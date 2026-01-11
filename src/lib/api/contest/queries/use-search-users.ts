import { useQuery } from '@tanstack/react-query';

import { searchUsers } from '@/lib/api/contest';

export interface SearchUser {
  id: string;
  email: string;
  name: string | null;
  role?: 'ADMIN' | 'USER';
  rating?: number | null;
}

export interface SearchUsersResponse {
  data: SearchUser[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UseSearchUsersParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  enabled?: boolean;
}

const useSearchUsers = ({
  search,
  page = 1,
  pageSize = 20,
  sortBy,
  sortOrder,
  enabled = true,
}: UseSearchUsersParams) => {
  return useQuery<SearchUsersResponse>({
    queryKey: ['search-users', search, page, pageSize, sortBy, sortOrder],
    queryFn: () => searchUsers({ search, page, pageSize, sortBy, sortOrder }),
    enabled: enabled,
  });
};

export default useSearchUsers;
