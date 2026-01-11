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
    mutationFn: ({ contestId, userIds }: InviteUsersPayload) =>
      inviteUsersToContest(contestId, userIds),
    onError: (error: any) => {
      console.log('Invite users error:', error);
      const message =
        error?.response?.data?.message ||
        'Failed to invite users. Please try again.';
      toastError(message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['contest-invitations', variables.contestId],
      });
      toastSuccess('Users invited successfully!');
    },
  });

  return mutation;
};

export default useInviteUsers;
