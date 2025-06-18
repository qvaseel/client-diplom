"use client";

import { Button, Flex, Heading, IconButton, Link, Table, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { EditAchievementModal } from "./EditAchievementModal";
import { Achievement } from "@/interface";

interface Props {
  userId: number;
  firstName: string;
  lastName: string;
  patronymic: string;
}

export const StudentPortfolio = ({ userId, firstName, lastName, patronymic }: Props) => {
  const { portfolio, fetchPortfolio, deleteAchievement, markAsPassed } =
    usePortfolioStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);

  useEffect(() => {
    fetchPortfolio(userId);
  }, [userId]);

  const handleDelete = async (id: number) => {
    if (confirm("Вы действительно хотите удалить достижение?")) {
      deleteAchievement(id);
    }
  };

  const openEditModal = (achievement: any) => {
    setSelectedAchievement(achievement);
    setIsEditOpen(true);
  };

  const handleMarkAsPassed = async (id: number) => {
    await markAsPassed(id);
    await fetchPortfolio(userId);
  };

  const isPassed = (achievement: Achievement) => {
    if (achievement.passed) {
      return "Зачтено";
    } else {
      return (
        <Button
          highContrast
          color="green"
          variant="soft"
          size='3'
          onClick={() => handleMarkAsPassed(achievement.id)}
        >
          Зачесть
        </Button>
      );
    }
  };

  return (
    <Flex direction='column' gap='4' p='4'>
      <Heading as="h2" size='5'>Портфолио студента {`${lastName} ${firstName[0]}. ${patronymic[0]}.`}</Heading>

      {portfolio?.achievements?.length === 0 ? (
        <Text>В портфолио студента пока не добавлено ни одного достижения</Text>
      ) : (
        <Table.Root size="3" variant="surface">
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
