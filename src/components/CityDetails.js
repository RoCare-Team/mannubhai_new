'use client';
import React, { useState, useRef, useCallback, memo, useEffect, useMemo, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Performance optimizations
const cityDataCache = new Map();
const componentPreloadCache = new Set();

// Enhanced loading component with skeleton UI
const SkeletonLoader = memo(({ 
  className = "", 
  variant = "default",
  count = 1,
  height = "h-48"
}) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200",
    card: "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-xl",
    text: "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md h-4",
    hero: "bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-2xl"
  };

  return (
    <div className="animate-pulse space-y-4" role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${variants[variant]} ${height} ${className} animate-shimmer bg-[length:200%_100%]`}
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
});

SkeletonLoader.displayName = 'SkeletonLoader';

// Optimized dynamic component loader with prefetching
const createOptimizedDynamicComponent = (
  loader, 
  componentName, 
  options = {}
) => {
  // Preload component in background
  const preloadComponent = () => {
    if (typeof window !== 'undefined' && !componentPreloadCache.has(componentName)) {
      componentPreloadCache.add(componentName);
      loader()
        .then(mod => {
          if (mod.default) {
            cityDataCache.set(componentName, mod.default);
          }
        })
        .catch(error => {
          console.warn(`Failed to preload ${componentName}:`, error);
          componentPreloadCache.delete(componentName);
        });
    }
  };

  // Intersection Observer for lazy loading
  const LazyComponent = dynamic(
    () => {
      if (cityDataCache.has(componentName)) {
        return Promise.resolve({ default: cityDataCache.get(componentName) });
      }
      
      return loader()
        .then(mod => {
          if (!mod.default) {
            throw new Error(`${componentName} has no default export`);
          }
          cityDataCache.set(componentName, mod.default);
          return mod;
        })
        .catch(error => {
          console.error(`Error loading ${componentName}:`, error);
          return {
            default: () => (
              <div className="flex items-center justify-center p-8 bg-red-50 rounded-xl border border-red-200">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 text-red-400">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-red-600 font-medium">Failed to load {componentName}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )
          };
        });
    },
    {
      loading: () => <SkeletonLoader variant="card" height="h-64" />,
      ssr: false,
      ...options
    }
  );

  LazyComponent.preload = preloadComponent;
  return LazyComponent;
};

// Modern component registry with lazy loading
const ModernComponents = {
  AboutMannuBhaiExpert: createOptimizedDynamicComponent(
    () => import("./AboutMannuBhaiExpert"), 
    "AboutMannuBhaiExpert"
  ),
  HeroSection: createOptimizedDynamicComponent(
    () => import("@/app/_components/Home/HeroSection"), 
    "HeroSection"
  ),
  Appliances: createOptimizedDynamicComponent(
    () => import("@/app/_components/Home/Appliances"), 
    "Appliances"
  ),
  HandymanServices: createOptimizedDynamicComponent(
    () => import("@/app/_components/Home/HandymanServices"), 
    "HandymanServices"
  ),
  BeautyCare: createOptimizedDynamicComponent(
    () => import("@/app/_components/Home/BeautyCare"), 
    "BeautyCare"
  ),
  HomecareServices: createOptimizedDynamicComponent(
    () => import('@/app/_components/Home/HomecareServcies'), 
    "HomecareServices"
  ),
  BrandsWeRepair: createOptimizedDynamicComponent(
    () => import('@/components/BrandsWeRepair'), 
    "BrandsWeRepair"
  ),
  Services: createOptimizedDynamicComponent(
    () => import('@/app/_components/Home/Services'), 
    "Services"
  ),
  PopularCities: createOptimizedDynamicComponent(
    () => import("@/app/_components/Home/PopularCities"), 
    "PopularCities"
  ),
  ClientReviews: createOptimizedDynamicComponent(
    () => import("@/app/_components/Home/ClientReviews"), 
    "ClientReviews"
  ),
  FooterLinks: createOptimizedDynamicComponent(
    () => import("@/app/_components/Home/FooterLinks"), 
    "FooterLinks"
  ),
  AppDownloadCard: createOptimizedDynamicComponent(
    () => import('@/app/_components/Home/AppDownloadCard'), 
    "AppDownloadCard"
  )
};

// Modern service wrapper with intersection observer
const ModernServiceWrapper = memo(({ 
  children, 
  categoryUrl, 
  cityUrl, 
  onServiceClick, 
  className = "",
  priority = false
}) => {
  const [isVisible, setIsVisible] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const elementRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const sectionId = `${categoryUrl}-section`;
  const headingId = `${categoryUrl}-heading`;

  return (
    <section 
      ref={elementRef}
      className={`relative overflow-hidden ${className}`}
      aria-labelledby={headingId}
      id={sectionId}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 -z-10" />
      
      <h2 id={headingId} className="sr-only">
        {categoryUrl.replace(/-/g, ' ')} services in {cityUrl}
      </h2>

      {isVisible ? (
        <Suspense fallback={
          <SkeletonLoader 
            variant="card" 
            height="h-80" 
            className="mx-4 sm:mx-6 lg:mx-8"
          />
        }>
          <div className="relative">
            {React.cloneElement(children, {
              ...children.props,
              onServiceClick,
              cityUrl,
              className: "transform transition-all duration-500 ease-out"
            })}
          </div>
        </Suspense>
      ) : (
        <div className="h-80 flex items-center justify-center">
          <SkeletonLoader variant="card" height="h-full" className="w-full mx-4 sm:mx-6 lg:mx-8" />
        </div>
      )}
    </section>
  );
});

ModernServiceWrapper.displayName = 'ModernServiceWrapper';
// Enhanced Coming Soon Section with clean card design
const ModernComingSoonSection = memo(({ title, cityName }) => {
  const SERVICE_IMAGES = {
    "Beauty & Personal Care": {
      "Women Salon At Home": "/BeautyHomeIcons/women salon at home.webp",
      "Makeup": "/BeautyHomeIcons/makeup.webp",
      "Spa For Women": "/BeautyHomeIcons/spa for women.webp",
      "Men Salon At Home": "/BeautyHomeIcons/Men Salon at Home.webp",
      "Massage For Men": "/BeautyHomeIcons/massage for men.webp",
      "Pedicure And Manicure": "/BeautyHomeIcons/pedicure and manicure.webp",
      "Hair Studio": "/BeautyHomeIcons/hair studio.webp",
    },
    "Handyman Services": {
      "Painter": "/HandyMan/painter.webp",
      "Plumber": "/HandyMan/plumber.webp",
      "Carpenter": "/HandyMan/carpenter.webp",
      "Electrician": "/HandyMan/electrician.webp"
    },
    "Home Care Services": {
      "Sofa Cleaning": "/HomeCareHomeIcon/SOFA-CLEANING.webp",
      "Bathroom Cleaning": "/HomeCareHomeIcon/BATHROOM-CLEANING.webp",
      "Kitchen Cleaning": "/HomeCareHomeIcon/KITCHEN-CLEANING.webp",
      "Home Deep Cleaning": "/HomeCareHomeIcon/HOMEDEEPCLEANING.webp",
      "Pest Control": "/HomeCareHomeIcon/PEST-CONTROL.webp",
      "Tank Cleaning": "/HomeCareHomeIcon/TANK-CLEANING.webp",
    }
  };

  const services = useMemo(() => 
    Object.entries(SERVICE_IMAGES[title] || {}), 
    [title]
  );

  return (
    <section className="relative  px-4 sm:px-6 lg:px-8">
      {/* Clean background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 max-w-20"></div>
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full">
              <svg className="w-4 h-4 mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-orange-700">Coming Soon</span>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 max-w-20"></div>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're expanding our premium {title.toLowerCase()} services to{' '}
            <span className="font-semibold text-indigo-600">{cityName}</span>
          </p>
        </div>

        {/* Services Grid - Clean Card Design */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 max-w-6xl mx-auto">
          {services.map(([serviceName, imagePath], index) => (
            <div
              key={serviceName}
              className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{ 
                animationDelay: `${index * 100}ms`,
                minHeight: '200px'
              }}
            >
              {/* Service Card Content */}
              <div className="p-1 sm:p-6 text-center h-full flex flex-col">
                {/* Service Image Container */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-1 sm:mb-4 flex-shrink-0">
                  <div className="absolute inset-0 bg-gray-100 rounded-xl"></div>
                  <Image
                    src={imagePath}
                    alt={serviceName}
                    fill
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 80px, 96px"
                    onError={(e) => {
                      e.target.src = "/default-service-image.webp";
                    }}
                  />
                  
                  {/* Coming Soon Badge */}
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    Soon
                  </div>
                </div>

                {/* Service Name */}
                <div className="flex-1 flex items-center justify-center">
                  <h3 className="font-medium text-gray-900 leading-tight text-center group-hover:text-indigo-600 transition-colors" style={{ fontSize: '10px' }}>
                    {serviceName}
                  </h3>
                </div>
              </div>

              {/* Subtle hover border effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-100 rounded-2xl transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-3 text-gray-500">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">We'll notify you when these services are available</span>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
});

ModernComingSoonSection.displayName = 'ModernComingSoonSection';
// Main CityDetails component with modern optimizations
const ModernCityDetails = memo(({ city }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef(null);

  // Optimized services configuration
  const servicesConfig = useMemo(() => [
    {
      id: 'appliances',
      component: <ModernComponents.Appliances />,
      show: true,
      title: 'Home Appliances',
      priority: true
    },
    {
      id: 'beauty-care',
      component: <ModernComponents.BeautyCare />,
      show: city?.personal_care === 1,
      title: 'Beauty & Personal Care',
      priority: false
    },
    {
      id: 'homecare-services',
      component: <ModernComponents.HomecareServices />,
      show: city?.home_care === 1,
      title: 'Home Care Services',
      priority: false
    },
   {
      id: 'handyman-services',
      component: <ModernComponents.HandymanServices />,
      show: city?.status === "1",
      title: 'Handyman Services',
      priority: false
    }

  ], [city]);

  // Preload components and routes
  useEffect(() => {
    if (!city?.city_url) return;

    // Preload critical components
    ModernComponents.HeroSection.preload?.();
    ModernComponents.Appliances.preload?.();
    
    // Prefetch likely navigation routes
    const routesToPrefetch = ['appliances', 'beauty-care', 'homecare-services', 'handyman-services'];
    routesToPrefetch.forEach(service => {
      router.prefetch(`/${city.city_url}/${service}`);
    });

    // Preload other components after a delay
    const timer = setTimeout(() => {
      Object.values(ModernComponents).forEach(component => {
        component.preload?.();
      });
    }, 2000);

    return () => clearTimeout(timer);
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
    
    // Use replace for better UX if same service category
    const currentService = pathname.split('/').pop();
    const method = currentService === serviceUrl ? 'replace' : 'push';
    router[method](`/${city.city_url}/${serviceUrl}`);
  }, [router, city?.city_url, pathname]);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse" />
            <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-ping opacity-20" />
          </div>
          
          <SkeletonLoader variant="text" count={3} className="max-w-sm mx-auto mb-4" />
          
          <div className="flex justify-center space-x-2 mt-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modern Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-sm mx-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-purple-400 rounded-full animate-spin animate-reverse" />
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading your experience...</p>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-white">
        {/* Hero Section - Critical Above Fold */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-5" />
          <Suspense fallback={<SkeletonLoader variant="hero" height="h-96" />}>
            <ModernComponents.HeroSection />
          </Suspense>
        </section>

        {/* Main Content */}
        <div className="relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.03),transparent_50%)]" />
          
          <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
            
            {/* Service Sections */}
            {servicesConfig.map(({ id, component, show, title, priority }) => (
              show ? (
                <ModernServiceWrapper
                  key={id}
                  categoryUrl={id}
                  cityUrl={city.city_url}
                  onServiceClick={handleServiceClick}
                  priority={priority}
                  className="scroll-mt-20"
                >
                  {component}
                </ModernServiceWrapper>
              ) : (
                <ModernComingSoonSection 
                  key={id} 
                  title={title} 
                  cityName={city.city_name} 
                />
              )
            ))}

            {/* App Download Section */}
            <section className="relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-5" />
              <Suspense fallback={<SkeletonLoader variant="card" height="h-64" />}>
                <ModernComponents.AppDownloadCard />
              </Suspense>
            </section>

            {/* About Section */}
            <section className="relative" aria-labelledby="expert-heading">
              <Suspense fallback={<SkeletonLoader variant="card" height="h-48" />}>
                <ModernComponents.AboutMannuBhaiExpert />
              </Suspense>
            </section>

            {/* Reviews Section */}
            <section className="relative" aria-labelledby="reviews-heading">
              <div className="text-center mb-12">
                <h2 id="reviews-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  What Our <span className="text-indigo-600">Customers Say</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
              </div>
              <Suspense fallback={<SkeletonLoader variant="card" height="h-64" count={3} />}>
                <ModernComponents.ClientReviews />
              </Suspense>
            </section>

            {/* Popular Cities */}
            <section className="relative" aria-labelledby="cities-heading">
              <div className="text-center mb-12">
                <h2 id="cities-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Services Available In <span className="text-indigo-600">These Cities</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
              </div>
              <Suspense fallback={<SkeletonLoader variant="card" height="h-48" />}>
                <ModernComponents.PopularCities onSelectCity={handleSelectCity} />
              </Suspense>
            </section>

            {/* Brands Section */}
            <section className="relative" aria-labelledby="brands-heading">
              <div className="text-center mb-12">
                <h2 id="brands-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  <span className="text-indigo-600">Brands</span> We Service
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
              </div>
              <Suspense fallback={<SkeletonLoader variant="card" height="h-32" />}>
                <ModernComponents.BrandsWeRepair />
              </Suspense>
            </section>

            {/* All Services */}
            <section className="relative" aria-labelledby="all-services-heading">
              <div className="text-center mb-12">
                <h2 id="all-services-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  All Our <span className="text-indigo-600">Services</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
              </div>
              <Suspense fallback={<SkeletonLoader variant="card" height="h-96" />}>
                <ModernComponents.Services />
              </Suspense>
            </section>
          </div>
        </div>
      </main>
    </>
  );
});

ModernCityDetails.displayName = 'ModernCityDetails';

export default ModernCityDetails;
export const fetchCache = 'force-cache';