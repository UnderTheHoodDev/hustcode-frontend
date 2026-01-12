import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateProblemDto } from '@/api/client';
import { createProblem } from '@/lib/api/problem';
import { toastError, toastSuccess } from '@/utils/toaster';

const useCreateProblem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateProblemDto) => createProblem(payload),
    onError: (error) => {
      console.error('Create problem error:', error);
      toastError('Failed to create problem. Please check your input.');
    },
    onSuccess: (response) => {
      console.warn('Create problem successful:', response);
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      queryClient.invalidateQueries({ queryKey: ['admin-problems'] });
      toastSuccess('Problem created successfully!');
    },
  });

  return mutation;
};

export default useCreateProblem;
