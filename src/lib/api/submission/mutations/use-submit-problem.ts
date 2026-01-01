import { useMutation, useQueryClient } from '@tanstack/react-query';

import { submitProblem } from '@/lib/api/submission';
import { SubmitProblemPayload, SubmitProblemResponse } from '@/types/submission';

const useSubmitProblem = (problemId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<SubmitProblemResponse, Error, SubmitProblemPayload>({
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
    },
  });

  return mutation;
};

export default useSubmitProblem;

