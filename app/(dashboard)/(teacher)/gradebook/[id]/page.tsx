"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLessonStore } from "@/store/lessonStore";
import { useGradeStore } from "@/store/gradeStore";
import { useUserStore } from "@/store/userStore";
import {
  Button,
  Flex,
  Heading,
  Select,
  Switch,
  Table,
  TextField,
} from "@radix-ui/themes";
import { CreateHomeworkModal } from "@/components/CreateHomeworkModal";
import { useHomeworkStore } from "@/store/homeworkStore";
import { HomeworkSubmissionsTable } from "@/components/HomeworkSubmissionsTable";
import { useHomeworkSubmissionStore } from "@/store/homeworkSubmission";
import { TaskHomeworkModal } from "@/components/TaskHomeworkModal";

export default function EditLessonPage() {
  const { id } = useParams();
  const router = useRouter();
  const lessonId = Number(id);
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const disciplineId = searchParams.get("disciplineId");

  const { lesson, getLessonById, updateLesson, deleteLesson } =
    useLessonStore();
  const { users, fetchStudentsByGroup } = useUserStore();
  const {
    grades,
    loadAllGradeByGroupAndDiscipline,
    createGrade,
    updateGrade,
    findGradeByStudentAndLesson,
  } = useGradeStore();

  const { fetchHomeworkByLesson, homework } = useHomeworkStore();
  const {fetchHomeworSubmissionByHomework, homeworksSubmissions } = useHomeworkSubmissionStore();
 

  const [gradesState, setGradesState] = useState<Record<number, number | null>>(
    {}
  );
  const [attendanceState, setAttendanceState] = useState<
    Record<number, boolean>
  >({});

  const [commentsState, setCommentsState] = useState<
    Record<number, string | null>
  >({});

  const [typeOfLessonState, setTypeOfLessonState] = useState("");
  const [topicOfLesson, setTopicOfLesson] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    getLessonById(lessonId);
    fetchHomeworkByLesson(lessonId);
    fetchStudentsByGroup(Number(groupId));
    loadAllGradeByGroupAndDiscipline(Number(groupId), Number(disciplineId));
  }, [lessonId]);

useEffect(() => {
  if (homework?.id) {
    fetchHomeworSubmissionByHomework(homework.id);
  }
}, [homework]);

  useEffect(() => {
    if (lesson?.typeOfLesson || lesson?.topic) {
      setTypeOfLessonState(lesson.typeOfLesson);
      setTopicOfLesson(lesson.topic || "");
    }
  }, [lesson]);

  useEffect(() => {
    const initial: Record<number, number> = {};
    const initialAttendance: Record<number, boolean> = {};
    const initialComments: Record<number, string> = {};
    grades.forEach((g) => {
      if (g.lesson?.id === lessonId) {
        initial[g.student.id] = g.grade ?? 0;
        initialAttendance[g.student.id] = g.attend;
        initialComments[g.student.id] = g.comment || "";
      }
    });

    setGradesState(initial);
    setAttendanceState(initialAttendance);
    setCommentsState(initialComments);
  }, [grades, lessonId]);

  const handleSave = async () => {
    if (lesson?.id) {
      await updateLesson(lessonId, {
        typeOfLesson: typeOfLessonState,
        topic: topicOfLesson,
      });
    }

    for (const student of users) {
      const gradeValue = gradesState[student.id] ?? null;
      const attend = attendanceState[student.id] ?? false;
      const comment = commentsState[student.id] ?? null;

      const existingGrade = findGradeByStudentAndLesson(student.id, lessonId);

      try {
        if (existingGrade) {
          await updateGrade(existingGrade.id, {
            grade: gradeValue ?? 0,
            attend,
            comment: comment || "",
          });
        } else {
          await createGrade({
            studentId: student.id,
            lessonId,
            grade: gradeValue ?? 0,
            attend,
            comment: comment || "",
          });
        }
      } catch (err) {
        console.error(
          `Ошибка при сохранении оценки студента ${student.id}:`,
          err
        );
      }
    }

    await loadAllGradeByGroupAndDiscipline(
      Number(groupId),
      Number(disciplineId)
    );
    alert("Оценки сохранены!");
  };

  const handleDelete = (id: number) => {
    if (confirm("Вы действительно хотите удалить данное занятие?")) {
      deleteLesson(id);
      router.back();
    }
  };

  return (
    <Flex display="flex" direction="column" gap="4" pb="4">
      <Flex display="flex" direction="row" gap="4">
        <Button
          onClick={() => {
            router.back();
          }}
        >
          Вернуться назад
        </Button>

        <Button color="red" onClick={() => handleDelete(lessonId)}>
          Удалить занятие
        </Button>
        {!homework && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Добавить домашнее задание
          </Button>
        )}
      </Flex>

      <Heading as="h4">
        Оценки за{" "}
        {lesson?.date ? new Date(lesson.date).toLocaleDateString("ru-RU") : ""}
      </Heading>

      {/* блок выбора типа занятия */}

      <Flex direction="row" justify="between" gap="2">
        <Flex direction="column" gap="4" className={`${homework ? 'w-1/2' : 'w-full'}`}>
          <Flex gap="3">
            <Select.Root
              value={typeOfLessonState}
              onValueChange={(val) => setTypeOfLessonState(val)}
            >
              <Select.Trigger>
                {typeOfLessonState || "Выбрать тип..."}
              </Select.Trigger>
              <Select.Content position="popper">
                <Select.Item value="Лекция">Лекция</Select.Item>
                <Select.Item value="Устный ответ">Устный ответ</Select.Item>
                <Select.Item value="Контрольная работа">
                  Контрольная работа
                </Select.Item>
                <Select.Item value="Итоговая работа">
                  Итоговая работа
                </Select.Item>
                <Select.Item value="Самостоятельная работа">
                  Самостоятельная работа
                </Select.Item>
                <Select.Item value="Практическая работа">
                  Практическая работа
                </Select.Item>
              </Select.Content>
            </Select.Root>

            <TextField.Root
              placeholder="Тема занятия"
              value={topicOfLesson ?? ""}
              onChange={(e) => setTopicOfLesson(e.target.value)}
            />
          </Flex>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>ФИО</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Оценка</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Посещаемость</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Комментарий</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((s) => (
                <Table.Row key={s.id}>
                  <Table.RowHeaderCell>{`${s.lastName} ${s.firstName[0]}.${s.patronymic[0]}.`}</Table.RowHeaderCell>
                  <Table.Cell>
                    <TextField.Root
                      type="number"
                      min={2}
                      max={5}
                      value={gradesState[s.id] || ""}
                      onChange={(e) =>
                        setGradesState((prev) => ({
                          ...prev,
                          [s.id]: Number(e.target.value),
                        }))
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Switch
                      checked={attendanceState[s.id] ?? false}
                      onCheckedChange={(checked) =>
                        setAttendanceState((prev) => ({
                          ...prev,
                          [s.id]: checked,
                        }))
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TextField.Root
                      value={commentsState[s.id] || ""}
                      onChange={(e) =>
                        setCommentsState((prev) => ({
                          ...prev,
                          [s.id]: e.target.value,
                        }))
                      }
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <Button onClick={handleSave}>Сохранить</Button>
        </Flex>
        {homework && (
          <Flex direction="column" gap="4" className="w-1/2">
            <div className="w-fit">
              <Button
                className="w-fit"
                onClick={() => setIsEditModalOpen(true)}
              >
                Просмотреть домашнее задание
              </Button>
            </div>
            <HomeworkSubmissionsTable
              homeworkId={homework.id}
            />
          </Flex>
        )}
      </Flex>

      <CreateHomeworkModal
        isOpen={isCreateModalOpen}
        onClose={setIsCreateModalOpen}
        lesson={lesson}
      />
      <TaskHomeworkModal
        isOpen={isEditModalOpen}
        onClose={setIsEditModalOpen}
        lesson={lesson}
        homework={homework}
      />
    </Flex>
  );
}
