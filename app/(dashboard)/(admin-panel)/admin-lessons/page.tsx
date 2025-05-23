'use client';

import { useEffect, useState } from 'react';
import { useScheduleStore } from '@/store/scheduleStore';
import { useLessonStore } from '@/store/lessonStore';
import { useGroupStore } from '@/store/groupStore';
import { useDisciplineStore } from '@/store/disciplineStore';

import {
  Select,
  TextField,
  Button,
  Heading,
  Flex,
  Text,
} from '@radix-ui/themes';

export default function AdminCreateLessonPage() {
  const { groups, fetchGroups } = useGroupStore();
  const { disciplines, fetchDisciplines } = useDisciplineStore();
  const { schedule, fetchScheduleByGroupAndDiscipline } = useScheduleStore();
  const { createLesson } = useLessonStore();

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<number | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [topic, setTopic] = useState('');
  const [typeOfLesson, setTypeOfLesson] = useState('Устный ответ');

  useEffect(() => {
    fetchGroups();
    fetchDisciplines();
  }, []);

  useEffect(() => {
    if (selectedGroupId && selectedDisciplineId) {
        fetchScheduleByGroupAndDiscipline(selectedGroupId, selectedDisciplineId);
      setSelectedScheduleId(null);
    }
  }, [selectedGroupId, selectedDisciplineId]);

  const handleSubmit = async () => {
    if (!selectedScheduleId || !date) return;

    await createLesson({
      scheduleId: selectedScheduleId,
      date,
      topic,
      typeOfLesson,
    });

    setDate('');
    setTopic('');
    setSelectedScheduleId(null);
  };

  return (
    <Flex direction="column" gap="4">
      <Heading as="h4">Создать занятие</Heading>

      <Select.Root value={selectedGroupId?.toString() || ''} onValueChange={(val) => setSelectedGroupId(Number(val))}>
        <Select.Trigger placeholder="Выберите группу" />
        <Select.Content>
          {groups.map((group) => (
            <Select.Item key={group.id} value={group.id.toString()}>
              {group.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      <Select.Root
        value={selectedDisciplineId?.toString() || ''}
        onValueChange={(val) => setSelectedDisciplineId(Number(val))}
        disabled={!selectedGroupId}
      >
        <Select.Trigger placeholder="Выберите дисциплину" />
        <Select.Content>
          {disciplines.map((discipline) => (
            <Select.Item key={discipline.id} value={discipline.id.toString()}>
              {discipline.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      <Select.Root
        value={selectedScheduleId?.toString() || ''}
        onValueChange={(val) => setSelectedScheduleId(Number(val))}
        disabled={!selectedGroupId || !selectedDisciplineId}
      >
        <Select.Trigger placeholder="Выберите расписание" />
        <Select.Content>
          {schedule.map((schedule) => (
            <Select.Item key={schedule.id} value={schedule.id.toString()}>
              {`${schedule.dayOfWeek} | ${schedule.room}`}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      <TextField.Root type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <TextField.Root placeholder="Тема занятия" value={topic} onChange={(e) => setTopic(e.target.value)} />

      <Select.Root value={typeOfLesson} onValueChange={(val) => setTypeOfLesson(val)}>
        <Select.Trigger placeholder="Тип занятия" />
        <Select.Content>
          <Select.Item value="Устный ответ">Устный ответ</Select.Item>
          <Select.Item value="Практическая работа">Практическая работа</Select.Item>
          <Select.Item value="Тест">Тест</Select.Item>
        </Select.Content>
      </Select.Root>

      <Button onClick={handleSubmit} disabled={!selectedScheduleId || !date}>
        Создать занятие
      </Button>
    </Flex>
  );
}
