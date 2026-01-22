import { useMutation, useQueryClient } from '@tanstack/react-query';

import { inviteUsersToContest } from '@/lib/api/contest';
import { toastError, toastSuccess } from '@/utils/toaster';

interface InviteUsersPayload {
  contestId: string;
  userIds: string[];
}

const useInviteUsers = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ contestId, userIds }: InviteUsersPayload) => {
      console.warn('[useInviteUsers] Inviting users:', { contestId, userIds });
      const result = await inviteUsersToContest(contestId, userIds);
      console.warn('[useInviteUsers] API response:', result);
      return result;
    },
    onError: (error: any) => {
      console.error('[useInviteUsers] Error:', error);
      const message =
        error?.response?.data?.message ||
        'Failed to invite users. Please try again.';
      toastError(message);
    },
    onSuccess: (_, variables) => {
      console.warn(
        '[useInviteUsers] Success, invalidating queries for contestId:',
        variables.contestId
      );
      // Invalidate contest invitations list
      queryClient.invalidateQueries({
        queryKey: ['contest-invitations', variables.contestId],
      });
      // Invalidate contest detail to update participant count
      queryClient.invalidateQueries({
        queryKey: ['contests', variables.contestId],
      });
      // Invalidate contests list to update participant count on list page
      queryClient.invalidateQueries({
        queryKey: ['contests'],
      });
      toastSuccess('Users invited successfully!');
    },
  });

  return mutation;
};

export default useInviteUsers;
