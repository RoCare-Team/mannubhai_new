"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { MapPin } from "lucide-react";

const cities = [
  { name: "Delhi", img: "/city/delhi.webp", link: "/delhi" },
  { name: "Gurgaon", img: "/city/indore.webp", link: "/gurgaon" },
  { name: "Noida", img: "/city/indore.webp", link: "/noida" },
  { name: "Bangalore", img: "/city/bang.webp", link: "/bangalore" },
  { name: "Hyderabad", img: "/city/hey.webp", link: "/hyderabad" },
  { name: "Ahmedabad", img: "/city/aham.webp", link: "/ahmedabad" },
  { name: "Pune", img: "/city/pune.webp", link: "/pune" },
  { name: "Ghaziabad", img: "/city/indore.webp", link: "/ghaziabad" },
  { name: "Faridabad", img: "/city/indore.webp", link: "/faridabad" },
  { name: "Jaipur", img: "/city/jaipur.webp", link: "/jaipur" },
  { name: "Lucknow", img: "/city/lucknoe.webp", link: "/lucknow" },
  { name: "Kanpur", img: "/city/kanpur.webp", link: "/kanpur" },
  { name: "Nagpur", img: "/city/nagpur.webp", link: "/nagpur" },
  { name: "Thane", img: "/city/thane.webp", link: "/thane" },
  { name: "Patna", img: "/city/patna.webp", link: "/patna" },
  { name: "Indore", img: "/city/indore.webp", link: "/indore" },
];

const PopularCities = () => {
  return (
    <section id="popular-cities" className="sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-center mb-4 sm:mb-8 text-gray-800">
          <span className="inline-flex items-center gap-2">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            Popular Cities
          </span>
        </h2>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={6}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            320: { slidesPerView: 4 },
            480: { slidesPerView: 5 },
            640: { slidesPerView: 6 },
            768: { slidesPerView: 7 },
            1024: { slidesPerView: 8 },
            1280: { slidesPerView: 10 },
            1536: { slidesPerView: 12 },
          }}
          className="w-full"
        >
          {cities.map((city, index) => (
            <SwiperSlide key={index}>
              <Link href={city.link} className="block group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 w-16 mx-auto">
                  <div className="relative w-10 h-10 mx-auto mt-2 overflow-hidden rounded-full">
                    <Image
                      src={city.img}
                      alt={`${city.name} city`}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  </div>
                  <div className="text-center py-1 px-1">
                    <h4 className="text-xs font-medium text-gray-700 group-hover:text-indigo-600 transition-colors truncate">
                      {city.name}
                    </h4>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PopularCities;