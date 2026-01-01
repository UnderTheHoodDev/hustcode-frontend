import { Metadata } from 'next';

import AdminNavBar from '@/components/admin/AdminNavBar';
import AdminContestList from '@/components/admin/contest/AdminContestList';
import Footer from '@/components/layouts/Footer';

export const metadata: Metadata = {
  title: 'Admin - Contests',
};

export default function AdminContestsPage() {
  return (
    <>
      <div className="layout-padding">
        <AdminNavBar />
        <div className="flex gap-8 py-4">
          <AdminContestList />
        </div>
        <Footer />
      </div>
    </>
  );
}
