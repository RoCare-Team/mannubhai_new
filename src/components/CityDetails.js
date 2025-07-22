'use client';
import React, { useState, useRef, useCallback, memo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Component loading states
const LoadingPlaceholder = ({ className = "" }) => (
  <div className={`bg-gray-100 animate-pulse rounded-lg ${className}`} />
);

// Dynamically loaded components with optimized loading states
const DynamicComponents = {
  AboutMannuBhaiExpert: dynamic(() => import("./AboutMannuBhaiExpert"), {
    loading: () => <LoadingPlaceholder className="h-64" />
  }),
  HeroSection: dynamic(() => import("@/app/_components/Home/HeroSection"), {
    loading: () => <LoadingPlaceholder className="h-96 w-full" />
  }),
  Appliances: dynamic(() => import("@/app/_components/Home/Appliances"), {
    loading: () => <LoadingPlaceholder className="h-64" />
  }),
  HandymanServices: dynamic(() => import("@/app/_components/Home/HandymanServices"), {
    loading: () => <LoadingPlaceholder className="h-64" />
  }),
  BeautyCare: dynamic(() => import("@/app/_components/Home/BeautyCare"), {
    loading: () => <LoadingPlaceholder className="h-64" />
  }),
  HomecareServcies: dynamic(() => import('@/app/_components/Home/HomecareServcies'), {
    loading: () => <LoadingPlaceholder className="h-64" />
  }),
  BrandsWeRepair: dynamic(() => import('@/components/BrandsWeRepair'), {
    loading: () => <LoadingPlaceholder className="h-64" />
  }),
  Services: dynamic(() => import('@/app/_components/Home/Services'), {
    loading: () => <LoadingPlaceholder className="h-64" />
  }),
  PopularCities: dynamic(() => import("@/app/_components/Home/PopularCities"), {
    loading: () => <LoadingPlaceholder className="h-64" />
  }),
  ClientReviews: dynamic(() => import("@/app/_components/Home/ClientReviews"), {
    loading: () => <LoadingPlaceholder className="h-64" />
  }),
  FooterLinks: dynamic(() => import("@/app/_components/Home/FooterLinks"), {
    loading: () => <LoadingPlaceholder className="h-64" />
  }),
  AppDownloadCard: dynamic(() => import('@/app/_components/Home/AppDownloadCard'), {
    loading: () => <LoadingPlaceholder className="h-64" />
  }),


};

// Memoized ServiceWrapper component to prevent unnecessary re-renders
const ServiceWrapper = memo(({ children, categoryUrl, cityUrl, onServiceClick, className }) => {
  const ChildComponent = DynamicComponents[children.type.name] || children.type;
  
  return (
    <ChildComponent 
      {...children.props} 
      onServiceClick={onServiceClick} 
      cityUrl={cityUrl}
      className={className}
    />
  );
});

const CityDetails = ({ city }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // Handle service navigation with loading state
  const handleServiceClick = useCallback((serviceUrl) => {
    setIsNavigating(true);
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 3000); // Fallback in case navigation fails
    
    router.push(`/${city.city_url}/${serviceUrl}`);
  }, [router, city?.city_url]);

  // Handle city selection with proper URL construction
  const handleSelectCity = useCallback((selectedCity) => {
    setIsNavigating(true);
    const segments = pathname.split('/').filter(Boolean);
    let newUrl = `/${selectedCity.city_url}`;
    
    if (segments.length === 1 && segments[0] !== selectedCity.city_url) {
      newUrl = `/${selectedCity.city_url}/${segments[0]}`;
    }
    
    window.location.href = newUrl;
  }, [pathname]);

  // Loading state
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

  // Main render
  return (
    <>
      <Head>
        <title>{`${city.city_name} Services | MannuBhai`}</title>
        <meta 
          name="description" 
          content={`Find expert services in ${city.city_name} - appliances repair, beauty care, home services and more`} 
        />
        <link rel="preload" href="/hero-image.webp" as="image" />
      </Head>

      {/* Navigation loading indicator */}
      {isNavigating && (
        <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <main className="w-full bg-white">
        <section className="w-full mb-8 md:mb-12">
          <DynamicComponents.HeroSection />
        </section>

        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mx-auto">
          <div className="space-y-12 md:space-y-16 lg:space-y-20 w-full">
            <ServiceWrapper 
              categoryUrl="appliances" 
              cityUrl={city.city_url}
              onServiceClick={handleServiceClick}
            >
              <DynamicComponents.Appliances />
            </ServiceWrapper>

            <ServiceWrapper 
              categoryUrl="beauty-care"
              cityUrl={city.city_url}
              onServiceClick={handleServiceClick}
            >
              <DynamicComponents.BeautyCare />
            </ServiceWrapper>

            <ServiceWrapper 
              categoryUrl="homecare-services"
              cityUrl={city.city_url}
              onServiceClick={handleServiceClick}
            >
              <DynamicComponents.HomecareServcies />
            </ServiceWrapper>

            <ServiceWrapper 
              categoryUrl="handyman-services" 
              cityUrl={city.city_url}
              onServiceClick={handleServiceClick}
              className="mb-0"
            >
              <DynamicComponents.HandymanServices />
            </ServiceWrapper>

            <section className="w-full my-8 md:my-12">
              <DynamicComponents.AppDownloadCard />
            </section>

            <section className="w-full my-8 md:my-12" aria-labelledby="expert-heading">
              <h2 id="expert-heading" className="sr-only">
                About MannuBhai Expert Services in {city.city_name}
              </h2>
              <DynamicComponents.AboutMannuBhaiExpert />
            </section>

            <section className="w-full my-8 md:my-12">
              <DynamicComponents.ClientReviews />
            </section>

            <section className="w-full my-8 md:my-12">
              <DynamicComponents.PopularCities onSelectCity={handleSelectCity} />
            </section>

            <section className="w-full my-8 md:my-12">
              <DynamicComponents.BrandsWeRepair />
            </section>

            <section className="w-full my-8 md:my-12">
              <DynamicComponents.Services />
            </section>
          </div>
        </div>

        <section className="w-full mt-12 md:mt-16">
          <DynamicComponents.FooterLinks />
        </section>

    </>
  );
};

export default memo(CityDetails);