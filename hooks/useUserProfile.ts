import { useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';

export const useUserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { profileUser, decodedUser, setProfileUser, token, logout } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      if (token && decodedUser && !profileUser) {
        try {
          setLoading(true);
          await setProfileUser(decodedUser.id);
          setError(null);
        } catch (err) {
          setError('Ошибка при загрузке профиля пользователя');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [decodedUser?.id, profileUser, setProfileUser, token]);

  return { loading, profileUser, groupId: profileUser?.group?.id, logout, error };
};