'use client';

import Link from 'next/link';
import { FaHeart, FaStar } from 'react-icons/fa';
import { MdChevronRight } from 'react-icons/md';

import Community from '@/icons/Community';

function MadeWithLove() {
  return (
    <>
      <div className="mb-10 flex flex-col items-center justify-center sm:mb-14 lg:mb-20">
        <div className="mb-2">{Community}</div>
        <div className="mb-4 flex items-center gap-2 text-[18px] font-medium text-[#FF4842] sm:text-xl">
          Made with <FaHeart /> in HN
        </div>
        <p className="text-neutral-content mb-6 w-full text-center text-sm sm:mb-10 sm:w-3/4 sm:text-base">
          At HUSTCODE, our mission is to help you improve yourself and land your
          dream job. We have a sizable repository of interview resources for
          many companies. In the past few years, our students have landed jobs
          at top companies around the world.
        </p>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
          <Link href="/#" className="landing-button">
            Join our community
          </Link>
          <Link href="/#" className="flex items-center text-sm sm:text-base">
            <FaStar color="#FFC926" className="mr-[6px] mb-[1px]" />
            <span>Star us on Github</span>
            <MdChevronRight className="ml-[2px]" />
          </Link>
        </div>
      </div>
    </>
  );
}

export default MadeWithLove;
