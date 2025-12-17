'use client';

import { useAtomValue } from 'jotai';
import { Settings } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { userInfoAtom } from '@/atoms';
import { HEADER_LINKS } from '@/config/layout';

const UserAvatarDropdown = dynamic(
  () => import('@/components/layouts/UserAvatarDropdown'),
  { ssr: false }
);

const HeaderPC = () => {
  const userInfo = useAtomValue(userInfoAtom);

  const isAdmin = userInfo.role === 'ADMIN';

  const visibleLinks = userInfo.id
    ? HEADER_LINKS.filter((link) => link.label !== 'Sign in')
    : HEADER_LINKS;

  return (
    <div className="hidden flex-1 justify-end gap-10 text-base md:flex">
      {visibleLinks.map((element) => (
        <Link
          href={element.link}
          key={element.label}
          className="flex items-center justify-center hover:text-[#F472B6]"
        >
          {element.label}
        </Link>
      ))}
      {isAdmin && (
        <Link
          href="/admin/problems"
          className="flex items-center gap-2 text-cyan-400/80 hover:text-cyan-400"
        >
          <Settings className="h-4 w-4" />
          Console
        </Link>
      )}
      {userInfo.id && <UserAvatarDropdown />}
    </div>
  );
};

export default HeaderPC;
