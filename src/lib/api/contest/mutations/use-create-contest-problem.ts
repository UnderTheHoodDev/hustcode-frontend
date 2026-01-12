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
      console.error('Create contest problem error:', error);
      toastError('Failed to create contest problem. Please check your input.');
    },
    onSuccess: (response) => {
      console.warn('Create contest problem successful:', response);
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      // Invalidate contest detail query
      const contestId = (response as any)?.contestId;
      if (contestId) {
        queryClient.invalidateQueries({ queryKey: ['contests', contestId] });
      }
      toastSuccess('Contest problem created successfully!');
    },
  });

  return mutation;
};

export default useCreateContestProblem;
