import axios from 'axios';
import { cookies } from 'next/headers';

import { AuthApi, Configuration, UserApi } from '@/api/client';
import { DEFAULT_API_BASE_URL } from '@/constants/api_paths';

const axiosInstanceWithAuth = axios.create();

axiosInstanceWithAuth.interceptors.request.use(async (request) => {
  const token = (await cookies()).get('access_token')?.value || '';
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

axiosInstanceWithAuth.interceptors.response.use(
  async (response) => response,
  async (error) => Promise.reject(error)
);

export const userConnectWithAuth = new UserApi(
  {
    basePath: DEFAULT_API_BASE_URL,
  } as Configuration,
  undefined,
  axiosInstanceWithAuth
);

export const authConnectWithAuth = new AuthApi(
  {
    basePath: DEFAULT_API_BASE_URL,
  } as Configuration,
  undefined,
  axiosInstanceWithAuth
);
