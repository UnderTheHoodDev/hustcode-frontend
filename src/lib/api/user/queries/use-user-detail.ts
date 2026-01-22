import { useQuery } from '@tanstack/react-query';

import { getUserProfile, UserDetail } from '@/lib/api/user';

const useUserDetail = (userId: string) => {
  const query = useQuery<UserDetail>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await getUserProfile(userId);
      return response;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useUserDetail;
