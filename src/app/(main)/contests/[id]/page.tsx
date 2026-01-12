'use client';

import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useAtomValue } from 'jotai';
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Loader2,
  Minus,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { use, useState } from 'react';

import { userInfoAtom } from '@/atoms';
import ContestLeaderboard from '@/components/contest/ContestLeaderboard';
import ContestTable from '@/components/contest/ContestTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useContest from '@/lib/api/contest/queries/use-contest';
import useContestLeaderboard from '@/lib/api/contest/queries/use-contest-leaderboard';
import useUserContestScore, {
  ProblemSolveStatus,
} from '@/lib/api/submission/queries/use-user-contest-score';
import type {
  ContestDetail,
  ContestProblem,
  ContestStatus,
} from '@/types/contest';

const ContestStatusBadge = ({ status }: { status: ContestStatus }) => {
  const statusConfig: Record<ContestStatus, { color: string; label: string }> =
    {
      UPCOMING: {
        color: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20',
        label: 'Upcoming',
      },
      RUNNING: {
        color: 'bg-green-500/10 text-green-400 hover:bg-green-500/20',
        label: 'Running',
      },
      FINISHED: {
        color: 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20',
        label: 'Finished',
      },
    };

  const config = statusConfig[status];

  return <Badge className={`${config.color} border-0`}>{config.label}</Badge>;
};

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const colors: Record<string, string> = {
    EASY: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    MEDIUM: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    HARD: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
  };

  return (
    <Badge className={`${colors[difficulty] || colors.EASY} border-0`}>
      {difficulty}
    </Badge>
  );
};

const formatDateTime = (dateStr: string | Date | null | undefined) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '-';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const durationMs = endDate.getTime() - startDate.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

// Convert order number to letter (1 -> A, 2 -> B, etc.)
const orderToLetter = (order: number) => {
  return String.fromCharCode(64 + order);
};

export default function ContestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const userInfo = useAtomValue(userInfoAtom);

  // Leaderboard pagination state
  const [leaderboardPage, setLeaderboardPage] = useState(1);
  const leaderboardPageSize = 20;

  // Fetch contest detail from API
  const { data, isLoading, isError, error } = useContest(id);

  // Type assertion and transform API response to match ContestDetail type
  const contest = React.useMemo(() => {
    if (!data) return undefined;

    const apiContest = data as any;

    // Transform problems array from API format to ContestProblem format
    // API format: { order, points, problem: { id, title, difficulty, tags, ... } }
    // Target format: { id, title, description, difficulty, order, points, tags, ... }
    const problems: ContestProblem[] =
      apiContest.problems?.map((item: any) => {
        const problem = item.problem || item;
        return {
          id: problem.id,
          title: problem.title,
          description: problem.description || '',
          difficulty: problem.difficulty,
          order: item.order,
          points: item.points,
          tags: problem.tags || [],
          _count: {
            submissions: problem._count?.submissions || 0,
          },
        };
      }) || [];

    return {
      ...apiContest,
      problems,
    } as ContestDetail;
  }, [data]);

  // Prepare contest problems for score calculation
  const contestProblemsForScore = React.useMemo(() => {
    return (
      contest?.problems.map((p) => ({
        id: p.id,
        points: p.points,
      })) || []
    );
  }, [contest]);

  // Fetch leaderboard from API
  const { data: leaderboardResponse, isLoading: isLeaderboardLoading } =
    useContestLeaderboard({
      contestId: id,
      page: leaderboardPage,
      pageSize: leaderboardPageSize,
      enabled: !!id,
    });

  // Transform leaderboard data for the component
  const leaderboardData = React.useMemo(() => {
    if (!leaderboardResponse?.data) return [];
    return leaderboardResponse.data;
  }, [leaderboardResponse?.data]);

  const leaderboardTotalPages = leaderboardResponse?.totalPages || 1;

  // Contest problems for leaderboard display
  const contestProblemsForLeaderboard = React.useMemo(() => {
    return (
      contest?.problems.map((p) => ({
        id: p.id,
        order: p.order,
        points: p.points,
      })) || []
    );
  }, [contest?.problems]);

  // Fetch user's contest score
  const { data: userScore, isLoading: isScoreLoading } = useUserContestScore({
    userId: userInfo?.id,
    contestProblems: contestProblemsForScore,
    contestId: id,
    enabled: !!userInfo?.id && !!contest,
  });

  const handleProblemClick = (problemId: string) => {
    // Navigate to contest problem page instead of regular problem page
    router.push(`/contests/${id}/problems/${problemId}`);
  };

  // Helper to get problem status
  const getProblemStatus = (problemId: string): ProblemSolveStatus => {
    return userScore?.problemResults.get(problemId)?.status || 'not_attempted';
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: ProblemSolveStatus }) => {
    if (status === 'solved') {
      return (
        <div className="flex items-center justify-center">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
            <Check className="h-4 w-4 text-green-500" />
          </div>
        </div>
      );
    }
    if (status === 'attempted') {
      return (
        <div className="flex items-center justify-center">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/20">
            <X className="h-4 w-4 text-yellow-500" />
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-500/20">
          <Minus className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    );
  };

  const problemColumns: ColumnDef<ContestProblem>[] = [
    {
      id: 'status',
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <StatusBadge status={getProblemStatus(row.original.id)} />
      ),
      size: 80,
    },
    {
      accessorKey: 'order',
      header: '#',
      cell: ({ row }) => (
        <div className="font-medium text-cyan-400">
          {orderToLetter(row.original.order)}
        </div>
      ),
      size: 60,
    },
    {
      accessorKey: 'title',
      header: 'Problem',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-200">
            {row.original.title}
          </span>
          <div className="flex flex-wrap gap-1">
            {row.original.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                className="border-0 bg-blue-500/10 text-xs text-blue-400 hover:bg-blue-500/20"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'difficulty',
      header: () => <div className="text-center">Difficulty</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DifficultyBadge difficulty={row.getValue('difficulty')} />
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: 'points',
      header: () => <div className="text-center">Points</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium text-yellow-500">
          {row.original.points}
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: '_count',
      header: () => <div className="text-center">Submissions</div>,
      cell: ({ row }) => (
        <div className="text-center text-gray-400">
          {row.original._count?.submissions || 0}
        </div>
      ),
      size: 120,
    },
  ];

  const problemTable = useReactTable({
    data: contest?.problems || [],
    columns: problemColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="layout-padding">
        <div className="flex min-h-screen items-center justify-center py-4">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
            <p className="text-gray-400">Loading contest...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !contest) {
    // Check for specific error types
    const errorMessage =
      (error as any)?.response?.status === 403
        ? 'Access denied. This contest is private.'
        : (error as any)?.response?.status === 404
          ? 'Contest not found.'
          : 'Failed to load contest. Please try again later.';

    return (
      <div className="layout-padding">
        <div className="flex min-h-screen items-center justify-center py-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-4 text-center">
            <p className="mb-4 text-red-400">{errorMessage}</p>
            <Link href="/contests">
              <Button
                variant="outline"
                className="border-[#3a4556] bg-transparent text-gray-300 hover:bg-[#252d3d]"
              >
                Back to Contests
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-padding">
      <div className="flex min-h-screen gap-8 py-4">
        <div className="w-full">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/contests"
              className="mb-4 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-gray-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Contests
            </Link>

            <div className="mt-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <h1 className="text-2xl font-bold text-gray-100">
                    {contest.title}
                  </h1>
                  <ContestStatusBadge status={contest.status} />
                </div>
                <p className="mt-2 text-gray-400">{contest.description}</p>

                <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Start: {formatDateTime(contest.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Duration:{' '}
                      {formatDuration(contest.startTime, contest.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {contest._count?.participants ??
                        contest._count?.invitations ??
                        0}{' '}
                      participants
                    </span>
                  </div>
                </div>
              </div>

              {/* User Score Card */}
              {userInfo?.id && (
                <div className="ml-6 flex-shrink-0">
                  <div className="rounded-xl border border-[#3a4556] bg-gradient-to-br from-[#1a2332] to-[#252d3d] p-5 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10">
                        <Trophy className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                          Your Score
                        </p>
                        {isScoreLoading ? (
                          <Loader2 className="mt-1 h-5 w-5 animate-spin text-cyan-400" />
                        ) : (
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-cyan-400">
                              {userScore?.totalPoints || 0}
                            </span>
                            <span className="text-sm text-gray-500">pts</span>
                            <span className="ml-2 rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-400">
                              {userScore?.solvedCount || 0}/
                              {contest.problems.length} solved
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="problems" className="mt-6">
            <TabsList className="border-[#3a4556] bg-[#252d3d]">
              <TabsTrigger
                value="problems"
                className="text-gray-300 data-[state=active]:bg-[#2a3344] data-[state=active]:text-cyan-400"
              >
                Problems ({contest.problems.length})
              </TabsTrigger>
              <TabsTrigger
                value="leaderboard"
                className="text-gray-300 data-[state=active]:bg-[#2a3344] data-[state=active]:text-cyan-400"
              >
                Leaderboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="problems" className="mt-4">
              {contest.problems.length > 0 ? (
                <ContestTable
                  table={problemTable}
                  onRowClick={handleProblemClick}
                  isProblemTable
                />
              ) : (
                <div className="flex h-64 items-center justify-center rounded-lg border border-[#3a4556] bg-[#252d3d]">
                  <div className="text-center text-gray-400">
                    <Trophy className="mx-auto mb-2 h-12 w-12 text-gray-600" />
                    <p>No problems available yet</p>
                    <p className="mt-1 text-sm">
                      Problems will be added to this contest soon
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="leaderboard" className="mt-4">
              <ContestLeaderboard
                leaderboardData={leaderboardData}
                contestProblems={contestProblemsForLeaderboard}
                isLoading={isLeaderboardLoading}
              />
              {/* Leaderboard Pagination */}
              {leaderboardTotalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Page {leaderboardPage} of {leaderboardTotalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setLeaderboardPage((p) => Math.max(1, p - 1))
                      }
                      disabled={leaderboardPage === 1}
                      className="border-[#3a4556] bg-transparent text-gray-300 hover:bg-[#252d3d]"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setLeaderboardPage((p) =>
                          Math.min(leaderboardTotalPages, p + 1)
                        )
                      }
                      disabled={leaderboardPage >= leaderboardTotalPages}
                      className="border-[#3a4556] bg-transparent text-gray-300 hover:bg-[#252d3d]"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
