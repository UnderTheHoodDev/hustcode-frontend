'use client';

import { List, Loader2 } from 'lucide-react';
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
import useProblems from '@/lib/api/problem/queries/use-problems';

type Problem = {
  id: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: Array<{ id: string; name: string }>;
};

const ProblemListSheet = ({
  currentProblemId,
}: {
  currentProblemId: string;
}) => {
  const { data: response, isLoading } = useProblems({ pageSize: 50 });

  const problems = (response?.data as { data: Problem[] } | undefined)?.data || [];

  const difficultyConfig: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    EASY: { bg: 'bg-green-500/15', text: 'text-green-400', label: 'Easy' },
    MEDIUM: { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'Medium' },
    HARD: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Hard' },
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-gray-600 bg-[#252d3d] text-gray-200 hover:border-cyan-500/50 hover:bg-[#2a3444] hover:text-white"
        >
          <List className="h-4 w-4" />
          <span>Problem List</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="custom-scrollbar w-[380px] border-gray-700/50 bg-[#1a2332] p-0 sm:w-[450px]">
        <SheetHeader className="border-b border-gray-700/50 px-6 py-4">
          <SheetTitle className="text-lg font-semibold text-white">
            All Problems
          </SheetTitle>
        </SheetHeader>

        <div className="custom-scrollbar h-[calc(100vh-80px)] overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
              <p className="mt-3 text-sm text-gray-400">Loading problems...</p>
            </div>
          ) : problems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-sm">No problems found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {problems.map((problem) => {
                const config = difficultyConfig[problem.difficulty] || difficultyConfig.EASY;
                const isCurrent = problem.id === currentProblemId;

                return (
                  <Link
                    key={problem.id}
                    href={`/problems/${problem.id}`}
                    className={`block rounded-lg border p-3 transition-all ${
                      isCurrent
                        ? 'border-cyan-500/50 bg-cyan-500/10'
                        : 'border-gray-700/50 bg-[#252d3d] hover:border-gray-600 hover:bg-[#2a3444]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-sm font-medium ${
                          isCurrent ? 'text-cyan-400' : 'text-gray-200'
                        }`}
                      >
                        {problem.title}
                      </h3>
                      <Badge
                        className={`${config.bg} ${config.text} border-0 px-2 py-0.5 text-xs`}
                      >
                        {config.label}
                      </Badge>
                    </div>
                    {problem.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
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

export default ProblemListSheet;
