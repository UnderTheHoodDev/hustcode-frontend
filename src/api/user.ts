import axios from 'axios';

import { ProblemApi, ProblemSubmissionApi, UserApi } from '@/api/client/api';
import { Configuration } from '@/api/client/configuration';
import { authConnect } from '@/api/guest';
import { DEFAULT_API_BASE_URL } from '@/config/api';

const axiosInstanceWithAuth = axios.create({
  baseURL: DEFAULT_API_BASE_URL,
  withCredentials: true,
});

axiosInstanceWithAuth.interceptors.response.use(
  async (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await authConnect.authControllerRefresh();
        return axiosInstanceWithAuth(originalRequest);
      } catch (error) {
        const isUserApiCall =
          originalRequest.url?.includes('/user') ||
          originalRequest.url?.includes('/api/user');

        if (!isUserApiCall && typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export const userConnect = new UserApi(
  {
    basePath: DEFAULT_API_BASE_URL,
  } as Configuration,
  undefined,
  axiosInstanceWithAuth
);

export const problemConnectWithAuth = new ProblemApi(
  {
    basePath: DEFAULT_API_BASE_URL,
  } as Configuration,
  undefined,
  axiosInstanceWithAuth
);

export const problemSubmissionWithAuth = new ProblemSubmissionApi(
  {
    basePath: DEFAULT_API_BASE_URL,
  } as Configuration,
  undefined,
  axiosInstanceWithAuth
);
