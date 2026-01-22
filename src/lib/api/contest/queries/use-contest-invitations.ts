import { useQuery } from '@tanstack/react-query';

import { getContestInvitations } from '@/lib/api/contest';

export interface ContestInvitation {
  id: string;
  contestId: string;
  userId: string;
  invitedAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

const useContestInvitations = (contestId: string, enabled: boolean = true) => {
  return useQuery<ContestInvitation[]>({
    queryKey: ['contest-invitations', contestId],
    queryFn: async () => {
      const response = await getContestInvitations(contestId);

      // API returns { contestId, totalInvited, invitations: [...] }
      if (response && Array.isArray(response.invitations)) {
        return response.invitations;
      }

      // Fallback: Direct array response
      if (Array.isArray(response)) {
        return response;
      }

      // Fallback: { data: [...] } response
      if (response && Array.isArray(response.data)) {
        return response.data;
      }

      console.warn(
        '[useContestInvitations] Unexpected response format:',
        response
      );
      return [];
    },
    enabled: enabled && !!contestId,
  });
};

export default useContestInvitations;
