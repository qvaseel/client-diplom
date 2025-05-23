"use client"

import React, { useEffect } from 'react';
import ScheduleTable from '@/components/ScheduleTable';
import { useScheduleStore } from '@/store/scheduleStore';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Text, Spinner } from '@radix-ui/themes';

const SchedulePage: React.FC = () => {
  const fetchScheduleForGroup = useScheduleStore((state) => state.fetchScheduleForGroup);
  const scLoading = useScheduleStore((state) => state.loading);
  const { profileUser, loading } = useUserProfile();

  useEffect(() => {
    if (profileUser?.group?.id) { 
      fetchScheduleForGroup(profileUser.group.id);
    }
  }, [fetchScheduleForGroup, profileUser]);

  return (
    <div className="container mx-auto">
      <Text className='text-lg md:text-xl font-bold'>Расписание группы {profileUser?.group?.name}</Text>
      <Spinner loading={loading || scLoading}>
        <ScheduleTable />
      </Spinner>
    </div>
  );
};

export default SchedulePage;
