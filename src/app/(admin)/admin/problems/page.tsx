import { Metadata } from 'next';

import AdminNavBar from '@/components/admin/AdminNavBar';
import AdminProblemList from '@/components/admin/problem/AdminProblemList';

export const metadata: Metadata = {
  title: 'Admin - Problems',
};

export default function AdminProblemsPage() {
  return (
    <>
      <div className="layout-padding">
        <AdminNavBar />
        <div className="flex gap-8 py-4">
          <AdminProblemList />
        </div>
      </div>
    </>
  );
}

