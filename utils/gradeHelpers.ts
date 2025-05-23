import { Grade } from "@/interface";

export function groupGradesByDisciplineAndDate(grades: Grade[]) {
  const grouped: Record<
    string,
    Record<string, { display: string; type: string | undefined }>
  > = {};

  grades.forEach((g) => {
    const discipline = g.lesson?.schedule?.discipline?.name || "Неизвестно";
    const date = g.lesson?.date?.slice(0, 10);
    const grade = g.grade === 0 ? "-" : `${g.grade}`;
    const display = g.attend === false ? "н" : grade;
    const type = g.lesson?.typeOfLesson;

    if (!grouped[discipline]) grouped[discipline] = {};
    grouped[discipline][date] = { display, type };
  });

  return grouped;
}
