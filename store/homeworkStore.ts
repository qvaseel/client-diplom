import { api } from "@/api/api";
import { Homework } from "@/interface";
import { create } from "zustand";

interface HomeworkStore {
  homework: Homework | null;
  homeworks: Homework[];
  fetchAllHomeworks: () => Promise<void>;
  fetchOneHomework: (homeworkId: number) => Promise<void>;
  fetchHomeworkByLesson: (lessonId: number) => Promise<void>;
  createHomework: (formData: FormData) => Promise<void>;
  updateHomework: (homeworkId: number, formData: FormData) => Promise<void>;
}

export const useHomeworkStore = create<HomeworkStore>((set) => ({
  homework: null,
  homeworks: [],

  fetchAllHomeworks: async () => {
    const res = await api.get(`/homeworks`);
    set({ homeworks: res.data });
  },

  createHomework: async (formData: FormData) => {
    console.log(formData)
    const res = await api.post("/homeworks", formData, {
              headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    set((state) => ({ homeworks: [...state.homeworks, res.data] }));
  },

  updateHomework: async (homeworkId: number, formData: FormData) => {
    const res = await api.patch(`/homeworks/${homeworkId}`, formData);
    set((state) => ({ homeworks: [...state.homeworks, res.data] }));
  },

  fetchOneHomework: async (homeworkId: number) => {
    const res = await api.get(`/homeworks/${homeworkId}`);
    set({ homework: res.data });
  },

  fetchHomeworkByLesson: async (lessonId: number) => {
    const res = await api.get(`/homeworks/lesson/${lessonId}`);
    set({ homework: res.data });
  },
}));
