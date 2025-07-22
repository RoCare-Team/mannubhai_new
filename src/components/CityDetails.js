'use client';
import React, { useState, useRef, useCallback, memo, useEffect, useMemo, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Optimized loading placeholder with different sizes
const LoadingPlaceholder = memo(({ className = "", height = "h-64" }) => (
  <div className={`bg-gray-100 animate-pulse rounded-lg ${height} ${className}`} />
));
// Intersection Observer hook for lazy loading
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      { rootMargin: '100px', ...options }
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [hasIntersected, options]);

  return { targetRef, isIntersecting, hasIntersected };
};

// Lazy component wrapper with intersection observer
const LazySection = memo(({ children, fallback, className = "" }) => {
  const { targetRef, hasIntersected } = useIntersectionObserver();
  
  return (
    <div ref={targetRef} className={className}>
      {hasIntersected ? children : fallback}
    </div>
  );
});

// Critical components loaded immediately (above the fold)
const CriticalComponents = {
  HeroSection: dynamic(() => import("@/app/_components/Home/HeroSection"), {
    loading: () => <LoadingPlaceholder height="h-96" className="w-full" />
  }),
  AboutMannuBhaiExpert: dynamic(() => import("./AboutMannuBhaiExpert"), {
    loading: () => <LoadingPlaceholder />
  })
};

// Non-critical components with higher loading threshold
const LazyComponents = {
  Appliances: dynamic(() => import("@/app/_components/Home/Appliances"), {
    loading: () => <LoadingPlaceholder />
  }),
  HandymanServices: dynamic(() => import("@/app/_components/Home/HandymanServices"), {
    loading: () => <LoadingPlaceholder />
  }),
  BeautyCare: dynamic(() => import("@/app/_components/Home/BeautyCare"), {
    loading: () => <LoadingPlaceholder />
  }),
  HomecareServcies: dynamic(() => import('@/app/_components/Home/HomecareServcies'), {
    loading: () => <LoadingPlaceholder />
  }),
  BrandsWeRepair: dynamic(() => import('@/components/BrandsWeRepair'), {
    loading: () => <LoadingPlaceholder />
  }),
  Services: dynamic(() => import('@/app/_components/Home/Services'), {
    loading: () => <LoadingPlaceholder />
  }),
  PopularCities: dynamic(() => import("@/app/_components/Home/PopularCities"), {
    loading: () => <LoadingPlaceholder />
  }),
  ClientReviews: dynamic(() => import("@/app/_components/Home/ClientReviews"), {
    loading: () => <LoadingPlaceholder />
  }),
  FooterLinks: dynamic(() => import("@/app/_components/Home/FooterLinks"), {
    loading: () => <LoadingPlaceholder />
  }),
  AppDownloadCard: dynamic(() => import('@/app/_components/Home/AppDownloadCard'), {
    loading: () => <LoadingPlaceholder />
  })
};

// Optimized service wrapper with reduced re-renders
const ServiceWrapper = memo(({ 
  Component, 
  categoryUrl, 
  cityUrl, 
  onServiceClick, 
  className = "",
  ...props 
}) => {
  const memoizedProps = useMemo(() => ({
    ...props,
    onServiceClick,
    cityUrl,
    className
  }), [props, onServiceClick, cityUrl, className]);

  return <Component {...memoizedProps} />;
});

const CityDetails = ({ city }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef(null);

  // Memoize city URL to prevent unnecessary re-renders
  const cityUrl = useMemo(() => city?.city_url, [city?.city_url]);
  // Memoize meta data
  const metaData = useMemo(() => ({
    title: `${city?.city_name} Services | MannuBhai`,
    description: `Find expert services in ${city?.city_name} - appliances repair, beauty care, home services and more`
  }), [city?.city_name]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // Optimized service click handler with debouncing
  const handleServiceClick = useCallback((serviceUrl) => {
    if (isNavigating) return; // Prevent multiple clicks
    
    setIsNavigating(true);
    
    // Clear existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    
    // Use requestIdleCallback for better performance
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        router.push(`/${cityUrl}/${serviceUrl}`);
      }, { timeout: 100 });
    } else {
      setTimeout(() => {
        router.push(`/${cityUrl}/${serviceUrl}`);
      }, 0);
    }
    
    // Fallback timeout
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 2000);
  }, [router, cityUrl, isNavigating]);

  // Optimized city selection handler
  const handleSelectCity = useCallback((selectedCity) => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    const segments = pathname.split('/').filter(Boolean);
    let newUrl = `/${selectedCity.city_url}`;
    
    if (segments.length === 1 && segments[0] !== selectedCity.city_url) {
      newUrl = `/${selectedCity.city_url}/${segments[0]}`;
    }
    // Use location.replace for better performance if staying on same domain
    window.location.href = newUrl;
  }, [pathname, isNavigating]);
  return (
    <>
      {/* Optimized navigation loading indicator */}
      {isNavigating && (
        <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      <main className="w-full bg-white">
        {/* Critical above-the-fold content */}
        <section className="w-full mb-8 md:mb-12">
          <Suspense fallback={<LoadingPlaceholder height="h-96" className="w-full" />}>
            <CriticalComponents.HeroSection />
          </Suspense>
        </section>
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mx-auto">
          <div className="space-y-12 md:space-y-16 lg:space-y-20 w-full"> 
            {/* Service sections with lazy loading */}
            <LazySection fallback={<LoadingPlaceholder />}>
              <ServiceWrapper 
                Component={LazyComponents.Appliances}
                categoryUrl="appliances" 
                cityUrl={cityUrl}
                onServiceClick={handleServiceClick}
              />
            </LazySection>
            <LazySection fallback={<LoadingPlaceholder />}>
              <ServiceWrapper 
                Component={LazyComponents.BeautyCare}
                categoryUrl="beauty-care"
                cityUrl={cityUrl}
                onServiceClick={handleServiceClick}
              />
            </LazySection>
            <LazySection fallback={<LoadingPlaceholder />}>
              <ServiceWrapper 
                Component={LazyComponents.HomecareServcies}
                categoryUrl="homecare-services"
                cityUrl={cityUrl}
                onServiceClick={handleServiceClick}
              />
            </LazySection>
            <LazySection fallback={<LoadingPlaceholder />}>
              <ServiceWrapper 
                Component={LazyComponents.HandymanServices}
                categoryUrl="handyman-services" 
                cityUrl={cityUrl}
                onServiceClick={handleServiceClick}
                className="mb-0"
              />
            </LazySection>
            {/* App download section */}
            <LazySection 
              fallback={<LoadingPlaceholder />}
              className="w-full my-8 md:my-12"
            >
              <LazyComponents.AppDownloadCard />
            </LazySection>

            {/* About section - keep this higher priority */}
            <section className="w-full my-8 md:my-12" aria-labelledby="expert-heading">
              <h2 id="expert-heading" className="sr-only">
                About MannuBhai Expert Services in {city.city_name}
              </h2>
              <Suspense fallback={<LoadingPlaceholder />}>
                <CriticalComponents.AboutMannuBhaiExpert />
              </Suspense>
            </section>

            {/* Lower priority sections */}
            <LazySection 
              fallback={<LoadingPlaceholder />}
              className="w-full my-8 md:my-12"
            >
              <LazyComponents.ClientReviews />
            </LazySection>

            <LazySection 
              fallback={<LoadingPlaceholder />}
              className="w-full my-8 md:my-12"
            >
              <LazyComponents.PopularCities onSelectCity={handleSelectCity} />
            </LazySection>

            <LazySection 
              fallback={<LoadingPlaceholder />}
              className="w-full my-8 md:my-12"
            >
              <LazyComponents.BrandsWeRepair />
            </LazySection>

            <LazySection 
              fallback={<LoadingPlaceholder />}
              className="w-full my-8 md:my-12"
            >
              <LazyComponents.Services />
            </LazySection>
          </div>
        </div>
        <section className="w-full mt-12 md:mt-16">
          <DynamicComponents.FooterLinks />
        </section>
      </main>
    </>
  );
};

export default memo(CityDetails);