import { useQuery } from '@tanstack/react-query';

import { getContestSubmissions } from '@/lib/api/submission';

interface UseContestSubmissionsParams {
  contestId: string;
  page?: number;
  pageSize?: number;
  problemId?: string;
  filterUserId?: string;
  status?: string;
  enabled?: boolean;
}

const useContestSubmissions = ({
  contestId,
  page = 1,
  pageSize = 20,
  problemId,
  filterUserId,
  status,
  enabled = true,
}: UseContestSubmissionsParams) => {
  return useQuery({
    queryKey: [
      'contest-submissions',
      contestId,
      page,
      pageSize,
      problemId,
      filterUserId,
      status,
    ],
    queryFn: () =>
      getContestSubmissions({
        contestId,
        page,
        pageSize,
        problemId,
        filterUserId,
        status,
      }),
    enabled: enabled && !!contestId,
  });
};

export default useContestSubmissions;
