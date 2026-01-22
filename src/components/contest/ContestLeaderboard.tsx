'use client';

import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Check, Loader2, Minus, Trophy, X } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type ProblemResult = {
  problemId: string;
  order: number;
  points: number;
  attempts: number;
  solvedAt: string | null;
  status: 'solved' | 'attempted' | 'not_attempted';
};

type LeaderboardEntry = {
  rank: number;
  id: string;
  userName: string | null;
  userEmail: string;
  userAvatar?: string;
  totalPoints: number;
  solvedProblems: number;
  problemResults: ProblemResult[];
};

type ContestProblemInfo = {
  id: string;
  order: number;
  points: number;
};

interface ContestLeaderboardProps {
  leaderboardData: LeaderboardEntry[];
  contestProblems: ContestProblemInfo[];
  isLoading?: boolean;
}

// Convert order number to letter (1 -> A, 2 -> B, etc.)
const orderToLetter = (order: number) => {
  return String.fromCharCode(64 + order);
};

// Status icon component
const StatusCell = ({ result }: { result: ProblemResult | undefined }) => {
  if (!result || result.status === 'not_attempted') {
    return (
      <div className="flex items-center justify-center">
        <Minus className="h-4 w-4 text-gray-500" />
      </div>
    );
  }

  if (result.status === 'solved') {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
          <Check className="h-4 w-4 text-green-500" />
        </div>
        {result.attempts > 1 && (
          <span className="text-[10px] text-gray-500">({result.attempts})</span>
        )}
      </div>
    );
  }

  // attempted
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20">
        <X className="h-4 w-4 text-red-500" />
      </div>
      {result.attempts > 0 && (
        <span className="text-[10px] text-gray-500">({result.attempts})</span>
      )}
    </div>
  );
};

// Rank badge component
const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20">
        <Trophy className="h-5 w-5 text-yellow-500" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300/20">
        <span className="text-lg font-bold text-gray-300">2</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600/20">
        <span className="text-lg font-bold text-amber-600">3</span>
      </div>
    );
  }
  return (
    <span className="text-center text-sm font-medium text-gray-400">
      {rank}
    </span>
  );
};

const ContestLeaderboard = ({
  leaderboardData,
  contestProblems,
  isLoading = false,
}: ContestLeaderboardProps) => {
  // Sort problems by order
  const sortedProblems = [...contestProblems].sort((a, b) => a.order - b.order);

  const columns: ColumnDef<LeaderboardEntry>[] = [
    {
      id: 'rank',
      header: () => <div className="text-center">No</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <RankBadge rank={row.original.rank} />
        </div>
      ),
      size: 60,
    },
    {
      id: 'user',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.userAvatar} />
            <AvatarFallback className="bg-cyan-500/20 text-cyan-400">
              {(row.original.userName || row.original.userEmail)
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-gray-200">
              {row.original.userName || row.original.userEmail.split('@')[0]}
            </span>
          </div>
        </div>
      ),
      size: 200,
    },
    {
      id: 'solved',
      header: () => <div className="text-center">Solved</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Badge className="border-0 bg-green-500/10 text-green-400">
            {row.original.solvedProblems ?? 0}/{contestProblems.length}
          </Badge>
        </div>
      ),
      size: 80,
    },
    {
      id: 'totalPoints',
      header: () => <div className="text-center">Score</div>,
      cell: ({ row }) => (
        <div className="text-center font-bold text-cyan-400">
          {row.original.totalPoints ?? 0}
        </div>
      ),
      size: 80,
    },
    // Dynamic columns for each problem
    ...sortedProblems.map((problem) => ({
      id: `problem-${problem.id}`,
      header: () => (
        <div className="flex flex-col items-center">
          <span className="font-bold text-cyan-400">
            {orderToLetter(problem.order)}
          </span>
          <span className="text-[10px] text-gray-500">{problem.points}pts</span>
        </div>
      ),
      cell: ({ row }: { row: { original: LeaderboardEntry } }) => {
        const result = row.original.problemResults.find(
          (r) => r.problemId === problem.id
        );
        return <StatusCell result={result} />;
      },
      size: 60,
    })),
  ];

  const table = useReactTable({
    data: leaderboardData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-[#3a4556] bg-[#252d3d]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-sm text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-[#3a4556] bg-[#252d3d]">
        <div className="text-center text-gray-400">
          <Trophy className="mx-auto mb-2 h-12 w-12 text-gray-600" />
          <p>No participants yet</p>
          <p className="mt-1 text-sm">Be the first to solve a problem!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#3a4556] bg-[#1e2a3a]">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-[#3a4556] bg-[#252d3d] hover:bg-[#252d3d]"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-gray-400"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : typeof header.column.columnDef.header === 'function'
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row, index) => (
            <TableRow
              key={row.id}
              className={`border-[#3a4556] transition-colors hover:bg-[#2a3444] ${
                index === 0 ? 'bg-yellow-500/5' : ''
              } ${index === 1 ? 'bg-gray-300/5' : ''} ${
                index === 2 ? 'bg-amber-600/5' : ''
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {typeof cell.column.columnDef.cell === 'function'
                    ? cell.column.columnDef.cell(cell.getContext())
                    : cell.getValue()}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContestLeaderboard;
