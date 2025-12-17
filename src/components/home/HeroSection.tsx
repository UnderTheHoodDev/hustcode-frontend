'use client';

import Image from 'next/image';
import Link from 'next/link';

function HeroSection() {
  return (
    <div className="bg-[url('/images/gradient-background.webp')] bg-cover bg-center">
      <div className="xsm:pt-22 xsm:pt-20 flex pt-[70px] pb-14 sm:pt-24 sm:pb-20 md:pt-28">
        <div className="flex flex-1 flex-col items-center pt-5 md:items-baseline">
          <div className="xsm:text-4xl text-3xl leading-normal font-bold sm:text-[42px] lg:text-5xl">
            <span>Start your</span>
            <span className="bg-gradient-to-r from-sky-400 to-pink-400 bg-clip-text text-transparent">
              &nbsp;coding
            </span>
          </div>
          <span className="xsm:text-4xl mt-0 mb-6 text-3xl leading-normal font-bold sm:mb-8 sm:text-[42px] lg:text-5xl">
            journey today
          </span>
          <p className="text-neutral-content xsm:w-3/4 mb-8 w-full text-center text-sm leading-relaxed sm:mb-14 sm:text-base md:text-left">
            HUSTCODE is the best platform to help you sharpen your
            problem-solving skills for coding interviews and build a strong
            foundation for your software development career.
          </p>
          <div className="flex w-full items-center justify-center md:block">
            <Link href="/auth/sign-up" className="landing-button">
              Create account
            </Link>
          </div>
        </div>
        <div className="hidden lg:block">
          <Image
            src="/images/HeroImage.webp"
            width={390}
            height={390}
            alt="Hero Image"
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
