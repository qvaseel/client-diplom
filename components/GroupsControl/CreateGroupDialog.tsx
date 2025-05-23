'use client';

import {
  Dialog,
  Flex,
  TextField,
  Button,
  Select,
} from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { useGroupStore } from '@/store/groupStore';
import { useSpecialtyStore } from '@/store/specialitiesStore';

interface Props {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

export default function CreateGroupDialog({ open, onOpenChange }: Props) {
  const { createGroup, fetchGroups } = useGroupStore();
  const { specialties, loadSpecialties } = useSpecialtyStore();

  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [specialtyId, setSpecialtyId] = useState<number | null>(null);

  useEffect(() => {
    loadSpecialties();
  }, []);
  
  const handleSubmit = async () => {
    if (!name || !course || !specialtyId) return;
    await createGroup({
        name,
        course: Number(course),
        specialityId: specialtyId,
      });
      setName('');
      setCourse('');
      setSpecialtyId(null);
      onOpenChange(false);
      await fetchGroups();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Title>Создание группы</Dialog.Title>
        <Flex direction="column" gap="3" mt="3">
          <TextField.Root
            placeholder="Название группы"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField.Root
            placeholder="Курс"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <Select.Root
            value={specialtyId?.toString() || ''}
            onValueChange={(val) => setSpecialtyId(Number(val))}
          >
            <Select.Trigger placeholder="Выберите специальность" />
            <Select.Content position='popper'>
              {specialties.map((s) => (
                <Select.Item key={s.id} value={s.id.toString()}>
                  {s.name}
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
