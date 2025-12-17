import AdminGuard from '@/components/guards/AdminGuard';
import Footer from '@/components/layouts/Footer';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminGuard>
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </AdminGuard>
  );
}

