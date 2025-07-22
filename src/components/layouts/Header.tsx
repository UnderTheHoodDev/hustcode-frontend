'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

import Logo from '@/icons/Logo';

const headerLinks = [
  { label: 'Explore', link: '/#' },
  { label: 'Blog', link: '/#' },
  { label: 'Community', link: '/#' },
  { label: 'Sign in', link: '/#' },
];

function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef(null); // Reference for the drawer

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      drawerRef.current &&
      !(drawerRef.current as any).contains(event.target)
    ) {
      setIsDrawerOpen(false);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) window.addEventListener('mousedown', handleClickOutside);
    else window.removeEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDrawerOpen]);

  return (
    <header className="layout-padding absolute z-10 flex w-full py-5">
      <div className="flex items-center md:hidden">
        <button onClick={toggleDrawer} className="text-xl">
          <AiOutlineMenu className="h-7 w-7 xsm:h-8 xsm:w-8" />
        </button>
      </div>
      <Link
        href="/"
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center gap-2 text-xl font-semibold md:static md:translate-x-0 md:translate-y-0 md:gap-4"
      >
        {Logo}
        <span className="text-sm xsm:text-base sm:text-[17px] md:text-[18px]">
          HUSTCODE
        </span>
      </Link>
      <div className="hidden flex-1 justify-end gap-10 text-base md:flex">
        {headerLinks.map((element) => (
          <Link
            href={element.link}
            key={element.label}
            className="flex items-center justify-center hover:text-[#F472B6]"
          >
            {element.label}
          </Link>
        ))}
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 backdrop-blur-md" />
      )}

      <div
        ref={drawerRef}
        className={`fixed left-0 top-0 z-20 h-full w-64 transform bg-background px-6 xsm:w-72 sm:w-80 ${
          isDrawerOpen
            ? 'translate-x-0'
            : '-translate-x-64 xsm:-translate-x-72 sm:-translate-x-80'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between py-6">
          {Logo}
          <button onClick={toggleDrawer}>
            <AiOutlineClose className="h-7 w-7 xsm:h-8 xsm:w-8" />
          </button>
        </div>
        <nav className="mt-4 flex flex-col gap-8">
          {headerLinks.map((element) => (
            <Link
              href={element.link}
              key={element.label}
              className="text-sm hover:text-[#F472B6] sm:text-base"
              onClick={toggleDrawer}
            >
              {element.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
