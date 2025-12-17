import Footer from '@/components/layouts/Footer';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
