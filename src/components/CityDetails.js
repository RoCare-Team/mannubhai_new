'use client';

import React, { useState, useRef, useCallback, memo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Enhanced LoadingPlaceholder with better accessibility and animation
const LoadingPlaceholder = ({ className = "", ariaLabel = "Loading..." }) => (
  <div 
    className={`bg-gray-100 animate-pulse rounded-lg ${className}`}
    role="status"
    aria-label={ariaLabel}
    aria-live="polite"
    aria-busy="true"
  >
    <span className="sr-only">{ariaLabel}</span>
  </div>
);

// Optimized dynamic imports with proper error handling
const createDynamicComponent = (loader, componentName, options = {}) => {
  return dynamic(() => loader()
    .then(mod => {
      if (!mod.default) {
        console.error(`${componentName} component export is invalid`);
        return () => <div className="text-red-500 p-4">Component failed to load</div>;
      }
      return mod.default;
    })
    .catch(error => {
      console.error(`Error loading ${componentName}:`, error);
      return () => <div className="text-red-500 p-4">Error loading component</div>;
    }), 
    {
      loading: () => <LoadingPlaceholder className="h-64" ariaLabel={`Loading ${componentName}`} />,
      ...options
    }
  );
};

// Dynamically loaded components with proper error boundaries
const DynamicComponents = {
  AboutMannuBhaiExpert: createDynamicComponent(() => import("./AboutMannuBhaiExpert"), "AboutMannuBhaiExpert"),
  HeroSection: createDynamicComponent(() => import("@/app/_components/Home/HeroSection"), "HeroSection", { ssr: false }),
  Appliances: createDynamicComponent(() => import("@/app/_components/Home/Appliances"), "Appliances"),
  HandymanServices: createDynamicComponent(() => import("@/app/_components/Home/HandymanServices"), "HandymanServices"),
  BeautyCare: createDynamicComponent(() => import("@/app/_components/Home/BeautyCare"), "BeautyCare"),
  HomecareServices: createDynamicComponent(() => import('@/app/_components/Home/HomecareServcies'), "HomecareServices"),
  BrandsWeRepair: createDynamicComponent(() => import('@/components/BrandsWeRepair'), "BrandsWeRepair"),
  Services: createDynamicComponent(() => import('@/app/_components/Home/Services'), "Services"),
  PopularCities: createDynamicComponent(() => import("@/app/_components/Home/PopularCities"), "PopularCities"),
  ClientReviews: createDynamicComponent(() => import("@/app/_components/Home/ClientReviews"), "ClientReviews"),
  FooterLinks: createDynamicComponent(() => import("@/app/_components/Home/FooterLinks"), "FooterLinks"),
  AppDownloadCard: createDynamicComponent(() => import('@/app/_components/Home/AppDownloadCard'), "AppDownloadCard")
};

// Improved ServiceWrapper with better error handling
const ServiceWrapper = memo(({ children, categoryUrl, cityUrl, onServiceClick, className }) => {
  const [hasError, setHasError] = useState(false);
  
  const ChildComponent = React.useMemo(() => {
    try {
      return DynamicComponents[children.type.name] || children.type;
    } catch (error) {
      console.error('Error resolving component:', error);
      setHasError(true);
      return () => <div className="text-red-500 p-4">Component error</div>;
    }
  }, [children]);

  if (hasError) {
    return (
      <section className={className}>
        <div className="text-red-500 p-4">Failed to load component</div>
      </section>
    );
  }

  return (
    <section 
      className={className}
      aria-labelledby={`${categoryUrl}-heading`}
    >
      <h2 id={`${categoryUrl}-heading`} className="sr-only">
        {categoryUrl.replace(/-/g, ' ')} services in {cityUrl}
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

// Main CityDetails component with optimized performance
const CityDetails = ({ city }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef(null);

  // Clean up effects properly
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // Memoized handlers for better performance
  const handleServiceClick = useCallback((serviceUrl) => {
    if (!city?.city_url) return;
    
    setIsNavigating(true);
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 3000);
    
    router.push(`/${city.city_url}/${serviceUrl}`);
  }, [router, city?.city_url]);

  const handleSelectCity = useCallback((selectedCity) => {
    setIsNavigating(true);
    const segments = pathname.split('/').filter(Boolean);
    const newUrl = segments.length === 1 && segments[0] !== selectedCity.city_url
      ? `/${selectedCity.city_url}/${segments[0]}`
      : `/${selectedCity.city_url}`;
    
    router.push(newUrl);
  }, [pathname, router]);

  // Loading state with better accessibility
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

  // SEO-optimized metadata
  const pageTitle = `${city.city_name} Services | MannuBhai`;
  const pageDescription = `Find expert services in ${city.city_name} - appliances repair, beauty care, home services and more`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="robots" content="index, follow" />
        <link rel="preload" href="/hero-image.webp" as="image" type="image/webp" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="/logo.png" />
      </Head>

      {isNavigating && (
        <div 
          className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center"
          role="alert"
          aria-live="assertive"
        >
          <div 
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
            aria-hidden="true"
          />
          <span className="sr-only">Loading new page...</span>
        </div>
      )}

      <main className="w-full bg-white">
        <section className="w-full mb-8 md:mb-12" aria-label="Hero section">
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
              <DynamicComponents.HomecareServices />
            </ServiceWrapper>

            <ServiceWrapper 
              categoryUrl="handyman-services" 
              cityUrl={city.city_url}
              onServiceClick={handleServiceClick}
            >
              <DynamicComponents.HandymanServices />
            </ServiceWrapper>

            <section aria-label="Download our mobile app">
              <DynamicComponents.AppDownloadCard />
            </section>

            <section aria-labelledby="expert-heading">
              <h2 id="expert-heading" className="text-2xl font-bold mb-6 text-center">
                About MannuBhai Expert Services in {city.city_name}
              </h2>
              <DynamicComponents.AboutMannuBhaiExpert />
            </section>

            <section aria-labelledby="reviews-heading">
              <h2 id="reviews-heading" className="text-2xl font-bold mb-6 text-center">
                What Our Customers Say
              </h2>
              <DynamicComponents.ClientReviews />
            </section>

            <section aria-labelledby="cities-heading">
              <h2 id="cities-heading" className="text-2xl font-bold mb-6 text-center">
                Services Available In These Cities
              </h2>
              <DynamicComponents.PopularCities onSelectCity={handleSelectCity} />
            </section>

            <section aria-labelledby="brands-heading">
              <h2 id="brands-heading" className="text-2xl font-bold mb-6 text-center">
                Brands We Service
              </h2>
              <DynamicComponents.BrandsWeRepair />
            </section>

            <section aria-labelledby="all-services-heading">
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

CityDetails.displayName = 'CityDetails';
export default memo(CityDetails);