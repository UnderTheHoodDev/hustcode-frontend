import axios from 'axios';

import {
  CreateContestDto,
  CreateContestProblemDto,
  UpdateContestDto,
  UpdateContestProblemDto,
} from '@/api/client/api';
import { contestConnectWithAuth } from '@/api/user';
import { DEFAULT_API_BASE_URL } from '@/config/api';
import type { ContestFilterOptions } from '@/types/contest';

// Create axios instance with auth for custom API calls
const axiosWithAuth = axios.create({
  baseURL: DEFAULT_API_BASE_URL,
  withCredentials: true,
});

const getContests = async (options: ContestFilterOptions) => {
  const response = await contestConnectWithAuth.contestControllerFindAll(
    options.page,
    options.pageSize,
    options.status,
    options.isPublic
  );
  return response.data;
};

const getContestDetail = async (contest_id: string) => {
  const response =
    await contestConnectWithAuth.contestControllerFindOne(contest_id);
  return response.data;
};

const createContest = async (payload: CreateContestDto) => {
  return await contestConnectWithAuth.contestControllerCreate(payload);
};

const updateContest = async (id: string, payload: UpdateContestDto) => {
  return await contestConnectWithAuth.contestControllerUpdate(id, payload);
};

const deleteContest = async (id: string) => {
  return await contestConnectWithAuth.contestControllerRemove(id);
};

const createContestProblem = async (payload: CreateContestProblemDto) => {
  return await contestConnectWithAuth.contestControllerCreateProblem(payload);
};

const removeContestProblem = async (contest_id: string, problem_id: string) => {
  return await contestConnectWithAuth.contestControllerRemoveProblem(
    contest_id,
    problem_id
  );
};

const updateContestProblem = async (
  contest_id: string,
  problem_id: string,
  payload: UpdateContestProblemDto
) => {
  return await contestConnectWithAuth.contestControllerUpdateProblem(
    contest_id,
    problem_id,
    payload
  );
};

// Invitation APIs (not in generated client, using axios directly)

// Get all invitations for a contest
const getContestInvitations = async (contestId: string) => {
  const response = await axiosWithAuth.get(
    `/contests/${contestId}/invitations`
  );
  return response.data;
};

// Invite users to a private contest
const inviteUsersToContest = async (contestId: string, userIds: string[]) => {
  const response = await axiosWithAuth.post(
    `/contests/${contestId}/invitations`,
    {
      userIds,
    }
  );
  return response.data;
};

// Remove user invitation from a contest
const removeContestInvitation = async (contestId: string, userId: string) => {
  const response = await axiosWithAuth.delete(
    `/contests/${contestId}/invitations/${userId}`
  );
  return response.data;
};

// Search users by email (for invitation feature)
// Using GET /user endpoint with search parameter
const searchUsers = async (params: {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}) => {
  const response = await axiosWithAuth.get('/user', {
    params: {
      search: params.search,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    },
  });
  return response.data;
};

// Get contest leaderboard
export interface LeaderboardProblemResult {
  problemId: string;
  order: number;
  points: number;
  attempts: number;
  solvedAt: string | null;
  status: 'solved' | 'attempted' | 'not_attempted';
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  userName: string | null;
  userEmail: string;
  userAvatar?: string;
  totalPoints: number;
  solvedProblems: number;
  lastSubmissionTime: string | null;
  problemResults: LeaderboardProblemResult[];
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const getContestLeaderboard = async (params: {
  contestId: string;
  page?: number;
  pageSize?: number;
  filterUserId?: string;
}): Promise<LeaderboardResponse> => {
  const response = await axiosWithAuth.get(
    `/contests/${params.contestId}/leaderboard`,
    {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 50,
        filterUserId: params.filterUserId,
      },
    }
  );
  return response.data;
};

export {
  createContest,
  createContestProblem,
  deleteContest,
  getContestDetail,
  getContestInvitations,
  getContestLeaderboard,
  getContests,
  inviteUsersToContest,
  removeContestInvitation,
  removeContestProblem,
  searchUsers,
  updateContest,
  updateContestProblem,
};
