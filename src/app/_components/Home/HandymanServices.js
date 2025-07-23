"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
// Constants
const DEFAULT_SERVICE_IMAGE = "/default-images/deafult.jpeg";
const SUBSERVICE_IMAGES = {
  Painter: "/HandyMan/PAINTER.webp",
  Plumber: "/HandyMan/PLUMBER.webp",
  Carpenter: "/HandyMan/CARPENTER.webp",
  Electrician: "/HandyMan/ELECTRICIAN.webp",
  Masons: "/HandyMan/OTHER.webp",
  Manson: "/HandyMan/OTHER.webp",
};

const DESIRED_ORDER = ["Painter", "Plumber", "Carpenter", "Electrician", "Manson"];
const ORDER_MAP = DESIRED_ORDER.reduce((acc, name, idx) => ({ ...acc, [name]: idx }), {});

const getSubServiceImage = (type) => SUBSERVICE_IMAGES[type] || DEFAULT_SERVICE_IMAGE;

export default function HandymanServices({ hideBanner = false, onServiceClick, cityUrl }) {
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const [subServices, setSubServices] = useState([]);
  const router = useRouter();
  const swiperRef = useRef(null);

  // Memoized fetch functions
  const fetchSubServices = useCallback(async () => {
    try {
      const q = query(
        collection(db, "lead_type"),
        where("mannubhai_cat_id", "==", "4")
      );
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ServiceName: doc.data().type,
        ServiceIcon: getSubServiceImage(doc.data().type),
        ...doc.data(),
      }));

      data.sort((a, b) => 
        (ORDER_MAP[a.ServiceName] ?? Infinity) - (ORDER_MAP[b.ServiceName] ?? Infinity)
      );

      setSubServices(data);
    } catch (error) {
      console.error("Error fetching handyman services:", error);
      setSubServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategoryUrlByLeadTypeId = useCallback(async (lead_type_id) => {
    const q = query(
      collection(db, "category_manage"),
      where("lead_type_id", "==", lead_type_id)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs[0]?.data()?.category_url || null;
  }, []);

  // Memoized click handler
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

  // Initialize data fetch
  useEffect(() => {
    fetchSubServices();
  }, [fetchSubServices]);

  // Memoized service items for mobile and desktop
  const mobileServiceItems = useMemo(() => (
    subServices.map((service) => (
      <button
        key={service.id}
        onClick={() => handleSubServiceClick(service)}
        className="bg-white rounded-2xl shadow-md p-2 flex flex-col items-center transition hover:scale-105 hover:shadow-xl h-full"
        aria-label={`View ${service.ServiceName} services`}
      >
        <div className="relative w-12 h-12 bg-blue-50 rounded-full mb-2">
          <Image
            src={service.ServiceIcon}
            alt={service.ServiceName} // Empty alt since service name is visible
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
    ))
  ), [subServices, handleSubServiceClick]);

  const desktopServiceItems = useMemo(() => (
    subServices.map((service) => (
      <SwiperSlide key={service.id}>
        <button
          className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center transition hover:scale-105 hover:shadow-xl w-full h-full"
          onClick={() => handleSubServiceClick(service)}
          aria-label={`View ${service.ServiceName} services`}
        >
          <div className="relative w-32 h-32 bg-blue-50 rounded-full mb-3">
            <Image
              src={service.ServiceIcon}
              alt={service.ServiceName} // Empty alt since service name is visible
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
    ))
  ), [subServices, handleSubServiceClick]);
  return (
    <main className="bg-gray-50 pb-10 px-4 sm:px-6 lg:px-19">
      <header className="mb-6 sm:mb-10 mt-0">
        <h2 className="text-left text-xl sm:text-3xl font-bold text-gray-800 ml-0 sm:ml-14">
          Handyman Services
        </h2>
      </header>

      <section aria-labelledby="handyman-services" className="relative max-w-7xl mx-auto" id="handyman">
        <h2 id="handyman-services" className="sr-only">Handyman Services</h2>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="loader" />
          </div>
        ) : subServices.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No handyman services found.</p>
        ) : (
          <>
            {/* Mobile - Grid View */}
            <div className="sm:hidden grid grid-cols-4 gap-3">
              {mobileServiceItems}
            </div>

            {/* Desktop - Swiper View */}
            <div className="hidden sm:block relative px-10">
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
                aria-label="Handyman services carousel"
              >
                {desktopServiceItems}
              </Swiper>

              {/* Navigation buttons */}
              <button
                onClick={() => swiperRef.current?.swiper.slidePrev()}
                aria-label="Previous services"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 w-10 h-10 z-10 flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span aria-hidden="true">&larr;</span>
              </button>
              <button
                onClick={() => swiperRef.current?.swiper.slideNext()}
                aria-label="Next services"
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 w-10 h-10 z-10 flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}