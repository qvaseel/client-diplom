"use client";

import { useEffect, useState } from "react";
import { useGradeStore } from "@/store/gradeStore";
import { useUserStore } from "@/store/userStore";
import { useDisciplineStore } from "@/store/disciplineStore";
import {
  Select,
  Table,
  Heading,
  Flex,
  Text,
  Button,
  ScrollArea,
} from "@radix-ui/themes";
import { useUserProfile } from "@/hooks/useUserProfile";
import { SummaryGradeTable } from "./SummaryGrateTable";

interface Props {
  innerWidth: number;
}

export default function StudentGradesPage({ innerWidth }: Props) {
  const { profileUser: user } = useUserProfile();
  const { disciplines, fetchDisciplines } = useDisciplineStore();
  const {
    grades,
    allGrades,
    loadAllGradesByStudentAcrossDisciplines,
    loadAllGradeByStudentAndDiscipline,
  } = useGradeStore();

  const [selectedDisciplineId, setSelectedDisciplineId] = useState<
    number | null
  >(null);
  const [showSummary, setShowSummary] = useState(false);
  const [buttonText, setButtonText] = useState("Показать сводную таблицу");

  useEffect(() => {
    fetchDisciplines();
  }, []);

  useEffect(() => {
    if (user?.id && selectedDisciplineId) {
      loadAllGradeByStudentAndDiscipline(user.id, selectedDisciplineId);
    }
  }, [user?.id, selectedDisciplineId]);

  useEffect(() => {
    if (user?.id) {
      loadAllGradesByStudentAcrossDisciplines(user.id);
    }
  }, [user?.id]);

  const calculateAverageGrade = () => {
    const numericGrades = grades
      .map((g) => g.grade)
      .filter((val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 1 && num <= 5;
      })
      .map(Number);

    if (numericGrades.length === 0) return "-";

    const sum = numericGrades.reduce((acc, val) => acc + val, 0);
    return (sum / numericGrades.length).toFixed(2);
  };

  const handleLoadSummary = async () => {
    setShowSummary(!showSummary);
    if (!showSummary) {
      setButtonText("Обратно");
    } else {
      setButtonText("Показать сводную таблицу");
    }
  };

  const selectSize =
    innerWidth < 640 && innerWidth > 200
      ? "1"
      : innerWidth > 640 && innerWidth < 810
      ? "2"
      : "3";

  const pSize = innerWidth < 640 ? "1" : "4";
  const tableSize =
    innerWidth < 640 && innerWidth > 200
      ? "1"
      : innerWidth > 640 && innerWidth < 810
      ? "2"
      : "3";
  const flexDir = innerWidth < 640 ? "column" : "row";

  return (
    <Flex direction="column" gap="4" p={pSize}>
      <Flex
        as="div"
        display="flex"
        direction={flexDir}
        gap="2"
        justify="between"
      >
        <Heading as="h2" size="5">
          Мои оценки
        </Heading>
        <Button onClick={handleLoadSummary}>{buttonText}</Button>
      </Flex>

      {showSummary && (
        <SummaryGradeTable grades={allGrades} innerWidth={innerWidth} />
      )}

      {!showSummary && (
        <Select.Root
          size={selectSize}
          value={selectedDisciplineId?.toString() || ""}
          onValueChange={(val) => setSelectedDisciplineId(Number(val))}
        >
          <Select.Trigger placeholder="Выберите дисциплину" />
          <Select.Content position="popper">
            {disciplines.map((d) => (
              <Select.Item key={d.id} value={d.id.toString()} className="py-4">
                {d.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      )}

      {grades.length === 0 && selectedDisciplineId && (
        <Text>Нет оценок по выбранной дисциплине.</Text>
      )}

      {!showSummary && grades.length > 0 && (
        <>
          <ScrollArea
            scrollbars="both"
            type="always"
            style={{ maxHeight: 600 }}
          >
            <Table.Root variant="surface" size={tableSize}>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Дата занятия</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Тип занятия</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Оценка</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Присутствие</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {grades
                  .filter((g) => g.lesson && g.lesson.date)
                  .sort(
                    (a, b) =>
                      new Date(a.lesson.date).getTime() -
                      new Date(b.lesson.date).getTime()
                  )
                  .map((g) => (
                    <Table.Row key={g.id}>
                      <Table.Cell>
                        {new Date(g.lesson.date).toLocaleDateString("ru-RU")}
                      </Table.Cell>
                      <Table.Cell>{g.lesson.typeOfLesson || "-"}</Table.Cell>
                      <Table.Cell>
                        {g.grade == 0 ? `-` : `${g.grade}`}
                      </Table.Cell>
                      <Table.Cell>{g.attend ? "-" : "Н"}</Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table.Root>
          </ScrollArea>
          <Text size="3" mt="2">
            Средняя оценка по дисциплине:{" "}
            <strong>{calculateAverageGrade()}</strong>
          </Text>
        </>
      )}
    </Flex>
  );
}
