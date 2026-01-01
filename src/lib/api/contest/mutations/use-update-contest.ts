import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateContestDto } from '@/api/client';
import { updateContest } from '@/lib/api/contest';
import { toastError, toastSuccess } from '@/utils/toaster';

const useUpdateContest = (contest_id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateContestDto) =>
      updateContest(contest_id, payload),
    onError: (error) => {
      console.log('Update contest error:', error);
      toastError('Failed to update contest. Please check your input.');
    },
    onSuccess: (response) => {
      console.log('Update contest successful:', response);
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      toastSuccess('Contest updated successfully!');
    },
  });

  return mutation;
};

export default useUpdateContest;
