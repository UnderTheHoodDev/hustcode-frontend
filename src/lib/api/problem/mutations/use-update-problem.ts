import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UpdateProblemDto } from '@/api/client';
import { updateProblem } from '@/lib/api/problem';
import { toastError, toastSuccess } from '@/utils/toaster';

const useUpdateProblem = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: UpdateProblemDto) => updateProblem(id, payload),
    onError: (error) => {
      console.log('Update problem error:', error);
      toastError('Failed to update problem. Please check your input.');
    },
    onSuccess: (response) => {
      console.log('Update problem successful:', response);
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      queryClient.invalidateQueries({ queryKey: ['admin-problems'] });
      toastSuccess('Problem updated successfully!');
    },
  });

  return mutation;
};

export default useUpdateProblem;
