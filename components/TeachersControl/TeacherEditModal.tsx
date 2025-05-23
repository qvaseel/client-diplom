"use client";

import { useEffect, useState } from "react";
import { Dialog, TextField, Button, Select, Flex } from "@radix-ui/themes";
import { useGroupStore } from "@/store/groupStore";
import { useUserStore } from "@/store/userStore";
import { UpdateUserDto, User } from "@/interface";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  teacher: User | null;
}

export function EditTeacherModal({ isOpen, onClose, teacher }: Props) {
  const { fetchTeachers } = useUserStore();
  const { updateUser } = useUserStore();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    patronymic: "",
    email: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (teacher) {
      setForm({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        patronymic: teacher.patronymic,
        email: teacher.email,
        dateOfBirth: teacher.dateOfBirth,
      });
    }
  }, [teacher]);

  const handleUpdate = async () => {
    if (!teacher) return;
    const updatedData: UpdateUserDto = {
      firstName: form.firstName,
      lastName: form.lastName,
      patronymic: form.patronymic,
      email: form.email,
      dateOfBirth: teacher.dateOfBirth,
    };

    await updateUser(teacher.id, updatedData);
    await fetchTeachers();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Редактировать преподавателя</Dialog.Title>
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
