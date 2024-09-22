import React from 'react';

import BrowserIDE from '@/components/home/BrowserIDE';
import HeroSection from '@/components/home/HeroSection';
import MadeWithLove from '@/components/home/MadeWithLove';
import ProgrammingLanguages from '@/components/home/ProgrammingLanguages';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProgrammingLanguages />
      <BrowserIDE />
      <MadeWithLove />
    </>
  );
}
