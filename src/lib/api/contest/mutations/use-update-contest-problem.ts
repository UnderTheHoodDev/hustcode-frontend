import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UpdateContestProblemDto } from '@/api/client';
import { updateContestProblem } from '@/lib/api/contest';
import { toastError, toastSuccess } from '@/utils/toaster';

const useUpdateContestProblem = (contest_id: string, problem_id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: UpdateContestProblemDto) =>
      updateContestProblem(contest_id, problem_id, payload),
    onError: (error) => {
      console.log('Create contest problem error:', error);
      toastError('Failed to create contest problem. Please check your input.');
    },
    onSuccess: (response) => {
      console.log('Create contest problem successful:', response);
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      toastSuccess('Contest problem created successfully!');
    },
  });

  return mutation;
};

export default useUpdateContestProblem;
