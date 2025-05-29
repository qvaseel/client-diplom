"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GroupSelector from "@/components/GroupSelector";
import { useUserStore } from "@/store/userStore";
import { useLessonStore } from "@/store/lessonStore";
import { useGradeStore } from "@/store/gradeStore";
import dayjs from "dayjs";
import Link from "next/link";
import { useDisciplineStore } from "@/store/disciplineStore";
import { useGroupStore } from "@/store/groupStore";
import DisciplineSelector from "@/components/DisciplineSelector";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Select,
  Table,
  TextField,
} from "@radix-ui/themes";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getGradeValue } from "@/utils/getGrade";
import { useScheduleStore } from "@/store/scheduleStore";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";


export default function TeacherJournalPage() {
  const { profileUser: user, loading } = useUserProfile();
  const { lessons, loadLessonsByFilter } = useLessonStore();
  const { grades, loadAllGradeByGroupAndDiscipline } = useGradeStore();
  const { schedule, fetchScheduleByGroupAndDiscipline } = useScheduleStore();
  const { createLesson } = useLessonStore();
  const { fetchGroups } = useGroupStore();
  const { disciplines, fetchDisciplinesOfTeacher } = useDisciplineStore();
  const { users: students, fetchStudentsByGroup } = useUserStore();

  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<number | null>(
    null
  );
  const [lessonDate, setLessonDate] = useState("");
  const [lessonTopic, setLessonTopic] = useState("");
  const [lessonType, setLessonType] = useState("Устный ответ");
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchGroups();
    if (selectedGroup) fetchStudentsByGroup(selectedGroup);

    if (user?.id) {
      fetchDisciplinesOfTeacher(user?.id);
    }
  }, [
    selectedGroup,
    fetchStudentsByGroup,
    fetchGroups,
    fetchDisciplinesOfTeacher,
    user,
  ]);

  useEffect(() => {
    const groupParam = searchParams.get("groupId");
    const disciplineParam = searchParams.get("disciplineId");

    if (groupParam) setSelectedGroup(Number(groupParam));
    if (disciplineParam) setSelectedDiscipline(Number(disciplineParam));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedGroup) params.set("groupId", String(selectedGroup));
    if (selectedDiscipline)
      params.set("disciplineId", String(selectedDiscipline));

    const query = params.toString();
    router.replace(`?${query}`);
  }, [selectedGroup, selectedDiscipline]);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedGroup || !selectedDiscipline || !user?.id) return;

      await loadAllGradeByGroupAndDiscipline(selectedGroup, selectedDiscipline);
      await loadLessonsByFilter(selectedGroup, selectedDiscipline);

      const scheduleData = await fetchScheduleByGroupAndDiscipline(
        selectedGroup,
        selectedDiscipline
      );

      const matching = scheduleData.find(
        (s) =>
          s.group.id === selectedGroup &&
          s.discipline.id === selectedDiscipline &&
          s.teacher.id === user.id
      );

      setSelectedScheduleId(matching?.id ?? null);
    };

    loadData();
  }, [selectedGroup, selectedDiscipline, user?.id]);

  const sortedLessons = [...lessons].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const calculateAverageGrade = (studentId: number) => {
    const studentGrades = grades
      .filter((g) => g.student.id === studentId)
      .map((g) => g.grade)
      .filter((val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 1 && num <= 5;
      })
      .map(Number);

    if (studentGrades.length === 0) return "-";

    const sum = studentGrades.reduce((acc, val) => acc + val, 0);
    return (sum / studentGrades.length).toFixed(2);
  };

  const handleCreateLesson = async () => {
    if (!selectedScheduleId || !lessonDate) return;
    await createLesson({
      scheduleId: selectedScheduleId,
      date: lessonDate,
      topic: lessonTopic,
      typeOfLesson: lessonType,
    });

    setLessonDate("");
    setLessonTopic("");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Журнал преподавателя</h1>

      <Flex display="flex" direction="row" gap="2">
        <GroupSelector
          setSelectedGroup={setSelectedGroup}
          selectedGroup={selectedGroup}
        />

        <DisciplineSelector
          loading={loading}
          disciplines={disciplines}
          setSelectedDiscipline={setSelectedDiscipline}
          selectedDiscipline={selectedDiscipline}
        />
      </Flex>

{students.length > 0 && sortedLessons.length > 0 ? (
  <div className="relative overflow-auto rounded max-w-full">
    <table className="min-w-[900px] table-auto border-collapse">
      <thead className="bg-gray-100 sticky top-0 z-20">
        <tr className="rounded border-b border-b-gray-200">
          <th className="sticky bg-gray-100 min-w-[220px] left-0 z-30 p-2">ФИО</th>
          {sortedLessons.map((lesson) => (
            <th key={lesson.id} className="bg-gray-100 p-2 whitespace-nowrap z-0">
              <Link
                href={{
                  pathname: `/gradebook/${lesson.id}`,
                  query: {
                    groupId: selectedGroup,
                    disciplineId: selectedDiscipline,
                  },
                }}
                className="text-blue-600 hover:underline"
                title={lesson.typeOfLesson || "Тип занятия не указано"}
              >
                {dayjs(lesson.date).format("DD.MM")}
              </Link>
            </th>
          ))}
          <th className="sticky right-0 z-30 p-2 min-w-[150px]  bg-gray-100">
            Средняя оценка
          </th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id} className="hover:bg-gray-50 border-b border-b-gray-200">
            <td className="sticky whitespace-nowrap max-w-[220px] overflow-hidden text-ellipsis left-0 bg-white z-10 p-2">
              {`${student.lastName} ${student.firstName}`}
            </td>
            {sortedLessons.map((lesson) => {
              const grade = grades.find(
                (g) =>
                  g.lesson.id === lesson.id && g.student.id === student.id
              );
              return (
                <td key={lesson.id} className="p-2 text-center ">
                  {getGradeValue(grade)}
                </td>
              );
            })}
            <td className="sticky right-0 bg-white z-10 p-2 text-center border-l-2 border-l-gray-200">
              {calculateAverageGrade(student.id)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p className="text-gray-500">Выберите фильтры для отображения журнала.</p>
)}



      {selectedScheduleId && (
        <Box>
          <Card>
            <Heading as="h2" mb="3">
              Добавить занятие
            </Heading>

            <Flex gap="2">
              <TextField.Root
                type="date"
                value={lessonDate}
                onChange={(e) => setLessonDate(e.target.value)}
              />
              <TextField.Root
                placeholder="Тема занятия"
                value={lessonTopic}
                onChange={(e) => setLessonTopic(e.target.value)}
              />
              <Select.Root value={lessonType} onValueChange={setLessonType}>
                <Select.Trigger placeholder="Тип занятия" />
                <Select.Content position="popper">
                  <Select.Item value="Лекция">Лекция</Select.Item>

                  <Select.Item value="Устный ответ">Устный ответ</Select.Item>
                  <Select.Item value="Тест">Тест</Select.Item>
                  <Select.Item value="Практическая работа">
                    Практическая работа
                  </Select.Item>
                  <Select.Item value="Самостоятельная работа">
                    Самостоятельная работа
                  </Select.Item>
                  <Select.Item value="Контрольная работа">
                    Контрольная работа
                  </Select.Item>
                  <Select.Item value="Итоговая работа">
                    Итоговая работа
                  </Select.Item>
                  <Select.Item value="Курсовая">Курсовая</Select.Item>
                </Select.Content>
              </Select.Root>
              <Button onClick={handleCreateLesson} disabled={!lessonDate}>
                Создать
              </Button>
            </Flex>
          </Card>
        </Box>
      )}
    </div>
  );
}
