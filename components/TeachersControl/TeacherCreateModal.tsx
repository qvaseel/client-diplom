"use client";
import { Dialog, Button, TextField, Flex } from "@radix-ui/themes";
import { useState } from "react";
import { useUserStore } from "@/store/userStore";

interface Props {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

export function TeacherCreateModal({ open, onOpenChange }: Props) {
  const { createUser, fetchTeachers } = useUserStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patronymic, setPatronymic] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleSubmit = async () => {
    await createUser({
      email,
      password,
      lastName,
      firstName,
      patronymic,
      roleId: 2,
      dateOfBirth,
    });
    await fetchTeachers();

    setFirstName("");
    setLastName("");
    setPatronymic("");
    setEmail("");
    setPassword("");
    setDateOfBirth("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Title>Добавить преподавателя</Dialog.Title>
        <Flex direction="column" gap="3">
          <TextField.Root
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField.Root
            placeholder="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField.Root
            placeholder="Фамилия"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField.Root
            placeholder="Имя"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField.Root
            placeholder="Отчество"
            value={patronymic}
            onChange={(e) => setPatronymic(e.target.value)}
          />
          <TextField.Root
            placeholder="Дата рождения"
            value={dateOfBirth}
            type="date"
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </Flex>
        <Flex justify="end" mt="4">
          <Button onClick={handleSubmit}>Сохранить</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
