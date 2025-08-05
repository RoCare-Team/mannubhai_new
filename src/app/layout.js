"use client";
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import '../styles/globals.css';
import { SEOAndTrackingScripts } from './SEOAndTrackingScripts';
const HIDDEN_LAYOUT_PATHS = new Set([
  '/franchise/franchise-opportunities',
]);
export default function RootLayout({ children }) {
  const pathname = usePathname();
  const shouldHideLayout = HIDDEN_LAYOUT_PATHS.has(pathname);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <SEOAndTrackingScripts />
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
