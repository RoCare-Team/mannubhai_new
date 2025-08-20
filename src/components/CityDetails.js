'use client';
import React, { useState, useRef, useCallback, memo, useEffect, useMemo, Suspense, startTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
import Image from 'next/image';

// --- Performance Optimizations & Caching ---
const cityDataCache = new Map();
const componentPreloadCache = new Set();

// --- Critical CSS-in-JS for Above-the-Fold Content ---
const criticalStyles = {
  heroSection: {
    minHeight: '400px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)'
  },
  loadingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

// --- Optimized Skeleton Loader ---
const SkeletonLoader = memo(({
  className = "",
  variant = "default",
  height = "h-48",
  width = "w-full"
}) => {
  const baseClass = "animate-pulse rounded-xl";
  const variantClass = variant === "hero"
    ? "bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 min-h-[400px]"
    : "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200";

  return (
    <div className={`${baseClass} ${variantClass} ${height} ${width} ${className}`}
         role="status"
         aria-label="Loading content">
      <span className="sr-only">Loading...</span>
    </div>
  );
});
SkeletonLoader.displayName = 'SkeletonLoader';

// --- Intersection Observer Hook ---
const useIntersectionObserver = (callback, options = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
        observer.disconnect();
      }
    }, { rootMargin: '100px 0px', threshold: 0.1, ...options });

    observer.observe(element);

    return () => observer.disconnect();
  }, [callback, options]);

  return elementRef;
};


// --- Optimized Dynamic Component Loader ---
const createOptimizedDynamicComponent = (
  loader,
  componentName,
  options = {}
) => {
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
        .catch(() => ({
          default: () => (
            <div className="flex items-center justify-center p-4 bg-red-50 rounded-xl border border-red-200 min-h-[200px]">
              <div className="text-center">
                <p className="text-red-600 font-medium text-sm">Component unavailable</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
                  type="button"
                >
                  Retry
                </button>
              </div>
            </div>
          )
        }));
    },
    {
      loading: () => <SkeletonLoader variant="default" className="min-h-[200px]" />,
      ssr: false,
      ...options
    }
  );

  LazyComponent.preload = () => {
    if (typeof window !== 'undefined' && !componentPreloadCache.has(componentName)) {
      componentPreloadCache.add(componentName);
      loader().catch(() => componentPreloadCache.delete(componentName));
    }
  };

  return LazyComponent;
};

// --- Unified Component Registry ---
const ModernComponents = {
  AboutMannuBhaiExpert: createOptimizedDynamicComponent(() => import("./AboutMannuBhaiExpert"), "AboutMannuBhaiExpert"),
  HeroSection: createOptimizedDynamicComponent(() => import("@/app/_components/Home/HeroSection"), "HeroSection", { ssr: true }),
  Appliances: createOptimizedDynamicComponent(() => import("@/app/_components/Home/Appliances"), "Appliances"),
  HandymanServices: createOptimizedDynamicComponent(() => import("@/app/_components/Home/HandymanServices"), "HandymanServices"),
  BeautyCare: createOptimizedDynamicComponent(() => import("@/app/_components/Home/BeautyCare"), "BeautyCare"),
  HomecareServices: createOptimizedDynamicComponent(() => import('@/app/_components/Home/HomecareServcies'), "HomecareServcies"),
  BrandsWeRepair: createOptimizedDynamicComponent(() => import('@/components/BrandsWeRepair'), "BrandsWeRepair"),
  Services: createOptimizedDynamicComponent(() => import('@/app/_components/Home/Services'), "Services"),
  PopularCities: createOptimizedDynamicComponent(() => import("@/app/_components/Home/PopularCities"), "PopularCities"),
  ClientReviews: createOptimizedDynamicComponent(() => import("@/app/_components/Home/ClientReviews"), "ClientReviews"),
  FooterLinks: createOptimizedDynamicComponent(() => import("@/app/_components/Home/FooterLinks"), "FooterLinks"),
  AppDownloadCard: createOptimizedDynamicComponent(() => import('@/app/_components/Home/AppDownloadCard'), "AppDownloadCard")
};


// --- Service Wrapper Component ---
const ModernServiceWrapper = memo(({
  children,
  categoryUrl,
  cityUrl,
  // onServiceClick is no longer needed here
  className = "",
  priority = false,
  minHeight = "min-h-[280px]"
}) => {
  const [isVisible, setIsVisible] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleIntersection = useCallback(() => {
    startTransition(() => {
      setIsVisible(true);
    });
  }, []);

  const elementRef = useIntersectionObserver(handleIntersection, { rootMargin: priority ? '0px' : '100px 0px' });

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const sectionId = `${categoryUrl}-section`;

  if (!isVisible) {
    return (
      <section
        ref={elementRef}
        className={`relative overflow-hidden ${minHeight} ${className}`}
        id={sectionId}
      >
        <SkeletonLoader className={minHeight} />
      </section>
    );
  }

  return (
    <section
      ref={elementRef}
      className={`relative overflow-hidden ${minHeight} ${className}`}
      id={sectionId}
    >
      <Suspense fallback={<SkeletonLoader className={minHeight} />}>
        <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {React.cloneElement(children, {
            ...children.props,
            // onServiceClick prop removed
            cityUrl,
          })}
        </div>
      </Suspense>
    </section>
  );
});
ModernServiceWrapper.displayName = 'ModernServiceWrapper';


// --- NEW: Modern "Coming Soon" Section ---
const ModernComingSoonSection = memo(({ title, cityName, id }) => {
  const SERVICE_IMAGES = useMemo(() => ({
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
      "Painter": "/HandyMan/PAINTER.webp",
      "Plumber": "/HandyMan/PLUMBER.webp",
      "Carpenter": "/HandyMan/CARPENTER.webp",
      "Electrician": "/HandyMan/ELECTRICIAN.webp",
      "Masons": "/HandyMan/OTHER.webp",
    },
    "Home Care Services": {
      "Sofa Cleaning": "/HomeCareHomeIcon/SOFA-CLEANING.webp",
      "Bathroom Cleaning": "/HomeCareHomeIcon/BATHROOM-CLEANING.webp",
      "Kitchen Cleaning": "/HomeCareHomeIcon/KITCHEN-CLEANING.webp",
      "Home Deep Cleaning": "/HomeCareHomeIcon/HOMEDEEPCLEANING.webp",
      "Pest Control": "/HomeCareHomeIcon/PEST-CONTROL.webp",
      "Tank Cleaning": "/HomeCareHomeIcon/TANK-CLEANING.webp",
    }
  }), []);

  const services = useMemo(() =>
    Object.entries(SERVICE_IMAGES[title] || {}),
    [title, SERVICE_IMAGES]
  );

  const [imageErrors, setImageErrors] = useState(new Set());

  const handleImageError = useCallback((serviceName) => {
    setImageErrors(prev => new Set(prev).add(serviceName));
  }, []);

  return (
    <section className="relative py-16 px-4 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 min-h-[500px] overflow-hidden" id={id}>
      {/* Modern background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-purple-100/50" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-indigo-100 to-transparent rounded-full blur-3xl opacity-70" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100 to-transparent rounded-full blur-3xl opacity-60" />

      <div className="relative max-w-7xl mx-auto">
        {/* Modern Header */}
        <div className="text-center mb-12 space-y-6">
          <div className="inline-flex items-center justify-center">
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                {title}
              </h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            </div>
          </div>

          {/* Modern Coming Soon Badge */}
          <div className="flex items-center justify-center">
            <div className="group relative inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-white/60 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 rounded-full" />
              <div className="relative flex items-center space-x-3">
                <div className="relative flex items-center justify-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <div className="absolute w-4 h-4 bg-orange-500/30 rounded-full animate-ping" />
                </div>
                <span className="text-sm sm:text-base font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Coming Soon
                </span>
                <svg className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              We're expanding our premium {title.toLowerCase()} services to{' '}
              <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {cityName}
              </span>
              . Stay tuned for exceptional service quality!
            </p>
          </div>
        </div>

        {/* Modern Services Grid */}
        {services.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 lg:gap-6 max-w-6xl mx-auto mb-12">
            {services.map(([serviceName, imagePath], index) => (
              <div
                key={serviceName}
                className="group relative bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/60 hover:border-indigo-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                style={{
                  animation: `fadeInUp 0.6s ease-out forwards ${index * 100}ms`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative p-2 sm:p-4 lg:p-6 text-center h-[130px] sm:h-[160px] lg:h-[180px] flex flex-col">
                  <div className="relative w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-1 sm:mb-2 flex-shrink-0">
                    {!imageErrors.has(serviceName) ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Image
                          src={imagePath}
                          alt={`${serviceName} service`}
                          fill
                          className="relative z-10 object-contain p-0.5 sm:p-1 group-hover:scale-110 transition-transform duration-300 filter group-hover:drop-shadow-lg"
                          sizes="(max-width: 640px) 32px, (max-width: 1024px) 48px, 64px"
                          loading={index < 8 ? "eager" : "lazy"}
                          quality={70}
                          onError={() => handleImageError(serviceName)}
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg sm:rounded-xl border border-gray-200">
                        <svg className="w-3 h-3 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center mb-1 sm:mb-2">
                    <div className="relative inline-flex">
                      <div className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 text-white text-[8px] sm:text-[10px] lg:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg border border-white/50 animate-pulse">
                        Coming Soon
                      </div>
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30" />
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center px-0.5 sm:px-1">
                    <h3 className="font-medium text-gray-900 leading-tight text-center group-hover:text-indigo-600 transition-colors duration-300 text-[10px] sm:text-xs lg:text-sm line-clamp-2">
                      {serviceName}
                    </h3>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {/* Modern Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center space-x-4 bg-white/60 backdrop-blur-sm border border-white/60 rounded-full px-6 py-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                We'll notify you when available
              </span>
            </div>
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 3v1a7 7 0 007 7v1h1a8 8 0 01-8 8H3a8 8 0 01-8-8V3h14z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
});
ModernComingSoonSection.displayName = 'ModernComingSoonSection';


// --- Main Page Component ---
const ModernCityDetails = memo(({ city }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  // Memoized services configuration
  const servicesConfig = useMemo(() => [
    {
      id: 'appliances',
      component: <ModernComponents.Appliances />,
      show: true, // Appliances are always shown
      title: 'Home Appliances',
      priority: true,
      minHeight: 'min-h-[320px]'
    },
    {
      id: 'beauty-care',
      component: <ModernComponents.BeautyCare />,
      show: city?.personal_care == 1,
      title: 'Beauty & Personal Care',
      priority: false,
      minHeight: 'min-h-[280px]'
    },
    {
      id: 'homecare-services',
      component: <ModernComponents.HomecareServices />,
      show: city?.home_care == 1,
      title: 'Home Care Services',
      priority: false,
      minHeight: 'min-h-[280px]'
    },
    {
      id: 'handyman-services',
      component: <ModernComponents.HandymanServices />,
      show: city?.status == 1,
      title: 'Handyman Services',
      priority: false,
      minHeight: 'min-h-[280px]'
    }
  ], [city]);

  // Preload critical components and prefetch routes
  useEffect(() => {
    if (!city?.city_url) return;

    ModernComponents.HeroSection.preload?.();
    ModernComponents.Appliances.preload?.();

    const timer = setTimeout(() => {
      router.prefetch(`/${city.city_url}/appliances`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [city?.city_url, router]);

  // FIX: Updated click handler to perform smooth scrolling instead of navigation.
  const handleServiceClick = useCallback((serviceUrl) => {
    const sectionId = `${serviceUrl}-section`;
    const section = document.getElementById(sectionId);
    if (section) {
      // Scrolls the corresponding service section into view smoothly.
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSelectCity = useCallback((selectedCity) => {
    startTransition(() => {
      setIsNavigating(true);
      const segments = pathname.split('/').filter(Boolean);
      const newUrl = segments.length > 0 && segments[0] !== selectedCity.city_url
        ? `/${selectedCity.city_url}/${segments.slice(1).join('/')}`
        : `/${selectedCity.city_url}`;
      router.push(newUrl);
    });
  }, [pathname, router]);

  // Loading state for the whole page
  if (!city) {
    return (
      <div style={criticalStyles.loadingContainer}>
        <div className="text-center max-w-md w-full">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse max-w-48 mx-auto" />
            <div className="h-4 bg-gray-200 rounded animate-pulse max-w-32 mx-auto" />
          </div>
          <span className="sr-only">Loading city details...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {isNavigating && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-sm mx-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="mt-4 text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section style={criticalStyles.heroSection} className="relative overflow-hidden">
          <Suspense fallback={<SkeletonLoader variant="hero" />}>
            {/* FIX: Pass the click handler to the HeroSection where the buttons likely are. */}
            <ModernComponents.HeroSection onServiceClick={handleServiceClick} />
          </Suspense>
        </section>

        {/* Services Sections */}
        {servicesConfig.map(({ id, component, show, title, priority, minHeight }) => (
          show ? (
            <ModernServiceWrapper
              key={id}
              categoryUrl={id}
              cityUrl={city.city_url}
              // The onServiceClick prop is no longer passed down here
              priority={priority}
              minHeight={minHeight}
            >
              {component}
            </ModernServiceWrapper>
          ) : (
            <ModernComingSoonSection
              key={id}
              id={id}
              title={title}
              cityName={city.city_name}
            />
          )
        ))}

        {/* Other Content Sections */}
        <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          <Suspense fallback={<SkeletonLoader className="min-h-[200px] rounded-3xl" />}>
            <ModernComponents.AppDownloadCard />
          </Suspense>
          <Suspense fallback={<SkeletonLoader className="min-h-[200px]" />}>
            <ModernComponents.AboutMannuBhaiExpert />
          </Suspense>
          <Suspense fallback={<SkeletonLoader className="min-h-[300px]" />}>
            <ModernComponents.ClientReviews />
          </Suspense>
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Services Available In <span className="text-indigo-600">These Cities</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
            </div>
            <Suspense fallback={<SkeletonLoader className="min-h-[200px]" />}>
              <ModernComponents.PopularCities onSelectCity={handleSelectCity} />
            </Suspense>
          </section>
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                <span className="text-indigo-600">Brands</span> We Service
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
            </div>
            <Suspense fallback={<SkeletonLoader className="min-h-[120px]" />}>
              <ModernComponents.BrandsWeRepair />
            </Suspense>
          </section>
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                All Our <span className="text-indigo-600">Services</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
            </div>
            <Suspense fallback={<SkeletonLoader className="min-h-[400px]" />}>
              <ModernComponents.Services />
            </Suspense>
          </section>
          <Suspense fallback={<SkeletonLoader className="min-h-[200px]" />}>
            <ModernComponents.FooterLinks />
          </Suspense>
        </div>
      </main>
    </>
  );
});
ModernCityDetails.displayName = 'ModernCityDetails';

export default ModernCityDetails;