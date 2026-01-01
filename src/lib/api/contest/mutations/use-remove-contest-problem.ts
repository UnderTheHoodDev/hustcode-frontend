import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeContestProblem } from '@/lib/api/contest';
import { toastError, toastSuccess } from '@/utils/toaster';

const useRemoveContestProblem = (contest_id: string, problem_id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => removeContestProblem(contest_id, problem_id),
    onError: (error) => {
      console.log('Delete contest error:', error);
      toastError('Failed to delete contest. Please check your input.');
    },
    onSuccess: (response) => {
      console.log('Remove contest problem successful:', response);
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      toastSuccess('Contest problem removed successfully!');
    },
  });

  return mutation;
};

export default useRemoveContestProblem;
