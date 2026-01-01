import { useQuery } from '@tanstack/react-query';

import { getContests } from '@/lib/api/contest';

const useContests = (options: OptherOptionsProps) => {
  const query = useQuery({
    queryKey: ['contests', options.page, options.pageSize, options.status],
    queryFn: async () => {
      try {
        const response = await getContests(options);
        return response;
      } catch (error) {
        console.error('Error fetching contests:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useContests;
