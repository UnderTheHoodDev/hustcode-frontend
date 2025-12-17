'use client';

import { useQuery } from '@tanstack/react-query';
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Check, Clock, Pencil, Trash2, X } from 'lucide-react';
import React from 'react';

import AdminProblemFilter from '@/components/admin/problem/AdminProblemFilter';
import CreateProblemModal from '@/components/admin/problem/CreateProblemModal';
import DeleteProblemModal from '@/components/admin/problem/DeleteProblemModal';
import EditProblemModal from '@/components/admin/problem/EditProblemModal';
import ProblemPagination from '@/components/problem/ProblemPagination';
import ProblemTable from '@/components/problem/ProblemTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getProblems } from '@/lib/api/problem';

const ProblemStatusBadge = ({
  status,
}: {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}) => {
  const statusConfig: Record<
    string,
    { color: string; icon: React.ReactNode; label: string }
  > = {
    PENDING: {
      color: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
      icon: <Clock className="mr-1 h-3 w-3" />,
      label: 'Pending',
    },
    APPROVED: {
      color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
      icon: <Check className="mr-1 h-3 w-3" />,
      label: 'Approved',
    },
    REJECTED: {
      color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
      icon: <X className="mr-1 h-3 w-3" />,
      label: 'Rejected',
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <Badge className={`${config.color} flex items-center border-0`}>
      {config.icon}
      {config.label}
    </Badge>
  );
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

export default function AdminProblemList() {
  const [difficulty, setDifficulty] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedProblemId, setSelectedProblemId] = React.useState<
    string | null
  >(null);
  const [selectedProblem, setSelectedProblem] =
    React.useState<AdminProblem | null>(null);

  // Build filter options for API
  const filterOptions: OptherOptionsProps = React.useMemo(() => {
    const options: OptherOptionsProps = {
      page,
      pageSize,
    };

    if (difficulty && difficulty !== 'All') {
      options.difficulty = difficulty as OptherOptionsProps['difficulty'];
    }

    if (statusFilter && statusFilter !== 'All') {
      options.status = statusFilter as OptherOptionsProps['status'];
    }

    if (searchQuery) {
      options.search = searchQuery;
    }

    if (selectedTags.length > 0) {
      options.tags = selectedTags;
    }

    return options;
  }, [page, pageSize, difficulty, statusFilter, searchQuery, selectedTags]);

  // Fetch data using tanstack-query with existing API
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-problems', filterOptions],
    queryFn: async () => {
      const response = await getProblems(filterOptions);
      return response.data as unknown as AdminProblemsResponse;
    },
    refetchOnWindowFocus: false,
  });

  // Get all unique tags from fetched problems
  const allTags = React.useMemo(() => {
    if (!data?.data) return [];
    const tagsSet = new Set<string>();
    data.data.forEach((problem) => {
      problem.tags.forEach((tag) => {
        tagsSet.add(tag.name);
      });
    });
    return Array.from(tagsSet).sort();
  }, [data]);

  const handleCreateProblem = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditProblem = (problem: AdminProblem) => {
    setSelectedProblemId(problem.id);
    setIsEditModalOpen(true);
  };

  const handleDeleteProblem = (problem: AdminProblem) => {
    setSelectedProblem(problem);
    setIsDeleteModalOpen(true);
  };

  const handleRowClick = (problemId: string) => {
    // Find the problem and open edit modal
    const problem = data?.data.find((p) => p.id === problemId);
    if (problem) {
      handleEditProblem(problem);
    }
  };

  const columns: ColumnDef<AdminProblem>[] = [
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
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                className="border-0 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
              >
                {tag.name}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge className="border-0 bg-gray-500/10 text-gray-400">
                +{tags.length - 3}
              </Badge>
            )}
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
    {
      accessorKey: 'status',
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ProblemStatusBadge status={row.getValue('status')} />
        </div>
      ),
      size: 120,
    },
    {
      id: 'actions',
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const problem = row.original;
        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditProblem(problem);
                  }}
                  className="h-8 w-8 p-0 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="border-[#3a4556] bg-[#252d3d] text-gray-200"
              >
                Edit problem
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProblem(problem);
                  }}
                  className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="border-[#3a4556] bg-[#252d3d] text-gray-200"
              >
                Delete problem
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
      size: 100,
    },
  ];

  const tableData = data?.data || [];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: data?.totalPages || 1,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex: page - 1,
          pageSize,
        });
        setPage(newState.pageIndex + 1);
        setPageSize(newState.pageSize);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="text-gray-400">Loading problems...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="text-red-400">
          Error loading problems. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Filter */}
      <AdminProblemFilter
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        availableTags={allTags}
        onCreateProblem={handleCreateProblem}
      />

      {/* Modals */}
      <CreateProblemModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      <EditProblemModal
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setSelectedProblemId(null);
        }}
        problemId={selectedProblemId}
      />
      <DeleteProblemModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        problem={selectedProblem}
      />

      {/* Table */}
      <ProblemTable table={table} onRowClick={handleRowClick} />
      {/* Pagination */}
      <ProblemPagination table={table} />
      {/* Stats */}
      <div className="mt-4 text-sm text-gray-400">
        Total: {data?.total || 0} problems
      </div>
    </div>
  );
}
