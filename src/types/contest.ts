// Contest types
export type ContestStatus = 'UPCOMING' | 'RUNNING' | 'FINISHED';

export type ContestAuthor = {
  id: string;
  name: string | null;
  email: string;
};

export type ContestProblem = {
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

// Detailed contest problem with testcases and constraints
export type ContestProblemDetail = ContestProblem & {
  taskDescription: string;
  inputDescription: string;
  outputDescription: string;
  testcases: Array<{
    id: string;
    input: string;
    output: string;
    isSample: boolean;
  }>;
  problemConstrain: {
    id: string;
    memoryLimit: number;
    timeLimit: number;
  } | null;
};

export type Contest = {
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
    invitations?: number;
  };
};

export type ContestDetail = Contest & {
  problems: ContestProblem[];
};

// Contest detail with full problem information including testcases
export type ContestDetailWithProblems = Contest & {
  problems: Array<{
    order: number;
    points: number;
    problem: ContestProblemDetail;
  }>;
};

export type ContestsResponse = {
  data: Contest[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ContestFilterOptions = {
  page?: number;
  pageSize?: number;
  status?: ContestStatus;
  isPublic?: boolean;
};

// Submission types for contest
export type ContestSubmission = {
  id: string;
  code: string;
  status:
    | 'PENDING'
    | 'RUNNING'
    | 'ACCEPTED'
    | 'WRONG_ANSWER'
    | 'TIME_LIMIT_EXCEEDED'
    | 'MEMORY_LIMIT_EXCEEDED'
    | 'RUNTIME_ERROR'
    | 'COMPILATION_ERROR';
  consumedTime: number | null;
  consumedMemory: number | null;
  submittedAt: string;
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

export type ContestSubmissionsResponse = {
  data: ContestSubmission[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Leaderboard types (for future use)
export type LeaderboardEntry = {
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

export type ContestLeaderboard = {
  data: LeaderboardEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
