import { create } from 'zustand';
import { api } from '@/api/api';
import { CreateGroupDto, Group } from '@/interface/index';

interface GroupState {
  groups: Group[];
  fetchGroups: () => Promise<void>;
  createGroup: (group: Omit<CreateGroupDto, 'id'>) => Promise<void>;
  updateGroup: (id: number, group: Partial<CreateGroupDto>) => Promise<void>;
  deleteGroup: (id: number) => Promise<void>;
}

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],

  fetchGroups: async () => {
    const res = await api.get<Group[]>('/groups');
    set({ groups: res.data });
  },

  createGroup: async (group) => {
    const res = await api.post<Group>('/groups', group);
    set((state) => ({ groups: [...state.groups, res.data] }));
  },

  updateGroup: async (id, group) => {
    await api.patch(`/groups/${id}`, group);
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== id),
    }));
  },

  deleteGroup: async (id) => {
    await api.delete(`/groups/${id}`);
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== id),
    }));
  },
}));
