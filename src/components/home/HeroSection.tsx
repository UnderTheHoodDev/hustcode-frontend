import Image from 'next/image';
import Link from 'next/link';

function HeroSection() {
  return (
    <div className="layout-padding bg-[url('/images/gradient-background.png')] bg-cover bg-center">
      <div className="xsm:pt-22 flex pb-14 pt-[70px] xsm:pt-20 sm:pb-20 sm:pt-24 md:pt-28">
        <div className="flex flex-1 flex-col pt-4">
          <div className="text-3xl font-bold leading-normal xsm:text-4xl sm:text-[42px] lg:text-5xl">
            <span>Start your</span>
            <span className="bg-gradient-to-r from-sky-400 to-pink-400 bg-clip-text text-transparent">
              &nbsp;coding
            </span>
          </div>
          <span className="mb-6 mt-0 text-3xl font-bold leading-normal xsm:mt-3 xsm:text-4xl sm:mb-10 sm:text-[42px] lg:text-5xl">
            journey today
          </span>
          <p className="mb-8 w-full text-sm leading-relaxed text-neutral_content xsm:w-3/4 sm:mb-14 sm:w-2/3 sm:text-base">
            Hustcoder is the best platform to help you sharpen your
            problem-solving skills for coding interviews and build a strong
            foundation for your software development career.
          </p>
          <Link href="/#" className="landing-button">
            Create account
          </Link>
        </div>
        <div className="hidden lg:block">
          <Image
            src="/images/HeroImage.png"
            width={390}
            height={390}
            alt="Hero Image"
            objectFit="contain"
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
