
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LogoLoader from '../components/LogoLoader';
import '../styles/globals.css';
import { AuthProvider } from './contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
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