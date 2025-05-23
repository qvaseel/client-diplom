"use client";
import { Dialog, Button, TextField, Flex, Select } from "@radix-ui/themes";
import * as Label from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useGroupStore } from "@/store/groupStore";

interface Props {
    open: boolean;
    onOpenChange: (val: boolean) => void;
  }

export function StudentCreateModal({ open, onOpenChange }: Props) {
  const { createUser, fetchStudents } = useUserStore();
  const { groups, fetchGroups } = useGroupStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patronymic, setPatronymic] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [telegramId, setTelegramId] = useState("");

  const [groupId, setGroupId] = useState<number | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSubmit = async () => {
    if (groupId) {
      await createUser({
        email,
        password,
        lastName,
        firstName,
        patronymic,
        roleId: 1,
        dateOfBirth,
        groupId,
        telegramId
      });
      await fetchStudents();
    }
    
    setFirstName("");
    setLastName("");
    setPatronymic("");
    setEmail("");
    setPassword("");
    setDateOfBirth("");
    setTelegramId("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Title>Добавить студента</Dialog.Title>
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
          <TextField.Root
            placeholder="Телеграмм"
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
          />
          <Select.Root
            value={groupId?.toString() || ""}
            onValueChange={(val) => setGroupId(Number(val))}
          >
            <Select.Trigger placeholder="Выберите группу" />
            <Select.Content>
              {groups.map((group) => (
                <Select.Item key={group.id} value={group.id.toString()}>
                  {group.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        <Flex justify="end" gap="3" mt="4">
          <Dialog.Close>
            <Button variant="soft">Отмена</Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={handleSubmit}>Создать</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
