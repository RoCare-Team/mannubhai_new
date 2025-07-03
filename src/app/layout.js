import Header from '../components/Header';
import Footer from '../components/Footer';
import LogoLoader from '../components/LogoLoader';
import '../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LogoLoader />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}