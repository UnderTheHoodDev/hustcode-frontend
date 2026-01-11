import { useQuery } from '@tanstack/react-query';

import { getUsers, GetUsersParams, UsersResponse } from '@/lib/api/user';

interface UseUsersParams extends GetUsersParams {
  enabled?: boolean;
}

const useUsers = ({
  page = 1,
  pageSize = 10,
  search,
  sortBy,
  sortOrder,
  enabled = true,
}: UseUsersParams = {}) => {
  return useQuery<UsersResponse>({
    queryKey: ['users', page, pageSize, search, sortBy, sortOrder],
    queryFn: () => getUsers({ page, pageSize, search, sortBy, sortOrder }),
    enabled,
  });
};

export default useUsers;
