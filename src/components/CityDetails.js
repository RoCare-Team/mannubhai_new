"use client";
import React, { useState, useRef, useCallback, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Lazy load all non-critical components
const AboutMannuBhaiExpert = dynamic(() => import("./AboutMannuBhaiExpert"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});
const HeroSection = dynamic(() => import("@/app/_components/Home/HeroSection"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse w-full" />
});
const Appliances = dynamic(() => import("@/app/_components/Home/Appliances"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});
const HandymanServices = dynamic(() => import("@/app/_components/Home/HandymanServices"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});
const BeautyCare = dynamic(() => import("@/app/_components/Home/BeautyCare"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});
const HomecareServcies = dynamic(() => import('@/app/_components/Home/HomecareServcies'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});
const BrandsWeRepair = dynamic(() => import('@/components/BrandsWeRepair'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});
const Services = dynamic(() => import('@/app/_components/Home/Services'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});
const PopularCities = dynamic(() => import("@/app/_components/Home/PopularCities"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});
const ClientReviews = dynamic(() => import("@/app/_components/Home/ClientReviews"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});
const FooterLinks = dynamic(() => import("@/app/_components/Home/FooterLinks"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});
const AppDownloadCard = dynamic(() => import('@/app/_components/Home/AppDownloadCard'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});
const FloatingContactButtons = dynamic(() => import('@/components/FloatingContactButtons'), {
  ssr: false
});


// Delay loading ToastContainer until after hydration
const ToastContainer = dynamic(
  () => import('react-toastify').then((c) => {
    import('react-toastify/dist/ReactToastify.css');
    return c.ToastContainer;
  }),
  {
    ssr: false,
    loading: () => null
  }
);

const CityDetails = ({ city }) => {
  const [showCitySearch, setShowCitySearch] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [selectedService, setSelectedService] = useState(null);
  const serviceRefs = useRef({});
  const [isNavigating, setIsNavigating] = useState(false);

  const ServiceWrapper = memo(({ children, categoryUrl, className = "" }) => {
    const handleClick = useCallback((serviceUrl) => {
      setIsNavigating(true);
      router.push(`/${city.city_url}/${serviceUrl}`);
    }, [router, city?.city_url]);

    return React.cloneElement(children, {
      onServiceClick: handleClick,
      cityUrl: city?.city_url,
      className
    });
  });

  const handleSelectCity = useCallback((selectedCity) => {
    setIsNavigating(true);
    const segments = pathname.split('/').filter(Boolean);
    
    if (segments.length === 1) {
      window.location.href = `/${selectedCity.city_url}`;
    } else if (segments.length === 1 && segments[0] === selectedCity.city_url) {
      setShowCitySearch(false);
    } else if (segments.length === 2) {
      window.location.href = `/${selectedCity.city_url}/${segments[1]}`;
    }
  }, [pathname]);

  if (!city) {
    return (
      <div className="w-full px-4 sm:px-6 py-8 md:py-12 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="bg-gray-200 rounded-full w-16 h-16 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <>
   
      <Head>
        <title>{`${city.city_name} Services | MannuBhai`}</title>
        <meta name="description" content={`Find expert services in ${city.city_name} - appliances repair, beauty care, home services and more`} />
        <link rel="preload" href="/hero-image.webp" as="image" />
      </Head>
      {isNavigating && (
        <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <main className="w-full bg-white">
        <section className="w-full mb-8 md:mb-12">
          <HeroSection />
        </section>

        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mx-auto">
          <div className="space-y-12 md:space-y-16 lg:space-y-20 w-full">
            <ServiceWrapper categoryUrl="appliances">
              <Appliances />
            </ServiceWrapper>

            <ServiceWrapper categoryUrl="beauty-care">
              <BeautyCare />
            </ServiceWrapper>

            <ServiceWrapper categoryUrl="homecare-services">
              <HomecareServcies />
            </ServiceWrapper>

            <ServiceWrapper categoryUrl="handyman-services" className="mb-0">
              <HandymanServices />
            </ServiceWrapper>

            <section className="w-full my-8 md:my-12">
              <AppDownloadCard />
            </section>

            <section className="w-full my-8 md:my-12" aria-labelledby="expert-heading">
              <h2 id="expert-heading" className="sr-only">
                About MannuBhai Expert Services in {city.city_name}
              </h2>
              <AboutMannuBhaiExpert />
            </section>

            <section className="w-full my-8 md:my-12">
              <ClientReviews />
            </section>

            <section className="w-full my-8 md:my-12">
              <PopularCities />
            </section>

            <section className="w-full my-8 md:my-12">
              <BrandsWeRepair />
            </section>

            <section className="w-full my-8 md:my-12">
              <Services />
            </section>
          </div>
        </div>

        <section className="w-full mt-12 md:mt-16">
          <FooterLinks />
        </section>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName="!rounded-lg !shadow-md !w-fit !min-w-[200px] !max-w-[80vw] !px-4 !py-2 !text-sm !text-gray-800 !bg-white"
          bodyClassName="!text-sm"
        />
      </main>
      <FloatingContactButtons />
    
    </>
  );
};

export default memo(CityDetails);