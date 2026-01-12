import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { SignupDto } from '@/api/client';
import { signUp } from '@/lib/api/auth';
import { toastError, toastSuccess } from '@/utils/toaster';

const useSignUpMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: SignupDto) => signUp(payload),
    onError: (error) => {
      console.error('Sign up error:', error);
      toastError('Sign up failed. Please try again.');
    },
    onSuccess: (response) => {
      console.warn('Sign up successful:', response);
      router.push('/');
      queryClient.invalidateQueries({ queryKey: ['user_status'] });
      toastSuccess('Sign up successful!');
    },
  });

  return mutation;
};

export default useSignUpMutation;
