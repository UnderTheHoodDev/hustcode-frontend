import { Metadata } from 'next';

import BrowserIDE from '@/components/home/BrowserIDE';
import HeroSection from '@/components/home/HeroSection';
import MadeWithLove from '@/components/home/MadeWithLove';
import ProgrammingLanguages from '@/components/home/ProgrammingLanguages';

export const metadata: Metadata = {
  title: 'Home | HUSTCODE',
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="layout-padding">
        <ProgrammingLanguages />
        <BrowserIDE />
        <MadeWithLove />
      </div>
    </>
  );
}
