import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeContestProblem } from '@/lib/api/contest';
import { toastError, toastSuccess } from '@/utils/toaster';

const useRemoveContestProblem = (contest_id: string, problem_id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => removeContestProblem(contest_id, problem_id),
    onError: (error) => {
      console.error('Remove contest problem error:', error);
      toastError('Failed to remove contest problem. Please try again.');
    },
    onSuccess: (response) => {
      console.warn('Remove contest problem successful:', response);
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      // Invalidate contest detail query
      queryClient.invalidateQueries({ queryKey: ['contests', contest_id] });
      toastSuccess('Contest problem removed successfully!');
    },
  });

  return mutation;
};

export default useRemoveContestProblem;
