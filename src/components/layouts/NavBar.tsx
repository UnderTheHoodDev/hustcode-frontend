'use client';

import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { userInfoAtom } from '@/atoms';
import UserAvatarDropdown from '@/components/layouts/UserAvatarDropdown';
import Logo from '@/icons/Logo';

const NavBar = () => {
  const navLinks = [
    { title: 'Problems', href: '/problems' },
    { title: 'Contests', href: '/contests' },
    { title: 'Discuss', href: '/#' },
  ];

  const pathName = usePathname();
  const userInfo = useAtomValue(userInfoAtom);

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
