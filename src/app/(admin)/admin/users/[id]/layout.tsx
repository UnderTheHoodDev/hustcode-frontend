import { Metadata } from 'next';

import AdminNavBar from '@/components/admin/AdminNavBar';
import Footer from '@/components/layouts/Footer';

export const metadata: Metadata = {
  title: 'Admin - User Details',
};

export default function AdminUserDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="layout-padding">
        <AdminNavBar />
        <div className="flex gap-8 py-4">{children}</div>
        <Footer />
      </div>
    </>
  );
}
