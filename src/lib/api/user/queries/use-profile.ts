import { useQuery } from '@tanstack/react-query';

import { getUserMe } from '@/lib/api/user';
import { UserProfile } from '@/types/user';

const useProfileQuery = () => {
  const query = useQuery({
    queryKey: ['user_profile'],
    queryFn: async () => {
      const response = await getUserMe();
      return response.data as unknown as UserProfile;
    },
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useProfileQuery;
