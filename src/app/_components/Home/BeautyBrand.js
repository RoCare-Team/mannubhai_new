"use client";
import React from "react";
import Image from "next/image";

const beatybrands = [
  { name: "O3+", src: "/Brand/O3+.webp" },
  { name: "Loreal", src: "/Brand/loreal.webp" },
  { name: "Lotus", src: "/Brand/lotus.webp" },
  { name: "Raaga", src: "/Brand/raaga.webp" },

];

const BeautyBrand = () => {
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
            {beatybrands.map((beatybrands, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-32 h-20 bg-white rounded-xl shadow-md p-3 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={beatybrands.src}
                  alt={beatybrands.name}
                  width={100}
                  height={50}
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          {/* Desktop Grid */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-center">
            {beatybrands.map((brand, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={beatybrands.src}
                  alt={beatybrands.name}
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

export default BeautyBrand;

