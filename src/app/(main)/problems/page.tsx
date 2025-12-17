import { Metadata } from 'next';

import Footer from '@/components/layouts/Footer';
import NavBar from '@/components/layouts/NavBar';
import ProblemList from '@/components/problem/ProblemList';

export const metadata: Metadata = {
  title: 'Problems',
};

export default function ProblemsPage() {
  return (
    <>
      <div className="layout-padding">
        <NavBar />
        <div className="flex min-h-screen gap-8 py-4">
          <ProblemList />
        </div>
        <Footer />
      </div>
    </>
  );
}
