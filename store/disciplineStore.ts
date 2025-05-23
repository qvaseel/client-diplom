import { create } from 'zustand';
import { api } from '@/api/api';
import { CreateDisciplineDto, Discipline } from '@/interface/index';

interface DisciplineState {
  disciplines: Discipline[];
  fetchDisciplines: () => Promise<void>;
  fetchDisciplinesOfTeacher: (teacherId: number) => Promise<void>;
  createDiscipline: (discipline: Partial<CreateDisciplineDto>) => Promise<void>;
  updateDiscipline: (id: number, discipline: Partial<CreateDisciplineDto>) => Promise<void>;
  deleteDiscipline: (id: number) => Promise<void>;
}

export const useDisciplineStore = create<DisciplineState>((set) => ({
  disciplines: [],

  fetchDisciplines: async () => {
    const { data } = await api.get<Discipline[]>('/disciplines');
    set({ disciplines: data });
  },

  fetchDisciplinesOfTeacher: async (teacherId) => {
    const { data } = await api.get<Discipline[]>(`/disciplines/by-teacher?teacherId=${teacherId}`);
    set({ disciplines: data });
  },

  createDiscipline: async (discipline) => {
    const res = await  api.post('/disciplines', discipline);
    set((state) => ({
      disciplines: [...state.disciplines, res.data],
    }));
  },

  updateDiscipline: async (id, discipline) => {
    await api.patch(`/disciplines/${id}`, discipline);
    set((state) => ({
      disciplines: state.disciplines.filter((d) => d.id !== id),
    }));
  },

  deleteDiscipline: async (id) => {
    await api.delete(`/disciplines/${id}`);
    set((state) => ({
      disciplines: state.disciplines.filter((d) => d.id !== id),
    }));
  },
  
}));
