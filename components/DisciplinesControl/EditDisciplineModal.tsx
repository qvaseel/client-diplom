'use client';

import {
  Dialog,
  Flex,
  TextField,
  Button,
  Select,
} from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { useDisciplineStore } from '@/store/disciplineStore';
import { useUserStore } from '@/store/userStore';
import { CreateDisciplineDto, Discipline } from '@/interface';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  discipline: Discipline | null;
}

export default function EditDisciplineDialog({ isOpen, onClose, discipline }: Props) {
  const { updateDiscipline, fetchDisciplines } = useDisciplineStore();
    const { fetchTeachers, users } = useUserStore();

    const [form, setForm] = useState({
        name: "",
        teacherId: ""
    })

  useEffect(() => {
    if (discipline) {
        setForm({
            name: discipline.name,
            teacherId: discipline.teacher?.id.toString() || ""
        })
    }
    fetchTeachers();
  }, [discipline]);

  const handleUpdate = async () => {
    if (!discipline) return;
    const updatedData: CreateDisciplineDto = {
        name: form.name,
        teacherId: Number(form.teacherId)
    }

    await updateDiscipline(discipline.id, updatedData);
    await fetchDisciplines();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>Редактировать дисциплину</Dialog.Title>
        <Flex direction="column" gap="3" mt="3">
          <TextField.Root
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value}))}
          />
          <Select.Root
            value={form.teacherId}
            onValueChange={(val) => setForm((f) => ({ ...f, teacherId: val }))}
          >
            <Select.Trigger placeholder="Преподаватель" />
            <Select.Content position='popper'>
              {users.map((t) => (
                <Select.Item key={t.id} value={t.id.toString()}>
                   {`${t.lastName} ${t.firstName[0]}. ${t.patronymic[0]}.`}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Button onClick={handleUpdate}>Сохранить</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
