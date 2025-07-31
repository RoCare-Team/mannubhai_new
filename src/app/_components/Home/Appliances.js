"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
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

  // Skeleton loader
  const SkeletonLoader = useMemo(() => (
    <div className="grid grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: Math.min(8, SERVICE_ORDER.length) }).map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center shadow-sm border border-gray-100 animate-pulse min-h-[140px] sm:min-h-[160px] lg:min-h-[180px]"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-100 mb-3 rounded-lg" />
          <div className="h-3 bg-gray-100 rounded w-16 sm:w-20" />
        </div>
      ))}
    </div>
  ), []);

  return (
    <main className="pb-5 px-4 sm:px-6 lg:px-8">
      <section 
        titleledby="appliance-services" 
        className="max-w-7xl mx-auto"
        id="appliances-care"
        role="region" 
      >
        <header className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800  lg:text-left">
            Home Appliance Services
          </h2>
        </header>

        {loading ? (
          <>
            <p className="text-center text-gray-500 mb-6">Loading services…</p>
            {SkeletonLoader}
          </>
        ) : subServices.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No services found</p>
        ) : (
          <div className="grid grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {subServices.map((service) => (
              <ServiceCard 
                key={service.id}
                service={service}
                onClick={handleServiceClick}
              />
            ))}
          </div>
        )}
      </section>

      {!hideBeautyBanner && (
        <section className="mt-8 sm:mt-12 mb-0">
          <div className="px-3 sm:px-6 md:px-0 max-w-7xl mx-auto">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/HomeBanner/beauty.webp"
                alt="Beauty services promotion"
                width={1920}
                height={400}
                priority={true}
                sizes="100vw"
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

// Extracted Service Card Component
const ServiceCard = ({ service, onClick }) => (
  <button
    onClick={() => onClick(service)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(service);
      }
    }}
    title={`View ${service.ServiceName} services`}
    className="group w-full bg-white rounded-2xl p-3 sm:p-4 lg:p-6 flex flex-col items-center justify-center shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:-translate-y-1 min-h-[140px] sm:min-h-[160px] lg:min-h-[180px]"
    tabIndex={0}
  >
    {/* Icon Container */}
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-2 sm:mb-3 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-300">
      <Image
        src={service.ServiceIcon}
        alt={`${service.ServiceName} icon`}
        width={96}
        height={96}
        className="object-contain group-hover:scale-110 transition-transform duration-300 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
        loading="lazy"
        sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 80px"
      />
    </div>
    
    {/* Service Name */}
    <span className="text-xs sm:text-sm lg:text-base font-medium text-center text-gray-700 leading-tight px-1 group-hover:text-blue-700 transition-colors duration-300">
      {service.ServiceName}
    </span>
  </button>
);