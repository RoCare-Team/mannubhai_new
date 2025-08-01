'use client';
import React, { useState, useRef, useCallback, memo, useEffect, useMemo, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Performance optimizations
const cityDataCache = new Map();
const componentPreloadCache = new Set();

// Enhanced loading component with skeleton UI - FIXED DIMENSIONS
const SkeletonLoader = memo(({ 
  className = "", 
  variant = "default",
  count = 1,
  height = "h-48",
  width = "w-full" // Added fixed width
}) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200",
    card: "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-xl",
    text: "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md h-4",
    hero: "bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-2xl min-h-[400px]", // Fixed hero height
    service: "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-2xl min-h-[320px]" // Fixed service height
  };

  return (
    <div className="animate-pulse space-y-4" role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${variants[variant]} ${height} ${width} ${className} animate-shimmer bg-[length:200%_100%]`}
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

// Optimized dynamic component loader with prefetching - FIXED LOADING STATES
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

  // Fixed loading heights based on component type
  const getLoadingHeight = (name) => {
    const heightMap = {
      'HeroSection': 'min-h-[400px]',
      'Appliances': 'min-h-[320px]',
      'HandymanServices': 'min-h-[280px]',
      'BeautyCare': 'min-h-[280px]',
      'HomecareServices': 'min-h-[280px]',
      'BrandsWeRepair': 'min-h-[120px]',
      'Services': 'min-h-[400px]',
      'PopularCities': 'min-h-[200px]',
      'ClientReviews': 'min-h-[300px]',
      'FooterLinks': 'min-h-[200px]',
      'AppDownloadCard': 'min-h-[200px]',
      'AboutMannuBhaiExpert': 'min-h-[200px]'
    };
    return heightMap[name] || 'min-h-[200px]';
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
              <div className={`flex items-center justify-center p-8 bg-red-50 rounded-xl border border-red-200 ${getLoadingHeight(componentName)}`}>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 text-red-400">
                    <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-red-600 font-medium">Failed to load {componentName}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    type="button"
                    aria-label={`Retry loading ${componentName}`}
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
      loading: () => (
        <div className={`w-full ${getLoadingHeight(componentName)}`}>
          <SkeletonLoader variant="service" className="h-full" />
        </div>
      ),
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

// Modern service wrapper with intersection observer - FIXED LAYOUT SHIFT
const ModernServiceWrapper = memo(({ 
  children, 
  categoryUrl, 
  cityUrl, 
  onServiceClick, 
  className = "",
  priority = false,
  minHeight = "min-h-[280px]" // Fixed minimum height
}) => {
  const [isVisible, setIsVisible] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false); // Track loading state
  const elementRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsVisible(true);
      return;
    }

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
        rootMargin: '100px 0px', // Increased margin for earlier loading
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
      className={`relative overflow-hidden ${minHeight} ${className}`} // Fixed minimum height
      aria-labelledby={headingId}
      id={sectionId}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 -z-10" />
      
      <h2 id={headingId} className="sr-only">
        {categoryUrl.replace(/-/g, ' ')} services in {cityUrl}
      </h2>

      {isVisible ? (
        <Suspense fallback={
          <div className={`${minHeight} flex items-center justify-center`}>
            <SkeletonLoader 
              variant="service" 
              className="w-full h-full mx-4 sm:mx-6 lg:mx-8"
            />
          </div>
        }>
          <div className="relative h-full">
            {React.cloneElement(children, {
              ...children.props,
              onServiceClick,
              cityUrl,
              className: `transform transition-all duration-500 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`,
              onLoad: () => setIsLoaded(true) // Add onLoad callback
            })}
          </div>
        </Suspense>
      ) : (
        <div className={`${minHeight} flex items-center justify-center`}>
          <SkeletonLoader variant="service" className="w-full h-full mx-4 sm:mx-6 lg:mx-8" />
        </div>
      )}
    </section>
  );
});

ModernServiceWrapper.displayName = 'ModernServiceWrapper';

// Enhanced Coming Soon Section with FIXED LAYOUT - NO SHIFTS
// Fixed ModernComingSoonSection with proper image handling
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

  const [imageErrors, setImageErrors] = useState(new Set());
  const [imagesLoaded, setImagesLoaded] = useState(new Set());

  const handleImageError = useCallback((serviceName, imagePath) => {
    console.error(`Failed to load image for ${serviceName}: ${imagePath}`);
    setImageErrors(prev => new Set(prev).add(serviceName));
  }, []);

  const handleImageLoad = useCallback((serviceName) => {
    console.log(`Successfully loaded image for: ${serviceName}`);
    setImagesLoaded(prev => new Set(prev).add(serviceName));
  }, []);

  // Debug: Log the current title and services
  useEffect(() => {
    console.log('ModernComingSoonSection - Title:', title);
    console.log('ModernComingSoonSection - Services found:', services.length);
    console.log('ModernComingSoonSection - Services:', services);
  }, [title, services]);

  return (
    <section 
      className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[400px]"
      aria-label={`${title} coming soon services`}
    >
      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 h-32">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 max-w-16 sm:max-w-20" aria-hidden="true"></div>
            <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-100 rounded-full">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm font-semibold text-orange-700">Coming Soon</span>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 max-w-16 sm:max-w-20" aria-hidden="true"></div>
          </div>
          
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            We're expanding our premium {title.toLowerCase()} services to{' '}
            <span className="font-semibold text-indigo-600">{cityName}</span>
          </p>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div 
            className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-6xl mx-auto"
            role="list"
            aria-label={`${title} services list`}
          >
            {services.map(([serviceName, imagePath], index) => (
              <div
                key={serviceName}
                role="listitem"
                className="group relative bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Service Card Content */}
                <div className="p-2 sm:p-4 text-center h-full flex flex-col h-[140px] sm:h-[180px]">
                  {/* Service Image Container */}
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-2 sm:mb-3 flex-shrink-0">
                    {/* Placeholder background */}
                    <div className="absolute inset-0 bg-gray-100 rounded-lg sm:rounded-xl" aria-hidden="true"></div>
                    
                    {!imageErrors.has(serviceName) ? (
                      <Image
                        src={imagePath}
                        alt={`${serviceName} service icon`}
                        fill
                        className={`object-contain p-1 sm:p-2 group-hover:scale-110 transition-transform duration-300 ${
                          imagesLoaded.has(serviceName) ? 'opacity-100' : 'opacity-0'
                        }`}
                        sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 80px"
                        priority={index < 4}
                        quality={75}
                        onError={() => handleImageError(serviceName, imagePath)}
                        onLoad={() => handleImageLoad(serviceName)}
                        // Remove placeholder and blurDataURL to see if they're causing issues
                        unoptimized={process.env.NODE_ENV === 'development'} // For development debugging
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="sr-only">Image failed to load</span>
                      </div>
                    )}
                    
                    {/* Coming Soon Badge */}
                    <div 
                      className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-sm w-fit h-fit"
                      aria-label="Coming soon"
                    >
                      <span className="hidden sm:inline">Soon</span>
                      <span className="sm:hidden">Soon</span>
                    </div>
                  </div>

                  {/* Service Name */}
                  <div className="flex-1 flex items-center justify-center px-1 min-h-[2.5rem]">
                    <h3 className="font-medium text-gray-900 leading-tight text-center group-hover:text-indigo-600 transition-colors text-xs sm:text-sm line-clamp-2">
                      {serviceName}
                    </h3>
                  </div>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-100 rounded-xl sm:rounded-2xl transition-colors duration-300 pointer-events-none" aria-hidden="true" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No services configured for "{title}"</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-8 sm:mt-12 h-12 flex items-center justify-center">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 text-gray-500" role="status" aria-live="polite">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-pulse" aria-hidden="true"></div>
            <span className="text-xs sm:text-sm font-medium">We'll notify you when these services are available</span>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </section>
  );
});
ModernComingSoonSection.displayName = 'ModernComingSoonSection';

// Main CityDetails component with modern optimizations - LAYOUT SHIFT FIXES
const ModernCityDetails = memo(({ city }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef(null);

  // Optimized services configuration with fixed heights
  const servicesConfig = useMemo(() => [
    {
      id: 'appliances',
      component: <ModernComponents.Appliances />,
      show: true,
      title: 'Home Appliances',
      priority: true,
      minHeight: 'min-h-[320px]'
    },
    {
      id: 'beauty-care',
      component: <ModernComponents.BeautyCare />,
      show: city?.personal_care === 1,
      title: 'Beauty & Personal Care',
      priority: false,
      minHeight: 'min-h-[280px]'
    },
    {
      id: 'homecare-services',
      component: <ModernComponents.HomecareServices />,
      show: city?.home_care === 1,
      title: 'Home Care Services',
      priority: false,
      minHeight: 'min-h-[280px]'
    },
    {
      id: 'handyman-services',
      component: <ModernComponents.HandymanServices />,
      show: city?.status === "1",
      title: 'Handyman Services',
      priority: false,
      minHeight: 'min-h-[280px]'
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

  // Loading state with FIXED DIMENSIONS
  if (!city) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse" aria-hidden="true" />
            <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-ping opacity-20" aria-hidden="true" />
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse max-w-48 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse max-w-32 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse max-w-40 mx-auto"></div>
          </div>
          
          <div className="flex justify-center space-x-2 mt-8" aria-hidden="true">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <span className="sr-only">Loading city details...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modern Navigation Loading Overlay - FIXED POSITION */}
      {isNavigating && (
        <div 
          className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Loading navigation"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-sm mx-4 w-80 h-48"> {/* Fixed dimensions */}
            <div className="relative">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" aria-hidden="true" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-purple-400 rounded-full animate-spin animate-reverse" aria-hidden="true" />
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading your experience...</p>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-white">
        {/* Hero Section - FIXED HEIGHT */}
        <section className="relative overflow-hidden min-h-[400px]"> {/* Fixed minimum height */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-5" aria-hidden="true" />
          <Suspense fallback={
            <div className="min-h-[400px] flex items-center justify-center">
              <SkeletonLoader variant="hero" className="w-full h-full" />
            </div>
          }>
            <ModernComponents.HeroSection />
          </Suspense>
        </section>

        {/* Main Content */}
        <div className="relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.03),transparent_50%)]" aria-hidden="true" />
          
          <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8"> {/* Increased space-y for consistent gaps */}
            
            {/* Service Sections - FIXED LAYOUT */}
            {servicesConfig.map(({ id, component, show, title, priority, minHeight }) => (
              show ? (
                <ModernServiceWrapper
                  key={id}
                  categoryUrl={id}
                  cityUrl={city.city_url}
                  onServiceClick={handleServiceClick}
                  priority={priority}
                  minHeight={minHeight}
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

            {/* App Download Section - FIXED HEIGHT */}
            <section className="relative overflow-hidden rounded-3xl min-h-[200px]" aria-label="App download section">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-5" aria-hidden="true" />
              <Suspense fallback={
                <div className="min-h-[200px] flex items-center justify-center">
                  <SkeletonLoader variant="card" className="w-full h-full" />
                </div>
              }>
                <ModernComponents.AppDownloadCard />
              </Suspense>
            </section>

            {/* About Section - FIXED HEIGHT */}
            <section className="relative min-h-[200px]" aria-labelledby="expert-heading">
              <Suspense fallback={
                <div className="min-h-[200px] flex items-center justify-center">
                  <SkeletonLoader variant="card" className="w-full h-full" />
                </div>
              }>
                <ModernComponents.AboutMannuBhaiExpert />
              </Suspense>
            </section>

            {/* Reviews Section - FIXED HEIGHT */}
            <section className="relative min-h-[400px]" aria-labelledby="reviews-heading">
              {/* Fixed Header Section */}
              <Suspense fallback={
                <div className="min-h-[300px] flex items-center justify-center">
                  <SkeletonLoader variant="card" className="w-full h-full" />
                </div>
              }>
                <ModernComponents.ClientReviews />
              </Suspense>
            </section>

            {/* Popular Cities - FIXED HEIGHT */}
            <section className="relative min-h-[300px]" aria-labelledby="cities-heading">
              {/* Fixed Header Section */}
              <div className="text-center mb-12 h-24"> {/* Fixed header height */}
                <h2 id="cities-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Services Available In <span className="text-indigo-600">These Cities</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" aria-hidden="true" />
              </div>
              <Suspense fallback={
                <div className="min-h-[200px] flex items-center justify-center">
                  <SkeletonLoader variant="card" className="w-full h-full" />
                </div>
              }>
                <ModernComponents.PopularCities onSelectCity={handleSelectCity} />
              </Suspense>
            </section>

            {/* Brands Section - FIXED HEIGHT */}
            <section className="relative min-h-[200px]" aria-labelledby="brands-heading">
              {/* Fixed Header Section */}
              <div className="text-center mb-12 h-24"> {/* Fixed header height */}
                <h2 id="brands-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  <span className="text-indigo-600">Brands</span> We Service
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" aria-hidden="true" />
              </div>
              <Suspense fallback={
                <div className="min-h-[120px] flex items-center justify-center">
                  <SkeletonLoader variant="card" className="w-full h-full" />
                </div>
              }>
                <ModernComponents.BrandsWeRepair />
              </Suspense>
            </section>

            {/* All Services - FIXED HEIGHT */}
            <section className="relative min-h-[500px]" aria-labelledby="all-services-heading">
              {/* Fixed Header Section */}
              <div className="text-center mb-12 h-24"> {/* Fixed header height */}
                <h2 id="all-services-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  All Our <span className="text-indigo-600">Services</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" aria-hidden="true" />
              </div>
              <Suspense fallback={
                <div className="min-h-[400px] flex items-center justify-center">
                  <SkeletonLoader variant="card" className="w-full h-full" />
                </div>
              }>
                <ModernComponents.Services />
              </Suspense>
            </section>

            {/* Footer Links - FIXED HEIGHT */}
            <section className="relative min-h-[200px]" aria-labelledby="footer-links-heading">
              <Suspense fallback={
                <div className="min-h-[200px] flex items-center justify-center">
                  <SkeletonLoader variant="card" className="w-full h-full" />
                </div>
              }>
                <ModernComponents.FooterLinks />
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

