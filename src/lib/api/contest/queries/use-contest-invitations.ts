import { useQuery } from '@tanstack/react-query';

import { getContestInvitations } from '@/lib/api/contest';

export interface ContestInvitation {
  id: string;
  contestId: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

interface InvitationsResponse {
  data: ContestInvitation[];
}

const useContestInvitations = (contestId: string, enabled: boolean = true) => {
  return useQuery<ContestInvitation[]>({
    queryKey: ['contest-invitations', contestId],
    queryFn: async () => {
      const response = await getContestInvitations(contestId);
      // Handle both array response and { data: [...] } response
      if (Array.isArray(response)) {
        return response;
      }
      if (response && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },
    enabled: enabled && !!contestId,
  });
};

export default useContestInvitations;
