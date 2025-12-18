import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/atoms';
import { getSubmissions } from '@/lib/api/submission';

const useSubmissions = (problemId: string) => {
  const userInfo = useAtomValue(userInfoAtom);

  const query = useQuery({
    queryKey: ['submissions', problemId],
    queryFn: async () => {
      try {
        const response = await getSubmissions({
          userId: userInfo?.id,
          problemId: problemId,
        });
        return response;
      } catch (error) {
        console.error('Error fetching submissions:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useSubmissions;
