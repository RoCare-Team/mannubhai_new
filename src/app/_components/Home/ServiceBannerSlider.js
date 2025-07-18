"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

// Memoized banner data to prevent recreation on re-renders
const serviceBannerData = Object.freeze([
  { 
    ServiceIcon: "/Appliance Slider Banner/RO Repair.webp", 
    link: "water-purifier-service",
    alt: "RO Repair Service" 
  },
  { 
    ServiceIcon: "/Appliance Slider Banner/AC Repair.webp", 
    link: "ac-service",
    alt: "AC Repair Service" 
  },
  { 
    ServiceIcon: "/Appliance Slider Banner/fridge repair.webp", 
    link: "refrigerator-repair-service",
    alt: "Refrigerator Repair Service" 
  },
  { 
    ServiceIcon: "/Appliance Slider Banner/washing machine repair.webp", 
    link: "washing-machine-repair",
    alt: "Washing Machine Repair Service" 
  },
  { 
    ServiceIcon: "/Appliance Slider Banner/all repairs.webp", 
    link: "appliance",
    alt: "All Appliance Repairs" 
  },
]);

export default function ServiceBannerSlider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  // Memoized navigation update function
  const updateNavigation = useCallback(() => {
    if (swiperInstance?.params?.navigation) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  // Effect for navigation setup
  useEffect(() => {
    updateNavigation();
  }, [updateNavigation]);

  // Optimized Swiper configuration
  const swiperConfig = {
    modules: [Navigation],
    onSwiper: setSwiperInstance,
    spaceBetween: 20,
    slidesPerView: 1,
    slidesOffsetBefore: 20,
    slidesOffsetAfter: 20,
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
    // Additional performance optimizations
    watchSlidesProgress: true,
    resistanceRatio: 0.85,
    shortSwipes: false,
    threshold: 10,
    followFinger: true,
  };

  return (
    <div className="w-full px-4 mx-auto max-w-7xl">
      <div className="relative">
        {/* Navigation buttons with aria labels */}
        <button
          ref={prevRef}
          aria-label="Previous slide"
          className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaArrowLeft className="text-gray-700" />
        </button>
        <button
          ref={nextRef}
          aria-label="Next slide"
          className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaArrowRight className="text-gray-700" />
        </button>

        <Swiper {...swiperConfig}>
          {serviceBannerData.map((item, idx) => (
            <SwiperSlide key={`${item.link}-${idx}`}>
              <Link href={item.link} className="block w-full" prefetch={false}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg shadow transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <Image
                    src={item.ServiceIcon}
                    alt={item.alt || `Service ${idx + 1}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={80}
                    placeholder="blur"
                    blurDataURL="/blur-placeholder.png"
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