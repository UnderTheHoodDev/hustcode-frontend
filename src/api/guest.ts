import axios from 'axios';

import { AuthApi, type Configuration } from '@/api/client';
import { DEFAULT_API_BASE_URL } from '@/config/api';

export const axiosInstance = axios.create({
  baseURL: DEFAULT_API_BASE_URL,
  withCredentials: true,
});

export const authConnect = new AuthApi(
  {
    basePath: DEFAULT_API_BASE_URL,
  } as Configuration,
  undefined,
  axiosInstance
);
