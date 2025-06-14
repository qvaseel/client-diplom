import { Table, ScrollArea, Link } from "@radix-ui/themes";
import { Grade } from "@/interface";
import { groupGradesByDisciplineAndDate } from "@/utils/gradeHelpers";

interface Props {
  grades: Grade[];
  innerWidth: number;
}

export function SummaryGradeTable({ grades, innerWidth }: Props) {
  const grouped = groupGradesByDisciplineAndDate(grades);

  const tableSize =
    innerWidth < 640 && innerWidth > 200
      ? "1"
      : innerWidth > 640 && innerWidth < 810
      ? "2"
      : "3";

  const allDatesSet = new Set<string>();
  Object.values(grouped).forEach((byDate) =>
    Object.keys(byDate).forEach((d) => allDatesSet.add(d))
  );
  const allDates = Array.from(allDatesSet).sort();

  const calcAverage = (
    grades: Record<string, { display: string; type: string | undefined }[]>
  ) => {
    const nums = Object.values(grades)
      .flat()
      .map((val) => Number(val.display))
      .filter((v) => !isNaN(v) && v >= 1 && v <= 5);
    if (nums.length === 0) return "-";
    const avg = nums.reduce((acc, v) => acc + v, 0) / nums.length;
    return avg.toFixed(2);
  };

  return (
<div className="relative overflow-auto rounded max-w-full">
  <table className="min-w-full border-collapse table-auto text-[10px] lg:text-lg">
    <thead className="bg-gray-100 sticky top-0 z-20">
      <tr className="rounded border-b border-b-gray-200">
        <th className="sticky bg-gray-100 min-w-[70px] lg:min-w-[220px] left-0 z-30 p-2 shadow-[inset_-2px_0_0_0_#3b82f6]">
          Предмет
        </th>
        {allDates.map((date) => (
          <th key={date} className="bg-gray-100 p-2 whitespace-nowrap z-0 ">
            {new Date(date).toLocaleDateString("ru-RU")}
          </th>
        ))}
        <th className="sticky right-0 z-30 p-2 min-w-[30px] lg:min-w-[100px]  bg-gray-100 shadow-[inset_2px_0_0_0_#3b82f6]">
          Средняя оценка
        </th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(grouped).map(([discipline, gradesByDate]) => (
        <tr key={discipline} className="hover:bg-gray-50 border-b border-b-gray-200">
          <td className="sticky min-w-[70px] lg:min-w-[220px] overflow-hidden text-ellipsis left-0 bg-white z-10 p-2 shadow-[inset_-2px_0_0_0_#3b82f6]">
            {discipline}
          </td>
          {allDates.map((date) => {
            const gradeObj = gradesByDate[date];
            return (
              <td key={date} className="p-2 text-center">
                {gradeObj ? (
                  <span title={gradeObj.map((g) => g.type).join(", ")}>
                    {gradeObj.map((g) => g.display).join(", ")}
                  </span>
                ) : (
                  ""
                )}
              </td>
            );
          })}
          <td className="sticky right-0 bg-white z-10 p-2 text-center shadow-[inset_2px_0_0_0_#3b82f6]">
            {calcAverage(gradesByDate)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
}
