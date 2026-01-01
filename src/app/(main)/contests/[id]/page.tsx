'use client';

import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  Trophy,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { use } from 'react';

import ContestTable from '@/components/contest/ContestTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useContest from '@/lib/api/contest/queries/use-contest';

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

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
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

  const handleProblemClick = (problemId: string) => {
    router.push(`/problems/${problemId}`);
  };

  const problemColumns: ColumnDef<ContestProblem>[] = [
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
      <div className="flex h-screen items-center justify-center bg-[#0f1724]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
          <p className="text-gray-400">Loading contest...</p>
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f1724]">
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
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1724]">
      <div className="layout-padding">
        {/* Header */}
        <div className="py-6">
          <Link
            href="/contests"
            className="mb-4 inline-flex items-center gap-2 text-gray-400 hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contests
          </Link>

          <div className="mt-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <h1 className="text-3xl font-bold text-gray-100">
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
                  <span>{contest._count?.participants || 0} participants</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="problems" className="mt-6">
          <TabsList className="border-[#3a4556] bg-[#1e293b]">
            <TabsTrigger
              value="problems"
              className="data-[state=active]:bg-[#252d3d] data-[state=active]:text-cyan-400"
            >
              Problems ({contest.problems.length})
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="data-[state=active]:bg-[#252d3d] data-[state=active]:text-cyan-400"
            >
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="problems" className="mt-4">
            {contest.problems.length > 0 ? (
              <ContestTable
                table={problemTable}
                onRowClick={handleProblemClick}
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
            <div className="flex h-64 items-center justify-center rounded-lg border border-[#3a4556] bg-[#252d3d]">
              <div className="text-center text-gray-400">
                <Trophy className="mx-auto mb-2 h-12 w-12 text-gray-600" />
                <p>Leaderboard coming soon</p>
                <p className="mt-1 text-sm">
                  This feature is under development
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
