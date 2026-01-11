'use client';

import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { Loader2, Search, Users } from 'lucide-react';
import React, { useState } from 'react';

import ContestPagination from '@/components/contest/ContestPagination';
import { Badge } from '@/components/ui/badge';
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
import { User } from '@/lib/api/user';
import useUsers from '@/lib/api/user/queries/use-users';
import { useDebounce } from '@/lib/hooks/use-debounce';

const RoleBadge = ({ role }: { role: string }) => {
  const colors: Record<string, string> = {
    ADMIN: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20',
    USER: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20',
  };

  return (
    <Badge className={`${colors[role] || colors.USER} border-0`}>{role}</Badge>
  );
};

export default function AdminUserList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'createdAt'>(
    'createdAt'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: usersResponse, isLoading } = useUsers({
    page,
    pageSize,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
  });

  const users = usersResponse?.data || [];
  const totalPages = usersResponse?.totalPages || 1;
  const total = usersResponse?.total || 0;

  // Table columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-200">
            {row.original.email}
          </span>
          {row.original.name && (
            <span className="text-sm text-gray-400">{row.original.name}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: () => <div className="text-center">Role</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <RoleBadge role={row.original.role} />
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: 'rating',
      header: () => <div className="text-center">Rating</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium text-yellow-500">
          {row.original.rating ?? '-'}
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: 'createdAt',
      header: () => <div className="text-center">Joined</div>,
      cell: ({ row }) => (
        <div className="text-center text-sm text-gray-400">
          {row.original.createdAt
            ? format(new Date(row.original.createdAt), 'MMM d, yyyy')
            : '-'}
        </div>
      ),
      size: 120,
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
        const newState = updater({
          pageIndex: page - 1,
          pageSize,
        });
        setPage(newState.pageIndex + 1);
        setPageSize(newState.pageSize);
      }
    },
  });

  const inputClassName =
    'border-[#3a4556] bg-[#252d3d] text-gray-200 placeholder:text-gray-500';

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-cyan-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Users</h1>
            <p className="text-sm text-gray-400">
              Manage all registered users on the platform
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative min-w-[250px] flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className={`${inputClassName} pl-9`}
          />
        </div>

        <Select
          value={sortBy}
          onValueChange={(value: 'name' | 'rating' | 'createdAt') => {
            setSortBy(value);
            setPage(1);
          }}
        >
          <SelectTrigger className={`${inputClassName} w-[150px]`}>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="border-[#3a4556] bg-[#252d3d]">
            <SelectItem value="createdAt" className="text-gray-200">
              Join Date
            </SelectItem>
            <SelectItem value="name" className="text-gray-200">
              Name
            </SelectItem>
            <SelectItem value="rating" className="text-gray-200">
              Rating
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(value: 'asc' | 'desc') => {
            setSortOrder(value);
            setPage(1);
          }}
        >
          <SelectTrigger className={`${inputClassName} w-[120px]`}>
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent className="border-[#3a4556] bg-[#252d3d]">
            <SelectItem value="desc" className="text-gray-200">
              Descending
            </SelectItem>
            <SelectItem value="asc" className="text-gray-200">
              Ascending
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-[#3a4556] bg-[#252d3d]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            <p className="text-gray-400">Loading users...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-[#3a4556] bg-[#252d3d]">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
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
                          : typeof header.column.columnDef.header === 'function'
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
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
                      colSpan={columns.length}
                      className="h-24 text-center text-gray-400"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <ContestPagination table={table} />
          <div className="mt-2 text-sm text-gray-400">Total: {total} users</div>
        </>
      )}
    </div>
  );
}
