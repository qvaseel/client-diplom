import { useState } from "react";
import { HomeworkSubmission, User } from "@/interface";

import { TextField, Button, Table } from "@radix-ui/themes";
import { useHomeworkSubmissionStore } from "@/store/homeworkSubmission";

interface Props {
  students: User[]; // список всех студентов группы
  homeworkId: number;
  submissions: HomeworkSubmission[]; // полученные из стора
}

export const HomeworkSubmissionsTable = ({ students, homeworkId, submissions }: Props) => {
  const { createHomeworkGrade } = useHomeworkSubmissionStore();

  // локальное состояние оценок и комментариев
  const [grades, setGrades] = useState<Record<number, { grade: number; comment: string }>>({});


  const handleGradeChange = (studentId: number, field: "grade" | "comment", value: string) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: field === "grade" ? Number(value) : value,
      },
    }));
  };

  const handleSave = async (studentId: number) => {
    const data = grades[studentId];
    if (!data || isNaN(data.grade)) return;

    await createHomeworkGrade(homeworkId, studentId, data.grade);
    // опционально: уведомление или очистка полей
  };

  return (
    <div className="overflow-x-auto">
      <Table.Root  variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>ФИО</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Файл</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Оценка</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Комментарий</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Сохранить</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {students.map((student) => {
            const submission = submissions.find((s) => s.student.id === student.id);
            const currentGrade = grades[student.id] || { grade: submission?.grade?.grade ?? "", comment: submission?.grade?.comment ?? "" };

            return (
              <Table.Row key={student.id}>
                <Table.RowHeaderCell>{student.lastName} {student.firstName}</Table.RowHeaderCell>
                <Table.Cell>
                  {submission?.fileUrl ? (
                    <a
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Файл
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">нет</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <TextField.Root
                    type="number"
                    min={0}
                    max={100}
                    value={currentGrade.grade}
                    onChange={(e) => handleGradeChange(student.id, "grade", e.target.value)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <TextField.Root
                    type="text"
                    value={currentGrade.comment}
                    onChange={(e) => handleGradeChange(student.id, "comment", e.target.value)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Button onClick={() => handleSave(student.id)}>Сохранить</Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </div>
  );
};
