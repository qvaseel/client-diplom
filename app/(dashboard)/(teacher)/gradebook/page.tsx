"use client";

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
    const loadData = async () => {
      if (!selectedGroup || !selectedDiscipline || !user?.id) return;
  
      // Загрузка оценок и уроков
      await loadAllGradeByGroupAndDiscipline(selectedGroup, selectedDiscipline);
      await loadLessonsByFilter(selectedGroup, selectedDiscipline);
  
      // Получаем расписание по группе и дисциплине
      const scheduleData = await fetchScheduleByGroupAndDiscipline(
        selectedGroup,
        selectedDiscipline
      );
  

      console.log(selectedGroup, selectedDiscipline, user.id)
      // Ищем нужную запись в расписании
      const matching = scheduleData.find(
        (s) =>
          s.group.id === selectedGroup &&
          s.discipline.id === selectedDiscipline &&
          s.teacher.id === user.id
      );
  
      setSelectedScheduleId(matching?.id ?? null);
      console.log(selectedScheduleId)
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
    console.log(selectedScheduleId, lessonDate, lessonTopic, lessonType)
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

      {/* === Фильтры === */}
      <Flex display="flex" direction="row" gap="2">
        <GroupSelector setSelectedGroup={setSelectedGroup} />

        <DisciplineSelector
          loading={loading}
          disciplines={disciplines}
          setSelectedDiscipline={setSelectedDiscipline}
        />

      </Flex>

      {/* === Таблица журнала === */}
      {students.length > 0 && sortedLessons.length > 0 ? (
        <div className="overflow-auto">
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Студент</Table.ColumnHeaderCell>
                {sortedLessons.map((lesson) => (
                  <Table.ColumnHeaderCell key={lesson.id}>
                    <Link
                      href={{
                        pathname: `/gradebook/${lesson.id}`,
                        query: {
                          groupId: selectedGroup,
                          disciplineId: selectedDiscipline,
                        },
                      }}
                      className="text-blue-600 hover:underline"
                      title={lesson.typeOfLesson || "Тип занятия не указан"}
                    >
                      {dayjs(lesson.date).format("DD.MM")}
                    </Link>
                  </Table.ColumnHeaderCell>
                ))}
                <Table.ColumnHeaderCell>Средняя оценка</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {students.map((student) => (
                <Table.Row key={student.id}>
                  <Table.RowHeaderCell>{`${student.lastName} ${student.firstName} ${student.patronymic}`}</Table.RowHeaderCell>
                  {sortedLessons.map((lesson) => {
                    const grade = grades.find(
                      (g) =>
                        g.lesson.id === lesson.id && g.student.id === student.id
                    );
                    return (
                      <Table.Cell key={lesson.id}>
                        {getGradeValue(grade)}
                      </Table.Cell>
                    );
                  })}
                  <Table.Cell>{calculateAverageGrade(student.id)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      ) : (
        <p className="text-gray-500">
          Выберите фильтры для отображения журнала.
        </p>
      )}

      {selectedScheduleId && (
        <Box>
          <Card>
            <Heading as="h2" mb='3'>Добавить занятие</Heading>

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
                <Select.Content>
                  <Select.Item value="Устный ответ">Устный ответ</Select.Item>
                  <Select.Item value="Практическая работа">
                    Практическая работа
                  </Select.Item>
                  <Select.Item value="Тест">Тест</Select.Item>
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
