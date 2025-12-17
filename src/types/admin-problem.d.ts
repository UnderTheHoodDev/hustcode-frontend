type AdminProblemTag = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type AdminProblemAuthor = {
  id: string;
  name: string | null;
  email: string;
};

type AdminProblem = {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  taskDescription: string;
  inputDescription: string;
  outputDescription: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  authorId: string;
  likeNumber: number;
  createdAt: string;
  updatedAt: string;
  author: AdminProblemAuthor;
  tags: AdminProblemTag[];
  _count: {
    submissions: number;
    comments: number;
  };
  userStatus: 'Solved' | 'Attempted' | 'Unsolved';
};

type AdminProblemsResponse = {
  data: AdminProblem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type AdminProblemFilterOptions = {
  page?: number;
  pageSize?: number;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  search?: string;
  tags?: string[];
};

type AdminProblemTestcase = {
  id: string;
  input: string;
  output: string;
  problemId: string;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
};

type AdminProblemConstraint = {
  id: string;
  problemId: string;
  memoryLimit: number;
  timeLimit: number;
  createdAt: string;
  updatedAt: string;
};

type AdminProblemSolution = {
  id: string;
  code: string;
  languageId: string;
  problemId: string;
  createdAt: string;
  updatedAt: string;
} | null;

type AdminProblemDetail = AdminProblem & {
  testcases: AdminProblemTestcase[];
  problemConstrain: AdminProblemConstraint | null;
  solution: AdminProblemSolution;
};

