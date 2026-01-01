// Contest types
type ContestStatus = 'UPCOMING' | 'RUNNING' | 'FINISHED';

type ContestAuthor = {
  id: string;
  name: string | null;
  email: string;
};

type ContestProblem = {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  order: number;
  points: number;
  tags: Array<{
    id: string;
    name: string;
  }>;
  _count?: {
    submissions: number;
  };
};

type Contest = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: ContestStatus;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: ContestAuthor;
  _count?: {
    problems: number;
    participants: number;
  };
};

type ContestDetail = Contest & {
  problems: ContestProblem[];
};

type ContestsResponse = {
  data: Contest[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type ContestFilterOptions = {
  page?: number;
  pageSize?: number;
  status?: ContestStatus;
  isPublic?: boolean;
};

// Submission types for contest
type ContestSubmission = {
  id: string;
  userId: string;
  problemId: string;
  contestId: string;
  sourceCode: string;
  status:
    | 'PENDING'
    | 'RUNNING'
    | 'ACCEPTED'
    | 'WRONG_ANSWER'
    | 'TIME_LIMIT_EXCEEDED'
    | 'MEMORY_LIMIT_EXCEEDED'
    | 'RUNTIME_ERROR'
    | 'COMPILATION_ERROR';
  executionTime: number | null;
  memoryUsed: number | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  problem: {
    id: string;
    title: string;
    order: number;
  };
  language: {
    id: string;
    name: string;
    version: string;
  };
};

type ContestSubmissionsResponse = {
  data: ContestSubmission[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Leaderboard types (for future use)
type LeaderboardEntry = {
  rank: number;
  userId: string;
  userName: string | null;
  userEmail: string;
  totalPoints: number;
  solvedProblems: number;
  totalTime: number;
  problemResults: Array<{
    problemId: string;
    order: number;
    points: number;
    attempts: number;
    solvedAt: string | null;
  }>;
};

type ContestLeaderboard = {
  data: LeaderboardEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
