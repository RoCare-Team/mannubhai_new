import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import HeroSection from './_components/Home/HeroSection';
import { homePageMetadata } from './pageMetadata';
export const metadata = homePageMetadata;
const ServiceGroup = dynamic(() => import('./_components/Home/ServiceGroup'));
const SecondaryGroup = dynamic(() => import('./_components/Home/SecondaryGroup'));
export default function Page() {
  return (
    <main>
      <HeroSection />
      <ServiceGroup />
      <Suspense fallback={<div className="min-h-[800px] bg-gray-100 animate-pulse" />}>
       <SecondaryGroup />
     </Suspense>
    </main>
  );
}
