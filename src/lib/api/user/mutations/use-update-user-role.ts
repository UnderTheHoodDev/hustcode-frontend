import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateUserRole } from '@/lib/api/user';
import { toastError, toastSuccess } from '@/utils/toaster';

interface UpdateRoleVariables {
  userId: string;
  role: 'ADMIN' | 'USER';
}

const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: UpdateRoleVariables) =>
      updateUserRole(userId, role),
    onSuccess: (_data, variables) => {
      toastSuccess('User role updated successfully');
      // Invalidate user queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      console.error('Failed to update user role:', error);
      toastError(error.message || 'Failed to update user role');
    },
  });
};

export default useUpdateUserRole;
