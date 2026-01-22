import { useQuery } from '@tanstack/react-query';

import {
  getContestSubmissions,
  getUserSubmissions,
} from '@/lib/api/submission';

export type ProblemSolveStatus = 'solved' | 'attempted' | 'not_attempted';

export type UserContestProblemResult = {
  problemId: string;
  status: ProblemSolveStatus;
  points: number; // Points earned (0 if not solved)
  attempts: number; // Number of submission attempts
};

export type UserContestScore = {
  totalPoints: number;
  solvedCount: number;
  problemResults: Map<string, UserContestProblemResult>;
};

interface UseUserContestScoreParams {
  userId: string | undefined;
  contestProblems: Array<{ id: string; points: number }>;
  contestId?: string; // Optional: if provided, will use contest submissions
  enabled?: boolean;
}

const useUserContestScore = ({
  userId,
  contestProblems,
  contestId,
  enabled = true,
}: UseUserContestScoreParams) => {
  return useQuery({
    queryKey: [
      'user-contest-score',
      userId,
      contestId,
      contestProblems.map((p) => p.id).join(','),
    ],
    queryFn: async (): Promise<UserContestScore> => {
      if (!userId || contestProblems.length === 0) {
        return {
          totalPoints: 0,
          solvedCount: 0,
          problemResults: new Map(),
        };
      }

      // If contestId is provided, fetch all contest submissions for this user
      // Otherwise, fetch user submissions for each problem
      let allSubmissions: any[] = [];

      console.warn('[UserContestScore] Fetching for:', {
        contestId,
        userId,
        contestProblems,
      });

      if (contestId) {
        // Fetch all submissions for this user in the contest at once
        console.warn('[UserContestScore] Using contest submissions API');
        const response = await getContestSubmissions({
          contestId,
          filterUserId: userId,
          pageSize: 500, // Get enough submissions
        }).catch((err) => {
          console.error('[UserContestScore] Error fetching:', err);
          return {
            data: [],
            total: 0,
            page: 1,
            pageSize: 500,
            totalPages: 0,
          };
        });

        console.warn('[UserContestScore] API Response:', response);
        allSubmissions = response.data || [];
      } else {
        // Fetch submissions for each problem in parallel (original behavior)
        const submissionsPromises = contestProblems.map((problem) =>
          getUserSubmissions({
            userId,
            problemId: problem.id,
            pageSize: 100,
          }).catch(() => ({
            data: [],
            total: 0,
            page: 1,
            pageSize: 100,
            totalPages: 0,
          }))
        );

        const submissionsResults = await Promise.all(submissionsPromises);
        submissionsResults.forEach((result) => {
          allSubmissions.push(...(result.data || []));
        });
      }

      // Calculate results for each problem
      const problemResults = new Map<string, UserContestProblemResult>();
      let totalPoints = 0;
      let solvedCount = 0;

      // Debug: log all submissions
      console.warn('[UserContestScore] All submissions:', allSubmissions);

      contestProblems.forEach((problem) => {
        // Filter submissions for this problem - check all possible ID fields
        const problemSubmissions = allSubmissions.filter((s) => {
          const submissionProblemId =
            s.problem?.id || s.problemId || s.problem_id;
          return submissionProblemId === problem.id;
        });

        console.warn(
          `[UserContestScore] Problem ${problem.id}: ${problemSubmissions.length} submissions`,
          problemSubmissions
        );

        const attempts = problemSubmissions.length;

        // Check if any submission is ACCEPTED
        const isSolved = problemSubmissions.some(
          (s) => s.status === 'ACCEPTED'
        );

        let status: ProblemSolveStatus = 'not_attempted';
        let points = 0;

        if (isSolved) {
          status = 'solved';
          points = problem.points;
          totalPoints += points;
          solvedCount++;
        } else if (attempts > 0) {
          status = 'attempted';
        }

        problemResults.set(problem.id, {
          problemId: problem.id,
          status,
          points,
          attempts,
        });
      });

      return {
        totalPoints,
        solvedCount,
        problemResults,
      };
    },
    enabled: enabled && !!userId && contestProblems.length > 0,
    refetchOnWindowFocus: false,
    staleTime: 30000, // Cache for 30 seconds
  });
};

export default useUserContestScore;
