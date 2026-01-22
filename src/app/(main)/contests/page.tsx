import { Metadata } from 'next';

import ContestList from '@/components/contest/ContestList';
import Footer from '@/components/layouts/Footer';
import NavBar from '@/components/layouts/NavBar';

export const metadata: Metadata = {
  title: 'Contests',
};

export default function ContestsPage() {
  return (
    <>
      <div className="layout-padding">
        <NavBar />
        <div className="flex min-h-screen gap-8 py-4">
          <ContestList />
        </div>
        <Footer />
      </div>
    </>
  );
}
