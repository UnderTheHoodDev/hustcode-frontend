import { useMutation, useQueryClient } from '@tanstack/react-query';

import { submitProblem } from '@/lib/api/submission';
import {
  SubmitProblemPayload,
  SubmitProblemResponse,
} from '@/types/submission';

const useSubmitProblem = (problemId: string, contestId?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    SubmitProblemResponse,
    Error,
    SubmitProblemPayload
  >({
    mutationFn: submitProblem,
    onSuccess: () => {
      // Invalidate all submissions queries that include this problemId
      // The query key is ['submissions', userId, problemId, ...]
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey as (string | undefined)[];
          return queryKey[0] === 'submissions' && queryKey[2] === problemId;
        },
      });

      // If in contest mode, also invalidate contest-related queries
      if (contestId) {
        // Invalidate contest submissions
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey as (string | undefined)[];
            return (
              queryKey[0] === 'contest-submissions' && queryKey[1] === contestId
            );
          },
        });

        // Invalidate user contest score
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey as (string | undefined)[];
            return (
              queryKey[0] === 'user-contest-score' && queryKey[2] === contestId
            );
          },
        });

        // Invalidate contest leaderboard
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey as (string | undefined)[];
            return (
              queryKey[0] === 'contest-leaderboard' && queryKey[1] === contestId
            );
          },
        });
      }
    },
  });

  return mutation;
};

export default useSubmitProblem;
