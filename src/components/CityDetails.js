'use client';

import React, { useState, useRef, useCallback, memo, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Cache for city data to prevent redundant fetches
const cityDataCache = new Map();

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

// Optimized dynamic imports with proper error handling and prefetching
const createDynamicComponent = (loader, componentName, options = {}) => {
  if (typeof window !== 'undefined') {
    loader().then(mod => {
      if (mod.default) {
        cityDataCache.set(componentName, mod.default);
      }
    }).catch(() => {});
  }

  return dynamic(() => {
    // Check cache first
    if (cityDataCache.has(componentName)) {
      return Promise.resolve({ default: cityDataCache.get(componentName) });
    }

    return loader()
      .then(mod => {
        if (!mod.default) {
          console.error(`${componentName} component export is invalid`);
          return () => <div className="text-red-500 p-4">Component failed to load</div>;
        }
        cityDataCache.set(componentName, mod.default);
        return mod;
      })
      .catch(error => {
        console.error(`Error loading ${componentName}:`, error);
        return () => <div className="text-red-500 p-4">Error loading component</div>;
      });
  }, {
    loading: () => <LoadingPlaceholder className="h-64" ariaLabel={`Loading ${componentName}`} />,
    ...options
  });
};

// Move DynamicComponents inside the component or make it a regular object
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

const ServiceWrapper = memo(({ children, categoryUrl, cityUrl, onServiceClick, className }) => {
  const [hasError, setHasError] = useState(false);
  
  const ChildComponent = useMemo(() => {
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

const ComingSoonSection = ({ title, cityName }) => (
  <section className="py-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm overflow-hidden relative">
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-blue-100 opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-purple-100 opacity-20 animate-pulse"></div>
    </div>
    
    {/* Content with animation */}
    <div className="relative z-10">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 animate-bounce animate-infinite animate-duration-[2000ms]">
        {title}
      </h2>
      <div className="flex items-center justify-center space-x-2 mb-6">
        <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
        <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse delay-100"></div>
        <div className="w-4 h-4 rounded-full bg-pink-500 animate-pulse delay-200"></div>
      </div>
      <p className="text-lg text-gray-600 mb-6">
        We're bringing {title.toLowerCase()} to {cityName} soon!
      </p>
      
      {/* Countdown/notification element */}
      <div className="inline-block px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        <div className="flex items-center space-x-2">
          <svg 
            className="w-6 h-6 text-blue-500 animate-pulse" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium text-gray-700">Coming Soon</span>
        </div>
      </div>
      
      {/* Animated progress bar */}
      <div className="mt-6 w-full max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-progress"
          style={{
            animation: 'progress 2s ease-in-out infinite alternate',
          }}
        ></div>
      </div>
    </div>
    
    {/* Add this to your global CSS or Tailwind config */}
    <style jsx global>{`
      @keyframes progress {
        0% { width: 0%; }
        100% { width: 100%; }
      }
    `}</style>
  </section>
);
const CityDetails = ({ city }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef(null);

  // Memoize services configuration
  const servicesConfig = useMemo(() => [
    {
      id: 'appliances',
      component: DynamicComponents.Appliances,
      show: true,
      title: 'Home Appliances'
    },
    {
      id: 'beauty-care',
      component: DynamicComponents.BeautyCare,
      show: city?.personal_care === 1,
      title: 'Beauty & Personal Care'
    },
    {
      id: 'homecare-services',
      component: DynamicComponents.HomecareServices,
      show: city?.home_care === 1,
      title: 'Home Care Services'
    },
    {
      id: 'handyman-services',
      component: DynamicComponents.HandymanServices,
      show: city?.handyman_services === 1,
      title: 'Handyman Services'
    }
  ], [city]);

  // Prefetch likely next pages
  useEffect(() => {
    if (city?.city_url) {
      const servicesToPrefetch = ['appliances', 'beauty-care', 'homecare-services', 'handyman-services'];
      servicesToPrefetch.forEach(service => {
        router.prefetch(`/${city.city_url}/${service}`);
      });
    }
  }, [city?.city_url, router]);

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  const handleServiceClick = useCallback((serviceUrl) => {
    if (!city?.city_url) return;
    setIsNavigating(true);
    navigationTimeoutRef.current = setTimeout(() => setIsNavigating(false), 3000);
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
            {servicesConfig.map(({ id, component: Component, show, title }) => (
              show ? (
                <ServiceWrapper 
                  key={id}
                  categoryUrl={id}
                  cityUrl={city.city_url}
                  onServiceClick={handleServiceClick}
                >
                  <Component />
                </ServiceWrapper>
              ) : (
                <ComingSoonSection key={id} title={title} cityName={city.city_name} />
              )
            ))}

            {/* Rest of your sections remain the same */}
            <section aria-label="Download our mobile app">
              <DynamicComponents.AppDownloadCard />
            </section>
            
            {/* ... other sections ... */}
          </div>
        </div>
      </main>
    </>
  );
};

CityDetails.displayName = 'CityDetails';
export default memo(CityDetails);
export const fetchCache = 'force-cache';