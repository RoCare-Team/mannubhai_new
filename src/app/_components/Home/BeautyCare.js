"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import BeautyBrand from "./BeautyBrand";
// Constants
const DEFAULT_IMAGE = "/BeautyCare/default.png";
const IMAGE_MAP = {
  "Women Salon At Home": "/BeautyHomeIcons/women salon at home.webp",
  "Makeup": "/BeautyHomeIcons/makeup.webp",
  "Spa For Women": "/BeautyHomeIcons/spa for women.webp",
  "Men Salon At Home": "/BeautyHomeIcons/Men Salon at Home.webp",
  "Massage For Men": "/BeautyHomeIcons/massage for men.webp",
  "Pedicure And Manicure": "/BeautyHomeIcons/pedicure and manicure.webp",
  "Hair Studio": "/BeautyHomeIcons/hair studio.webp",
};

const DESIRED_ORDER = [
  "Women Salon At Home",
  "Makeup",
  "Spa For Women",
  "Men Salon At Home",
  "Massage For Men",
  "Pedicure And Manicure",
  "Hair Studio",
];

export default function BeautyCare({ hideBrightBanner = false, onServiceClick, cityUrl }) {
  const router = useRouter();
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  // Precompute the order map
  const orderMap = useMemo(() => 
    DESIRED_ORDER.reduce((acc, name, idx) => {
      acc[name] = idx;
      return acc;
    }, {}), 
  []);

  const getSubServiceImage = useCallback((type) => IMAGE_MAP[type] || DEFAULT_IMAGE, []);

  // Fetch sub-services from Firestore
  const fetchSubServices = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "lead_type"),
        where("mannubhai_cat_id", "==", "3")
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
          (orderMap[a.ServiceName] ?? Number.MAX_SAFE_INTEGER) -
          (orderMap[b.ServiceName] ?? Number.MAX_SAFE_INTEGER)
      );

      setSubServices(data);
    } catch (error) {
      console.error("Error fetching sub-services:", error);
      setSubServices([]);
    } finally {
      setLoading(false);
    }
  }, [getSubServiceImage, orderMap]);

  // Fetch category URL from Firestore
  const getCategoryUrlByLeadTypeId = useCallback(async (lead_type_id) => {
    try {
      const q = query(
        collection(db, "category_manage"),
        where("lead_type_id", "==", lead_type_id)
      );
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : snapshot.docs[0].data().category_url;
    } catch (error) {
      console.error("Error fetching category URL:", error);
      return null;
    }
  }, []);

  // Handle service click
  const handleSubServiceClick = useCallback(async (service) => {
    setRouteLoading(true);
    try {
      const category_url = await getCategoryUrlByLeadTypeId(service.id);
      if (!category_url) {
        alert("Category URL not found!");
        return;
      }

      if (onServiceClick) {
        onServiceClick(category_url);
      } else if (cityUrl) {
        router.push(`/${cityUrl}/${category_url}`);
      } else {
        router.push(`/${category_url}`);
      }
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setRouteLoading(false);
    }
  }, [getCategoryUrlByLeadTypeId, onServiceClick, cityUrl, router]);

  // Initial data fetch
  useEffect(() => {
    fetchSubServices();
  }, [fetchSubServices]);

  // Skeleton loader items
  const skeletonItems = useMemo(() => 
    Array.from({ length: Math.min(8, DESIRED_ORDER.length) }).map((_, i) => (
      <div
        key={`skeleton-${i}`}
        className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow animate-pulse"
      >
        <div className="w-full aspect-square max-w-[80px] bg-blue-100 mb-2 rounded-md" />
        <div className="h-3 w-14 bg-blue-100 rounded" />
      </div>
    )), 
  []);

  return (
    <main className="relative pb-5 px-3 sm:mt-6 sm:px-6 md:px-8 lg:px-20 mt-0 mb-0 sm:mt-5 sm:mb-5">

      {/* Header */}
      <header className="mb-5">
        <h2 className="text-left text-lg sm:text-3xl font-bold text-gray-800 ml-0 lg:ml-10">
          Beauty Services
        </h2>
      </header>

      {/* Services grid */}
      <section title="beauty-services" className="max-w-7xl mx-auto" id="beauty-care">
        <h2 id="beauty-services" className="sr-only">
          Beauty Sub-Services
        </h2>

        {loading ? (
          <>
            <p className="text-center text-sm text-gray-500 mb-4">
              Loading services...
            </p>
            <div className="grid grid-cols-4 gap-3 sm:gap-6">
              {skeletonItems}
            </div>
          </>
        ) : subServices.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-8">
            No beauty services found.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-3 sm:gap-6">
            {subServices.map((service) => (
              <button
                key={service.id}
                onClick={() => handleSubServiceClick(service)}
                title={`View ${service.ServiceName} services`}
                className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="relative w-full aspect-square max-w-[80px] sm:max-w-[96px] bg-blue-50 rounded-lg mb-2">
                  <Image
                    src={service.ServiceIcon}
                    alt="" // Decorative image, alt can be empty since the service name is visible
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

      {/* Beauty brands section */}
      <section 
        title="beauty-brands" 
        className="w-full px-3 sm:px-6 lg:px-8 py-6 bg-white" 
        id="beauty-brands"
      >
        <BeautyBrand />
      </section>

      {/* Promotional banner - desktop only */}
{!hideBrightBanner && (
  <section className="mt-0  mb-0">
    <div className="px-3 sm:px-6 md:px-0 max-w-7xl mx-auto">
      <div className="rounded-xl overflow-hidden shadow">
        <Image
          src="/HomeBanner/homecare.webp"
          alt="Professional homecare services available"
          width={1920}
          height={400}
       
          placeholder="blur"
          loading="lazy"
          blurDataURL="/blur-banner.png"
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