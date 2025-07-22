import axios from 'axios';

import { AuthApi, Configuration, UserApi } from '@/api/client';
import { DEFAULT_API_BASE_URL } from '@/constants/api_paths';

const axiosInstance = axios.create();

export const userConnect = new UserApi(
  {
    basePath: DEFAULT_API_BASE_URL,
  } as Configuration,
  undefined,
  axiosInstance
);

export const authConnect = new AuthApi(
  {
    basePath: DEFAULT_API_BASE_URL,
  } as Configuration,
  undefined,
  axiosInstance
);
