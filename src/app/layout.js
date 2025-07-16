"use client";
import Header from '@/components/Header';
import LogoLoader from '../components/LogoLoader';
import '../styles/globals.css';
import { AuthProvider } from './contexts/AuthContext';
import Script from 'next/script';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  // Get the current path
  const pathname = usePathname();
  
  // Check if the current path is the franchise page
  const isFranchisePage = pathname === '/franchise/franchise-opportunities';

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-KLC9RHXW');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KLC9RHXW"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
      
        <AuthProvider>
          <LogoLoader />
          {!isFranchisePage && <Header />}
          {children}
          {!isFranchisePage && <Footer />}  
        </AuthProvider>
      </body>
    </html>
  );
}