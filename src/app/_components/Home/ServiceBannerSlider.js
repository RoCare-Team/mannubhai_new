"use client";

import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const serviceBannerData = [
    { ServiceIcon: "/Appliance Slider Banner/RO Repair.webp", link: "water-purifier-service" },
  { ServiceIcon: "/Appliance Slider Banner/AC Repair.webp", link: "ac-service" },
    { ServiceIcon: "/Appliance Slider Banner/fridge repair.webp", link: "refrigerator-repair-service" },

  { ServiceIcon: "/Appliance Slider Banner/washing machine repair.webp", link: "washing-machine-repair" },
    { ServiceIcon:"/Appliance Slider Banner/all repairs.webp", link: "appliance" },
];

export default function ServiceBannerSlider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  // Attach custom nav buttons once Swiper is ready
  useEffect(() => {
    if (swiperInstance && swiperInstance.params?.navigation) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  return (
    <div className="w-full px-4 mx-auto max-w-7xl">
      {/* Slider wrapper */}
      <div className="relative">
        {/* Navigation buttons */}
        <button
          ref={prevRef}
          className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow hover:bg-gray-200"
        >
          <FaArrowLeft />
        </button>
        <button
          ref={nextRef}
          className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow hover:bg-gray-200"
        >
          <FaArrowRight />
        </button>

        <Swiper
          modules={[Navigation]}
          onSwiper={setSwiperInstance}
          spaceBetween={20}
          slidesPerView={1}
          slidesOffsetBefore={20}   // <-- gap at the start
          slidesOffsetAfter={20}    // <-- gap at the end
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {serviceBannerData.map((item, idx) => (
            <SwiperSlide key={idx}>
              <Link href={item.link} className="block w-full">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg shadow transition hover:shadow-lg">
                  <Image
                    src={item.ServiceIcon}
                    alt={`Service ${idx + 1}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}