import { create } from "zustand";
import { api } from "@/api/api";
import { CreateUserDto, UpdateUserDto, User } from "@/interface/index";
import { getAuthToken } from "@/utils/auth";

interface UserState {
  users: User[];
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  fetchStudentsByGroup: (groupId: number) => Promise<void>;
  fetchTeachers: () => Promise<void>;
  fetchUser: (id: number) => Promise<void>;
  createUser: (user: Partial<CreateUserDto>) => Promise<void>;
  updateUser: (id: number, user: Partial<UpdateUserDto>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  searchResults: User[];
  hasMoreResults: boolean;
  searchUsers: (query: string, skip?: number) => Promise<void>;
  clearSearch: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  user: null,
  loading: false,
  error: null,

  fetchStudents: async () => {
    set({ loading: true, error: null });
    const token = getAuthToken();
    try {
      const { data } = await api.get<User[]>("/users/get/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ users: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchStudentsByGroup: async (groupId: number) => {
    set({ loading: true, error: null });
    const token = getAuthToken();
    try {
      const { data } = await api.get<User[]>(`/users/get/students/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ users: data.sort((a, b) => a.lastName.localeCompare(b.lastName)), loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTeachers: async () => {
    set({ loading: true, error: null });
    const token = getAuthToken();
    try {
      const { data } = await api.get<User[]>("/users/get/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ users: data.sort((a, b) => a.lastName.localeCompare(b.lastName)), loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchUser: async (id) => {
    set({ loading: true, error: null });
    const token = getAuthToken();
    try {
      const { data } = await api.get<User>(`/users/search-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteUser: async (id) => {
    const token = getAuthToken();
    try {
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  createUser: async (user) => {
    const token = getAuthToken();
    try {
      const res = await api.post<User>("/auth/reg", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({ users: [...state.users, res.data] }));

      await get().fetchStudents();
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateUser: async (id, user) => {
    const token = getAuthToken();
    try {
      await api.patch(`/users/${id}`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  searchResults: [],
  hasMoreResults: false,

  searchUsers: async (query, skip = 0) => {
    const token = getAuthToken();
    try {
      const { data } = await api.get<User[]>(`/users/search-users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { query, take: 5, skip },
      });

      set((state) => ({
        searchResults: skip === 0 ? data : [...state.searchResults, ...data],
        hasMoreResults: data.length === 5,
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  clearSearch: () => set({ searchResults: [], hasMoreResults: false }),
}));
