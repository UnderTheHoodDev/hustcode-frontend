'use client';

import Link from 'next/link';
import { Fragment } from 'react';

import { FOOTER_LINKS } from '@/config/layout';
import VN from '@/icons/VN';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center py-6 lg:flex-row">
      <span className="text-sm sm:text-base"> Copyright © 2024 HUSTCODE</span>
      <div className="mt-3 flex flex-1 flex-wrap items-center justify-center gap-2 text-[12px] sm:text-sm lg:mt-0 lg:justify-end">
        {FOOTER_LINKS.map((element, index) => (
          <Fragment key={element.label}>
            <Link href={element.link} className="hover:text-[#F472B6]">
              {element.label}
            </Link>
            <div className="h-[16px] w-[1.5px] bg-white" />
            {index === FOOTER_LINKS.length - 1 && (
              <div className="flex items-center gap-1">
                {VN}
                Vietnam
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
