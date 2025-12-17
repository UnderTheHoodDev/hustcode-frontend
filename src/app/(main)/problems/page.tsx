import { Metadata } from 'next';

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
        <div className="flex gap-8 py-4">
          <ProblemList />
        </div>
      </div>
    </>
  );
}
