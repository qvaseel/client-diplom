import { useEffect, useState } from "react";
import { TextField, Button, Table, Link } from "@radix-ui/themes";
import { useHomeworkSubmissionStore } from "@/store/homeworkSubmission";

interface Props {
  homeworkId: number;
}

export const HomeworkSubmissionsTable = ({ homeworkId }: Props) => {
  const {
    createHomeworkGrade,
    fetchHomeworSubmissionByHomework,
    homeworksSubmissions,
  } = useHomeworkSubmissionStore();

  const [grades, setGrades] = useState<
    Record<number, { grade: number; comment: string }>
  >({});

  // Получаем submissions и инициализируем оценки
  useEffect(() => {
    fetchHomeworSubmissionByHomework(homeworkId);
  }, [homeworkId]);

  useEffect(() => {
    const initialGrades: Record<number, { grade: number; comment: string }> =
      {};
    homeworksSubmissions.forEach((submission) => {
      const studentId = submission.studentId;
      initialGrades[studentId] = {
        grade: submission.grade?.grade ?? 0,
        comment: submission.grade?.comment ?? "",
      };
    });
    setGrades(initialGrades);
  }, [homeworksSubmissions]);

  const handleGradeChange = (
    studentId: number,
    field: "grade" | "comment",
    value: string
  ) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        grade: field === "grade" ? Number(value) : prev[studentId]?.grade ?? 0,
        comment:
          field === "comment" ? value : prev[studentId]?.comment ?? "",
      },
    }));
  };

const handleSaveAll = async () => {
  let successCount = 0;

  for (const submission of homeworksSubmissions) {
    const studentId = submission.studentId;
    const data = grades[studentId];
    if (data && !isNaN(data.grade)) {
      const dto = {
        homeworkId,
        studentId,
        comment: data.comment ?? "",
      };
      try {
        await createHomeworkGrade(dto, data.grade);
        successCount++;
      } catch (error) {
        console.error("Ошибка при сохранении оценки:", error);
      }
    }
  }

  if (successCount > 0) {
    alert("Оценки за домашние задания успешно сохранены.");
  }
};


  return (
    <div className="overflow-x-auto w-full flex flex-col gap-4">
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Файл</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Оценка</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Комментарий</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {homeworksSubmissions
  .slice()
  .sort((a, b) =>
    a.student.lastName.localeCompare(b.student.lastName, "ru", {
      sensitivity: "base",
    })
  )
  .map((submission) => {
            const student = submission.student;
            const studentId = student.id;
            const currentGrade = grades[studentId] || {
              grade: 0,
              comment: "",
            };

            return (
              <Table.Row key={studentId}>
                <Table.Cell>
                  {submission.fileUrl ? (

                  <Link
                    href={`https://server-diplom.onrender.com${submission.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    
                    className="text-blue-600 underline"
                  >Файл</Link>
                  ) : (
                    <span className="text-gray-400 italic">нет</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <TextField.Root
                    type="number"
                    min={0}
                    max={100}
                    value={String(currentGrade.grade)}
                    onChange={(e) =>
                      handleGradeChange(studentId, "grade", e.target.value)
                    }
                  />
                </Table.Cell>
                <Table.Cell>
                  <TextField.Root
                    type="text"
                    value={currentGrade.comment}
                    onChange={(e) =>
                      handleGradeChange(studentId, "comment", e.target.value)
                    }
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>

      <Button onClick={handleSaveAll}>Сохранить</Button>
    </div>
  );
};
