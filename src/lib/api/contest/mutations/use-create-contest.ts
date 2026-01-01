import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateContestDto } from '@/api/client';
import { createContest } from '@/lib/api/contest';
import { toastError, toastSuccess } from '@/utils/toaster';

const useCreateContest = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateContestDto) => createContest(payload),
    onError: (error) => {
      console.log('Create contest error:', error);
      toastError('Failed to create contest. Please check your input.');
    },
    onSuccess: (response) => {
      console.log('Create contest successful:', response);
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      toastSuccess('Contest created successfully!');
    },
  });

  return mutation;
};

export default useCreateContest;
