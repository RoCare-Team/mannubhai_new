"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import LogoLoader from "@/components/LogoLoader";

const DEFAULT_SERVICE_IMAGE = "/HomeIcons/default.png";
const SUBSERVICE_IMAGES = {
  Painter: "/HandyMan/PAINTER.png",
  Plumber: "/HandyMan/PLUMBER.png",
  Carpenter: "/HandyMan/CARPENTER.png",
  Electrician: "/HandyMan/ELECTRICIAN.png",
  Masons: "/HandyMan/OTHER.jpeg",
  Manson: "/HandyMan/OTHER.jpeg",
};

const DESIRED_ORDER = [
  "Painter",
  "Plumber",
  "Carpenter",
  "Electrician",
  "Manson",
];

const orderMap = DESIRED_ORDER.reduce((acc, name, idx) => {
  acc[name] = idx;
  return acc;
}, {});

const getSubServiceImage = (type) => SUBSERVICE_IMAGES[type] || DEFAULT_SERVICE_IMAGE;

export default function HandymanServices({ hideBanner = false, onServiceClick, cityUrl }) {
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const router = useRouter();
  const swiperRef = useRef(null);
  const [subServices, setSubServices] = useState([]);

  useEffect(() => {
    const fetchSubServices = async () => {
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
            (orderMap[a.ServiceName] ?? Number.MAX_SAFE_INTEGER) -
            (orderMap[b.ServiceName] ?? Number.MAX_SAFE_INTEGER)
        );

        setSubServices(data);
      } catch (error) {
        console.error("Error fetching handyman services:", error);
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
            {/* Mobile – 4‑up grid */}
            <div className="sm:hidden grid grid-cols-4 gap-3">
              {subServices.map((service) => (
                <div
                  key={service.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSubServiceClick(service)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSubServiceClick(service)
                  }
                  className="bg-white rounded-2xl shadow-md p-2 flex flex-col items-center cursor-pointer transition hover:scale-105 hover:shadow-xl h-full"
                  aria-label={`View ${service.ServiceName}`}
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                    <Image
                      src={service.ServiceIcon}
                      alt={service.ServiceName}
                      width={64}
                      height={64}
                      className="object-contain"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-center text-[10px] font-semibold leading-tight text-gray-700 break-words w-full">
                    {service.ServiceName}
                  </p>
                </div>
              ))}
            </div>

            {/* Tablet & Desktop – Swiper */}
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
                    <div
                      className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center cursor-pointer transition hover:scale-105 hover:shadow-xl"
                      onClick={() => handleSubServiceClick(service)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSubServiceClick(service)
                      }
                      role="button"
                      tabIndex={0}
                      aria-label={`View ${service.ServiceName}`}
                    >
                      <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                        <Image
                          src={service.ServiceIcon}
                          alt={service.ServiceName}
                          width={160}
                          height={160}
                          className="object-contain"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-center text-sm font-medium text-gray-700">
                        {service.ServiceName}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Swiper navigation */}
              <button
                onClick={() => swiperRef.current?.swiper.slidePrev()}
                aria-label="Previous services"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 w-8 h-8 z-10"
              >
                &larr;
              </button>
              <button
                onClick={() => swiperRef.current?.swiper.slideNext()}
                aria-label="Next services"
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 w-8 h-8 z-10"
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