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
// Modify your createDynamicComponent function to include loading states in the cache
const createDynamicComponent = (loader, componentName, options = {}) => {
  // Prefetch in the background
  if (typeof window !== 'undefined' && !cityDataCache.has(componentName)) {
    loader().then(mod => {
      if (mod.default) {
        cityDataCache.set(componentName, mod.default);
      }
    }).catch(() => {});
  }
  return dynamic(() => {
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
  const [isLoading, setIsLoading] = useState(true);
  const ChildComponent = useMemo(() => {
    const component = DynamicComponents[children.type.name] || children.type;
    if (component.preload) component.preload(); // Trigger preload if available
    return component;
  }, [children]);

  return (
    <section className={className} aria-labelledby={`${categoryUrl}-heading`}>
      <h2 id={`${categoryUrl}-heading`} className="sr-only">
        {categoryUrl.replace(/-/g, ' ')} services in {cityUrl}
      </h2>
      <React.Suspense fallback={<LoadingPlaceholder className="h-64" />}>
        <ChildComponent 
          {...children.props} 
          onServiceClick={onServiceClick} 
          cityUrl={cityUrl}
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingPlaceholder className="h-64" />
          </div>
        )}
      </React.Suspense>
    </section>
  );
});
ServiceWrapper.displayName = 'ServiceWrapper';

const ComingSoonSection = ({ title, cityName }) => {
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

  const getServiceNames = () => Object.keys(SERVICE_IMAGES[title] || {});
  const getServiceImage = (serviceName) => SERVICE_IMAGES[title]?.[serviceName] || "/default-service-image.webp";

  return (
    <section className="py-16 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">{title}</h2>
          <p className="text-base sm:text-lg text-gray-600">
            We're bringing amazing {title.toLowerCase()} to <span className="font-semibold text-pink-600">{cityName}</span> soon!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {getServiceNames().map((serviceName, index) => {
            const imageSrc = getServiceImage(serviceName);
            return (
              <div
                key={index}
                className="relative group rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition duration-300"
              >
                <img
                  src={imageSrc}
                  alt={serviceName}
                  className="w-full h-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "/default-service-image.webp";
                  }}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300 flex flex-col justify-center items-center text-white p-4">
                  <span className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    COMING SOON
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-center">
                    {serviceName}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
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
       <section className="w-full mb-8 md:mb-12" title="Hero section">
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
               <DynamicComponents.Appliances />
                </ServiceWrapper>
              ) : (
                <ComingSoonSection key={id} title={title} cityName={city.city_name} />
              )
            ))}
             {servicesConfig.map(({ id, component: Component, show, title }) => (
              show ? (
                <ServiceWrapper 
                  key={id}
                  categoryUrl={id}
                  cityUrl={city.city_url}
                  onServiceClick={handleServiceClick}
                >
               <DynamicComponents.BeautyCare />
                </ServiceWrapper>
              ) : (
                <ComingSoonSection key={id} title={title} cityName={city.city_name} />
              )
            ))}
           {servicesConfig.map(({ id, component: Component, show, title }) => (
              show ? (
                <ServiceWrapper 
                  key={id}
                  categoryUrl={id}
                  cityUrl={city.city_url}
                  onServiceClick={handleServiceClick}
                >
             <DynamicComponents.HandymanServices />
                </ServiceWrapper>
              ) : (
                <ComingSoonSection key={id} title={title} cityName={city.city_name} />
              )
            ))}
             {servicesConfig.map(({ id, component: Component, show, title }) => (
              show ? (
                <ServiceWrapper 
                  key={id}
                  categoryUrl={id}
                  cityUrl={city.city_url}
                  onServiceClick={handleServiceClick}
                >
              <DynamicComponents.HomecareServices />
                </ServiceWrapper>
              ) : (
                <ComingSoonSection key={id} title={title} cityName={city.city_name} />
              )
            ))}

            {/* Rest of your sections remain the same */}
            <section title="Download our mobile app">
              <DynamicComponents.AppDownloadCard />
            </section>
            
             <section title="expert-heading">
              <h2 id="expert-heading" className="text-2xl font-bold mb-6 text-center">
                About MannuBhai Expert Services in {city.city_name}
              </h2>
              <DynamicComponents.AboutMannuBhaiExpert />
            </section>
              <section title="reviews-heading">
              <h2 id="reviews-heading" className="text-2xl font-bold mb-6 text-center">
                What Our Customers Say
              </h2>
              <DynamicComponents.ClientReviews />
            </section>
              <section title="cities-heading">
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
export const fetchCache = 'force-cache';