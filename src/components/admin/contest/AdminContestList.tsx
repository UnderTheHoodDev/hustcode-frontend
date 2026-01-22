'use client';

import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Calendar,
  Clock,
  Loader2,
  Pencil,
  Trash2,
  Trophy,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import AdminContestFilter from '@/components/admin/contest/AdminContestFilter';
import CreateContestModal from '@/components/admin/contest/CreateContestModal';
import DeleteContestModal from '@/components/admin/contest/DeleteContestModal';
import ContestPagination from '@/components/contest/ContestPagination';
import ContestTable from '@/components/contest/ContestTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useContests from '@/lib/api/contest/queries/use-contests';
import type { Contest, ContestStatus, ContestsResponse } from '@/types/contest';

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

export default function AdminContestList() {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [statusFilter, setStatusFilter] = React.useState('');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedContest, setSelectedContest] = React.useState<Contest | null>(
    null
  );

  // Fetch contests from API
  const { data, isLoading, isError } = useContests({
    page,
    pageSize,
    status:
      statusFilter && statusFilter !== 'All'
        ? (statusFilter as ContestStatus)
        : undefined,
  });

  const handleCreateContest = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditContest = (contest: Contest) => {
    router.push(`/admin/contests/${contest.id}`);
  };

  const handleDeleteContest = (contest: Contest) => {
    setSelectedContest(contest);
    setIsDeleteModalOpen(true);
  };

  const handleRowClick = (contestId: string, _status: ContestStatus) => {
    router.push(`/admin/contests/${contestId}`);
  };

  const columns: ColumnDef<Contest>[] = [
    {
      accessorKey: 'title',
      header: 'Contest',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="font-medium text-gray-200">
              {row.original.title}
            </span>
            {!row.original.isPublic && (
              <Badge className="border-0 bg-purple-500/10 text-purple-400">
                Private
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'startTime',
      header: () => <div className="text-center">Schedule</div>,
      cell: ({ row }) => (
        <div className="flex flex-col items-center gap-1 text-sm">
          <div className="flex items-center gap-1 text-gray-300">
            <Calendar className="h-3 w-3" />
            {formatDateTime(row.original.startTime)}
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="h-3 w-3" />
            {formatDuration(row.original.startTime, row.original.endTime)}
          </div>
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: 'status',
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ContestStatusBadge status={row.getValue('status')} />
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: '_count',
      header: () => <div className="text-center">Info</div>,
      cell: ({ row }) => {
        // Support both participants and invitations count from backend
        const participantCount =
          row.original._count?.participants ??
          row.original._count?.invitations ??
          0;
        return (
          <div className="flex flex-col items-center gap-1 text-sm text-gray-400">
            <span>{row.original._count?.problems || 0} problems</span>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{participantCount}</span>
            </div>
          </div>
        );
      },
      size: 100,
    },
    {
      id: 'actions',
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const contest = row.original;
        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditContest(contest);
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
                Edit contest
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteContest(contest);
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
                Delete contest
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
      size: 100,
    },
  ];

  // Type assertion for API response
  const apiData = data as ContestsResponse | undefined;
  const tableData = apiData?.data || [];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: apiData?.totalPages || 1,
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
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
          <p className="text-gray-400">Loading contests...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-400">
          Failed to load contests. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Filter */}
      <AdminContestFilter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onCreateContest={handleCreateContest}
      />

      {/* Modals */}
      <CreateContestModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      <DeleteContestModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        contest={selectedContest}
      />

      {/* Table */}
      <ContestTable table={table} onRowClick={handleRowClick} isAdmin />

      {/* Pagination */}
      <ContestPagination table={table} />

      {/* Stats */}
      <div className="mt-4 text-sm text-gray-400">
        Total: {apiData?.total || 0} contests
      </div>
    </div>
  );
}
