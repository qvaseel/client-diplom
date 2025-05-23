"use client";

import {
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  ScrollArea,
  Table,
  Text,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Achievement } from "@/interface";

interface Props {
  userId: number;
  innerWidth: number;
}

export const Portfolio = ({ userId, innerWidth }: Props) => {
  const { portfolio, fetchPortfolio } = usePortfolioStore();

  useEffect(() => {
    fetchPortfolio(userId);
  }, [userId]);

  const isPassed = (achievement: Achievement) => {
    if (achievement.passed) {
      return "Зачтено";
    } else {
      return "Не зачтено";
    }
  };

  const pSize = innerWidth < 640 ? "1" : "4";
  const tableSize =
    innerWidth < 640 && innerWidth > 200
      ? "1"
      : innerWidth > 640 && innerWidth < 810
      ? "2"
      : "3";

  return (
    <Flex direction="column" gap="4" p={pSize}>
      <Heading as="h2" size="5">
        Моё портфолио
      </Heading>

      {portfolio?.achievements?.length === 0 ? (
        <Text>В портфолио студента пока не добавлено ни одного достижения</Text>
      ) : (
        <ScrollArea scrollbars="both" type="always" style={{ maxHeight: 600 }}>
          <Table.Root size={tableSize} variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Описание</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Статус</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Ссылка</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {portfolio?.achievements?.map((a) => (
                <Table.Row key={a.id}>
                  <Table.RowHeaderCell>{a.title}</Table.RowHeaderCell>
                  <Table.Cell>{a.description}</Table.Cell>
                  <Table.Cell>{isPassed(a)}</Table.Cell>
                  <Table.Cell>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_API_URL}${a.fileUrl}`}
                      target="_blank"
                    >
                      Открыть
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </ScrollArea>
      )}
    </Flex>
  );
};
