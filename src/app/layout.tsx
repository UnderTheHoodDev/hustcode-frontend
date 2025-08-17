import '@/styles/global.scss';

import NextTopLoader from 'nextjs-toploader';

import { poppins } from '@/app/fonts';
import '@/app/global.css';
import Providers from '@/app/providers';
import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';
import { Toaster } from '@/components/ui/sonner';
import { defaultMetadata } from '@/config/metadata';

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      </head>
      <body className="text-base-content bg-background graph-paper-background">
        <Providers>
          <NextTopLoader showSpinner={false} />
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
