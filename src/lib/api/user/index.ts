import axios from 'axios';

import { userConnect, userConnectWithAuth } from '@/api/user';
import { DEFAULT_API_BASE_URL } from '@/config/api';

// Create axios instance with auth for user API
const userAxios = axios.create({
  baseURL: DEFAULT_API_BASE_URL,
  withCredentials: true,
});

const getUserMe = async () => {
  return await userConnect.userControllerGetUser();
};

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'USER';
  rating: number | null;
  createdAt?: string;
}

export interface UserDetail extends User {
  contributions: number | null;
  stats?: {
    solved: number;
    inProgress: number;
    accepted: number;
  };
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: 'name' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Get all users - GET /user
const getUsers = async (params: GetUsersParams): Promise<UsersResponse> => {
  const response = await userAxios.get<UsersResponse>('/user', {
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      search: params.search,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    },
  });
  return response.data;
};

// Get user profile by ID - GET /user/profile/:id
const getUserProfile = async (userId: string): Promise<UserDetail> => {
  const response = await userAxios.get<UserDetail>(`/user/profile/${userId}`);
  return response.data;
};

// Update user role - PATCH /user/:id/role
const updateUserRole = async (
  userId: string,
  role: 'ADMIN' | 'USER'
): Promise<User> => {
  const response = await userConnectWithAuth.userControllerUpdateUserRole(
    userId,
    { role }
  );
  return response.data as unknown as User;
};

export { getUserMe, getUserProfile, getUsers, updateUserRole };
