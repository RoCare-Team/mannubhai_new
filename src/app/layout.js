import Header from '../components/Header';
import Footer from '../components/Footer';
import LogoLoader from '../components/LogoLoader';
import '../styles/globals.css';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleTagManager, GoogleTagManagerNoScript } from './../components/GoogleTagManage';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <head>
        <GoogleTagManager />
      </head>
      <body>
      <GoogleTagManagerNoScript />
        {children}
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