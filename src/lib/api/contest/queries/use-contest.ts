import { useQuery } from '@tanstack/react-query';

import { getContestDetail } from '@/lib/api/contest';

const useContest = (contest_id: string) => {
  const query = useQuery({
    queryKey: ['contests', contest_id],
    queryFn: async () => {
      try {
        const response = await getContestDetail(contest_id);
        return response;
      } catch (error) {
        console.error('Error fetching detail:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useContest;
