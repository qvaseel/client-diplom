import React from "react";
import { useScheduleStore } from "@/store/scheduleStore";
import { Table } from "@radix-ui/themes";
import { daysOfWeek } from '@/utils/constants';

const TeacherScheduleTable: React.FC = () => {
  const schedule = useScheduleStore((state) => state.schedule);
  const currentDayOfWeek = new Date().getDay();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
      {daysOfWeek.map((day, index) => {
        const dayNumber = index + 1;

        const daySchedule = schedule
          .filter((item) => item.dayOfWeek === dayNumber)
          .sort((a, b) => a.orderNumber - b.orderNumber);

        return (
          <div
            key={day}
            className={`bg-white shadow-md border overflow-x-visible ${currentDayOfWeek == Number(dayNumber) ? 'border-2 border-cyan-600' : 'border-slate-400'} rounded-lg p-4`}
            >
            <h2 className="text-xl font-bold mb-2">{day}</h2>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Пара</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Дисциплина</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Ауд.</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Группа</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
              {daySchedule.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.RowHeaderCell>{item.orderNumber}</Table.RowHeaderCell>
                    <Table.Cell>{item.discipline.name}</Table.Cell>
                    <Table.Cell>{item.room}</Table.Cell>
                    <Table.Cell>{item.group.name}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
        );
      })}
    </div>
  );
};

export default TeacherScheduleTable;
