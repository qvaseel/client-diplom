import { create } from 'zustand';
import { api } from '@/api/api';
import { Schedule } from '@/interface/index';

interface ScheduleState {
  schedule: Schedule[];
  loading: boolean;
  error: string | null;
  fetchSchedule: () => Promise<void>;
  fetchScheduleByGroupAndDiscipline: (groupId: number, disciplineId: number) => Promise<Schedule[]>
  fetchScheduleForGroup: (groupId: number) => Promise<void>;
  fetchScheduleForTeacher: (teacherId: number) => Promise<void>;
  createSchedule: (data: Partial<Schedule>) => Promise<void>;
  updateSchedule: (id: number, data: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (id: number) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedule: [],
  loading: false,
  error: null,

  fetchSchedule: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<Schedule[]>(`/schedule`);
      set({ schedule: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchScheduleForGroup: async (groupId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<Schedule[]>(`/schedule/group/${groupId}`);
      set({ schedule: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchScheduleForTeacher: async (teacherId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<Schedule[]>(`/schedule/teacher/${teacherId}`);
      set({ schedule: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchScheduleByGroupAndDiscipline: async (groupId: number, disciplineId: number) => {
    const res = await api.get<Schedule[]>(`/schedule/group-and-discipline?groupId=${groupId}&disciplineId=${disciplineId}`);
    set({ schedule: res.data });
    return res.data;
  },

  createSchedule: async (data: Partial<Schedule>) => {
    set({ loading: true, error: null });

    try {
      await api.post('/schedule', data);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateSchedule: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/schedule/${id}`, data);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteSchedule: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/schedule/${id}`);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
