import { Grade } from "@/interface";

export function groupGradesByDisciplineAndDate(grades: Grade[]) {
  const grouped: Record<
    string,
    Record<string, { display: string; type: string | undefined }[]>
  > = {};

  for (const grade of grades) {
    const discipline = grade.lesson.schedule.discipline.name;
    const date = grade.lesson.date;

    if (!grouped[discipline]) grouped[discipline] = {};
    if (!grouped[discipline][date]) grouped[discipline][date] = [];

    grouped[discipline][date].push({
      display: `${grade.grade == 0 ? '-' : `${grade.grade}`}`,
      type: `${grade.homeworkSubmissionId ? 'Домашнее задание' : grade.lesson.typeOfLesson}`,
    });
  }

  return grouped;
}
