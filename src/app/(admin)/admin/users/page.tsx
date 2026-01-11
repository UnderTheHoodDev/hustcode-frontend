import { Metadata } from 'next';

import AdminNavBar from '@/components/admin/AdminNavBar';
import AdminUserList from '@/components/admin/user/AdminUserList';
import Footer from '@/components/layouts/Footer';

export const metadata: Metadata = {
  title: 'Admin - Users',
};

export default function AdminUsersPage() {
  return (
    <>
      <div className="layout-padding">
        <AdminNavBar />
        <div className="flex gap-8 py-4">
          <AdminUserList />
        </div>
        <Footer />
      </div>
    </>
  );
}
