"use client";

import { useEffect, useState } from "react";
import {
  Heading,
  Button,
  Table,
  Flex,
  Text,
  IconButton,
} from "@radix-ui/themes";
import { useGroupStore } from "@/store/groupStore";
import CreateGroupDialog from "@/components/GroupsControl/CreateGroupDialog";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Group } from "@/interface";
import EditGroupDialog from "./EditGroupModal";

export default function AdminGroupsPage() {
  const { groups, fetchGroups, deleteGroup } = useGroupStore();
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleDelete = async (id: number) => {
    if (confirm("Вы действительно хотите удалить группу?")) {
      deleteGroup(id);
    }
  };

  const openEditModal = (group: Group) => {
    setEditingGroup(group);
    setIsEditModalOpen(true);
  };

  return (
    <Flex direction="column" gap="4">
      <Flex justify="end" align="center">
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Создать группу
        </Button>
      </Flex>

      {groups.length === 0 ? (
        <Text>Нет созданных групп.</Text>
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Курс</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Специальность</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Действия</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {groups.map((group) => (
              <Table.Row key={group.id}>
                <Table.Cell>{group.name}</Table.Cell>
                <Table.Cell>{group.course}</Table.Cell>
                <Table.Cell>{group.speciality?.name || "—"}</Table.Cell>
                <Table.Cell>
                  <Flex gap="3">
                    <IconButton
                      variant="ghost"
                      color="blue"
                      onClick={() => openEditModal(group)}
                    >
                      <PencilIcon width="32" height="32" />
                    </IconButton>
                    <IconButton
                      variant="ghost"
                      color="red"
                      onClick={() => handleDelete(group.id)}
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

      <CreateGroupDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      {editingGroup && (
        <EditGroupDialog
          isOpen={isEditModalOpen}
          onClose={() => {
            setEditingGroup(null);
            setIsEditModalOpen(false);
          }}
          group={editingGroup}
        />
      )}
    </Flex>
  );
}
