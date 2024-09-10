import Link from 'next/link';
import { FaHeart, FaStar } from 'react-icons/fa';
import { MdChevronRight } from 'react-icons/md';

import Community from '@/icons/Community';

function MadeWithLove() {
  return (
    <>
      <div className="flex flex-col items-center justify-center mb-28 layout-padding">
        <div className="mb-2">{Community}</div>
        <div className="flex text-xl font-medium gap-2 items-center text-[#FF4842] mb-6">
          Made with <FaHeart /> in HN
        </div>
        <p className="text-neutral_content text-center w-3/4 text-base mb-12">
          At HUSTCODER, our mission is to help you improve yourself and land
          your dream job. We have a sizable repository of interview resources
          for many companies. In the past few years, our students have landed
          jobs at top companies around the world.
        </p>
        <div className="flex gap-8">
          <Link href="/#" className="landing-button">
            Join our community
          </Link>
          <Link href="/#" className="flex items-center">
            <FaStar color="#FFC926" className="mr-[6px]" /> Star us on Github
            <MdChevronRight className="mt-[1px] ml-[2px]" />
          </Link>
        </div>
      </div>
    </>
  );
}

export default MadeWithLove;
