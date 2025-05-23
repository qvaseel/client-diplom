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
import { CreateGroupDto, Group } from '@/interface';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
}

export default function EditGroupDialog({ isOpen, onClose, group }: Props) {
  const { updateGroup, fetchGroups } = useGroupStore();
  const { specialties, loadSpecialties } = useSpecialtyStore();

    const [form, setForm] = useState({
        name: "",
        course: "",
        specialtyId: ""
    })

  useEffect(() => {
    if (group) {
        setForm({
            name: group.name,
            course: group.course.toString(),
            specialtyId: group.speciality?.id.toString() || ""
        })
    }
    loadSpecialties();
  }, [group]);

  const handleUpdate = async () => {
    if (!group) return;
    const updatedData: CreateGroupDto = {
        name: form.name,
        course: Number(form.course),
        specialityId: Number(form.specialtyId)
    }

    await updateGroup(group.id, updatedData);
    await fetchGroups();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>Редактировать группу</Dialog.Title>
        <Flex direction="column" gap="3" mt="3">
          <TextField.Root
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value}))}
          />
          <TextField.Root
            value={form.course}
            onChange={(e) => setForm((f) => ({ ...f, course: e.target.value}))}
            type='number'
          />
          <Select.Root
            value={form.specialtyId}
            onValueChange={(val) => setForm((f) => ({ ...f, specialtyId: val }))}
          >
            <Select.Trigger placeholder="Специальность" />
            <Select.Content position='popper'>
              {specialties.map((s) => (
                <Select.Item key={s.id} value={s.id.toString()}>
                  {s.name}
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
