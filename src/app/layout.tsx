import '@/app/global.css';
import '@/styles/global.scss';

import NextTopLoader from 'nextjs-toploader';

import { poppins } from '@/app/fonts';
import Providers from '@/app/providers';
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
      <body className="text-base-content bg-background graph-paper-background flex min-h-screen flex-col">
        <Providers>
          <NextTopLoader showSpinner={false} />
          {children}
        </Providers>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
