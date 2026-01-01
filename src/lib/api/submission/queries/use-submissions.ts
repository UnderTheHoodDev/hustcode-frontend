import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { userInfoAtom } from '@/atoms';
import { getUserSubmissions } from '@/lib/api/submission';
import { SubmissionsListResponse } from '@/types/submission';

interface UseSubmissionsOptions {
  problemId?: string;
  page?: number;
  pageSize?: number;
  status?: string;
  enabled?: boolean;
}

const useSubmissions = (options: UseSubmissionsOptions = {}) => {
  const { problemId, page = 1, pageSize = 20, status, enabled = true } = options;
  const userInfo = useAtomValue(userInfoAtom);

  const query = useQuery<SubmissionsListResponse>({
    queryKey: ['submissions', userInfo?.id, problemId, page, pageSize, status],
    queryFn: async () => {
      if (!userInfo?.id) {
        return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
      }
      return await getUserSubmissions({
        userId: userInfo.id,
        page,
        pageSize,
        problemId,
        status,
      });
    },
    enabled: enabled && !!userInfo?.id,
    refetchOnWindowFocus: false,
  });

  return query;
};

export default useSubmissions;
