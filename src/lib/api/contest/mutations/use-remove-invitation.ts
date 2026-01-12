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
      console.error('Remove invitation error:', error);
      const message =
        error?.response?.data?.message ||
        'Failed to remove invitation. Please try again.';
      toastError(message);
    },
    onSuccess: (_, variables) => {
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
      toastSuccess('Invitation removed successfully!');
    },
  });

  return mutation;
};

export default useRemoveInvitation;
