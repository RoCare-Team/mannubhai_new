"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import LogoLoader from "@/components/LogoLoader";

/* ---------- Constants & Helpers ---------- */
const DEFAULT_IMAGE = "/HomeIcons/default.png";
const IMAGE_MAP = {
  "Sofa Cleaning": "/HomeCareHomeIcon/SOFA-CLEANING.webp",
  "Bathroom Cleaning": "/HomeCareHomeIcon/BATHROOM-CLEANING.webp",
  "Kitchen Cleaning": "/HomeCareHomeIcon/KITCHEN-CLEANING.webp",
  "Home Deep Cleaning": "/HomeCareHomeIcon/HOMEDEEPCLEANING.webp",
  "Pest Control": "/HomeCareHomeIcon/PEST-CONTROL.webp",
  "Tank Cleaning": "/HomeCareHomeIcon/TANK-CLEANING.webp",
};

const DESIRED_ORDER = [
  "Sofa Cleaning",
  "Bathroom Cleaning",
  "Home Deep Cleaning",
  "Kitchen Cleaning",
  "Pest Control",
  "Water Tank Cleaning",
];

const ORDER_MAP = DESIRED_ORDER.reduce((obj, name, i) => {
  obj[name] = i;
  return obj;
}, {});

const getSubServiceImage = (type) => IMAGE_MAP[type] || DEFAULT_IMAGE;

/* ---------- Component ---------- */
export default function HomecareServices({ 
  hideBrightBanner = false, 
  onServiceClick, 
  cityUrl 
}) {
  const router = useRouter();
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  // Fetch category URL by lead type ID
  const getCategoryUrlByLeadTypeId = useCallback(async (lead_type_id) => {
    try {
      const q = query(
        collection(db, "category_manage"),
        where("lead_type_id", "==", lead_type_id)
      );
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : snapshot.docs[0]?.data()?.category_url;
    } catch (error) {
      console.error("Error fetching category URL:", error);
      return null;
    }
  }, []);

  // Handle sub-service click
  const handleSubServiceClick = useCallback(async (service) => {
    setRouteLoading(true);
    try {
      const category_url = await getCategoryUrlByLeadTypeId(service.id);
      if (!category_url) {
        console.error("Category URL not found for service:", service.id);
        return;
      }

      if (onServiceClick) {
        onServiceClick(category_url);
      } else {
        const path = cityUrl ? `/${cityUrl}/${category_url}` : `/${category_url}`;
        router.push(path);
      }
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setRouteLoading(false);
    }
  }, [getCategoryUrlByLeadTypeId, onServiceClick, cityUrl, router]);

  // Fetch sub-services
  useEffect(() => {
    const fetchSubServices = async () => {
      try {
        const q = query(
          collection(db, "lead_type"),
          where("mannubhai_cat_id", "==", "2")
        );
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ServiceName: doc.data().type,
          ServiceIcon: getSubServiceImage(doc.data().type),
          ...doc.data(),
        }));

        data.sort(
          (a, b) => 
            (ORDER_MAP[a.ServiceName] ?? Infinity) - 
            (ORDER_MAP[b.ServiceName] ?? Infinity)
        );

        setSubServices(data);
      } catch (error) {
        console.error("Error fetching sub-services:", error);
        setSubServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubServices();
  }, []);

  // Memoized skeleton items
  const skeletonItems = useMemo(() => (
    Array.from({ length: Math.min(6, DESIRED_ORDER.length) }).map((_, i) => (
      <div
        key={`skeleton-${i}`}
        className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow animate-pulse"
      >
        <div className="w-full aspect-square max-w-[80px] bg-blue-100 mb-2 rounded-md" />
        <div className="h-3 w-14 bg-blue-100 rounded" />
      </div>
    ))
  ), []);

  // Memoized service items
  const serviceItems = useMemo(() => (
    subServices.map((service) => (
      <button
        key={service.id}
        onClick={() => handleSubServiceClick(service)}
        title={`View ${service.ServiceName} services`}
        className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="relative w-full aspect-square max-w-[80px] sm:max-w-[96px] bg-blue-50 rounded-lg mb-2">
          <Image
            src={service.ServiceIcon}
            alt="" // Empty alt since the service name is already visible
            fill
            className="object-contain"
            placeholder="blur"
            blurDataURL="/blur.png"
            loading="lazy"
            sizes="(max-width: 640px) 80px, 96px"
          />
        </div>
        <span className="text-[10px] font-semibold text-center text-gray-700 leading-tight">
          {service.ServiceName}
        </span>
      </button>
    ))
  ), [subServices, handleSubServiceClick]);

  return (
    <main className="relative pb-5 px-3 sm:mt-6 sm:px-6 md:px-8 lg:px-20 mt-0 mb-0 sm:mt-5 sm:mb-5">
      {routeLoading && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-80 flex items-center justify-center">
          <LogoLoader />
        </div>
      )}

      <header className="mb-5">
        <h2 className="text-left text-lg sm:text-3xl font-bold text-gray-800 ml-0 lg:ml-10">
          Home Care Services
        </h2>
      </header>

      <section 
        title="homecare-services" 
        className="max-w-7xl mx-auto" 
        id="home-care"
      >
        <h2 id="homecare-services" className="sr-only">
          Home Care Sub-Services
        </h2>

        {loading ? (
          <>
            <p className="text-center text-sm text-gray-500 mb-4">
              Loading services…
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-6">
              {skeletonItems}
            </div>
          </>
        ) : subServices.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-8">
            No home care services found.
          </p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-6">
            {serviceItems}
          </div>
        )}
      </section>

      {!hideBrightBanner && (
        <section className="mt-0 md:mt-10 mb-0">
          <div className="px-3 sm:px-6 md:px-0 max-w-7xl mx-auto">
            <div className="rounded-xl overflow-hidden shadow mt-5">
              <Image
                src="/HomeBanner/handyman.webp"
                alt="Professional home care services available"
                width={1920}
                height={400}
            
                placeholder="blur"
                blurDataURL="/blur-banner.png"
                sizes="100vw"
                loading="lazy"
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}