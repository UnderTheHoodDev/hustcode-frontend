import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SubmitProblemDto } from '@/api/client';
import { submitSolution } from '@/lib/api/submission';
import { toastError, toastSuccess } from '@/utils/toaster';

const useSubmitSolution = (problemId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: SubmitProblemDto) => submitSolution(payload),
    onError: (error) => {
      console.log('Submit solution error:', error);
      toastError('Failed to submit solution. There was something wrong.');
    },
    onSuccess: (response) => {
      console.log('Submit solution successful:', response);
      queryClient.invalidateQueries({ queryKey: ['submissions', problemId] });
      toastSuccess('Submit solution successfully!');
    },
  });

  return mutation;
};

export default useSubmitSolution;
