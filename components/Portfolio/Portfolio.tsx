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
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { EditAchievementModal } from "./EditAchievementModal";

interface Props {
  userId: number;
  innerWidth: number;
}

export const Portfolio = ({ userId, innerWidth }: Props) => {
  const { portfolio, fetchPortfolio, deleteAchievement } = usePortfolioStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);

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

    const handleDelete = async (id: number) => {
    if (confirm("Вы действительно хотите удалить достижение?")) {
      deleteAchievement(id);
    }
  };

   const openEditModal = (achievement: any) => {
    setSelectedAchievement(achievement);
    setIsEditOpen(true);
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
        <Text>В ваше портфолио пока не добавлено ни одного достижения</Text>
      ) : (
        <ScrollArea scrollbars="both" type="always" style={{ maxHeight: 600 }}>
          <Table.Root size={tableSize} variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Описание</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Статус</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Ссылка</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Действия</Table.ColumnHeaderCell>
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
                      href={`https://server-diplom.onrender.com${a.fileUrl}`}
                      target="_blank"
                    >
                      Открыть
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                  <Flex gap="3">
                    <IconButton
                      variant="ghost"
                      color="blue"
                      onClick={() => openEditModal(a)}
                    >
                      <PencilIcon width="32" height="32" />
                    </IconButton>
                    <IconButton
                      variant="ghost"
                      color="red"
                      onClick={() => handleDelete(a.id)}
                    >
                      <TrashIcon width="32" height="32" />
                    </IconButton>
                  </Flex>
                </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </ScrollArea>
      )}
            {selectedAchievement && (
              <EditAchievementModal
                isOpen={isEditOpen}
                onClose={setIsEditOpen}
                achievement={selectedAchievement}
                userId={userId}
              />
            )}
    </Flex>
  );
};
