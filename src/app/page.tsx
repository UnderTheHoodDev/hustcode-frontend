import React from 'react';

import BrowserIDE from '@/app/components/Home/BrowserIDE';
import HeroSection from '@/app/components/Home/HeroSection';
import MadeWithLove from '@/app/components/Home/MadeWithLove';
import ProgrammingLanguages from '@/app/components/Home/ProgrammingLanguages';
import DefaultLayout from '@/components/layouts/DefaultLayout';

export default function Home() {
  return (
    <DefaultLayout>
      <HeroSection />
      <ProgrammingLanguages />
      <BrowserIDE />
      <MadeWithLove />
    </DefaultLayout>
  );
}
