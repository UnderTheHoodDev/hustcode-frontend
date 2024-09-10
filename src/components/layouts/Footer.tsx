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
    <footer className="flex items-center py-6 layout-padding">
      <span> Copyright © 2024 HUSTCODER</span>
      <div className="flex flex-1 justify-end items-center gap-2 flex-wrap text-sm">
        {footerLinks.map((element, index) => (
          <Fragment key={element.label}>
            <Link href={element.link}> {element.label} </Link>
            <div className="w-[1.5px] h-[16px] bg-white" />
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
