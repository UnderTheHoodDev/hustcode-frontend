import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProblem } from '@/lib/api/problem';
import { toastError, toastSuccess } from '@/utils/toaster';

const useDeleteProblem = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteProblem(id),
    onError: (error) => {
      console.log('Delete problem error:', error);
      toastError('Failed to delete problem. Please check your input.');
    },
    onSuccess: (response) => {
      console.log('Delete problem successful:', response);
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      toastSuccess('Problem deleted successfully!');
    },
  });

  return mutation;
};

export default useDeleteProblem;
