import { GradeWithLesson } from "@/store/gradeStore";
import { Button, Card, Flex } from "@radix-ui/themes";
import { ShowHomeworkModal } from "./ShowHomeworkModal";
import { useState } from "react";
import { Lesson } from "@/interface";
import { useUserProfile } from "@/hooks/useUserProfile";

type Props = {
  grade: GradeWithLesson;
};

export default function LessonCard({ grade }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { profileUser } = useUserProfile();
  const lesson = grade.lesson;
  const teacher = lesson.schedule.teacher;

  const studentSubmission = lesson.homework?.submissions?.find(
    (submission) => submission.studentId === profileUser?.id
  );

  return (
    <Card>
      <Flex direction="column" gap="2">
        <div className="font-medium">{lesson.schedule.discipline.name}</div>
<div>
            Тема: {lesson.topic || "Не указана"}, {lesson.typeOfLesson}, оценка:{" "}
            {grade.grade ?? "н/б"}
          </div>

        {grade.comment && grade.comment != "" && (
          <div>Комментарий: {grade.comment}</div>
        )}
        <div className="text-sm text-gray-500">
          Преподаватель: {teacher ? `${teacher.lastName} ${teacher.firstName}` : "Не указан"}
        </div>
        <p> </p>
        <Button className="w-fit" onClick={() => setIsEditModalOpen(true)}>
          Открыть ДЗ
        </Button>
      </Flex>
      <ShowHomeworkModal
        isOpen={isEditModalOpen}
        onClose={setIsEditModalOpen}
        lesson={lesson}
        homework={lesson.homework || null}
        homeworkSubmissionId={studentSubmission?.id || null}
      />
    </Card>
  );
}
