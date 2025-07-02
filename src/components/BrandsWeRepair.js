"use client";
import React from "react";
import Image from "next/image";

const brands = [
  { name: "Samsung", src: "/Brand/samsung-logo.webp" },
  { name: "Toshiba", src: "/Brand/toshiba-logoo.webp" },
  { name: "LG", src: "/Brand/lg-logo.webp" },
  { name: "Bosch", src: "/Brand/bosch-logo.webp" },
  { name: "Electrolux", src: "/Brand/Electrolux-.webp" },
  { name: "Haier", src: "/Brand/haire-logo.webp" },
  { name: "Whirlpool", src: "/Brand/whirlpool.webp" },
  { name: "Sharp", src: "/Brand/sharp-logo.webp" },
  { name: "Daikin", src: "/Brand/dekin-logo.webp" },
  { name: "Kent", src: "/Brand/kent-logo.webp" },
  { name: "Eureka Forbes", src: "/Brand/eurekha.webp" },
  { name: "Sony", src: "/Brand/sony.webp" },
];

const BrandsWeRepair = () => {
  return (
    <section className="py-12">
      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-purple-700 mb-2">
            Brands we repair
          </h2>
          <p className="text-gray-600 mb-8">
            No matter where you bought it, we can fix it. We repair most major brands, makes, and models.
          </p>

          {/* Mobile Slider */}
          <div className="flex sm:hidden overflow-x-auto gap-4 pb-5 -mx-2 px-2">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-32 h-20 bg-white rounded-xl shadow-md p-3 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={brand.src}
                  alt={brand.name}
                  width={100}
                  height={50}
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          {/* Desktop Grid */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-center">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={brand.src}
                  alt={brand.name}
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandsWeRepair;
