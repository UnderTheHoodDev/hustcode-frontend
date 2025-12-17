'use client';

import { useAtomValue } from 'jotai';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { userInfoAtom } from '@/atoms';
import { Button } from '@/components/ui/button';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const router = useRouter();
  const userInfo = useAtomValue(userInfoAtom);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait a bit for userInfo to be loaded from storage
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Still loading
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1724]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
          <p className="text-gray-400">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!userInfo.id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1724]">
        <div className="flex max-w-md flex-col items-center gap-6 rounded-2xl border border-gray-700/50 bg-[#1a2332] p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
            <ShieldAlert className="h-8 w-8 text-amber-400" />
          </div>
          <div>
            <h1 className="mb-2 text-xl font-bold text-white">
              Authentication Required
            </h1>
            <p className="text-gray-400">
              Please login to access the admin console.
            </p>
          </div>
          <Button
            onClick={() => router.push('/login')}
            className="bg-cyan-500 text-white hover:bg-cyan-600"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Not an admin
  if (userInfo.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1724]">
        <div className="flex max-w-md flex-col items-center gap-6 rounded-2xl border border-red-500/30 bg-[#1a2332] p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <ShieldAlert className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <h1 className="mb-2 text-xl font-bold text-white">Access Denied</h1>
            <p className="text-gray-400">
              You don&apos;t have permission to access the admin console. This
              area is restricted to administrators only.
            </p>
          </div>
          <Button
            onClick={() => router.push('/')}
            className="bg-gray-600 text-white hover:bg-gray-700"
          >
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  // User is admin, render children
  return <>{children}</>;
};

export default AdminGuard;

