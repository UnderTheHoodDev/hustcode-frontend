'use client';

import { useAtomValue } from 'jotai';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

import { userInfoAtom } from '@/atoms';
import UserAvatarAccordion from '@/components/layouts/UserAvatarAccordion';
import { HEADER_LINKS } from '@/config/layout';
import Logo from '@/icons/Logo';

const HeaderSP = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const userInfo = useAtomValue(userInfoAtom);

  const isAdmin = userInfo.role === 'ADMIN';

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const visibleLinks = userInfo.id
    ? HEADER_LINKS.filter((link) => link.label !== 'Sign in')
    : HEADER_LINKS;

  const handleClickOutside = (event: MouseEvent) => {
    if (
      drawerRef.current &&
      !drawerRef.current.contains(event.target as Node)
    ) {
      setIsDrawerOpen(false);
    }
  };

  useLayoutEffect(() => {
    if (isDrawerOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    } else {
      window.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDrawerOpen]);

  return (
    <>
      <div className="flex items-center md:hidden">
        <div onClick={toggleDrawer} className="cursor-pointer text-xl">
          <AiOutlineMenu className="xsm:h-8 xsm:w-8 h-7 w-7" />
        </div>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-10 bg-black/50 backdrop-blur-md" />
      )}

      <div
        ref={drawerRef}
        className={`bg-background xsm:w-80 xsm:px-6 fixed top-0 left-0 z-20 h-full w-[272px] transform overflow-auto px-4 sm:w-96 ${
          isDrawerOpen
            ? 'translate-x-0'
            : 'xsm:-translate-x-80 -translate-x-[272px] sm:-translate-x-96'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between py-6">
          {Logo}
          <div onClick={toggleDrawer} className="cursor-pointer">
            <AiOutlineClose className="xsm:h-8 xsm:w-8 h-7 w-7" />
          </div>
        </div>
        <nav className="mt-4 flex flex-col gap-8">
          {visibleLinks.map((element) => (
            <Link
              href={element.link}
              key={element.label}
              className="text-base text-sm hover:text-[#F472B6]"
              onClick={toggleDrawer}
            >
              {element.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin/problems"
              className="flex items-center gap-2 text-sm text-cyan-400/80 hover:text-cyan-400"
              onClick={toggleDrawer}
            >
              <Settings className="h-4 w-4" />
              Console
            </Link>
          )}
        </nav>
        {userInfo.id && (
          <>
            <div className="mt-6 mb-6 w-full border border-gray-700"></div>
            <UserAvatarAccordion />
          </>
        )}
      </div>
    </>
  );
};

export default HeaderSP;
