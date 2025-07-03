"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import LogoLoader from "@/components/LogoLoader";

// Constants moved outside component to avoid recreation on every render
const DEFAULT_SERVICE_IMAGE = "/HomeIcons/default.png";
const SUBSERVICE_IMAGES = Object.freeze({
  Painter: "/HandyMan/PAINTER.png",
  Plumber: "/HandyMan/PLUMBER.png",
  Carpenter: "/HandyMan/CARPENTER.png",
  Electrician: "/HandyMan/ELECTRICIAN.png",
  Masons: "/HandyMan/OTHER.jpeg",
  Manson: "/HandyMan/OTHER.jpeg",
});

const DESIRED_ORDER = Object.freeze([
  "Painter",
  "Plumber",
  "Carpenter",
  "Electrician",
  "Manson",
]);

// Precomputed order map
const ORDER_MAP = Object.freeze(
  DESIRED_ORDER.reduce((acc, name, idx) => {
    acc[name] = idx;
    return acc;
  }, {})
);

const getSubServiceImage = (type) => SUBSERVICE_IMAGES[type] || DEFAULT_SERVICE_IMAGE;

export default function HandymanServices({ hideBanner = false, onServiceClick, cityUrl }) {
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const router = useRouter();
  const swiperRef = useRef(null);
  const [subServices, setSubServices] = useState([]);

  // Memoized fetch function
  const fetchSubServices = useCallback(async () => {
    try {
      const q = query(
        collection(db, "lead_type"),
        where("mannubhai_cat_id", "==", "4")
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
      console.error("Error fetching handyman services:", error);
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

  // Memoized swiper navigation handlers
  const handlePrev = useCallback(() => {
    swiperRef.current?.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.swiper.slideNext();
  }, []);

  if (routeLoading) return <LogoLoader />;

  return (
    <main className="bg-gray-80 pb-10 px-4 sm:px-6 lg:px-19">
      <header className="mb-6 sm:mb-10 mt-0">
        <h2 className="text-left text-xl sm:text-3xl font-bold text-gray-800 ml-0 sm:ml-14">
          Handyman Services
        </h2>
      </header>

      {/* Services Section */}
      <section
        aria-labelledby="handyman-services"
        className="relative max-w-7xl mx-auto" id="handyman"
      >
        <h2 id="handyman-services" className="sr-only">
          Handyman Sub‑Services
        </h2>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="loader" />
          </div>
        ) : subServices.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No handyman services found.
          </p>
        ) : (
          <>
            {/* Mobile - Grid View (4 items per row) */}
            <div className="sm:hidden grid grid-cols-4 gap-3">
              {subServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleSubServiceClick(service)}
                  className="bg-white rounded-2xl shadow-md p-2 flex flex-col items-center transition hover:scale-105 hover:shadow-xl h-full"
                  aria-label={`View ${service.ServiceName}`}
                >
                  <div className="relative w-12 h-12 bg-blue-50 rounded-full mb-2">
                    <Image
                      src={service.ServiceIcon}
                      alt={service.ServiceName}
                      fill
                      className="object-contain"
                      loading="lazy"
                      sizes="(max-width: 640px) 48px"
                    />
                  </div>
                  <p className="text-center text-[10px] font-semibold leading-tight text-gray-700 break-words w-full">
                    {service.ServiceName}
                  </p>
                </button>
              ))}
            </div>

            {/* Desktop - Swiper View */}
            <div className="hidden sm:block relative">
              <Swiper
                ref={swiperRef}
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={3}
                breakpoints={{
                  640: { slidesPerView: 3.5 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 5 },
                }}
                className="pb-6"
              >
                {subServices.map((service) => (
                  <SwiperSlide key={service.id}>
                    <button
                      className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center transition hover:scale-105 hover:shadow-xl w-full h-full"
                      onClick={() => handleSubServiceClick(service)}
                      aria-label={`View ${service.ServiceName}`}
                    >
                      <div className="relative w-32 h-32 bg-blue-50 rounded-full mb-3">
                        <Image
                          src={service.ServiceIcon}
                          alt={service.ServiceName}
                          fill
                          className="object-contain"
                          loading="lazy"
                          sizes="(min-width: 640px) 160px"
                        />
                      </div>
                      <p className="text-center text-sm font-medium text-gray-700">
                        {service.ServiceName}
                      </p>
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Swiper navigation */}
              <button
                onClick={handlePrev}
                aria-label="Previous services"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 w-8 h-8 z-10 flex items-center justify-center"
              >
                &larr;
              </button>
              <button
                onClick={handleNext}
                aria-label="Next services"
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 w-8 h-8 z-10 flex items-center justify-center"
              >
                &rarr;
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}