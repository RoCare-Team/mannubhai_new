"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import LogoLoader from "@/components/LogoLoader";

// Constants moved outside component to avoid recreation on every render
const DEFAULT_IMAGE = "/BeautyCare/default.png";
const IMAGE_MAP = Object.freeze({
  "Women Salon At Home": "/BeautyCare/women salon at home.png",
  "Makeup": "/BeautyCare/makeup.png",
  "Spa For Women": "/BeautyCare/spa for women.png",
  "Men Salon At Home": "/BeautyCare/Men Salon at Home.png",
  "Massage For Men": "/BeautyCare/massage for men.png",
  "Pedicure And Manicure": "/BeautyCare/pedicure and manicure.png",
  "Hair Studio": "/BeautyCare/hair studio.png",
});

const DESIRED_ORDER = Object.freeze([
  "Women Salon At Home",
  "Makeup",
  "Spa For Women",
  "Men Salon At Home",
  "Massage For Men",
  "Pedicure And Manicure",
  "Hair Studio",
]);

// Precompute the order map
const ORDER_MAP = Object.freeze(
  DESIRED_ORDER.reduce((acc, name, idx) => {
    acc[name] = idx;
    return acc;
  }, {})
);

const getSubServiceImage = (type) => IMAGE_MAP[type] || DEFAULT_IMAGE;

export default function BeautyCare({ hideBrightBanner = false, onServiceClick, cityUrl }) {
  const router = useRouter();
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  // Memoized fetch function
  const fetchSubServices = useCallback(async () => {
    try {
      const q = query(
        collection(db, "lead_type"),
        where("mannubhai_cat_id", "==", "3")
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

  return (
    <main className="relative pb-5 px-3 sm:mt-6 sm:px-6 md:px-8 lg:px-20 mt-0 mb-0 sm:mt-5 sm:mb-5">
      {/* Full-screen route loader */}
      {routeLoading && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-80 flex items-center justify-center">
          <LogoLoader />
        </div>
      )}

      {/* header */}
      <header className="mb-5">
        <h2 className="text-left text-lg sm:text-3xl font-bold text-gray-800 ml-0 lg:ml-10">
          Beauty Services
        </h2>
      </header>

      {/* grid */}
      <section aria-labelledby="beauty-services" className="max-w-7xl mx-auto" id="beauty-care">
        <h2 id="beauty-services" className="sr-only">
          Beauty Sub‑Services
        </h2>

        {loading ? (
          <>
            <p className="text-center text-sm text-gray-500 mb-4">
              Loading services…
            </p>
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: Math.min(8, DESIRED_ORDER.length) }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow animate-pulse"
                >
                  <div className="w-full aspect-square max-w-[80px] bg-blue-100 mb-2 rounded-md" />
                  <div className="h-3 w-14 bg-blue-100 rounded" />
                </div>
              ))}
            </div>
          </>
        ) : subServices.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-8">
            No beauty services found.
          </p>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-6">
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

      {/* promo banner */}
      {!hideBrightBanner && (
        <section className="mt-0 md:mt-10 mb-0">
          <div className="px-3 sm:px-6 md:px-0 max-w-7xl mx-auto">
            <div className="rounded-xl overflow-hidden shadow mt-5">
              <Image
                src="/HomeBanner/homecare_mbo.webp"
                alt="Promotional banner for homecare services – mobile"
                width={768}
                height={300}
                priority
                placeholder="blur"
                blurDataURL="/blur-banner.png"
                sizes="100vw"
                className="block md:hidden w-full h-auto"
              />
              <Image
                src="/HomeBanner/homecare.webp"
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