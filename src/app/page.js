

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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ✅ App Router metadata
export const metadata = {
  title: {
    default: "Mannubhai - Get Expert Professional Services at Home",
    template: "%s | Mannubhai Services",
  },
      alternates: {
    canonical: "https://www.mannubhai.com", 
  },
  robots: {
    index: true,
    follow: true,
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
  metadataBase: new URL('https://www.mannubhai.com'),
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
        <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName="!rounded-lg !shadow-md !w-fit !min-w-[200px] !max-w-[80vw] !px-4 !py-2 !text-sm !text-gray-800 !bg-white"
        bodyClassName="!text-sm"
      />
      </main>
    </>
  );
}
