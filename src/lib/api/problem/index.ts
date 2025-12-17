import { CreateProblemDto, UpdateProblemDto } from '@/api/client';
import { problemConnect } from '@/api/guest';
import { problemConnectWithAuth } from '@/api/user';

const getProblems = async (options: OptherOptionsProps) => {
  return await problemConnect.problemControllerFindAll(
    options.page,
    options.pageSize,
    options.difficulty,
    options.status,
    options.search,
    options.tags
  );
};

const getProblemDetail = async (id: string) => {
  return await problemConnect.problemControllerFindOne(id);
};

const createProblem = async (payload: CreateProblemDto) => {
  return await problemConnectWithAuth.problemControllerCreate(payload);
};

const updateProblem = async (id: string, payload: UpdateProblemDto) => {
  return await problemConnectWithAuth.problemControllerUpdate(id, payload);
};

const deleteProblem = async (id: string) => {
  return await problemConnectWithAuth.problemControllerRemove(id);
};

export {
  createProblem,
  deleteProblem,
  getProblemDetail,
  getProblems,
  updateProblem,
};
