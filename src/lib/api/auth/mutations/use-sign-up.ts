import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { SignupDto } from '@/api/client';
import { signUp } from '@/lib/api/auth';
import { toastError, toastSuccess } from '@/utils/toaster';

const useSignUpMutation = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: SignupDto) => signUp(payload),
    onError: (error) => {
      console.log('Sign up error:', error);
      toastError('Sign up failed. Please try again.');
    },
    onSuccess: (response) => {
      console.log('Sign up successful:', response);
      router.push('/auth/login');
      toastSuccess('Sign up successful! Please log in.');
    },
  });

  return mutation;
};

export default useSignUpMutation;
