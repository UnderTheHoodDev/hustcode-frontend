'use client';

import { List } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { problemsData } from '@/constants/mock-problem-data';

const ProblemListSheet = ({
  currentProblemId,
}: {
  currentProblemId: string;
}) => {
  const difficultyColors: Record<string, string> = {
    EASY: 'bg-green-500/10 text-green-500',
    MEDIUM: 'bg-yellow-500/10 text-yellow-500',
    HARD: 'bg-red-500/10 text-red-500',
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 transition-colors hover:bg-gray-700">
          <List className="h-5 w-5" />
          <span>Problem List</span>
        </button>
      </SheetTrigger>
      <SheetContent className="w-[400px] border-gray-700 bg-[#1e2430] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-gray-100">All Problems</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-2 overflow-y-auto">
          {problemsData.data.map((problem) => (
            <Link
              key={problem.id}
              href={`/problems/${problem.id}`}
              className={`block rounded-lg border p-3 transition-colors ${
                problem.id === currentProblemId
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-200">{problem.title}</h3>
                <Badge
                  className={`${difficultyColors[problem.difficulty]} border-0`}
                >
                  {problem.difficulty}
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {problem.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    className="border-0 bg-blue-500/10 text-xs text-blue-400"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProblemListSheet;
