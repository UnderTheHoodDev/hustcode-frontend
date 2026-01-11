import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeContestInvitation } from '@/lib/api/contest';
import { toastError, toastSuccess } from '@/utils/toaster';

interface RemoveInvitationPayload {
  contestId: string;
  userId: string;
}

const useRemoveInvitation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ contestId, userId }: RemoveInvitationPayload) =>
      removeContestInvitation(contestId, userId),
    onError: (error: any) => {
      console.log('Remove invitation error:', error);
      const message =
        error?.response?.data?.message ||
        'Failed to remove invitation. Please try again.';
      toastError(message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['contest-invitations', variables.contestId],
      });
      toastSuccess('Invitation removed successfully!');
    },
  });

  return mutation;
};

export default useRemoveInvitation;
