// Types for submission API

// ===== Submit Problem API =====

export type SubmissionLanguage = {
  id: string;
  version: string;
};

// Request payload for POST /problem-submission
export type SubmitProblemPayload = {
  source_code: string;
  problemId: string;
  language: SubmissionLanguage;
};

// Testcase result from API response
export type TestcaseResultFromAPI = {
  testcaseId: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Runtime Error' | 'Compile Error';
  time: number;
  memory: number;
  stdout: string;
  stderr: string;
};

// Submission object in response
export type SubmissionData = {
  id: string;
  code: string;
  languageId: string;
  userId: string;
  problemId: string;
  status: SubmissionStatus;
  consumedTime: number;
  consumedMemory: number;
  submittedAt: string;
  updatedAt: string;
  problem: {
    id: string;
    title: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  };
  language: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  failedTests: string[];
};

// Response from POST /problem-submission
export type SubmitProblemResponse = {
  submission: SubmissionData;
  testcaseResults: TestcaseResultFromAPI[];
};

// ===== Get User Submissions API =====

export type SubmissionStatus = 
  | 'PENDING'
  | 'RUNNING'
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'RUNTIME_ERROR'
  | 'COMPILATION_ERROR';

// Single submission in list
export type SubmissionHistory = {
  id: string;
  code: string;
  languageId: string;
  userId: string;
  problemId: string;
  status: SubmissionStatus;
  consumedTime: number;
  consumedMemory: number;
  submittedAt: string;
  updatedAt: string;
  problem: {
    id: string;
    title: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  };
  language: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
};

// Response from GET /problem-submission/user/:userId
export type SubmissionsListResponse = {
  data: SubmissionHistory[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// ===== Run Code API (no submission record) =====

// Request payload for POST /submission (run code only)
export type RunCodePayload = {
  source_code: string;
  stdin: string;
  expected_output: string;
  cpu_time_limit?: number;
  cpu_extra_time?: number;
  memory_limit?: number;
  language: SubmissionLanguage;
};

// Response from POST /submission
export type RunCodeResult = {
  time: number | null;
  memory: number | null;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Runtime Error' | 'Compile Error';
  stdout: string;
  stderr: string;
  compile_error: string | null;
  language: {
    id: string;
    name: string;
    version: string;
  } | null;
};

// ===== UI Types =====

// Type for test case result display in UI
export type TestCaseResult = {
  testcaseId: string;
  input?: string;
  expectedOutput?: string;
  userOutput: string;
  isPassed: boolean;
  time: number | null;
  memory: number | null;
  status: string;
};
