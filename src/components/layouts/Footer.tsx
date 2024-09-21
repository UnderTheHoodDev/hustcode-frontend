import Link from 'next/link';
import { Fragment } from 'react';

import VN from '@/icons/VN';

const footerLinks = [
  {
    label: 'Help center',
    link: '/#',
  },
  {
    label: 'Students',
    link: '/#',
  },
  {
    label: 'Terms',
    link: '/#',
  },
  {
    label: 'Private Policy',
    link: '/#',
  },
  {
    label: 'Jobs',
    link: '/#',
  },
];

function Footer() {
  return (
    <footer className="layout-padding flex flex-col items-center py-6 lg:flex-row">
      <span className="text-sm sm:text-base"> Copyright © 2024 HUSTCODER</span>
      <div className="mt-3 flex flex-1 flex-wrap items-center justify-center gap-2 text-[12px] sm:text-sm lg:mt-0 lg:justify-end">
        {footerLinks.map((element, index) => (
          <Fragment key={element.label}>
            <Link href={element.link} className="hover:text-[#F472B6]">
              {element.label}
            </Link>
            <div className="h-[16px] w-[1.5px] bg-white" />
            {index === footerLinks.length - 1 && (
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
}

export default Footer;
