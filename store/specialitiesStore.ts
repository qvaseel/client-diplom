// store/specialtyStore.ts

import { create } from 'zustand';
import { api } from '@/api/api';

export interface Specialty {
  id: number;
  name: string;
}

interface SpecialtyStore {
  specialties: Specialty[];
  loadSpecialties: () => Promise<void>;
}

export const useSpecialtyStore = create<SpecialtyStore>((set) => ({
  specialties: [],
  loadSpecialties: async () => {
    const res = await api.get<Specialty[]>('/specialities');
    set({ specialties: res.data });
  },
}));
