import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { LoginDto } from '@/api/client';
import { login } from '@/lib/api/auth';
import { toastError, toastSuccess } from '@/utils/toaster';

const useLoginMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: LoginDto) => login(payload),
    onError: (error) => {
      console.error('Login error:', error);
      toastError('Login failed. Please check your credentials.');
    },
    onSuccess: (response) => {
      console.warn('Login successful:', response);
      router.push('/');
      queryClient.invalidateQueries({ queryKey: ['user_status'] });
      toastSuccess('Login successful!');
    },
  });

  return mutation;
};

export default useLoginMutation;
