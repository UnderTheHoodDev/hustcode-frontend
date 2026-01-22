'use client';

import {
  Award,
  Calendar,
  CheckCircle2,
  Code2,
  Flame,
  Loader2,
  Mail,
  Shield,
  Trophy,
  User,
} from 'lucide-react';
import { useMemo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import useProfileQuery from '@/lib/api/user/queries/use-profile';
import { getUserInitials } from '@/utils/user';

// Language colors for visual distinction
const LANGUAGE_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  python: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  javascript: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
  },
  typescript: {
    bg: 'bg-blue-600/20',
    text: 'text-blue-300',
    border: 'border-blue-600/30',
  },
  java: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
  },
  c: {
    bg: 'bg-gray-500/20',
    text: 'text-gray-300',
    border: 'border-gray-500/30',
  },
  'c++': {
    bg: 'bg-pink-500/20',
    text: 'text-pink-400',
    border: 'border-pink-500/30',
  },
  cpp: {
    bg: 'bg-pink-500/20',
    text: 'text-pink-400',
    border: 'border-pink-500/30',
  },
  nodejs: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    border: 'border-green-500/30',
  },
  go: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
  rust: {
    bg: 'bg-orange-600/20',
    text: 'text-orange-300',
    border: 'border-orange-600/30',
  },
};

const getLanguageColor = (language: string) => {
  const key = language.toLowerCase();
  return (
    LANGUAGE_COLORS[key] || {
      bg: 'bg-purple-500/20',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
    }
  );
};

const ProfileContent = () => {
  const { data: profile, isLoading, isError } = useProfileQuery();

  // Calculate total submissions
  const totalSubmissions = useMemo(() => {
    if (!profile?.languagesUsed) return 0;
    return profile.languagesUsed.reduce((sum, lang) => sum + lang.count, 0);
  }, [profile?.languagesUsed]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-400">
          Failed to load profile. Please try again later.
        </div>
      </div>
    );
  }

  const displayName = profile.name || 'Anonymous User';
  const isAdmin = profile.role === 'ADMIN';

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-br from-[#1a2332] to-[#0f1724] p-8">
        {/* Background decoration */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-28 w-28 ring-4 ring-cyan-500/30">
              <AvatarImage src={undefined} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-pink-500 text-3xl font-bold text-white">
                {getUserInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            {isAdmin && (
              <div className="absolute -right-1 -bottom-1 rounded-full bg-amber-500 p-1.5">
                <Shield className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {displayName}
              </h1>
              <Badge
                className={
                  isAdmin
                    ? 'border-amber-500/30 bg-amber-500/20 text-amber-400'
                    : 'border-cyan-500/30 bg-cyan-500/20 text-cyan-400'
                }
              >
                {profile.role}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <Mail className="h-4 w-4" />
              <span>{profile.email}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {profile.rating !== null && (
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <span className="font-semibold text-amber-400">
                    Rating: {profile.rating}
                  </span>
                </div>
              )}

              {profile.contributions !== null && profile.contributions > 0 && (
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-400">
                    {profile.contributions} contributions
                  </span>
                </div>
              )}

              {totalSubmissions > 0 && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">
                    {totalSubmissions} total submissions
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Solved */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-700/50 bg-gradient-to-br from-[#1a2332] to-[#0f1724] p-6 transition-all hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-green-500/10 blur-2xl transition-all group-hover:bg-green-500/20" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Problems Solved</p>
              <p className="text-3xl font-bold text-green-400">
                {profile.stats.solved}
              </p>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-700/50 bg-gradient-to-br from-[#1a2332] to-[#0f1724] p-6 transition-all hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl transition-all group-hover:bg-amber-500/20" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20">
              <Flame className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">In Progress</p>
              <p className="text-3xl font-bold text-amber-400">
                {profile.stats.inProgress}
              </p>
            </div>
          </div>
        </div>

        {/* Accepted */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-700/50 bg-gradient-to-br from-[#1a2332] to-[#0f1724] p-6 transition-all hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl transition-all group-hover:bg-cyan-500/20" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20">
              <Trophy className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Accepted Solutions</p>
              <p className="text-3xl font-bold text-cyan-400">
                {profile.stats.accepted}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Languages Used Section */}
      <div className="rounded-xl border border-gray-700/50 bg-gradient-to-br from-[#1a2332] to-[#0f1724] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">Languages Used</h2>
          </div>
          {profile.languagesUsed.length > 0 && (
            <span className="text-sm text-gray-400">
              {profile.languagesUsed.length} languages
            </span>
          )}
        </div>

        {profile.languagesUsed.length > 0 ? (
          <div className="space-y-4">
            {/* Language cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {profile.languagesUsed
                .sort((a, b) => b.count - a.count)
                .map((lang) => {
                  const colors = getLanguageColor(lang.language);
                  const percentage =
                    totalSubmissions > 0
                      ? Math.round((lang.count / totalSubmissions) * 100)
                      : 0;

                  return (
                    <div
                      key={lang.language}
                      className={`relative overflow-hidden rounded-lg border ${colors.border} ${colors.bg} p-4 transition-all hover:scale-[1.02]`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}
                          >
                            <Code2 className={`h-5 w-5 ${colors.text}`} />
                          </div>
                          <div>
                            <p className={`font-semibold ${colors.text}`}>
                              {lang.language}
                            </p>
                            <p className="text-xs text-gray-400">
                              {lang.count} submissions
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${colors.text}`}>
                            {percentage}%
                          </p>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-700/50">
                        <div
                          className={`h-full rounded-full ${colors.bg} transition-all`}
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: colors.text
                              .replace('text-', '')
                              .includes('400')
                              ? `rgb(var(--tw-${colors.text.replace('text-', '').replace('-400', '-500')}))`
                              : undefined,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 rounded-lg border border-dashed border-gray-600 py-8 text-gray-500">
            <User className="h-5 w-5" />
            <span>No languages used yet. Start solving problems!</span>
          </div>
        )}
      </div>

      {/* Activity placeholder - can be expanded later */}
      <div className="rounded-xl border border-gray-700/50 bg-gradient-to-br from-[#1a2332] to-[#0f1724] p-6">
        <div className="mb-4 flex items-center gap-3">
          <Flame className="h-5 w-5 text-pink-400" />
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>

        <div className="flex items-center justify-center gap-3 rounded-lg border border-dashed border-gray-600 py-12 text-gray-500">
          <span>Activity history coming soon...</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
