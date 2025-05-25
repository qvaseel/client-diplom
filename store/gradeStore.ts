import { create } from 'zustand';
import { api } from '@/api/api';
import { CreateGradeDto, Grade, HomeworkSubmission, Lesson } from '@/interface';

export type GradeWithLesson = {
  id: string;
  grade: number | null;
  comment?: string;
  lesson: Lesson;
  homeworkSubmission?: HomeworkSubmission;
  homeworkSubmissionId?: number;
}

interface GradeStore {
  grades: Grade[];
  allGrades: Grade[]; 
  diaryByDate: Record<string, GradeWithLesson[]>
  loadAllGradeByStudentAndDiscipline: (studentId: number, disciplineId: number) => Promise<void>;
  loadAllGradeByGroupAndDiscipline: (groupId: number, disciplineId: number) => Promise<void>;
  loadGradesByLessonId: (lessonId: number) => Grade[];
  loadAllGradesByStudentAcrossDisciplines: (studentId: number) => Promise<void>;
  findGradeByStudentAndLesson: (studentId: number, lessonId: number) => Grade | undefined;
  createGrade: (grade: Partial<CreateGradeDto>) => Promise<void>;
  updateGrade: (id: number, grade: Partial<Grade>) => Promise<void>;
  loadDiaryByDate: (date: string, studentId: number) => Promise<void>;
}

export const useGradeStore = create<GradeStore>((set, get) => ({
  grades: [],
  allGrades: [],
  diaryByDate: {},

  loadAllGradeByStudentAndDiscipline: async (studentId, disciplineId) => {
    const res = await api.get<Grade[]>(`/grades/by-student-and-discipline?studentId=${studentId}&disciplineId=${disciplineId}`);
    set({ grades: res.data });
  },

  loadAllGradeByGroupAndDiscipline: async (groupId, disciplineId) => {
    const res = await api.get<Grade[]>(`/grades/by-group-and-discipline?groupId=${groupId}&disciplineId=${disciplineId}`);
    set({ grades: res.data });
  },

  loadGradesByLessonId: (lessonId) => {
    return get().grades.filter((g) => g.lesson.id === lessonId);
  },

  findGradeByStudentAndLesson: (studentId, lessonId) => {
    return get().grades.find(
      (g) => g.student?.id === studentId && g.lesson?.id === lessonId
    );
  },

    loadAllGradesByStudentAcrossDisciplines: async (studentId) => {
    const res = await api.get<Grade[]>(`/grades/by-student?studentId=${studentId}`);
    set({ allGrades: res.data });
  },

loadDiaryByDate: async (date: string, studentId: number) => {
  const res = await api.get<GradeWithLesson[]>(`/grades/by-date?date=${date}&studentId=${studentId}`);
      set((state) => ({
      diaryByDate: {
        ...state.diaryByDate,
        [date]: res.data,
      },
    }))
},

  createGrade: async (grade) => {
    const res = await api.post('/grades', grade);
    set((state) => ({ grades: [...state.grades, res.data] }));
  },

  updateGrade: async (id, grade) => {
    const res = await api.patch<Grade>(`/grades/${id}`, grade);
    set((state) => ({
      grades: state.grades.map((g) => (g.id === id ? res.data : g)),
    }));
  },
}));
