"use client";
import React from "react";
import Image from "next/image";

const beautyBrands = [
  { name: "O3+", src: "/Beauty Brand Logo/O3.webp" },
  { name: "L'Oréal", src: "/Beauty Brand Logo/loreal.webp" },
  { name: "Lotus", src: "/Beauty Brand Logo/lotus.webp" },
  { name: "Raaga", src: "/Beauty Brand Logo/raaga.webp" }
];

const BeautyBrand = () => {
  return (
    <section className="w-full transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Modern heading with subtle gradient */}
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

        {/* Brands grid with gradient hover effect */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-6 px-2 sm:px-0">
          {beautyBrands.map((brand, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl p-4 sm:p-4 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-sm"
            >
              {/* Gradient background on hover - only on desktop */}
              <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              
              {/* White border that becomes gradient on hover - only on desktop */}
              <div className="hidden sm:block absolute inset-0 rounded-xl border-2 border-white group-hover:border-transparent transition-all duration-300 z-10 pointer-events-none"></div>
              
              {/* Gradient border effect (revealed on hover) - only on desktop */}
              <div className="hidden sm:block absolute inset-0 rounded-xl p-[2px] bg-gradient-to-br from-purple-300 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10">
                <div className="bg-white rounded-[9px] h-full w-full"></div>
              </div>
              
              {/* Content */}
              <div className="relative h-28 sm:h-24 w-full mb-3 z-20">
                <Image
                  src={brand.src}
                  alt={brand.name}
                  fill
                  className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
                  quality={90}
                  sizes="(max-width: 640px) 150px, 150px"
                  loading="eager"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeautyBrand;