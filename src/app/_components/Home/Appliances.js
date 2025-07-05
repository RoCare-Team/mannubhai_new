"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import LogoLoader from "@/components/LogoLoader";

// Constants moved outside component to avoid recreation on every render
const DEFAULT_IMAGE = "/HomeIcons/default.png";
const IMAGE_MAP = Object.freeze({
  "Water Purifier": "/HomeIcons/RO.png",
  "Air Conditioner": "/HomeIcons/AIR-CONDITIONAR.png",
  Fridge: "/HomeIcons/REFRIGERATOR.png",
  "Washing Machine": "/HomeIcons/WASHINGMACHINE.png",
  Microwave: "/HomeIcons/MICROWAVE.png",
  "Kitchen Chimney": "/HomeIcons/KitchenChimney.png",
  "LED TV": "/HomeIcons/LED-TV.png",
  "Vacuum Cleaner": "/HomeIcons/vacuum-cleaner.png",
  "Air Purifier": "/HomeIcons/air-purifier.png",
  "Air Cooler": "/HomeIcons/air-cooler.png",
  "Kitchen Appliance": "/HomeIcons/Kitchen-Appliance.png",
  Geyser: "/HomeIcons/geyser.png",
});

const SERVICE_ORDER = Object.freeze([
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
]);

const getSubServiceImage = (type) => IMAGE_MAP[type] || DEFAULT_IMAGE;

export default function Appliances({ hideBeautyBanner = false, onServiceClick, cityUrl }) {
  const router = useRouter();
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  // Memoized fetch function
  const fetchSubServices = useCallback(async () => {
    try {
      const q = query(
        collection(db, "lead_type"),
        where("mannubhai_cat_id", "==", "1")
      );
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        ServiceName: doc.data().type,
        ServiceIcon: getSubServiceImage(doc.data().type),
      }));

      // Create a map for O(1) lookups
      const serviceOrderMap = Object.fromEntries(
        SERVICE_ORDER.map((service, index) => [service, index])
      );

      const sortedData = data.sort((a, b) => {
        const indexA = serviceOrderMap[a.ServiceName] ?? Infinity;
        const indexB = serviceOrderMap[b.ServiceName] ?? Infinity;
        return indexA - indexB;
      });

      setSubServices(sortedData);
    } catch (error) {
      console.error("Error fetching sub-services:", error);
      setSubServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized category URL fetch
  const getCategoryUrlByLeadTypeId = useCallback(async (lead_type_id) => {
    const q = query(
      collection(db, "category_manage"),
      where("lead_type_id", "==", lead_type_id)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].data().category_url;
  }, []);

  // Memoized click handler
  const handleSubServiceClick = useCallback(async (service) => {
    setRouteLoading(true);
    try {
      const category_url = await getCategoryUrlByLeadTypeId(service.id);
      if (category_url) {
        if (onServiceClick) {
          onServiceClick(category_url);
        } else if (cityUrl) {
          router.push(`/${cityUrl}/${category_url}`);
        } else {
          router.push(`/${category_url}`);
        }
      } else {
        alert("Category URL not found!");
      }
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setRouteLoading(false);
    }
  }, [getCategoryUrlByLeadTypeId, onServiceClick, cityUrl, router]);

  useEffect(() => {
    fetchSubServices();
  }, [fetchSubServices]);

  if (routeLoading) return <LogoLoader />;

  return (
    <main className="pb-5 px-4 sm:px-6 lg:px-20 mt-0 mb-0 sm:mt-5 sm:mb-5">
      <section aria-labelledby="appliance-services" className="max-w-7xl mx-auto" id="appliances-care">
        <header className="mt-5 mb-5">
          <h2 className="text-left text-lg sm:text-3xl font-bold text-gray-800 ml-0 lg:ml-10">
            Appliance Services
          </h2>
        </header>

        {loading ? (
          <>
            <p className="text-center text-gray-500 mb-4">Loading services…</p>
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:[grid-template-columns:repeat(auto-fit,_minmax(140px,_1fr))] gap-4 sm:gap-6">
              {Array.from({ length: Math.min(8, SERVICE_ORDER.length) }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="bg-white rounded-xl p-4 flex flex-col items-center justify-center shadow animate-pulse"
                >
                  <div className="w-full aspect-square max-w-[80px] bg-blue-100 mb-2 rounded-md" />
                  <div className="h-4 w-20 bg-blue-100 rounded" />
                </div>
              ))}
            </div>
          </>
        ) : subServices.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No appliance services found.</p>
        ) : (
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-4 sm:gap-6">
            {subServices.map((service) => (
              <button
                key={service.id}
                onClick={() => handleSubServiceClick(service)}
                aria-label={`View ${service.ServiceName} services`}
                className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full aspect-square max-w-[96px] sm:max-w-[80px] bg-blue-50 rounded-lg mb-2">
                  <Image
                    src={service.ServiceIcon}
                    alt={service.ServiceName}
                    fill
                    className="object-contain"
                    placeholder="blur"
                    blurDataURL="/blur.png"
                    loading="lazy"
                    sizes="(max-width: 640px) 96px, 80px"
                  />
                </div>
                <span className="text-[10px] font-semibold text-center text-gray-700 leading-tight">
                  {service.ServiceName}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {!hideBeautyBanner && (
        <section className="mt-4 md:mt-10 mb-0 max-w-7xl mx-auto">
          <div className="rounded-xl overflow-hidden shadow">
            <Image
              src="/HomeBanner/beauty_mob.webp"
              alt="Beauty services banner for mobile"
              width={768}
              height={300}
              placeholder="blur"
              blurDataURL="/blur-banner.png"
              sizes="100vw"
              className="block md:hidden w-full h-auto"
              priority={true}
              fetchPriority="high"  
              loading="eager"    
              quality={80}       
              unoptimized={false}
            />

            <Image
              src="/HomeBanner/beauty.webp"
              alt="Beauty services banner for desktop"
              width={1920}
              height={400}
              priority
              placeholder="blur"
              blurDataURL="/blur-banner.png"
              sizes="100vw"
              className="hidden md:block w-full h-auto"
              
  fetchPriority="high"  // Explicit fetch priority
  loading="eager"      // Force immediate loading
  quality={80}         // Optimized quality for mobile
     // Full viewport width on all devices
  unoptimized={false}
            />
          </div>
        </section>
      )}
    </main>
  );
}