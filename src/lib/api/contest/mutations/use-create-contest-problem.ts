import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateContestProblemDto } from '@/api/client';
import { createContestProblem } from '@/lib/api/contest';
import { toastError, toastSuccess } from '@/utils/toaster';

const useCreateContestProblem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateContestProblemDto) =>
      createContestProblem(payload),
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

export default useCreateContestProblem;
