"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { Table, IconButton, Flex, Button } from "@radix-ui/themes";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { User } from "@/interface";
import { TeacherCreateModal } from "./TeacherCreateModal";
import { EditTeacherModal } from "./TeacherEditModal";

export function AdminTeachersControl() {
  const { users, fetchTeachers, deleteUser } = useUserStore();

  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = (id: number) => {
    if (confirm("Вы действительно хотите удалить преподавателя?")) {
      deleteUser(id);
    }
  };

  const openEditModal = (teacher: User) => {
    setEditingTeacher(teacher);
    setIsEditModalOpen(true);
  };

  return (
    <Flex gap="4" direction="column">
      <Flex justify="end" align="center">
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Создать преподавателя
        </Button>
      </Flex>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>ФИО</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>День рождения</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Действия</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                {`${user?.lastName ?? ""} ${user?.firstName?.[0] ?? ""}. ${
                  user?.patronymic?.[0] ?? ""
                }.`}
              </Table.Cell>

              <Table.Cell>
                {dayjs(user.dateOfBirth).format("DD.MM.YYYY")}
              </Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
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

      <TeacherCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {editingTeacher && (
        <EditTeacherModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTeacher(null);
          }}
          teacher={editingTeacher}
        />
      )}
    </Flex>
  );
}
