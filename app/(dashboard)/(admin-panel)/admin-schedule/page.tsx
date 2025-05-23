"use client";

import React, { useEffect, useState } from 'react';
import { useScheduleStore } from '@/store/scheduleStore';
import { useGroupStore } from '@/store/groupStore';
import GroupSelector from '@/components/GroupSelector';
import ScheduleTableAdmin from '@/components/ScheduleTableAdmin/ScheduleTableAdmin';

const AdminSchedulePage: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const { fetchGroups } = useGroupStore();
  const { fetchScheduleForGroup } = useScheduleStore();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (selectedGroup) fetchScheduleForGroup(selectedGroup);
  }, [selectedGroup, fetchScheduleForGroup]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Редактирование расписания</h1>
      <GroupSelector setSelectedGroup={setSelectedGroup} />
      <ScheduleTableAdmin selectedGroup={selectedGroup} />
    </div>
  );
};

export default AdminSchedulePage;
