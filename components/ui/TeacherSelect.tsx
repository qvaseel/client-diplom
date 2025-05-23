import { Select } from '@radix-ui/themes';
import { Controller } from 'react-hook-form';
import { useState } from 'react';
import { User } from '@/interface';

interface Props {
  control: any;
  users: User[];
}

const TeacherSelect: React.FC<Props> = ({ control, users }) => {
  const userMap = Object.fromEntries(
    users.map((u) => [
      String(u.id),
      `${u.lastName} ${u.firstName[0]}. ${u.patronymic[0]}.`,
    ])
  );

  return (
    <Controller
      name="teacherId"
      control={control}
      render={({ field }) => {
        const stringValue = field.value ? String(field.value) : '';

        return (
          <Select.Root
            value={stringValue}
            onValueChange={(value) => field.onChange(Number(value))}
          >
            <Select.Trigger placeholder="Выберите преподавателя">
              {userMap[stringValue] || 'Выберите преподавателя'}
            </Select.Trigger>
            <Select.Content>
              {users.map((t) => (
                <Select.Item key={t.id} value={String(t.id)}>
                  {`${t.lastName} ${t.firstName[0]}. ${t.patronymic[0]}.`}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        );
      }}
    />
  );
};

export default TeacherSelect;