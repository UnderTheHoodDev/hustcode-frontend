import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProblem } from '@/lib/api/problem';
import { toastError, toastSuccess } from '@/utils/toaster';

const useDeleteProblem = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteProblem(id),
    onError: (error) => {
      console.error('Delete problem error:', error);
      toastError('Failed to delete problem. Please check your input.');
    },
    onSuccess: (response) => {
      console.warn('Delete problem successful:', response);
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      queryClient.invalidateQueries({ queryKey: ['admin-problems'] });
      toastSuccess('Problem deleted successfully!');
    },
  });

  return mutation;
};

export default useDeleteProblem;
