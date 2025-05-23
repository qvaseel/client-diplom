"use client";

import { useEffect, useState } from "react";
import { Dialog, TextField, Button, Select, Flex } from "@radix-ui/themes";
import { useGroupStore } from "@/store/groupStore";
import { useUserStore } from "@/store/userStore";
import { UpdateUserDto, User } from "@/interface";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: User | null;
}

export function EditStudentModal({ isOpen, onClose, student }: Props) {
  const { groups, fetchGroups } = useGroupStore();
  const { fetchStudents } = useUserStore();
  const { updateUser } = useUserStore();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    patronymic: "",
    email: "",
    groupId: "",
    dateOfBirth: "",
    telegramId: ""
  });

  useEffect(() => {
    if (student) {
      setForm({
        firstName: student.firstName,
        lastName: student.lastName,
        patronymic: student.patronymic,
        email: student.email,
        groupId: student.group?.id.toString() || "",
        dateOfBirth: student.dateOfBirth,
        telegramId: student.telegramId || ""
      });
    }
    fetchGroups();
  }, [student]);

  const handleUpdate = async () => {
    if (!student) return;
    const updatedData: UpdateUserDto = {
      firstName: form.firstName,
      lastName: form.lastName,
      patronymic: form.patronymic,
      email: form.email,
      groupId: Number(form.groupId),
      dateOfBirth: form.dateOfBirth,
      telegramId: form.telegramId 
    };
    console.log(updatedData)
    await updateUser(student.id, updatedData);
    await fetchStudents();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Редактировать студента</Dialog.Title>
        <Flex direction="column" gap="3" mt="4">
          <TextField.Root
            placeholder="Фамилия"
            value={form.lastName}
            onChange={(e) =>
              setForm((f) => ({ ...f, lastName: e.target.value }))
            }
          />
          <TextField.Root
            placeholder="Имя"
            value={form.firstName}
            onChange={(e) =>
              setForm((f) => ({ ...f, firstName: e.target.value }))
            }
          />
          <TextField.Root
            placeholder="Отчество"
            value={form.patronymic}
            onChange={(e) =>
              setForm((f) => ({ ...f, patronymic: e.target.value }))
            }
          />
          <TextField.Root
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <TextField.Root
            placeholder="Дата рождения"
            value={form.dateOfBirth}
            type="date"
            onChange={(e) =>
              setForm((f) => ({ ...f, dateOfBirth: e.target.value }))
            }
          />
          <TextField.Root
            placeholder="Телеграмм"
            value={form.telegramId}
            onChange={(e) =>
              setForm((f) => ({ ...f, telegramId: e.target.value }))
            }
          />
          <Select.Root
            value={form.groupId}
            onValueChange={(val) => setForm((f) => ({ ...f, groupId: val }))}
          >
            <Select.Trigger placeholder="Выберите группу" />
            <Select.Content position="popper">
              {groups.map((group) => (
                <Select.Item key={group.id} value={group.id.toString()}>
                  {group.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        <Flex justify="end" gap="3" mt="4">
          <Button variant="soft" color="gray" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleUpdate}>Сохранить</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
