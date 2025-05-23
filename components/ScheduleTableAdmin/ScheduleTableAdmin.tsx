import React from 'react';
import { useScheduleStore } from '@/store/scheduleStore';
import ScheduleDayColumn from './ScheduleDayColumn';

interface ScheduleTableProps {
  selectedGroup: number | null;
}

const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

const ScheduleTableAdmin: React.FC<ScheduleTableProps> = ({ selectedGroup }) => {
  const { schedule } = useScheduleStore();

  return (
    <div className="grid grid-cols-3 gap-4">
      {daysOfWeek.map((day, index) => (
        <ScheduleDayColumn
          key={index}
          dayOfWeek={index + 1}
          dayName={day}
          schedule={schedule.filter(item => item.dayOfWeek === index + 1)}
          selectedGroup={selectedGroup}
        />
      ))}
    </div>
  );
};

export default ScheduleTableAdmin;
