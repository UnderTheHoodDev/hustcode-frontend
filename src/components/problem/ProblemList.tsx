'use client';

import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import ProblemFilter from '@/components/problem/ProblemFIlter';
import ProblemPagination from '@/components/problem/ProblemPagination';
import ProblemTable from '@/components/problem/ProblemTable';
import { Badge } from '@/components/ui/badge';
import useProblems from '@/lib/api/problem/queries/use-problems';

type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  taskDescription: string;
  inputDescription: string;
  outputDescription: string;
  status: string;
  authorId: string;
  likeNumber: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
  tags: Array<{
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }>;
  _count: {
    submissions: number;
    comments: number;
  };
  userStatus: 'Solved' | 'Attempted' | 'Unsolved';
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'Solved') {
    return <Check className="h-4 w-4 text-green-500" />;
  } else if (status === 'Attempted') {
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  }
  return null;
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

export default function ProblemList() {
  const router = useRouter();
  const [difficulty, setDifficulty] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const pageSize = 20;

  // Build filter options for API
  // Note: userStatus (Solved/Attempted/Unsolved) is filtered client-side
  const filterOptions: OptherOptionsProps = React.useMemo(() => {
    const options: OptherOptionsProps = {
      page,
      pageSize,
    };

    if (difficulty && difficulty !== 'All') {
      options.difficulty = difficulty as OptherOptionsProps['difficulty'];
    }

    if (searchQuery) {
      options.search = searchQuery;
    }

    if (selectedTags.length > 0) {
      options.tags = selectedTags;
    }

    return options;
  }, [page, pageSize, difficulty, searchQuery, selectedTags]);

  // Fetch problems from API
  const { data: response, isLoading, isError } = useProblems(filterOptions);

  // Type assertion for API response
  const apiData = response?.data as
    | {
        data: Problem[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      }
    | undefined;

  // Filter by userStatus client-side (Solved, Attempted, Unsolved)
  const problems: Problem[] = React.useMemo(() => {
    const data = apiData?.data || [];
    
    if (!statusFilter || statusFilter === 'All') {
      return data;
    }
    
    return data.filter((problem) => problem.userStatus === statusFilter);
  }, [apiData, statusFilter]);

  const totalPages = apiData?.totalPages || 1;

  // Get all unique tags from problems for filter dropdown
  const allTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    problems.forEach((problem) => {
      problem.tags.forEach((tag) => {
        tagsSet.add(tag.name);
      });
    });
    return Array.from(tagsSet).sort();
  }, [problems]);

  const handleRandomProblem = () => {
    if (problems.length > 0) {
      const randomIndex = Math.floor(Math.random() * problems.length);
      const randomProblem = problems[randomIndex];
      router.push(`/problems/${randomProblem.id}`);
    }
  };

  const handleRowClick = (problemId: string) => {
    router.push(`/problems/${problemId}`);
  };

  const columns: ColumnDef<Problem>[] = [
    {
      accessorKey: 'userStatus',
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <StatusIcon status={row.getValue('userStatus')} />
        </div>
      ),
      size: 80,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="font-medium text-gray-200">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }) => {
        const tags = row.original.tags;
        return (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                className="border-0 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        );
      },
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
  ];

  const table = useReactTable({
    data: problems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: page - 1, pageSize });
        setPage(newState.pageIndex + 1);
      }
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
          <p className="text-gray-400">Loading problems...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-400">
          Failed to load problems. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Filter */}
      <ProblemFilter
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        availableTags={allTags}
        onRandomProblem={handleRandomProblem}
      />
      {/* Table */}
      <ProblemTable table={table} onRowClick={handleRowClick} />
      {/* Pagination */}
      <ProblemPagination table={table} />
    </div>
  );
}
