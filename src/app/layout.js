
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LogoLoader from '../components/LogoLoader';
import '../styles/globals.css';
import { AuthProvider } from './contexts/AuthContext';
import Head from './about/head';

const GoogleTagManager = () => {
  return (
    <Script id="gtm-script" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-KLC9RHXW');
      `}
    </Script>
  )
}

const GoogleTagManagerNoScript = () => {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=GTM-KLC9RHXW`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">  
   <Head>
       <GoogleTagManager />
   </Head>
 
      <body>
           <GoogleTagManagerNoScript />
           <AuthProvider>
          <LogoLoader />
        <Header />
        {children}
        <Footer />
           </AuthProvider>
     
      </body>
    </html>
  );
}