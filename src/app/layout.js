"use client";
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import '../styles/globals.css';

// Lazy load the LogoLoader component
// const LogoLoader = dynamic(() => import('../components/LogoLoader'), {
//   ssr: false,
//   loading: () => null
// });

// Define paths where Header/Footer should be hidden
const HIDDEN_LAYOUT_PATHS = new Set([
  '/franchise/franchise-opportunities',
  // Add other paths here if needed
]);

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const shouldHideLayout = HIDDEN_LAYOUT_PATHS.has(pathname);
  return (
    <html lang="en">
      <head>
      <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: `{"@context":"https://schema.org","@type":"Organization","name":"Mannubhai Service Expert","url":"https://www.mannubhai.com/","logo":"https://www.mannubhai.com/logo.png","image":"https://www.mannubhai.com/logo.png","description":"Mannubhai Service Expert is a trusted home service company offering repair, maintenance, and installation services for home appliances, gadgets, water purifiers, beauty, and home care needs across India.","sameAs":["https://www.facebook.com/mannubhaiserviceexperts","https://www.instagram.com/mannubhaiserviceexperts/","https://www.linkedin.com/company/mannubhaiserviceexpert/","https://www.youtube.com/@mannubhaiserviceexpert"],"contactPoint":{"@type":"ContactPoint","telephone":"+91-7065012902","contactType":"Customer Service","areaServed":"IN","availableLanguage":["English","Hindi"]}}`
      }}
      />
        {/* Google Tag Manager - optimized loading */}
        <Script 
          id="gtm-script" 
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtm.js?id=GTM-KLC9RHXW`}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=GTM-KLC9RHXW`}
            height="0"
            width="0"
            className="hidden invisible"
          />
        </noscript>
        
        <AuthProvider>
          {!shouldHideLayout && <Header />}
          <main className="flex-1">
            {children}
          </main>
          {!shouldHideLayout && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}

// Optimized Script component
function Script({ src, strategy, id }) {
  return (
    <script
      id={id}
      strategy={strategy}
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        '${src}';f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${src.split('id=')[1]}');`
      }}
    />
  );
}