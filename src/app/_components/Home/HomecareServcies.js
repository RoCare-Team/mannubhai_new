"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import LogoLoader from "@/components/LogoLoader";

/* ---------- Constants & Helpers ---------- */
const DEFAULT_IMAGE = "/HomeIcons/default.png";
const IMAGE_MAP = Object.freeze({
  "Sofa Cleaning": "/HomeCare/SOFA-CLEANING.png",
  "Bathroom Cleaning": "/HomeCare/BATHROOM-CLEANING.png",
  "Kitchen Cleaning": "/HomeCare/KITCHEN-CLEANING.png",
  "Home Deep Cleaning": "/HomeCare/HOMEDEEPCLEANING.png",
  "Pest Control": "/HomeCare/PEST-CONTROL.png",
  "Water Tank Cleaning": "/HomeCare/TANK-CLEANING.png",
  "Tank Cleaning": "/HomeCare/TANK-CLEANING.png",
});

const DESIRED_ORDER = Object.freeze([
  "Sofa Cleaning",
  "Bathroom Cleaning",
  "Home Deep Cleaning",
  "Kitchen Cleaning",
  "Pest Control",
  "Water Tank Cleaning",
]);

// Precomputed order map for faster sorting
const ORDER_MAP = Object.freeze(
  DESIRED_ORDER.reduce((obj, name, i) => {
    obj[name] = i;
    return obj;
  }, {})
);

const getSubServiceImage = (type) => IMAGE_MAP[type] || DEFAULT_IMAGE;

/* ---------- Component ---------- */
export default function HomecareServices({ hideBrightBanner = false, onServiceClick, cityUrl }) {
  const router = useRouter();
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  // Memoized fetch function
  const fetchSubServices = useCallback(async () => {
    try {
      const q = query(
        collection(db, "lead_type"),
        where("mannubhai_cat_id", "==", "2")
      );
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        ServiceName: doc.data().type,
        ServiceIcon: getSubServiceImage(doc.data().type),
      }));

      data.sort(
        (a, b) =>
          (ORDER_MAP[a.ServiceName] ?? Number.MAX_SAFE_INTEGER) -
          (ORDER_MAP[b.ServiceName] ?? Number.MAX_SAFE_INTEGER)
      );

      setSubServices(data);
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

  return (
    <main className="relative pb-5 px-3 sm:mt-6 sm:px-6 md:px-8 lg:px-20 mt-0 mb-0 sm:mt-5 sm:mb-5">
      {/* Route loading overlay */}
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
        aria-labelledby="homecare-services" 
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
            {subServices.map((service) => (
              <button
                key={service.id}
                onClick={() => handleSubServiceClick(service)}
                aria-label={`View ${service.ServiceName} services`}
                className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative w-full aspect-square max-w-[80px] sm:max-w-[96px] bg-blue-50 rounded-lg mb-2">
                  <Image
                    src={service.ServiceIcon}
                    alt={service.ServiceName}
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
            ))}
          </div>
        )}
      </section>

      {!hideBrightBanner && (
        <section className="mt-0 md:mt-10 mb-0">
          <div className="px-3 sm:px-6 md:px-0 max-w-7xl mx-auto">
            <div className="rounded-xl overflow-hidden shadow mt-5">
              <Image
                src="/HomeBanner/handy_mob.webp"
                alt="Promotional banner for homecare services - mobile"
                width={768}
                height={300}
                priority
                placeholder="blur"
                blurDataURL="/blur-banner.png"
                sizes="100vw"
                className="block md:hidden w-full h-auto"
              />
              <Image
                src="/HomeBanner/handyman.webp"
                alt="Promotional banner for homecare services"
                width={1920}
                height={400}
                priority
                placeholder="blur"
                blurDataURL="/blur-banner.png"
                sizes="100vw"
                className="hidden md:block w-full h-auto"
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}