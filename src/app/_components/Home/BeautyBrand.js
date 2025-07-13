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
    <section className="w-full py-10 sm:py-14 bg-gradient-to-b from-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        {/* Heading with better hierarchy */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-sm sm:text-base font-medium text-purple-600 mb-2 block">
            Trusted Professional Brands
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Premium Beauty Brands We Use
          </h3>
       
        </div>

        {/* Responsive Brands Grid - Single implementation */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-5 md:gap-6 lg:gap-8 px-2 sm:px-0">
          {beautyBrands.map((brand, index) => (
            <div
              key={index}
              className="bg-white rounded-lg sm:rounded-xl shadow-xs sm:shadow-sm p-3 sm:p-4 md:p-5 flex flex-col items-center justify-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="relative h-16 sm:h-20 md:h-24 w-full mb-2 sm:mb-3">
                <Image
                  src={brand.src}
                  alt={brand.name}
                  fill
                  className="object-contain object-center"
                  quality={90}
                  sizes="(max-width: 640px) 100px, 150px"
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                {brand.name}
              </span>
            </div>
          ))}
        </div>

        {/* Optional decorative element */}
        <div className="mt-12 flex justify-center">
          <div className="h-1 w-20 bg-purple-100 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default BeautyBrand;