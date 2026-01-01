import {
  CreateContestDto,
  CreateContestProblemDto,
  UpdateContestDto,
} from '@/api/client/api';
import { contestConnectWithAuth } from '@/api/user';

const getContests = async (options: OptherOptionsProps) => {
  return await contestConnectWithAuth.contestControllerFindAll(
    options.page,
    options.pageSize,
    options.status
  );
};

const getContestDetail = async (contest_id: string) => {
  return await contestConnectWithAuth.contestControllerFindOne(contest_id);
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

export {
  createContest,
  createContestProblem,
  deleteContest,
  getContestDetail,
  getContests,
  removeContestProblem,
  updateContest,
};
