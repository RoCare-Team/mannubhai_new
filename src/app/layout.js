'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import '../styles/globals.css';
import { SEOAndTrackingScripts } from './SEOAndTrackingScripts';
import { Metadata } from 'next';

const HIDDEN_LAYOUT_PATHS = new Set([
  '/franchise/franchise-opportunities',
]);

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const shouldHideLayout = HIDDEN_LAYOUT_PATHS.has(pathname);

  return (
    <html lang="en">
      <head>
        <SEOAndTrackingScripts />

        {/* Preconnect Hints - improve performance for external fonts or APIs */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

        {/* Author and Publisher Meta Tags */}
        <meta name="author" content="Mannubhai Service Expert" />
        <meta name="publisher" content="Mannubhai Service Expert" />

        {/* Additional SEO Meta Tags */}
        <meta name="copyright" content="© Mannubhai Service Expert" />
        <meta name="creator" content="Mannubhai Services Expert" />

        {/* Open Graph Meta Tags for Social Media */}
        <meta property="og:site_name" content="Mannubhai Services Expert" />
        <meta property="article:author" content="Mannubhai Services Expert" />
        <meta property="article:publisher" content="Mannubhai Services Expert" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:creator" content="@mannubhaiservices" />
        <meta name="twitter:site" content="@mannubhaiservices" />

        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/MB Favicon.png" />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          {!shouldHideLayout && <Header />}
          <main className="flex-1">{children}</main>
          {!shouldHideLayout && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
