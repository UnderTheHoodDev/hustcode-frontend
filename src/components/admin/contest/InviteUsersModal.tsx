'use client';

import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Loader2, Search, UserPlus, X } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useInviteUsers from '@/lib/api/contest/mutations/use-invite-users';
import useSearchUsers, {
  SearchUser,
} from '@/lib/api/contest/queries/use-search-users';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface SelectedUser {
  id: string;
  email: string;
  name: string | null;
}

interface InviteUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contestId: string;
  existingInvitedUserIds: string[];
}

const InviteUsersModal = ({
  open,
  onOpenChange,
  contestId,
  existingInvitedUserIds,
}: InviteUsersModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  // Store full user info, not just IDs
  const [selectedUsers, setSelectedUsers] = useState<Map<string, SelectedUser>>(
    new Map()
  );
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch users
  const { data: usersResponse, isLoading: isLoadingUsers } = useSearchUsers({
    search: debouncedSearch || undefined,
    page,
    pageSize: 10,
    enabled: open,
  });

  const totalPages = usersResponse?.totalPages || 1;

  // Filter out already invited users
  const availableUsers = useMemo(() => {
    const users = usersResponse?.data || [];
    return users.filter((user) => !existingInvitedUserIds.includes(user.id));
  }, [usersResponse?.data, existingInvitedUserIds]);

  const { mutate: inviteUsers, isPending: isInviting } = useInviteUsers();

  // Get array of selected user IDs for API call
  const selectedUserIds = useMemo(() => {
    return Array.from(selectedUsers.keys());
  }, [selectedUsers]);

  const handleSelectUser = useCallback((user: SearchUser, checked: boolean) => {
    setSelectedUsers((prev) => {
      const newMap = new Map(prev);
      if (checked) {
        newMap.set(user.id, {
          id: user.id,
          email: user.email,
          name: user.name,
        });
      } else {
        newMap.delete(user.id);
      }
      return newMap;
    });
  }, []);

  const handleRemoveSelectedUser = useCallback((userId: string) => {
    setSelectedUsers((prev) => {
      const newMap = new Map(prev);
      newMap.delete(userId);
      return newMap;
    });
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedUsers((prev) => {
        const newMap = new Map(prev);
        if (checked) {
          availableUsers.forEach((user) => {
            newMap.set(user.id, {
              id: user.id,
              email: user.email,
              name: user.name,
            });
          });
        } else {
          // Only remove users from current page
          availableUsers.forEach((user) => {
            newMap.delete(user.id);
          });
        }
        return newMap;
      });
    },
    [availableUsers]
  );

  const isAllSelected = useMemo(() => {
    if (availableUsers.length === 0) return false;
    return availableUsers.every((user) => selectedUsers.has(user.id));
  }, [availableUsers, selectedUsers]);

  const handleInvite = () => {
    if (selectedUserIds.length === 0) return;

    inviteUsers(
      { contestId, userIds: selectedUserIds },
      {
        onSuccess: () => {
          setSelectedUsers(new Map());
          setSearchQuery('');
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = () => {
    setSelectedUsers(new Map());
    setSearchQuery('');
    setPage(1);
    onOpenChange(false);
  };

  // Table columns
  const columns: ColumnDef<SearchUser>[] = [
    {
      id: 'select',
      header: () => (
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
          aria-label="Select all"
          className="border-gray-500 data-[state=checked]:border-cyan-500 data-[state=checked]:bg-cyan-500"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedUsers.has(row.original.id)}
          onCheckedChange={(checked: boolean) =>
            handleSelectUser(row.original, checked)
          }
          aria-label="Select row"
          className="border-gray-500 data-[state=checked]:border-cyan-500 data-[state=checked]:bg-cyan-500"
        />
      ),
      size: 50,
    },
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
  ];

  const table = useReactTable({
    data: availableUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const inputClassName =
    'border-[#3a4556] bg-[#252d3d] text-gray-200 placeholder:text-gray-500';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl border-[#3a4556] bg-[#1e2530]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-100">
            <UserPlus className="h-5 w-5 text-cyan-400" />
            Invite Users to Contest
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Search and select users to invite to this private contest.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className={`pl-10 ${inputClassName}`}
            />
          </div>

          {/* Selected count */}
          {selectedUsers.size > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-cyan-400">
                {selectedUsers.size} user(s) selected:
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from(selectedUsers.values()).map((user) => (
                  <Badge
                    key={user.id}
                    variant="secondary"
                    className="flex items-center gap-1 border-[#3a4556] bg-[#252d3d] text-gray-200"
                  >
                    <span className="max-w-[150px] truncate">{user.email}</span>
                    <button
                      onClick={() => handleRemoveSelectedUser(user.id)}
                      className="ml-1 rounded-full p-0.5 hover:bg-[#3a4556]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="max-h-[400px] overflow-y-auto rounded-lg border border-[#3a4556]">
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
                {isLoadingUsers ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="h-24 text-center text-gray-400"
                    >
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-cyan-400" />
                    </TableCell>
                  </TableRow>
                ) : availableUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="h-24 text-center text-gray-400"
                    >
                      {searchQuery
                        ? 'No users found matching your search.'
                        : 'No users available to invite.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer border-b border-[#3a4556] hover:bg-[#2a3344]"
                      onClick={() =>
                        handleSelectUser(
                          row.original,
                          !selectedUsers.has(row.original.id)
                        )
                      }
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
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-[#3a4556] bg-transparent text-gray-300 hover:bg-[#252d3d]"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="border-[#3a4556] bg-transparent text-gray-300 hover:bg-[#252d3d]"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-[#3a4556] bg-transparent text-gray-300 hover:bg-[#252d3d]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={selectedUsers.size === 0 || isInviting}
            className="bg-cyan-500 text-white hover:bg-cyan-600"
          >
            {isInviting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inviting...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite ({selectedUsers.size})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUsersModal;
