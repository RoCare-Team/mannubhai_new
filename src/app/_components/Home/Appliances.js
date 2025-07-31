"use client";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// Constants
const DEFAULT_IMAGE = "/default-images/deafult.jpeg";
const IMAGE_MAP = {
  "Water Purifier": "/ApplianceHomeIcons/RO.webp",
  "Air Conditioner": "/ApplianceHomeIcons/AIR-CONDITIONAR.webp",
  "Fridge": "/ApplianceHomeIcons/REFRIGERATOR.webp",
  "Washing Machine": "/ApplianceHomeIcons/WASHING-MACHINE.webp",
  "Microwave": "/ApplianceHomeIcons/MICROWAVE.webp",
  "Kitchen Chimney": "/ApplianceHomeIcons/KitchenChimney.webp",
  "LED TV": "/ApplianceHomeIcons/LED-TV.webp",
  "Vacuum Cleaner": "/ApplianceHomeIcons/vacuum-cleaner.webp",
  "Air Purifier": "/ApplianceHomeIcons/air-purifier.webp",
  "Air Cooler": "/ApplianceHomeIcons/air-cooler.webp",
  "Kitchen Appliance": "/ApplianceHomeIcons/Kitchen-Appliance.webp",
  "Geyser": "/ApplianceHomeIcons/geyser.webp",
};

const SERVICE_ORDER = [
  "Water Purifier",
  "Air Conditioner", 
  "Fridge",
  "Washing Machine",
  "Microwave",
  "Kitchen Chimney",
  "LED TV",
  "Vacuum Cleaner",
  "Air Purifier",
  "Air Cooler",
  "Small Appliances",
  "Geyser",
];

// Memoized Service Card Component - Fixed square design for mobile
const ServiceCard = memo(({ service, onClick }) => (
  <div className="group">
    <button
      onClick={() => onClick(service)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(service);
        }
      }}
      title={`View ${service.ServiceName} services`}
      className="w-full aspect-square rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-white"
      tabIndex={0}
    >
      {/* Image Container - Takes up most of the space */}
      <div className="flex-1 w-full flex items-center justify-center">
        <Image
          src={service.ServiceIcon}
          alt={`${service.ServiceName} service`}
          width={100}
          height={100}
          className="object-contain w-12 h-12 sm:w-16 sm:h-16 lg:w-30 lg:h-30 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          sizes="(max-width: 640px) 60px, (max-width: 1024px) 80px, 90px"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgAHAAAAAAAAAAAAAAAAAQIAAxEhkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli21llHDjORrFUjNEWuNfFmNhEfcE05/V2d0NQ3DyY3AgegqKSNgbIUhZq5Q/QBdaDRZNLLrFYD7E/NuBbBVPj7K8b7QSZSGTl2M+yRN7e9A0KUQn8MnI05/vvIj+i9E/qGrwLiuCfDl+7Ej/RmDJGfb/vQoG9WJCaWAmjkUcE5lJk9sVsG3IQBfCLi4M/X9G5QIoNe9ZJPSFYOjmOHHhkY7FGz92B8v1OhJjJYfbBBwG2tFrZTgr45VhKc9HqyTZe2MPEBGa5VzgGsH3GAp6MfXKx2sBWJImfUe3l6OJhXYNSCUoS/x6b/VpNO1iLqxvyPtYY6DzCcTd27e+uVF9QSu1mAp/J1kvgUzYSQ0mgWJlw6Z2TrQkVTjYwQXBLJP8JFhDFJlz5CZEHEFvK1SXGT11zHgZEFEINF2H1GGnGUQiXhNwU8I2G1KMw8YOXGvNuQ8NQjKFyY2J3eIa/yQN6FGxsLx5ZIj+JT5GnJ8YCiEUQTq7T1mjDpQyFCIhYxdMTJMHf7/8BvQ=="
        />
      </div>
      
      {/* Service Name - Fixed height area */}
      <div className="h-8 sm:h-10 lg:h-12 flex items-center justify-center px-1">
        <span className="text-xs sm:text-sm font-medium text-center text-gray-700 leading-tight line-clamp-2">
          {service.ServiceName}
        </span>
      </div>
    </button>
  </div>
), (prevProps, nextProps) => prevProps.service.id === nextProps.service.id);

ServiceCard.displayName = 'ServiceCard';

// Skeleton Loader Component - Also square
const SkeletonCard = memo(() => (
  <div className="bg-white rounded-xl p-2 sm:p-3 lg:p-4 flex flex-col items-center justify-center shadow-sm animate-pulse aspect-square">
    <div className="flex-1 w-full bg-gray-200 rounded-lg" />
    <div className="h-8 sm:h-10 lg:h-12 flex items-center justify-center">
      <div className="h-3 bg-gray-200 rounded w-16" />
    </div>
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';

export default function Appliances({ hideBeautyBanner = false, onServiceClick, cityUrl }) {
  const router = useRouter();
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  const serviceOrderMap = useMemo(() => 
    SERVICE_ORDER.reduce((acc, service, index) => {
      acc[service] = index;
      return acc;
    }, {}), 
  []);

  // Memoized image getter
  const getSubServiceImage = useCallback((type) => IMAGE_MAP[type] || DEFAULT_IMAGE, []);

  // Fetch services with error boundary
  const fetchSubServices = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "lead_type"),
        where("mannubhai_cat_id", "==", "1")
      );
      const snapshot = await getDocs(q);
      const services = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ServiceName: data.type,
          ServiceIcon: getSubServiceImage(data.type),
          ...data,
        };
      });

      services.sort((a, b) => 
        (serviceOrderMap[a.ServiceName] ?? Infinity) - 
        (serviceOrderMap[b.ServiceName] ?? Infinity)
      );

      setSubServices(services);
    } catch (error) {
      console.error("Fetch error:", error);
      setSubServices([]);
    } finally {
      setLoading(false);
    }
  }, [getSubServiceImage, serviceOrderMap]);

  // Cached category URL fetcher
  const getCategoryUrl = useCallback(async (lead_type_id) => {
    try {
      const cacheKey = `cat-url-${lead_type_id}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return cached;

      const q = query(
        collection(db, "category_manage"),
        where("lead_type_id", "==", lead_type_id)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      const url = snapshot.docs[0].data().category_url;
      sessionStorage.setItem(cacheKey, url);
      return url;
    } catch (error) {
      console.error("Category URL error:", error);
      return null;
    }
  }, []);

  // Optimized navigation handler
  const handleServiceClick = useCallback(async (service) => {
    setRouteLoading(true);
    try {
      const categoryUrl = await getCategoryUrl(service.id);
      if (!categoryUrl) {
        alert("Service not available");
        return;
      }
      const targetUrl = cityUrl ? `/${cityUrl}/${categoryUrl}` : `/${categoryUrl}`;
      if (onServiceClick) {
        onServiceClick(categoryUrl);
      } else {
        await router.prefetch(targetUrl);
        router.push(targetUrl);
      }
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setRouteLoading(false);
    }
  }, [getCategoryUrl, cityUrl, onServiceClick, router]);

  // Initial data fetch
  useEffect(() => {
    fetchSubServices();
  }, [fetchSubServices]);

  // Memoized skeleton loader
  const SkeletonLoader = useMemo(() => (
    <div className="grid grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {Array.from({ length: Math.min(12, SERVICE_ORDER.length) }).map((_, i) => (
        <SkeletonCard key={`skeleton-${i}`} />
      ))}
    </div>
  ), []);

  return (
    <main className="pb-5 px-4 sm:px-6 lg:px-8">
      <section 
        id="appliances-care"
        className="max-w-7xl mx-auto"
        role="region"
        aria-labelledby="appliance-services-heading"
      >
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h2 
            id="appliance-services-heading"
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mt-3 lg:text-left"
          >
           Appliance Services
          </h2>
        </header>

        {/* Services Grid */}
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading services...</span>
            </div>
            {SkeletonLoader}
          </div>
        ) : subServices.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33M15.536 8.464a5 5 0 010 7.072M8.464 8.464a5 5 0 000 7.072" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Available</h3>
            <p className="text-gray-600">Please check back later for available services.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {subServices.map((service) => (
              <ServiceCard 
                key={service.id}
                service={service}
                onClick={handleServiceClick}
              />
            ))}
          </div>
        )}

        {/* Loading State Overlay */}
        {routeLoading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 shadow-2xl flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-700 font-medium">Loading service...</span>
            </div>
          </div>
        )}
      </section>

      {/* Beauty Banner */}
      {!hideBeautyBanner && (
        <section className="mt-8 sm:mt-12 mb-0" aria-label="Beauty services promotion">
          <div className="px-3 sm:px-6 md:px-0 max-w-7xl mx-auto">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/HomeBanner/beauty.webp"
                alt="Beauty services promotion - Professional beauty treatments at home"
                width={1920}
                height={400}
                priority={false}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                className="w-full h-auto object-cover"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgAHAAAAAAAAAAAAAAAAAQIAAxEhkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli21llHDjORrFUjNEWuNfFmNhEfcE05/V2d0NQ3DyY3AgegqKSNgbIUhZq5Q/QBdaDRZNLLrFYD7E/NuBbBVPj7K8b7QSZSGTl2M+yRN7e9A0KUQn8MnI05/vvIj+i9E/qGrwLiuCfDl+7Ej/RmDJGfb/vQoG9WJCaWAmjkUcE5lJk9sVsG3IQBfCLi4M/X9G5QIoNe9ZJPSFYOjmOHHhkY7FGz92B8v1OhJjJYfbBBwG2tFrZTgr45VhKc9HqyTZe2MPEBGa5VzgGsH3GAp6MfXKx2sBWJImfUe3l6OJhXYNSCUoS/x6b/VpNO1iLqxvyPtYY6DzCcTd27e+uVF9QSu1mAp/J1kvgUzYSQ0mgWJlw6Z2TrQkVTjYwQXBLJP8JFhDFJlz5CZEHEFvK1SXGT11zHgZEFEINF2H1GGnGUQiXhNwU8I2G1KMw8YOXGvNuQ8NQjKFyY2J3eIa/yQN6FGxsLx5ZIj+JT5GnJ8YCiEUQTq7T1mjDpQyFCIhYxdMTJMHf7/8BvQ=="
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}