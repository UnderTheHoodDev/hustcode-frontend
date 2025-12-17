import { useQuery } from '@tanstack/react-query';

import { getProblemDetail } from '@/lib/api/problem';

const useProblemDetailQuery = (id: string) => {
  const query = useQuery({
    queryKey: ['problems', id],
    queryFn: async () => {
      try {
        const response = await getProblemDetail(id);
        return response;
      } catch (error) {
        console.error('Error fetching problem detail:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return query;
};

export default useProblemDetailQuery;
