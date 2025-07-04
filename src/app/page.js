import Head from 'next/head';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeroSection from './_components/Home/HeroSection';
import Appliances from './_components/Home/Appliances';
import HandymanServices from './_components/Home/HandymanServices';
import BeautyCare from './_components/Home/BeautyCare';
import HomecareServcies from './_components/Home/HomecareServcies';
import AboutMannuBhai from '@/components/about';
import BrandsWeRepair from '@/components/BrandsWeRepair';
import Services from './_components/Home/Services';
import PopularCities from './_components/Home/PopularCities';
import ClientReviews from './_components/Home/ClientReviews';
import FooterLinks from './_components/Home/FooterLinks';
import { faL } from '@fortawesome/free-solid-svg-icons';
import AppDownloadCard from './_components/Home/AppDownloadCard';

// ✅ App Router metadata
export const metadata = {
  title: {
    default: "Mannubhai - Get Expert Professional Services at Home",
    template: "%s | Mannubhai Services",
  },
      alternates: {
    canonical: "https://mannubhai-new.vercel.app/", 
  },
  robots: {
    index: false,
    follow: false,
  },
  description:
    "Mannubhai is your one-stop destination for expert local services in India. Book trusted professionals for appliance repair, beauty services, home care, and more.",
  keywords: [
    "Mannubhai service",
    "Professional Services",
    "appliance repair",
    "beauty services",
    "home care",
    "handyman services",
  ],
  metadataBase: new URL('https://mannubhai-new.vercel.app/'),
  openGraph: {
    title: "Mannubhai - Professional Home Services",
    description: "Book trusted professionals for all your home service needs",
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon/MB-Favicon.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/favicon/MB-Favicon.png',
      },
      {
        rel: 'mask-icon',
        url: '/favicon/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function Page() {
  return (
    <>
      <main>
        <HeroSection />
        <Appliances />
        <BeautyCare />
        <HomecareServcies />
        <HandymanServices />
        <AppDownloadCard />
        <PopularCities />
        <AboutMannuBhai />
        <ClientReviews />
        <BrandsWeRepair />
        <Services />
        <FooterLinks />
        <ToastContainer />
      </main>
    </>
  );
}
