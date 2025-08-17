import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { logout } from '@/lib/api/auth';
import { toastError, toastSuccess } from '@/utils/toaster';

const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => logout(),
    onError: (error) => {
      console.log('Logout error:', error);
      toastError('Logout failed. Please try again.');
    },
    onSuccess: (response) => {
      console.log('Logout successful:', response);
      router.push('/');
      queryClient.invalidateQueries({ queryKey: ['user_status'] });
      toastSuccess('Logout successful!');
    },
  });

  return mutation;
};

export default useLogoutMutation;
