import { create } from 'zustand';
import { api } from '@/api/api';
import { Lesson, LessonCreateDto
 } from '@/interface';

interface LessonStore {
  lessons: Lesson[];
  lesson: Lesson | null;
  loadLessons: () => Promise<void>;
  loadLessonsByFilter: (  groupId: number, disciplineId: number) => Promise<void>;
  getLessonById: (id: number) => Promise<void>;
  createLesson: (lesson: LessonCreateDto) => Promise<void>;
  updateLesson: (id: number, lesson: Partial<Lesson>) => Promise<void>;
  deleteLesson: (id: number) => Promise<void>;

}

export const useLessonStore = create<LessonStore>((set, get) => ({
  lessons: [],
  lesson: null,

  loadLessons: async () => {
    const res = await api.get<Lesson[]>('/lessons');
    set({ lessons: res.data });
  },

  loadLessonsByFilter: async (groupId, disciplineId) => {
    const res = await api.get<Lesson[]>(`/lessons?groupId=${groupId}&disciplineId=${disciplineId}`);
    set({ lessons: res.data });
  },

  getLessonById: async (id: number) => {
    const res = await api.get<Lesson>(`/lessons/${id}`);
   set({ lesson: res.data })
  },

  createLesson: async (lesson) => {
    const res = await api.post<Lesson>('/lessons', lesson);
    set((state) => ({ lessons: [...state.lessons, res.data] }));
  },

  updateLesson: async (id, lesson) => {
    const res = await api.patch<Lesson>(`/lessons/${id}`, lesson);
    set((state) => ({
      lessons: state.lessons.filter((l) => (l.id === id ? res.data : l)),
    }));
  },

  deleteLesson: async (id) => {
    const res = await api.delete<Lesson>(`/lessons/${id}`);
    set((state) => ({
      lessons: state.lessons.filter((l) => (l.id === id ? res.data : l)),
    }));
  },
}));
