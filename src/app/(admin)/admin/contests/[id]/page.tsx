'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowLeft,
  Check,
  Clock,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Trophy,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import ContestPagination from '@/components/contest/ContestPagination';
import ContestTable from '@/components/contest/ContestTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  mockContestDetailData,
  mockContestSubmissionsData,
} from '@/constants/mock-contest-data';
import useUpdateContest from '@/lib/api/contest/mutations/use-update-contest';

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

const SubmissionStatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> =
    {
      ACCEPTED: {
        color: 'bg-green-500/10 text-green-500',
        icon: <Check className="mr-1 h-3 w-3" />,
      },
      WRONG_ANSWER: {
        color: 'bg-red-500/10 text-red-500',
        icon: <X className="mr-1 h-3 w-3" />,
      },
      TIME_LIMIT_EXCEEDED: {
        color: 'bg-yellow-500/10 text-yellow-500',
        icon: <Clock className="mr-1 h-3 w-3" />,
      },
      MEMORY_LIMIT_EXCEEDED: {
        color: 'bg-orange-500/10 text-orange-500',
        icon: null,
      },
      RUNTIME_ERROR: {
        color: 'bg-purple-500/10 text-purple-500',
        icon: null,
      },
      COMPILATION_ERROR: {
        color: 'bg-pink-500/10 text-pink-500',
        icon: null,
      },
      PENDING: {
        color: 'bg-gray-500/10 text-gray-500',
        icon: null,
      },
      RUNNING: {
        color: 'bg-blue-500/10 text-blue-500',
        icon: null,
      },
    };

  const config = statusConfig[status] || statusConfig.PENDING;
  const displayStatus = status.replace(/_/g, ' ');

  return (
    <Badge className={`${config.color} flex items-center border-0`}>
      {config.icon}
      {displayStatus}
    </Badge>
  );
};

// Convert order number to letter (1 -> A, 2 -> B, etc.)
const orderToLetter = (order: number) => {
  return String.fromCharCode(64 + order);
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

const updateContestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
  startTime: z.date({ message: 'Start time is required' }),
  endTime: z.date({ message: 'End time is required' }),
  status: z.string(),
  isPublic: z.string(),
});

type UpdateContestFormData = z.infer<typeof updateContestSchema>;

export default function AdminContestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [submissionsPageSize, setSubmissionsPageSize] = useState(20);

  // Fetch contest detail - using mock data for now
  const {
    data: contest,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin-contest', id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockContestDetailData;
    },
    refetchOnWindowFocus: false,
  });

  // Fetch submissions - using mock data for now
  const { data: submissions } = useQuery({
    queryKey: ['contest-submissions', id, submissionsPage, submissionsPageSize],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockContestSubmissionsData;
    },
    refetchOnWindowFocus: false,
  });

  const form = useForm<UpdateContestFormData>({
    resolver: zodResolver(updateContestSchema) as any,
    mode: 'onSubmit',
    values: contest
      ? {
          title: contest.title,
          description: contest.description,
          startTime: new Date(contest.startTime),
          endTime: new Date(contest.endTime),
          status: contest.status,
          isPublic: contest.isPublic ? 'true' : 'false',
        }
      : undefined,
  });

  const { mutate: updateContest, isPending: isUpdating } = useUpdateContest(id);

  const onSubmit = (data: UpdateContestFormData) => {
    const payload = {
      title: data.title,
      description: data.description,
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
      status: data.status as ContestStatus,
      isPublic: data.isPublic === 'true',
    };

    updateContest(payload as any);
  };

  const handleProblemClick = (_problemId: string) => {
    // Navigate to problem edit in a new tab or modal
    // TODO: Implement problem edit functionality
  };

  const handleAddProblem = () => {
    // Open modal to add problem
    // TODO: Implement add problem modal
  };

  const handleDeleteProblem = (_problemId: string) => {
    // Delete problem from contest
    // TODO: Implement delete problem functionality
  };

  // Problem columns
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
                    handleProblemClick(problem.id);
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
                    handleDeleteProblem(problem.id);
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
                Remove problem
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
      size: 100,
    },
  ];

  const problemTable = useReactTable({
    data: contest?.problems || [],
    columns: problemColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Submission table
  const submissionTable = useReactTable({
    data: submissions?.data || [],
    columns: [
      {
        accessorKey: 'createdAt',
        header: 'Time',
        cell: ({ row }) => (
          <span className="text-sm text-gray-400">
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
        size: 180,
      },
      {
        accessorKey: 'user',
        header: 'User',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-gray-200">
              {row.original.user.name || row.original.user.email}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'problem',
        header: 'Problem',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="font-medium text-cyan-400">
              {orderToLetter(row.original.problem.order)}
            </span>
            <span className="text-gray-300">{row.original.problem.title}</span>
          </div>
        ),
      },
      {
        accessorKey: 'language',
        header: 'Language',
        cell: ({ row }) => (
          <span className="text-gray-400">{row.original.language.name}</span>
        ),
        size: 120,
      },
      {
        accessorKey: 'status',
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <SubmissionStatusBadge status={row.getValue('status')} />
          </div>
        ),
        size: 180,
      },
      {
        accessorKey: 'executionTime',
        header: () => <div className="text-center">Time</div>,
        cell: ({ row }) => (
          <div className="text-center text-sm text-gray-400">
            {row.original.executionTime
              ? `${row.original.executionTime}ms`
              : '-'}
          </div>
        ),
        size: 80,
      },
      {
        accessorKey: 'memoryUsed',
        header: () => <div className="text-center">Memory</div>,
        cell: ({ row }) => (
          <div className="text-center text-sm text-gray-400">
            {row.original.memoryUsed
              ? `${(row.original.memoryUsed / 1024).toFixed(1)}MB`
              : '-'}
          </div>
        ),
        size: 100,
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: submissions?.totalPages || 1,
    state: {
      pagination: {
        pageIndex: submissionsPage - 1,
        pageSize: submissionsPageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex: submissionsPage - 1,
          pageSize: submissionsPageSize,
        });
        setSubmissionsPage(newState.pageIndex + 1);
        setSubmissionsPageSize(newState.pageSize);
      }
    },
  });

  const inputClassName =
    'border-[#3a4556] bg-[#252d3d] text-gray-200 placeholder:text-gray-500';
  const labelClassName = 'text-gray-300';

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
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0f1724]">
        <p className="mb-4 text-red-400">Failed to load contest</p>
        <Link href="/admin/contests">
          <Button variant="outline">Back to Contests</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1724]">
      <div className="layout-padding">
        {/* Header */}
        <div className="py-6">
          <Link
            href="/admin/contests"
            className="mb-4 inline-flex items-center gap-2 text-gray-400 hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contests
          </Link>

          <div className="mt-4 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-100">
              {contest.title}
            </h1>
            <ContestStatusBadge status={contest.status} />
            {!contest.isPublic && (
              <Badge className="border-0 bg-purple-500/10 text-purple-400">
                Private
              </Badge>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="detail" className="mt-6">
          <TabsList className="border-[#3a4556] bg-[#1e293b]">
            <TabsTrigger
              value="detail"
              className="data-[state=active]:bg-[#252d3d] data-[state=active]:text-cyan-400"
            >
              Detail
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className="data-[state=active]:bg-[#252d3d] data-[state=active]:text-cyan-400"
            >
              Submissions ({submissions?.total || 0})
            </TabsTrigger>
          </TabsList>

          {/* Detail Tab */}
          <TabsContent value="detail" className="mt-4">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Edit Form */}
              <div className="rounded-lg border border-[#3a4556] bg-[#1e293b] p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-100">
                  Contest Information
                </h2>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    {/* Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClassName}>
                            Title
                          </FormLabel>
                          <FormControl>
                            <Input className={inputClassName} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClassName}>
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={inputClassName}
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Start & End Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClassName}>
                              Start Time
                            </FormLabel>
                            <FormControl>
                              <DateTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select start time"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClassName}>
                              End Time
                            </FormLabel>
                            <FormControl>
                              <DateTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select end time"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Status & Visibility */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClassName}>
                              Status
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className={inputClassName}>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border-[#3a4556] bg-[#252d3d]">
                                <SelectItem
                                  value="UPCOMING"
                                  className="text-gray-200"
                                >
                                  Upcoming
                                </SelectItem>
                                <SelectItem
                                  value="RUNNING"
                                  className="text-gray-200"
                                >
                                  Running
                                </SelectItem>
                                <SelectItem
                                  value="FINISHED"
                                  className="text-gray-200"
                                >
                                  Finished
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isPublic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClassName}>
                              Visibility
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className={inputClassName}>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border-[#3a4556] bg-[#252d3d]">
                                <SelectItem
                                  value="true"
                                  className="text-gray-200"
                                >
                                  Public
                                </SelectItem>
                                <SelectItem
                                  value="false"
                                  className="text-gray-200"
                                >
                                  Private
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full bg-cyan-600 text-white hover:bg-cyan-700"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Problems List */}
              <div className="rounded-lg border border-[#3a4556] bg-[#1e293b] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-100">
                    Problems ({contest.problems.length})
                  </h2>
                  <Button
                    onClick={handleAddProblem}
                    size="sm"
                    className="bg-cyan-600 text-white hover:bg-cyan-700"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Problem
                  </Button>
                </div>
                <ContestTable
                  table={problemTable}
                  onRowClick={handleProblemClick}
                />
              </div>
            </div>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="mt-4">
            <div className="overflow-hidden rounded-lg border border-[#3a4556] bg-[#252d3d]">
              <Table>
                <TableHeader>
                  {submissionTable.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-b border-[#3a4556] hover:bg-transparent"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="font-medium text-gray-400"
                          style={{ width: header.getSize() }}
                        >
                          {header.isPlaceholder
                            ? null
                            : typeof header.column.columnDef.header ===
                                'function'
                              ? header.column.columnDef.header(
                                  header.getContext()
                                )
                              : header.column.columnDef.header}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {submissionTable.getRowModel().rows?.length ? (
                    submissionTable.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="border-b border-[#3a4556] hover:bg-[#2a3344]"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {typeof cell.column.columnDef.cell === 'function'
                              ? cell.column.columnDef.cell(cell.getContext())
                              : cell.getValue()}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={submissionTable.getAllColumns().length}
                        className="h-24 text-center text-gray-400"
                      >
                        No submissions yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <ContestPagination table={submissionTable} />
            <div className="mt-4 text-sm text-gray-400">
              Total: {submissions?.total || 0} submissions
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
