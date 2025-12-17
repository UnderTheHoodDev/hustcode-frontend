import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="layout-padding flex flex-1 flex-col">
        {children}
        <Footer />
      </main>
    </>
  );
}
