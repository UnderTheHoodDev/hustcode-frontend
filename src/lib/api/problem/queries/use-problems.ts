import { useQuery } from '@tanstack/react-query';

import { getProblems } from '@/lib/api/problem';

const useProblems = (options: OptherOptionsProps) => {
  const query = useQuery({
    queryKey: ['problems'],
    queryFn: async () => {
      try {
        const response = await getProblems(options);
        return response;
      } catch (error) {
        console.error('Error fetching problems:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return query;
};

export default useProblems;
