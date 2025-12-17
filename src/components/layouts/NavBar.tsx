'use client';

import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { Bell, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { userInfoAtom } from '@/atoms';
import UserAvatarDropdown from '@/components/layouts/UserAvatarDropdown';
import Logo from '@/icons/Logo';

const NavBar = () => {
  const pathName = usePathname();
  const userInfo = useAtomValue(userInfoAtom);

  const isAdmin = userInfo.role === 'ADMIN';

  const navLinks = [
    { title: 'Problems', href: '/problems' },
    { title: 'Contests', href: '/contests' },
    { title: 'Discuss', href: '/#' },
  ];

  return (
    <div className="flex items-center">
      <div className="flex flex-1 items-center gap-6 py-2">
        <Link href="/" className="mr-4">
          {Logo}
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
        {isAdmin && (
          <Link
            href="/admin/problems"
            className={clsx(
              pathName.includes('/admin') && 'text-cyan-400',
              'flex items-center gap-2 px-4 py-4 text-cyan-400/80 hover:text-cyan-400'
            )}
          >
            <Settings className="h-4 w-4" />
            Console
          </Link>
        )}
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

export default NavBar;
