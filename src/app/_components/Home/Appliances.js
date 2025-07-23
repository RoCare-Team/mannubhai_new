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
      <div className="grid grid-cols-4 md:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: Math.min(8, SERVICE_ORDER.length) }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="bg-white rounded-xl p-2 flex flex-col items-center justify-center shadow animate-pulse"
            style={{ aspectRatio: '1/1.2' }}
          >
            <div className="w-full aspect-square max-w-[50px] bg-blue-100 mb-1.5 rounded-md" />
            <div className="bg-blue-100 rounded" />
          </div>
        ))}
      </div>
    ), []);
    return (
      <main className="pb-5 px-4 sm:px-6 lg:px-20">
        <section 
          titleledby="appliance-services" 
          className="max-w-7xl mx-auto"
          id="appliances-care"
            role="region" 
        >
          <header className="my-5">
            <h2 className="text-lg sm:text-3xl font-bold text-gray-800 lg:ml-10">
              Appliance Services
            </h2>
          </header>

          {loading ? (
            <>
              <p className="text-center text-gray-500 mb-4">Loading services…</p>
              {SkeletonLoader}
            </>
          ) : subServices.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No services found</p>
          ) : (
          <div className="grid grid-cols-4 md:grid-cols-5 gap-4 sm:gap-6">
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
            <section className="mt-0  mb-0">
              <div className="px-3 sm:px-6 md:px-0 max-w-7xl mx-auto">
                <div className="rounded-xl overflow-hidden shadow">
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
      className="w-full bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      style={{ aspectRatio: '1/1.2' }}
      tabIndex={0}
    >
      <div className="relative w-full aspect-square max-w-[96px] bg-blue-50 rounded-lg mb-2">
        <Image
          src={service.ServiceIcon}
          alt={`${service.ServiceName} icon`}
          fill
          className="object-contain"
          loading="lazy"
          sizes="(max-width: 640px) 96px, 80px"
        />
      </div>
      <span className="text-xs font-semibold text-center text-gray-700">
        {service.ServiceName}
      </span>
    </button>
  );


