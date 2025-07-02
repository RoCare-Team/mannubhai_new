"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import LogoLoader from "@/components/LogoLoader";

const DEFAULT_IMAGE = "/HomeIcons/default.png";
const IMAGE_MAP = {
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
};
const getSubServiceImage = (type) => IMAGE_MAP[type] || DEFAULT_IMAGE;

export default function Appliances({ hideBeautyBanner = false, onServiceClick, cityUrl }) {
  const router = useRouter();
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    const fetchSubServices = async () => {
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

        const serviceOrder = [
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

        const sortedData = data.sort((a, b) => {
          const indexA = serviceOrder.indexOf(a.ServiceName);
          const indexB = serviceOrder.indexOf(b.ServiceName);
          return indexA - indexB;
        });

        setSubServices(sortedData);
      } catch (error) {
        console.error("Error fetching sub-services:", error);
        setSubServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubServices();
  }, []);

  const getCategoryUrlByLeadTypeId = async (lead_type_id) => {
    const q = query(
      collection(db, "category_manage"),
      where("lead_type_id", "==", lead_type_id)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].data().category_url;
  };

  const handleSubServiceClick = async (service) => {
    setRouteLoading(true);
    try {
      const category_url = await getCategoryUrlByLeadTypeId(service.id);
      if (category_url) {
        if (onServiceClick) {
          // Use the parent-provided navigation handler if available
          onServiceClick(category_url);
        } else if (cityUrl) {
          // If we have a city URL, navigate to city/category
          router.push(`/${cityUrl}/${category_url}`);
        } else {
          // Fallback to just the category URL
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
  };

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
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
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
         <div className="grid grid-cols-5 gap-4 sm:gap-6">
          {subServices.map((service) => (
            <button
              key={service.id}
              onClick={() => handleSubServiceClick(service)}
              aria-label={`View ${service.ServiceName} services`}
              className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-md"
            >
              <div
                className="relative w-full aspect-square 
                          max-w-[96px] sm:max-w-[80px] 
                          bg-blue-50 rounded-lg mb-2 shadow group-hover:shadow-xl transition"
              >
                <Image
                  src={service.ServiceIcon}
                  alt={service.ServiceName}
                  fill
                  className="object-contain"
                  placeholder="blur"
                  blurDataURL="/blur.png"
                  loading="lazy"
                  sizes="(max-width:640px) 96px, (max-width:1024px) 80px, 96px"
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
              priority
              placeholder="blur"
              blurDataURL="/blur-banner.png"
              sizes="100vw"
              className="block md:hidden w-full h-auto"
            />

            <Image
              src="/HomeBanner/beauty.webp"
              alt="Beauty services banner for desktop"
              width={1920}
              height={400}
              priority
              placeholder="blur"
              blurDataURL="/blur-banner.png"
              sizes="(min-width:768px) 1000px"
              className="hidden md:block w-full h-auto"
            />
          </div>
        </section>
      )}
    </main>
  );
}