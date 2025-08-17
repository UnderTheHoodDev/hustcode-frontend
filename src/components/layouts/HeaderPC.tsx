'use client';

import { useAtomValue } from 'jotai';
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
      {userInfo.id && <UserAvatarDropdown />}
    </div>
  );
};

export default HeaderPC;
