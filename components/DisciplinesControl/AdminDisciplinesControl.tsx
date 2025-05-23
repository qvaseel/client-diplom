"use client";

import { useEffect, useState } from "react";
import { Button, Flex, Table, IconButton } from "@radix-ui/themes";
import { useDisciplineStore } from "@/store/disciplineStore";
import CreateDisciplineDialog from "./CreateDisciplineDialog";
import { Discipline } from "@/interface";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import EditDisciplineDialog from "./EditDisciplineModal";

export default function AdminDisciplinesPage() {
  const { disciplines, fetchDisciplines, deleteDiscipline } =
    useDisciplineStore();
  const [editingDiscipline, setEditingDiscipline] = useState<Discipline | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchDisciplines();
  }, [fetchDisciplines]);

  const handleDelete = async (id: number) => {
    if (confirm("Вы действительно хотите удалить группу?")) {
      deleteDiscipline(id);
    }
  };

  const openEditModal = (discipine: Discipline) => {
    setEditingDiscipline(discipine);
    setIsEditModalOpen(true);
  };

  return (
    <Flex direction="column" gap="4">
      <Flex justify="end" align="center">
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Добавить дисциплину
        </Button>
      </Flex>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Преподаватель</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Действия</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {disciplines.sort((a, b) => a.name.localeCompare(b.name)).map((discipline, index) => (
            <Table.Row key={index}>
              <Table.Cell>{discipline.name}</Table.Cell>
              <Table.Cell>{`${discipline.teacher?.lastName ?? ""} ${discipline.teacher?.firstName[0] ?? ""}. ${discipline.teacher?.patronymic[0] ?? ""}.`}</Table.Cell>
              <Table.Cell>
                <Flex gap="3">
                  <IconButton
                    variant="ghost"
                    color="blue"
                    onClick={() => openEditModal(discipline)}
                  >
                    <PencilIcon width="32" height="32" />
                  </IconButton>
                  <IconButton
                    variant="ghost"
                    color="red"
                    onClick={() => handleDelete(discipline.id)}
                  >
                    <TrashIcon width="32" height="32" />
                  </IconButton>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <CreateDisciplineDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      {editingDiscipline && (
        <EditDisciplineDialog
          isOpen={isEditModalOpen}
          onClose={() => {
            setEditingDiscipline(null);
            setIsEditModalOpen(false);
          }}
          discipline={editingDiscipline}
        />
      )}
    </Flex>
  );
}
