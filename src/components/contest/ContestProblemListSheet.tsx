'use client';

import { Check, List, Loader2, Minus, Trophy, X } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type ProblemSolveStatus = 'solved' | 'attempted' | 'not_attempted';

type ContestProblem = {
  id: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  order: number;
  points: number;
  tags: Array<{ id: string; name: string }>;
};

interface ContestProblemListSheetProps {
  contestId: string;
  currentProblemId: string;
  problems: ContestProblem[];
  isLoading?: boolean;
  // User score props
  userTotalPoints?: number;
  userSolvedCount?: number;
  getProblemStatus?: (problemId: string) => ProblemSolveStatus;
  isScoreLoading?: boolean;
}

// Convert order number to letter (1 -> A, 2 -> B, etc.)
const orderToLetter = (order: number) => {
  return String.fromCharCode(64 + order);
};

// Status icon component
const StatusIcon = ({ status }: { status: ProblemSolveStatus }) => {
  if (status === 'solved') {
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
        <Check className="h-3 w-3 text-green-500" />
      </div>
    );
  }
  if (status === 'attempted') {
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500/20">
        <X className="h-3 w-3 text-yellow-500" />
      </div>
    );
  }
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-500/20">
      <Minus className="h-3 w-3 text-gray-500" />
    </div>
  );
};

const ContestProblemListSheet = ({
  contestId,
  currentProblemId,
  problems,
  isLoading = false,
  userTotalPoints = 0,
  userSolvedCount = 0,
  getProblemStatus,
  isScoreLoading = false,
}: ContestProblemListSheetProps) => {
  const difficultyConfig: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    EASY: { bg: 'bg-green-500/15', text: 'text-green-400', label: 'Easy' },
    MEDIUM: { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Medium' },
    HARD: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Hard' },
  };

  // Sort problems by order
  const sortedProblems = [...problems].sort((a, b) => a.order - b.order);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-gray-600 bg-[#252d3d] text-gray-200 hover:border-cyan-500/50 hover:bg-[#2a3444] hover:text-white"
        >
          <List className="h-4 w-4" />
          <span>Problems</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="custom-scrollbar w-[500px] border-gray-700/50 bg-[#1a2332] p-0 sm:w-[600px] sm:max-w-[600px]">
        <SheetHeader className="border-b border-gray-700/50 px-6 py-4">
          <SheetTitle className="text-lg font-semibold text-white">
            Contest Problems
          </SheetTitle>
        </SheetHeader>

        {/* User Score Summary */}
        {getProblemStatus && (
          <div className="border-b border-gray-700/50 px-6 py-4">
            <div className="rounded-xl border border-[#3a4556] bg-gradient-to-br from-[#1e2a3a] to-[#252d3d] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10">
                    <Trophy className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                      Your Progress
                    </p>
                    {isScoreLoading ? (
                      <Loader2 className="mt-1 h-4 w-4 animate-spin text-cyan-400" />
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-cyan-400">
                          {userTotalPoints}
                        </span>
                        <span className="text-sm text-gray-500">pts</span>
                      </div>
                    )}
                  </div>
                </div>
                {!isScoreLoading && (
                  <div className="rounded-full bg-cyan-500/10 px-3 py-1">
                    <span className="text-sm font-medium text-cyan-400">
                      {userSolvedCount}/{problems.length} solved
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="custom-scrollbar h-[calc(100vh-200px)] overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
              <p className="mt-3 text-sm text-gray-400">Loading problems...</p>
            </div>
          ) : sortedProblems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-sm">No problems in this contest</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedProblems.map((problem) => {
                const config =
                  difficultyConfig[problem.difficulty] || difficultyConfig.EASY;
                const isCurrent = problem.id === currentProblemId;
                const status = getProblemStatus
                  ? getProblemStatus(problem.id)
                  : 'not_attempted';

                return (
                  <Link
                    key={problem.id}
                    href={`/contests/${contestId}/problems/${problem.id}`}
                    className={`block rounded-lg border p-3 transition-all ${
                      isCurrent
                        ? 'border-cyan-500/50 bg-cyan-500/10'
                        : 'border-gray-700/50 bg-[#252d3d] hover:border-gray-600 hover:bg-[#2a3444]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Status Icon */}
                        {getProblemStatus && <StatusIcon status={status} />}
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                            isCurrent
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-gray-700/50 text-gray-400'
                          }`}
                        >
                          {orderToLetter(problem.order)}
                        </span>
                        <h3
                          className={`text-sm font-medium ${
                            isCurrent ? 'text-cyan-400' : 'text-gray-200'
                          }`}
                        >
                          {problem.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-yellow-500">
                          {problem.points} pts
                        </span>
                        <Badge
                          className={`${config.bg} ${config.text} border-0 px-2 py-0.5 text-xs`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                    {problem.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1 pl-14">
                        {problem.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag.id}
                            className="border-0 bg-gray-700/50 px-1.5 py-0 text-[10px] text-gray-400"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                        {problem.tags.length > 3 && (
                          <span className="text-[10px] text-gray-500">
                            +{problem.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ContestProblemListSheet;
