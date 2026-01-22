import { useQuery } from '@tanstack/react-query';

import {
  getContestLeaderboard,
  LeaderboardEntry,
  LeaderboardProblemResult,
  LeaderboardResponse,
} from '@/lib/api/contest';

interface UseContestLeaderboardParams {
  contestId: string;
  page?: number;
  pageSize?: number;
  filterUserId?: string;
  enabled?: boolean;
}

// Transform API response to match our LeaderboardEntry interface
const transformLeaderboardEntry = (
  entry: any,
  index: number
): LeaderboardEntry => {
  // Handle different API response formats
  const user = entry.user || {};

  // Transform problem results - handle different field names
  const rawProblemResults =
    entry.problemResults ||
    entry.scores ||
    entry.problems ||
    entry.problemScores ||
    [];

  const problemResults: LeaderboardProblemResult[] = rawProblemResults.map(
    (pr: any) => {
      // Get problemId - handle various field names
      const problemId = pr.problemId || pr.problem_id || pr.id || pr.problemID;

      // Get attempts count
      const attempts =
        pr.attempts ??
        pr.attemptCount ??
        pr.submissionCount ??
        pr.tryCount ??
        0;

      // Get points/score
      const points = pr.points ?? pr.score ?? pr.totalScore ?? 0;

      // Determine status - check multiple possible indicators
      let status: 'solved' | 'attempted' | 'not_attempted' = 'not_attempted';

      if (pr.status) {
        // If status is explicitly provided
        if (
          pr.status === 'solved' ||
          pr.status === 'ACCEPTED' ||
          pr.status === 'accepted' ||
          pr.status === 'AC'
        ) {
          status = 'solved';
        } else if (
          pr.status === 'attempted' ||
          pr.status === 'WRONG_ANSWER' ||
          pr.status === 'wrong_answer' ||
          pr.status === 'WA' ||
          pr.status === 'TLE' ||
          pr.status === 'MLE' ||
          pr.status === 'RE' ||
          pr.status === 'pending' ||
          pr.status === 'PENDING'
        ) {
          status = 'attempted';
        }
      } else if (
        pr.solved === true ||
        pr.isSolved === true ||
        pr.accepted === true ||
        pr.isAccepted === true
      ) {
        status = 'solved';
      } else if (
        pr.solvedAt ||
        pr.solved_at ||
        pr.acceptedAt ||
        pr.accepted_at
      ) {
        // If there's a solved time, it's solved
        status = 'solved';
      } else if (points > 0) {
        // If has points, likely solved
        status = 'solved';
      } else if (attempts > 0) {
        // If has attempts but no points, it's attempted but not solved
        status = 'attempted';
      }

      return {
        problemId,
        order: pr.order ?? pr.problemOrder ?? 0,
        points,
        attempts,
        solvedAt:
          pr.solvedAt ||
          pr.solved_at ||
          pr.acceptedAt ||
          pr.accepted_at ||
          pr.firstAcceptedAt ||
          null,
        status,
      };
    }
  );

  // Calculate solved count from problem results if not provided
  const solvedFromResults = problemResults.filter(
    (pr: LeaderboardProblemResult) => pr.status === 'solved'
  ).length;

  return {
    rank: entry.rank ?? index + 1,
    id: entry.id || entry.userId || user.id || String(index),
    userName:
      entry.userName || entry.username || user.name || user.username || null,
    userEmail: entry.userEmail || entry.email || user.email || '',
    userAvatar: entry.userAvatar || entry.avatar || user.avatar || undefined,
    totalPoints:
      entry.totalPoints ?? entry.totalScore ?? entry.score ?? entry.points ?? 0,
    solvedProblems:
      entry.solvedProblems ??
      entry.solvedCount ??
      entry.solved ??
      solvedFromResults,
    lastSubmissionTime:
      entry.lastSubmissionTime || entry.lastSubmission || null,
    problemResults,
  };
};

const useContestLeaderboard = ({
  contestId,
  page = 1,
  pageSize = 50,
  filterUserId,
  enabled = true,
}: UseContestLeaderboardParams) => {
  return useQuery<LeaderboardResponse>({
    queryKey: ['contest-leaderboard', contestId, page, pageSize, filterUserId],
    queryFn: async () => {
      const response = await getContestLeaderboard({
        contestId,
        page,
        pageSize,
        filterUserId,
      });

      // Cast to any to handle flexible API response format
      const rawResponse = response as any;

      // Debug: log raw response to see actual API format
      console.warn(
        '[Leaderboard] Raw API Response:',
        JSON.stringify(rawResponse, null, 2)
      );

      // Handle both direct array and { data: [...] } response
      let rawData: any[];
      let pagination = {
        total: 0,
        page: 1,
        pageSize: 50,
        totalPages: 1,
      };

      if (Array.isArray(rawResponse)) {
        rawData = rawResponse;
        pagination.total = rawResponse.length;
        pagination.pageSize = rawResponse.length;
      } else if (rawResponse && typeof rawResponse === 'object') {
        rawData =
          rawResponse.data ||
          rawResponse.entries ||
          rawResponse.leaderboard ||
          [];
        pagination = {
          total: rawResponse.total ?? rawData.length,
          page: rawResponse.page ?? 1,
          pageSize: rawResponse.pageSize ?? rawData.length,
          totalPages: rawResponse.totalPages ?? 1,
        };
      } else {
        rawData = [];
      }

      console.warn('[Leaderboard] Extracted rawData:', rawData);

      // Transform each entry to match our interface
      const transformedData = rawData.map((entry, index) => {
        const transformed = transformLeaderboardEntry(
          entry,
          index + (pagination.page - 1) * pagination.pageSize
        );
        console.warn(`[Leaderboard] Entry ${index}:`, {
          original: entry,
          transformed,
        });
        return transformed;
      });

      return {
        data: transformedData,
        ...pagination,
      };
    },
    enabled: enabled && !!contestId,
  });
};

export default useContestLeaderboard;
export type { LeaderboardEntry, LeaderboardResponse };
