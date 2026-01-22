import axios from 'axios';

import { DEFAULT_API_BASE_URL } from '@/config/api';
import { ContestSubmissionsResponse } from '@/types/contest';
import {
  RunCodePayload,
  RunCodeResult,
  SubmissionsListResponse,
  SubmitProblemPayload,
  SubmitProblemResponse,
} from '@/types/submission';

// Create axios instance with auth for submission API
const submissionAxios = axios.create({
  baseURL: DEFAULT_API_BASE_URL,
  withCredentials: true,
});

// Run code without creating submission - POST /submission
// Just runs the code and returns result
const runCode = async (payload: RunCodePayload): Promise<RunCodeResult> => {
  const response = await submissionAxios.post<RunCodeResult>(
    '/submission',
    payload
  );
  return response.data;
};

// Submit problem solution - POST /problem-submission
// Returns submission result with testcase results
const submitProblem = async (
  payload: SubmitProblemPayload
): Promise<SubmitProblemResponse> => {
  const response = await submissionAxios.post<SubmitProblemResponse>(
    '/problem-submission',
    payload
  );
  return response.data;
};

// Get user's submissions - GET /problem-submission/user/:userId
const getUserSubmissions = async (params: {
  userId: string;
  page?: number;
  pageSize?: number;
  problemId?: string;
  status?: string;
}): Promise<SubmissionsListResponse> => {
  const { userId, ...queryParams } = params;
  const response = await submissionAxios.get<SubmissionsListResponse>(
    `/problem-submission/user/${userId}`,
    { params: queryParams }
  );
  return response.data;
};

// Get contest submissions - GET /contests/:id/submissions
// This endpoint returns all submissions for a specific contest
// Can filter by problemId, userId (filterUserId), and status
const getContestSubmissions = async (params: {
  contestId: string;
  page?: number;
  pageSize?: number;
  problemId?: string;
  filterUserId?: string;
  status?: string;
}): Promise<ContestSubmissionsResponse> => {
  const { contestId, ...queryParams } = params;
  const response = await submissionAxios.get<ContestSubmissionsResponse>(
    `/contests/${contestId}/submissions`,
    { params: queryParams }
  );
  return response.data;
};

export { getContestSubmissions, getUserSubmissions, runCode, submitProblem };
