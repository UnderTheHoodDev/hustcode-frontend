import { SubmitProblemDto } from '@/api/client';
import { problemSubmissionWithAuth } from '@/api/user';

const getSubmissions = async (payload: any) => {
  return await problemSubmissionWithAuth.problemSubmissionControllerGetUserSubmissions(
    payload.userId,
    undefined,
    undefined,
    payload.problemId
  );
};

const submitSolution = async (payload: SubmitProblemDto) => {
  return await problemSubmissionWithAuth.problemSubmissionControllerSubmitProblem(
    payload
  );
};

export { getSubmissions, submitSolution };
