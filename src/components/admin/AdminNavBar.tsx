'use client';

import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { Bell, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { userInfoAtom } from '@/atoms';
import UserAvatarDropdown from '@/components/layouts/UserAvatarDropdown';
import Logo from '@/icons/Logo';

const AdminNavBar = () => {
  const navLinks = [
    { title: 'Problems', href: '/admin/problems' },
    { title: 'Users', href: '/admin/users' },
    { title: 'Contests', href: '/admin/contests' },
  ];

  const pathName = usePathname();
  const userInfo = useAtomValue(userInfoAtom);

  return (
    <div className="flex items-center">
      <div className="flex flex-1 items-center gap-6 py-2">
        <Link href="/admin" className="mr-4 flex items-center gap-2">
          {Logo}
          <span className="flex items-center gap-1 rounded-md bg-cyan-500/20 px-2 py-0.5 text-xs font-medium text-cyan-400">
            <Shield className="h-3 w-3" />
            Admin
          </span>
        </Link>
        {navLinks.map((link) => {
          const isActive = pathName.includes(link.href);
          return (
            <Link
              key={link.title}
              href={link.href}
              className={clsx(
                isActive && 'text-[#F472B6]',
                'px-4 py-4 hover:text-[#F472B6]'
              )}
            >
              {link.title}
            </Link>
          );
        })}
      </div>
      {userInfo.id && (
        <div className="flex items-center gap-4">
          <Bell />
          <UserAvatarDropdown />
        </div>
      )}
    </div>
  );
};

export default AdminNavBar;

