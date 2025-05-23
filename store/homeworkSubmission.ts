import { api } from "@/api/api";
import { HomeworkSubmission } from "@/interface";
import { create } from "zustand";

interface HomeworkSubmissionStore {
  homeworkSubmission: HomeworkSubmission | null;
  homeworksSubmissions: HomeworkSubmission[];
  createHomeworkSubmission: (formData: FormData) => Promise<void>;

  fetchAllHomeworksSubmissions: () => Promise<void>;
  fetchOneHomeworkSubmission: (homeworkSubmissionId: number) => Promise<void>;
  fetchHomeworSubmissionByHomework: (homeworkId: number) => Promise<void>;
    createHomeworkGrade: (homeworkId: number, studentId: number, grade: number) => Promise<void>;
  //   updateHomework: (homeworkId: number, formData: FormData) => Promise<void>;
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
      set({ homeworkSubmission: res.data });
    },

    createHomeworkGrade: async (homeworkId, studentId, grade) => {
        const res = await api.post(`/homework-submissions/grade`, {homeworkId, studentId, grade})
        set({ homeworkSubmission: res.data });
    }
  })
);
