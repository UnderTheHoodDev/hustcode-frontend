import axios from 'axios';

import {
  ContestsApi,
  ProblemApi,
  ProblemSubmissionApi,
  UsersApi,
} from '@/api/client/api';
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

        // Create a fresh request config to avoid using stale cached headers
        // With cookie-based auth, browser will automatically send new cookies
        const freshRequestConfig = {
          method: originalRequest.method,
          url: originalRequest.url,
          data: originalRequest.data,
          params: originalRequest.params,
          // Don't copy old headers, let axios create fresh ones
        };

        return axiosInstanceWithAuth(freshRequestConfig);
      } catch {
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

export const userConnect = new UsersApi(
  {
    basePath: DEFAULT_API_BASE_URL,
  } as Configuration,
  undefined,
  axiosInstanceWithAuth
);

// Alias for consistency with other APIs
export const userConnectWithAuth = userConnect;

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

export const contestConnectWithAuth = new ContestsApi(
  {
    basePath: DEFAULT_API_BASE_URL,
  } as Configuration,
  undefined,
  axiosInstanceWithAuth
);
