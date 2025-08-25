"use client";

import React from "react";
import Image from "next/image";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

// import required modules
import { Autoplay, Pagination } from "swiper/modules";

const beautyBrands = [
  { name: "O3+", src: "/Beauty Brand Logo/O3.webp" },
  { name: "L'Oréal", src: "/Beauty Brand Logo/loreal.webp" },
  { name: "Lotus", src: "/Beauty Brand Logo/lotus.webp" },
  { name: "Raaga", src: "/Beauty Brand Logo/raaga.webp" },
  // Add more brands for a better slider experience
];

const BeautyBrand = () => {
  return (
    <section className="w-full transition-colors duration-300 py-8 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Modern heading - unchanged */}
        <div className="text-center mb-12 mt-8">
          <span className="text-xs sm:text-sm font-medium text-purple-500 mb-3 block tracking-widest uppercase">
            Professional Quality
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Our Premium Brands
            </span>
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            Trusted by professionals worldwide
          </p>
        </div>

        {/* Swiper Slider Implementation */}
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          spaceBetween={24} // Corresponds to gap-6
          breakpoints={{
            // when window width is >= 320px (mobile - 1 slide)
            320: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
            // when window width is >= 640px (tablet - 3 slides)
            640: {
              slidesPerView: 3,
            },
            // when window width is >= 1024px (desktop - 4 slides)
            1024: {
              slidesPerView: 4,
            },
          }}
          className="mySwiper" // Custom class for styling
        >
          {beautyBrands.map((brand, index) => (
            <SwiperSlide key={index} className="group pb-12">
              {/* The card styling from your original code is preserved here */}
              <div className="relative bg-white rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-sm h-full">
                {/* Gradient background on hover - desktop */}
                <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                
                {/* Gradient border effect (revealed on hover) - desktop */}
                <div className="hidden sm:block absolute -inset-px rounded-xl p-[2px] bg-gradient-to-br from-purple-300 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white rounded-[9px] h-full w-full"></div>
                </div>

                {/* Content */}
                <div className="relative h-28 sm:h-24 w-full z-10">
                  <Image
                    src={brand.src}
                    alt={`${brand.name} logo`}
                    fill
                    className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
                    quality={85}
                    // CORE WEB VITALS OPTIMIZATION:
                    // 1. Eagerly load the first few images that are visible on page load.
                    // 2. Lazily load the rest.
                    // 3. Give priority to the first few images to improve LCP.
                    loading={index < 4 ? "eager" : "lazy"}
                    priority={index < 4}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 30vw, 20vw"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* GLOBAL STYLES for Swiper Pagination (removed navigation styles) */}
      {/* This is a clean way to apply custom styles without a separate CSS file */}
      <style jsx global>{`
        .mySwiper .swiper-pagination-bullet {
          background-color: #d8b4fe; /* purple-300 */
          width: 10px;
          height: 10px;
          transition: background-color 0.3s, transform 0.3s;
        }
        .mySwiper .swiper-pagination-bullet-active {
          background-color: #a855f7; /* purple-600 */
          transform: scale(1.2);
        }
      `}</style>
    </section>
  );
};

export default BeautyBrand;