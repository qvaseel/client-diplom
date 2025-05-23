import { create } from 'zustand';
import { api } from '@/api/api';
import { Achievement, CreateAchievementDto, Portfolio } from '@/interface';

interface PortfolioStore {
  portfolio: Portfolio | null;
  achievement: Achievement | null;
  achievements: Achievement[] | null;
  fetchPortfolio: (userId: number) => Promise<void>;
  deleteAchievement: (achievementId: number) => Promise<void>;
  createPortfolio: (userId: number) => Promise<void>;
  createAchievement: (userId: number, formData: FormData) => Promise<void>;
  fetchAchievement: (achievementId: number) => Promise<void>;
  updateAchievement: (achievementId: number, formData: FormData, userId: number) => Promise<void>;
  markAsPassed: (achievementId: number) => Promise<void>;
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  portfolio: null,
  achievement: null,
  achievements: null,

  fetchPortfolio: async (userId) => {
    const res = await api.get(`/portfolio/get/${userId}`);
    set({ portfolio: res.data });
  },

  deleteAchievement: async (achievementId) => {
    await api.delete(`/portfolio/achievement/${achievementId}`);
    const { portfolio } = get();
    if (portfolio) {
      set({
        portfolio: {
          ...portfolio,
          achievements: portfolio.achievements.filter(a => a.id !== achievementId),
        },
      });
    }
  },

  createPortfolio: async (userId) => {
    const res = await api.post(`/portfolio/create/${userId}`);
    set({ portfolio: res.data });
  },

  createAchievement: async (userId: number, formData: FormData) => {
    const response = await api.post(`/portfolio/achievement?studentId=${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
    const newAchievement = response.data;
  
    set((state) => {
      const updatedAchievements = [
        ...(state.portfolio?.achievements || []),
        newAchievement,
      ];
  
      return {
        achievement: newAchievement,
        achievements: updatedAchievements,
        portfolio: state.portfolio
          ? {
              ...state.portfolio,
              achievements: updatedAchievements,
            }
          : state.portfolio,
      };
    });
  },

  fetchAchievement: async (achievementId: number) => {
    const res = await api.get(`/portfolio/${achievementId}`)
    set({
      achievement: res.data
    })
  },

  updateAchievement: async (achievementId, formData, userId) => {
    await api.patch(`/portfolio/achievement/update/${achievementId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Обновляем портфолио, можно также вручную обновить список
    const updatedPortfolio = await api.get(`/portfolio/get/${userId}`);
    set({ portfolio: updatedPortfolio.data });
  },

  markAsPassed: async (achievementId: number) => {
    await api.patch(`/portfolio/achievement/pass/${achievementId}`);
  }

}));
