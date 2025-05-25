import { GradeWithLesson } from "@/store/gradeStore";
import { Button, Card, Flex } from "@radix-ui/themes";
import { ShowHomeworkModal } from "./ShowHomeworkModal";
import { useState } from "react";
import { Lesson } from "@/interface";

type Props = {
  grade: GradeWithLesson;
};



export default function LessonCard({ grade }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const lesson = grade.lesson;
  const teacher = lesson.schedule.teacher;

  const isHomework = (lesson: Lesson, grade: GradeWithLesson) => {
      if (!lesson.homework) {
        return false;
      } else {
        if (grade.homeworkSubmissionId) {
          return false;
        } else {
          return true;
        }
      }
  }
console.log("grade.homeworkSubmission", grade.homeworkSubmission);
  return (
    <Card>
      <Flex direction="column" gap="2">
        <div className="font-medium">{lesson.schedule.discipline.name}</div>
        {!grade.homeworkSubmissionId && (
          <div>
          Тема: {lesson.topic || "Не указана"}, {lesson.typeOfLesson}, оценка: {grade.grade ?? "н/б"}
        </div>
        )}

        {grade.homeworkSubmissionId && (
          <div>
            Домашняя работа, оценка: {grade.grade ?? "н/б"}
          </div>
        )}

        {grade.comment && grade.comment != "" && (
          <div>Комментарий: {grade.comment}</div>
        )}
        <div className="text-sm text-gray-500">
          Преподаватель:{" "}
          {teacher ? `${teacher.lastName} ${teacher.firstName}` : "Не указан"}
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
          homeworkSubmission={grade.homeworkSubmission || null}
        />
        
    </Card>
  );
}
