'use client';

import { format } from 'date-fns';
import { useAtomValue } from 'jotai';
import {
  ArrowLeft,
  Calendar,
  Crown,
  Loader2,
  Mail,
  Save,
  Shield,
  Star,
  Trophy,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

import { userInfoAtom } from '@/atoms';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useUpdateUserRole from '@/lib/api/user/mutations/use-update-user-role';
import useUserDetail from '@/lib/api/user/queries/use-user-detail';

const RoleBadge = ({ role }: { role: string }) => {
  if (role === 'ADMIN') {
    return (
      <Badge className="border-0 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20">
        <Crown className="mr-1 h-3 w-3" />
        Admin
      </Badge>
    );
  }
  return (
    <Badge className="border-0 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
      <User className="mr-1 h-3 w-3" />
      User
    </Badge>
  );
};

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: userId } = use(params);
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'USER'>('USER');
  const currentUser = useAtomValue(userInfoAtom);

  // Check if viewing own profile
  const isSelf = currentUser?.id === userId;

  const { data: user, isLoading, isError } = useUserDetail(userId);
  const { mutate: updateRole, isPending: isUpdating } = useUpdateUserRole();

  // Update selected role when user data is loaded
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
    }
  }, [user]);

  const handleSaveRole = () => {
    if (!user || selectedRole === user.role) return;

    updateRole({ userId, role: selectedRole });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-gray-400">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-200">
            User Not Found
          </h2>
          <p className="mt-2 text-gray-400">
            The user you are looking for does not exist or has been deleted.
          </p>
        </div>
        <Link href="/admin/users">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-cyan-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-100">User Details</h1>
            <p className="text-sm text-gray-400">
              View and manage user information
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Info Card */}
        <Card className="border-[#3a4556] bg-[#252d3d] lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-100">
              <User className="h-5 w-5 text-cyan-400" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar & Basic Info */}
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-3xl font-bold text-white">
                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-100">
                    {user.name || 'No name set'}
                  </h2>
                  <div className="mt-1 flex items-center gap-2 text-gray-400">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RoleBadge role={user.role} />
                  {user.rating !== null && (
                    <Badge
                      variant="outline"
                      className="border-yellow-500/30 text-yellow-500"
                    >
                      <Star className="mr-1 h-3 w-3" />
                      Rating: {user.rating}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {user.createdAt && (
                <div className="rounded-lg border border-[#3a4556] bg-[#1a2233] p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    Joined
                  </div>
                  <div className="mt-1 font-medium text-gray-200">
                    {format(new Date(user.createdAt), 'MMMM d, yyyy')}
                  </div>
                </div>
              )}
              <div className="rounded-lg border border-[#3a4556] bg-[#1a2233] p-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Trophy className="h-4 w-4" />
                  Contributions
                </div>
                <div className="mt-1 font-medium text-gray-200">
                  {user.contributions ?? 0}
                </div>
              </div>
            </div>

            {/* Stats */}
            {user.stats && (
              <div>
                <h3 className="mb-3 font-medium text-gray-300">
                  Problem Statistics
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {user.stats.solved}
                    </div>
                    <div className="text-sm text-gray-400">Solved</div>
                  </div>
                  <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {user.stats.inProgress}
                    </div>
                    <div className="text-sm text-gray-400">In Progress</div>
                  </div>
                  <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 text-center">
                    <div className="text-2xl font-bold text-cyan-400">
                      {user.stats.accepted}
                    </div>
                    <div className="text-sm text-gray-400">Accepted</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Management Card */}
        <Card className="border-[#3a4556] bg-[#252d3d]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-100">
              <Crown className="h-5 w-5 text-purple-400" />
              Role Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isSelf && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                <p className="text-xs text-red-400">
                  <strong>Note:</strong> You cannot change your own role.
                </p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                User Role
              </label>
              <Select
                disabled={isUpdating || isSelf}
                onValueChange={(value: 'ADMIN' | 'USER') =>
                  setSelectedRole(value)
                }
                value={selectedRole}
              >
                <SelectTrigger
                  className={`border-[#3a4556] bg-[#1a2233] text-gray-200 ${isSelf ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="border-[#3a4556] bg-[#252d3d]">
                  <SelectItem
                    value="USER"
                    className="cursor-pointer text-gray-200 hover:bg-[#3a4556] focus:bg-[#3a4556] focus:text-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-400" />
                      User
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="ADMIN"
                    className="cursor-pointer text-gray-200 hover:bg-[#3a4556] focus:bg-[#3a4556] focus:text-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-purple-400" />
                      Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                {selectedRole === 'ADMIN'
                  ? 'Admins have full access to manage the platform.'
                  : 'Regular users can participate in contests and solve problems.'}
              </p>
            </div>

            <Button
              onClick={handleSaveRole}
              disabled={isUpdating || selectedRole === user.role || isSelf}
              className="w-full gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>

            {/* Warning */}
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
              <p className="text-xs text-yellow-400">
                <strong>Warning:</strong> Changing user roles affects their
                permissions on the platform. Admin users have full access to all
                admin features.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
