import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteContest } from '@/lib/api/contest';
import { toastError, toastSuccess } from '@/utils/toaster';

const useDeleteContest = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (contest_id: string) => deleteContest(contest_id),
    onError: (error) => {
      console.log('Delete contest error:', error);
      toastError('Failed to delete contest. Please check your input.');
    },
    onSuccess: (response) => {
      console.log('Delete contest successful:', response);
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      toastSuccess('Contest deleted successfully!');
    },
  });

  return mutation;
};

export default useDeleteContest;
