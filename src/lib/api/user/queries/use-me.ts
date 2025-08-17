import { useQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';

import { userInfoAtom } from '@/atoms';
import { getUserMe } from '@/lib/api/user';

const useUserMeQuery = () => {
  const updateUserInfo = useSetAtom(userInfoAtom);

  const query = useQuery({
    queryKey: ['user_status'],
    queryFn: async () => {
      try {
        const response = await getUserMe();
        updateUserInfo(response.data as any);
        return response;
      } catch (error) {
        console.error('Error fetching user info:', error);
        updateUserInfo({
          id: '',
          email: '',
          name: '',
          role: '',
        });
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return query;
};

export default useUserMeQuery;
