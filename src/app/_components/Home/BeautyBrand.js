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
    <section className="w-full sm:py-16 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Modern heading with subtle gradient */}
        <div className="text-center mb-12">
          <span className="text-xs sm:text-sm font-medium text-purple-500 dark:text-purple-400 mb-3 block tracking-widest uppercase">
            Professional Quality
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400">
              Our Premium Brands
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm">
            Trusted by professionals worldwide
          </p>
        </div>

        {/* Brands grid with gradient hover effect */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0">
          {beautyBrands.map((brand, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-sm dark:shadow-none"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-900/20 dark:via-gray-800/50 dark:to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              
              {/* White border that becomes gradient on hover */}
              <div className="absolute inset-0 rounded-xl border-2 border-white dark:border-gray-700 group-hover:border-transparent transition-all duration-300 z-10 pointer-events-none"></div>
              
              {/* Gradient border effect (revealed on hover) */}
              <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-br from-purple-300 to-pink-300 dark:from-purple-500 dark:to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10">
                <div className="bg-white dark:bg-gray-800 rounded-[9px] h-full w-full"></div>
              </div>

              {/* Content */}
              <div className="relative h-20 sm:h-24 w-full mb-3 z-20">
                <Image
                  src={brand.src}
                  alt={brand.name}
                  fill
                  className="object-contain object-center transition-transform duration-300 group-hover:scale-105 dark:brightness-90 dark:hover:brightness-100"
                  quality={90}
                  sizes="(max-width: 640px) 100px, 150px"
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