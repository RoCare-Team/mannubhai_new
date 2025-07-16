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

import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  },
  icons: {
    icon: 'favicon/MB Favicon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'IaTaWIzhmYLa4xubMA-U595_5CX8O-zVfP_Y69z2Wss',
    other: {
      'ahrefs-site-verification': '483dfd13bd02e15036ba68fb4b8adc6ab44c031dbdfc6e9de0c36ea01ea99eab',
    },
  },
};


export default function Page() {
  return (
    <>
      <Header />
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
         <Footer />
    </>
  );
}