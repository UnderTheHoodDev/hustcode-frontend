'use client';

import Link from 'next/link';

import HeaderPC from '@/components/layouts/HeaderPC';
import HeaderSP from '@/components/layouts/HeaderSP';
import Logo from '@/icons/Logo';
import useUserMeQuery from '@/lib/api/user/queries/use-me';

const Header = () => {
  useUserMeQuery();

  return (
    <header className="layout-padding absolute z-10 flex w-full items-center py-5">
      <HeaderSP />

      <Link
        href="/"
        className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center gap-2 text-xl font-semibold md:static md:translate-x-0 md:translate-y-0 md:gap-4"
      >
        {Logo}
        <span className="xsm:text-base text-sm sm:text-[17px] md:text-[18px]">
          HUSTCODE
        </span>
      </Link>

      <HeaderPC />
    </header>
  );
};

export default Header;
