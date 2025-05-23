"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import {
  Table,
  IconButton,
  Flex,
  Select,
  Text,
  Button,
} from "@radix-ui/themes";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useGroupStore } from "@/store/groupStore";
import { User } from "@/interface";
import { EditStudentModal } from "./StudentEditModal";
import dayjs from "dayjs";
import { StudentCreateModal } from "./StudentCreateModal";

export function AdminStudentsControl() {
  const { users, fetchStudents, deleteUser } = useUserStore();
  const { groups, fetchGroups } = useGroupStore();

  const [selectedGroupId, setSelectedGroupId] = useState<string>("all");
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchGroups();
  }, []);
  
  const filteredUsers =
    selectedGroupId === "all"
      ? users.sort((a, b) => a.lastName.localeCompare(b.lastName))
      : users.filter((user) => user.group?.id.toString() === selectedGroupId).sort((a, b) => a.lastName.localeCompare(b.lastName));

  const handleDelete = (id: number) => {
    if (confirm("Вы действительно хотите удалить студента?")) {
      deleteUser(id);
    }
  };

  const openEditModal = (student: User) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  return (
    <Flex gap="4" direction="column">
      <Flex justify="between" align="center">
        <Flex gap="2" align="center">
          <Text weight="bold">Фильтр по группам:</Text>
          <Select.Root
            value={selectedGroupId}
            onValueChange={setSelectedGroupId}
          >
            <Select.Trigger placeholder="Выберите группу" />
            <Select.Content position="popper">
              <Select.Item value="all">Все группы</Select.Item>
              {groups.map((group) => (
                <Select.Item key={group.id} value={group.id.toString()}>
                  {group.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Создать студента
        </Button>
      </Flex>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>ФИО</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Дата рождения</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Группа</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Telegram</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Действия</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredUsers.map((user, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                {`${user.lastName ?? ""} ${user.firstName?.[0] ?? ""}. ${
                  user.patronymic?.[0] ?? ""
                }.`}
              </Table.Cell>
              <Table.Cell>
                {dayjs(user.dateOfBirth).format("DD.MM.YYYY")}
              </Table.Cell>
              <Table.Cell>{user.group?.name}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.telegramId}</Table.Cell>
              <Table.Cell>
                <Flex gap="3">
                  <IconButton
                    variant="ghost"
                    color="blue"
                    onClick={() => openEditModal(user)}
                  >
                    <PencilIcon width="32" height="32" />
                  </IconButton>
                  <IconButton
                    variant="ghost"
                    color="red"
                    onClick={() => handleDelete(user.id)}
                  >
                    <TrashIcon width="32" height="32" />
                  </IconButton>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <StudentCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {editingStudent && (
        <EditStudentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingStudent(null);
          }}
          student={editingStudent}
        />
      )}
    </Flex>
  );
}
