import {
  CreateContestDto,
  CreateContestProblemDto,
  UpdateContestDto,
  UpdateContestProblemDto,
} from '@/api/client/api';
import { contestConnectWithAuth } from '@/api/user';

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
  const response = await contestConnectWithAuth.contestControllerFindOne(contest_id);
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

export {
  createContest,
  createContestProblem,
  deleteContest,
  getContestDetail,
  getContests,
  removeContestProblem,
  updateContest,
  updateContestProblem,
};
