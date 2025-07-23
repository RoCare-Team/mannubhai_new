'use client';
import React, { useState, useRef, useCallback, memo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Enhanced LoadingPlaceholder with accessibility
const LoadingPlaceholder = ({ className = "", ariaLabel = "Loading..." }) => (
  <div 
    className={`bg-gray-100 animate-pulse rounded-lg ${className}`}
    aria-label={ariaLabel}
    role="status"
    aria-live="polite"
    aria-busy="true"
  />
);

// Dynamically loaded components with optimized loading states and accessibility
const DynamicComponents = {
  AboutMannuBhaiExpert: dynamic(() => import("./AboutMannuBhaiExpert"), {
    loading: () => <LoadingPlaceholder className="h-64" ariaLabel="Loading expert information" />
  }),
  HeroSection: dynamic(() => import("@/app/_components/Home/HeroSection"), {
    loading: () => <LoadingPlaceholder className="h-96 w-full" ariaLabel="Loading hero section" />,
    ssr: false
  }),
  Appliances: dynamic(() => import("@/app/_components/Home/Appliances"), {
    loading: () => <LoadingPlaceholder className="h-64" ariaLabel="Loading appliances services" />
  }),
  HandymanServices: dynamic(() => import("@/app/_components/Home/HandymanServices"), {
    loading: () => <LoadingPlaceholder className="h-64" ariaLabel="Loading handyman services" />
  }),
  BeautyCare: dynamic(() => import("@/app/_components/Home/BeautyCare"), {
    loading: () => <LoadingPlaceholder className="h-64" ariaLabel="Loading beauty care services" />
  }),
  HomecareServcies: dynamic(() => import('@/app/_components/Home/HomecareServcies'), {
    loading: () => <LoadingPlaceholder className="h-64" ariaLabel="Loading homecare services" />
  }),
  BrandsWeRepair: dynamic(() => import('@/components/BrandsWeRepair'), {
    loading: () => <LoadingPlaceholder className="h-64" ariaLabel="Loading brands we repair" />
  }),
  Services: dynamic(() => import('@/app/_components/Home/Services'), {
    loading: () => <LoadingPlaceholder className="h-64" ariaLabel="Loading services" />
  }),
  PopularCities: dynamic(() => import("@/app/_components/Home/PopularCities"), {
    loading: () => <LoadingPlaceholder className="h-64" ariaLabel="Loading popular cities" />
  }),
  ClientReviews: dynamic(() => import("@/app/_components/Home/ClientReviews"), {
    loading: () => <LoadingPlaceholder className="h-64" ariaLabel="Loading client reviews" />
  }),
  FooterLinks: dynamic(() => import("@/app/_components/Home/FooterLinks"), {
    loading: () => <LoadingPlaceholder className="h-64" ariaLabel="Loading footer links" />
  }),
  AppDownloadCard: dynamic(() => import('@/app/_components/Home/AppDownloadCard'), {
    loading: () => <LoadingPlaceholder className="h-64" ariaLabel="Loading app download card" />
  }),
};

// Enhanced ServiceWrapper with error boundary and proper semantic structure
const ServiceWrapper = memo(({ children, categoryUrl, cityUrl, onServiceClick, className }) => {
  const ChildComponent = DynamicComponents[children.type.name] || children.type;
  
  return (
    <section 
      className={className}
      aria-labelledby={`${categoryUrl}-heading`}
    >
      <h2 id={`${categoryUrl}-heading`} className="sr-only">
        {categoryUrl.replace(/-/g, ' ')} services
      </h2>
      <React.Suspense fallback={<LoadingPlaceholder className="h-64" ariaLabel={`Loading ${categoryUrl.replace(/-/g, ' ')} services`} />}>
        <ChildComponent 
          {...children.props} 
          onServiceClick={onServiceClick} 
          cityUrl={cityUrl}
        />
      </React.Suspense>
    </section>
  );
});

ServiceWrapper.displayName = 'ServiceWrapper';

const CityDetails = ({ city }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef(null);

  // Clean up timeout on unmount
  useEffect(() => {
    const timeoutRef = navigationTimeoutRef.current;
    return () => {
      if (timeoutRef) clearTimeout(timeoutRef);
    };
  }, []);

  // Handle service navigation with loading state
  const handleServiceClick = useCallback((serviceUrl) => {
    setIsNavigating(true);
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 3000);
    
    router.push(`/${city.city_url}/${serviceUrl}`);
  }, [router, city?.city_url]);

  // Handle city selection with proper URL construction
  const handleSelectCity = useCallback((selectedCity) => {
    setIsNavigating(true);
    const segments = pathname.split('/').filter(Boolean);
    const newUrl = segments.length === 1 && segments[0] !== selectedCity.city_url
      ? `/${selectedCity.city_url}/${segments[0]}`
      : `/${selectedCity.city_url}`;
    
    router.push(newUrl);
  }, [pathname, router]);

  // Loading state
  if (!city) {
    return (
      <div className="w-full px-4 sm:px-6 py-8 md:py-12 text-center" aria-live="polite">
        <div className="animate-pulse flex flex-col items-center">
          <div className="bg-gray-200 rounded-full w-16 h-16 mb-4" aria-hidden="true" />
          <div className="h-4 bg-gray-200 rounded w-64 mb-2" aria-hidden="true" />
          <div className="h-4 bg-gray-200 rounded w-48" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{`${city.city_name} Services | MannuBhai`}</title>
        <meta 
          name="description" 
          content={`Find expert services in ${city.city_name} - appliances repair, beauty care, home services and more`} 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="robots" content="index, follow" />
        <link rel="preload" href="/hero-image.webp" as="image" type="image/webp" />
        <meta property="og:title" content={`${city.city_name} Services | MannuBhai`} />
        <meta property="og:description" content={`Find expert services in ${city.city_name}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* Navigation loading indicator */}
      {isNavigating && (
        <div 
          className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center"
          role="alert"
          aria-live="assertive"
          aria-label="Page navigation in progress"
        >
          <div 
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
            aria-hidden="true"
          />
          <span className="sr-only">Loading new page...</span>
        </div>
      )}

      <main className="w-full bg-white">
        <section 
          className="w-full mb-8 md:mb-12" 
          aria-label={`${city.city_name} services introduction`}
        >
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

            <section 
              className="w-full my-8 md:my-12"
              aria-label="Download our mobile app"
            >
              <DynamicComponents.AppDownloadCard />
            </section>

            <section 
              className="w-full my-8 md:my-12" 
              aria-labelledby="expert-heading"
            >
              <h2 id="expert-heading" className="text-2xl font-bold mb-6 text-center">
                About MannuBhai Expert Services in {city.city_name}
              </h2>
              <DynamicComponents.AboutMannuBhaiExpert />
            </section>

            <section 
              className="w-full my-8 md:my-12"
              aria-labelledby="reviews-heading"
            >
              <h2 id="reviews-heading" className="text-2xl font-bold mb-6 text-center">
                What Our Customers Say
              </h2>
              <DynamicComponents.ClientReviews />
            </section>

            <section 
              className="w-full my-8 md:my-12"
              aria-labelledby="cities-heading"
            >
              <h2 id="cities-heading" className="text-2xl font-bold mb-6 text-center">
                Services Available In These Cities
              </h2>
              <DynamicComponents.PopularCities onSelectCity={handleSelectCity} />
            </section>

            <section 
              className="w-full my-8 md:my-12"
              aria-labelledby="brands-heading"
            >
              <h2 id="brands-heading" className="text-2xl font-bold mb-6 text-center">
                Brands We Service
              </h2>
              <DynamicComponents.BrandsWeRepair />
            </section>

            <section 
              className="w-full my-8 md:my-12"
              aria-labelledby="all-services-heading"
            >
              <h2 id="all-services-heading" className="text-2xl font-bold mb-6 text-center">
                All Our Services
              </h2>
              <DynamicComponents.Services />
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default memo(CityDetails);