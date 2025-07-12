"use client";
import React from "react";
import Image from "next/image";
const beatybrands = [
  { name: "O3+", src: "Beauty Brand Logo/O3+.webp" },
  { name: "Loreal", src: "Beauty Brand Logo/loreal.webp" },
  { name: "Lotus", src: "Beauty Brand Logo/lotus.webp" },
  { name: "Raaga", src: "Beauty Brand Logo/raaga.webp" }

];
const BeautyBrand = () => {
  return (
    <section className="py-12">
      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-purple-700 mb-2">
          Beauty  Brands we serve
          </h2>
          {/* Mobile Slider */}
          <div className="flex sm:hidden overflow-x-auto gap-4 pb-5 -mx-2 px-2">
            {beatybrands.map((BeautyBrand, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={BeautyBrand.src}
                  alt={BeautyBrand.name}
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
            ))}

          </div>

          {/* Desktop Grid */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 items-center justify-center">
            {beatybrands.map((BeautyBrand, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={BeautyBrand.src}
                  alt={BeautyBrand.name}
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

