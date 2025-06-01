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
    <ScrollArea scrollbars="both" type="always" style={{ maxHeight: 600 }}>
      <Table.Root variant="surface" size={tableSize}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Предмет</Table.ColumnHeaderCell>
            {allDates.map((date) => (
              <Table.ColumnHeaderCell key={date}>
                {new Date(date).toLocaleDateString("ru-RU")}
              </Table.ColumnHeaderCell>
            ))}
            <Table.ColumnHeaderCell>Средняя оценка</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.entries(grouped).map(([discipline, gradesByDate]) => (
            <Table.Row key={discipline}>
              <Table.RowHeaderCell>{discipline}</Table.RowHeaderCell>
              {allDates.map((date) => {
                const gradeObj = gradesByDate[date];
                return (
                  <Table.Cell key={date}>
                    {gradeObj ? (
                      <Link title={gradeObj.map((g) => g.type).join(", ")}>
                        {gradeObj.map((g) => g.display).join(", ")}
                      </Link>
                    ) : (
                      ""
                    )}
                  </Table.Cell>
                );
              })}
              <Table.Cell>{calcAverage(gradesByDate)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </ScrollArea>
  );
}
