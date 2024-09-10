'use client';

import React from 'react';

import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';

type Props = {
  children: React.ReactNode;
};

function DefaultLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default DefaultLayout;
