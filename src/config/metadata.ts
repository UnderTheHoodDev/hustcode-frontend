import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: {
    default: 'HUSTCODE - HUST Coding Platform',
    template: '%s | HUSTCODE',
  },
  description:
    'HUSTCODE is the best platform to help you sharpen your problem-solving skills for coding interviews and build a strong foundation for your software development career.',
  keywords: [
    'programming',
    'coding',
    'learn to code',
    'online coding',
    'competitive programming',
    'interactive learning',
  ],
  authors: [{ name: 'Under The Hood Team' }],
  creator: 'Under The Hood Team',
  publisher: 'HUSTCODE',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hustcode.app',
    siteName: 'HUSTCODE',
    title: 'HUSTCODE - HUST Coding Platform',
    description:
      'HUSTCODE is the best platform to help you sharpen your problem-solving skills for coding interviews and build a strong foundation for your software development career.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: '',
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'HUSTCODE - HUST Coding Platform',
    description:
      'HUSTCODE is the best platform to help you sharpen your problem-solving skills for coding interviews and build a strong foundation for your software development career.',
    images: ['/images/og-image.png'],
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

  // Additional metadata
  metadataBase: new URL('https://hustcode.app'),
};
