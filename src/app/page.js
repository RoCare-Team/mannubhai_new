import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import HeroSection from './_components/Home/HeroSection';
import ToastWrapper from '@/components/ToastWrapper';

// Lazy load the group components
const ServiceGroup = dynamic(() => import('./_components/Home/ServiceGroup'));
const SecondaryGroup = dynamic(() => import('./_components/Home/SecondaryGroup'));

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
    <main>
      {/* Critical content that loads immediately */}
      <HeroSection />
      
      {/* First group of services */}
      <ServiceGroup />
      
      {/* Secondary content with loading fallback */}
      <Suspense fallback={<div className="min-h-[800px] bg-gray-100 animate-pulse" />}>
        <SecondaryGroup />
      </Suspense>
      <ToastWrapper />
    </main>
  );
}