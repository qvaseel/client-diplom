import { api } from "@/api/api";
import { CreateHomeworkSubmissionDto, HomeworkSubmission } from "@/interface";
import { create } from "zustand";

interface HomeworkSubmissionStore {
  homeworkSubmission: HomeworkSubmission | null;
  homeworksSubmissions: HomeworkSubmission[];
  createHomeworkSubmission: (formData: FormData) => Promise<void>;

  fetchAllHomeworksSubmissions: () => Promise<void>;
  fetchOneHomeworkSubmission: (homeworkSubmissionId: number) => Promise<void>;
  fetchHomeworSubmissionByHomework: (homeworkId: number) => Promise<void>;
  createHomeworkGrade: (dto: CreateHomeworkSubmissionDto, grade: number) => Promise<void>;
  updateHomework: (homeworkId: number, formData: FormData) => Promise<void>;
}

export const useHomeworkSubmissionStore = create<HomeworkSubmissionStore>(
  (set) => ({
    homeworksSubmissions: [],
    homeworkSubmission: null,

    fetchAllHomeworksSubmissions: async () => {
      const res = await api.get(`/homework-submissions`);
      set({ homeworkSubmission: res.data });
    },

    fetchOneHomeworkSubmission: async (homeworkSubmissionId: number) => {
      const res = await api.get(
        `/homework-submissions/${homeworkSubmissionId}`
      );
      
      set({ homeworkSubmission: res.data });
    },

    createHomeworkSubmission: async (formData: FormData) => {
      const res = await api.post("/homework-submissions", formData);
      set((state) => ({
        homeworksSubmissions: [...state.homeworksSubmissions, res.data],
      }));
    },

    fetchHomeworSubmissionByHomework: async (homeworkId: number) => {
      const res = await api.get(`/homework-submissions/homework/${homeworkId}`);
      set({ homeworksSubmissions: res.data });
    },

    createHomeworkGrade: async (dto, grade) => {
        const res = await api.patch(`/homework-submissions/grade`, {dto, grade})
        set({ homeworkSubmission: res.data });
    },

    updateHomework: async (homeworkId: number, formData: FormData) => {
      const res = await api.patch(`/homework-submissions/student/${homeworkId}`, formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
      set((state) => ({ homeworksSubmissions: [...state.homeworksSubmissions, res.data] }));
    },

  })
);
