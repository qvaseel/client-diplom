import React from "react";
import { Schedule } from "@/interface/index";
import { useScheduleStore } from "@/store/scheduleStore";
import { Table } from "@radix-ui/themes";
import { daysOfWeek } from '@/utils/constants';

const ScheduleTable: React.FC = () => {
  const schedule = useScheduleStore((state) => state.schedule);
  const currentDayOfWeek = new Date().getDay();

  const groupedSchedule = schedule.reduce(
    (acc: Record<number, Schedule[]>, item) => {
      if (!acc[item.dayOfWeek]) acc[item.dayOfWeek] = [];
      acc[item.dayOfWeek].push(item);
      return acc;
    },
    {}
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 w-full py-4">
      {Object.keys(groupedSchedule)
        .sort((a, b) => Number(a) - Number(b))
        .map((dayNumber) => {
          const dayIndex = Number(dayNumber) - 1;
          return (
            <div
              key={dayNumber}
              className={`bg-white shadow-md border  ${
                currentDayOfWeek == Number(dayNumber)
                  ? "border-2 border-cyan-600"
                  : "border-slate-400"
              } rounded-lg p-4`}
            >
              <h2 className="text-xl font-bold mb-3">{daysOfWeek[dayIndex]}</h2>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Пара</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Дисциплина</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Ауд.</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>
                      Преподаватель
                    </Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {groupedSchedule[Number(dayNumber)].map((item, index) => (
                    <Table.Row key={index}>
                      <Table.RowHeaderCell>{item.orderNumber}</Table.RowHeaderCell>
                      <Table.Cell className="font-medium">
                        {item.discipline.name}
                      </Table.Cell>
                      <Table.Cell>{item.room}</Table.Cell>
                      <Table.Cell>{`${item.teacher.lastName} ${item.teacher.firstName[0]}. ${item.teacher.patronymic[0]}.`}</Table.Cell>
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

export default ScheduleTable;
