'use client';

import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AlertCircle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import ProblemFilter from '@/components/problem/ProblemFIlter';
import ProblemPagination from '@/components/problem/ProblemPagination';
import ProblemTable from '@/components/problem/ProblemTable';
import { Badge } from '@/components/ui/badge';
import { problemsData } from '@/constants/mock-problem-data';

type Problem = (typeof problemsData.data)[0];

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

  // Get all unique tags from problems
  const allTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    problemsData.data.forEach((problem) => {
      problem.tags.forEach((tag) => {
        tagsSet.add(tag.name);
      });
    });
    return Array.from(tagsSet).sort();
  }, []);

  const handleRandomProblem = () => {
    if (filteredData.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredData.length);
      const randomProblem = filteredData[randomIndex];
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

  const filteredData = React.useMemo(() => {
    return problemsData.data.filter((problem) => {
      const matchesDifficulty =
        !difficulty ||
        difficulty === 'All' ||
        problem.difficulty === difficulty;
      const matchesStatus =
        !statusFilter ||
        statusFilter === 'All' ||
        problem.userStatus === statusFilter;
      const matchesSearch =
        !searchQuery ||
        problem.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((selectedTag) =>
          problem.tags.some((tag) => tag.name === selectedTag)
        );
      return matchesDifficulty && matchesStatus && matchesSearch && matchesTags;
    });
  }, [difficulty, statusFilter, searchQuery, selectedTags]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

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
