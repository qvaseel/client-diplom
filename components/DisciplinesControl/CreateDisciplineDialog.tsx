"use client";

import { useEffect, useState } from "react";
import { Dialog, TextField, Button, Flex, Select } from "@radix-ui/themes";
import { useDisciplineStore } from "@/store/disciplineStore";
import { useUserStore } from "@/store/userStore";

interface Props {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

export default function CreateDisciplineDialog({ open, onOpenChange }: Props) {
  const { createDiscipline, fetchDisciplines } = useDisciplineStore();
  const { users, fetchTeachers } = useUserStore();

  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState<number | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSubmit = async () => {
    if (!name || !teacherId) return;
    await createDiscipline({
      name,
      teacherId: Number(teacherId),
    });
    setName("");
    setTeacherId(null);
    onOpenChange(false);
    await fetchDisciplines();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Title>Создание дисциплины</Dialog.Title>
        <Flex direction="column" gap="3" mt="3">
          <TextField.Root
            placeholder="Название дисциплины"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select.Root
            value={teacherId?.toString() || ""}
            onValueChange={(val) => setTeacherId(Number(val))}
          >
            <Select.Trigger placeholder="Выберите преподавателя" />
            <Select.Content position="popper">
              {users.map((t) => (
                <Select.Item key={t.id} value={t.id.toString()}>
                  {`${t.lastName} ${t.firstName[0]}. ${t.patronymic[0]}.`}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Button onClick={handleSubmit}>Сохранить</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
