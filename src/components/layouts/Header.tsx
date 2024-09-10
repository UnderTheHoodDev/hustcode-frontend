import Link from 'next/link';

import Logo from '@/icons/Logo';

const headerLinks = [
  {
    label: 'Explore',
    link: '/#',
  },
  {
    label: 'Blog',
    link: '/#',
  },
  {
    label: 'Community',
    link: '/#',
  },
  {
    label: 'Sign in',
    link: '/#',
  },
];

function Header() {
  return (
    <header className="flex z-10 py-5 absolute w-full layout-padding">
      <Link href="/" className="flex items-center gap-4 text-xl font-semibold">
        {Logo} HUSTCODE
      </Link>
      <div className="flex flex-1 justify-end gap-10 text-[15px]">
        {headerLinks.map((element) => (
          <Link
            href={element.link}
            key={element.label}
            className="flex justify-center items-center hover:text-[#F472B6]"
          >
            {element.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

export default Header;
