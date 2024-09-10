import Image from 'next/image';
import Link from 'next/link';

function HeroSection() {
  return (
    <>
      <div className="layout-padding bg-cover bg-center bg-[url('/images/gradient-background.png')]">
        <div className="flex pt-28 pb-20">
          <div className="flex flex-col flex-1 pt-4">
            <p className="text-5xl font-bold leading-normal">
              Start your&nbsp;
              <span className="bg-gradient-to-r from-sky-400 to-pink-400 bg-clip-text text-transparent">
                coding
              </span>
            </p>
            <p className="text-5xl font-bold mb-10"> journey today </p>
            <p className="mb-14 w-2/3 md:w-full text-[18px] text-neutral_content leading-relaxed">
              Hustcoder is the best platform to help you sharpen your
              problem-solving skills for coding interviews, build a strong
              foundation for your software development career
            </p>
            <Link href="/#" className="landing-button">
              Create account
            </Link>
          </div>
          <Image
            src="/images/HeroImage.png"
            width={400}
            height={400}
            alt="Hero Image"
            objectFit="cover"
            loading="lazy"
          />
        </div>
      </div>
    </>
  );
}

export default HeroSection;
