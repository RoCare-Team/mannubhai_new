"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

function HomeCareService() {
  const [showAllServices, setShowAllServices] = useState(false);
  const urlPath = usePathname();
  const city = urlPath.split("/")[1] || "";

  const services = [
    { id: 1, name: "Kitchen Cleaning", image: "/HomeCare/KITCHEN-CLEANING.png", link: "kitchen-cleaning" },
    { id: 2, name: "Home Deep Cleaning", image: "/HomeCare/HOMEDEEPCLEANING.png", link: "home-deep-cleaning" },
    { id: 3, name: "House Painting", image: "/HandyMan/PAINTER.png", link: "painting-services" },
    { id: 4, name: "Bathroom Cleaning", image: "/HomeCare/BATHROOM-CLEANING.png", link: "bathroom-cleaning" },
    { id: 5, name: "Sofa Cleaning", image: "/HomeCare/SOFA-CLEANING.png", link: "sofa-cleaning" },
    { id: 6, name: "Tank Cleaning", image: "/HomeCare/TANK-CLEANING.png", link: "tank-cleaning" },
    { id: 7, name: "Mason Service", image: "/HandyMan/OTHER.jpeg", link: "mason-service" },
    { id: 8, name: "Pest Control", image: "/HomeCare/PEST-CONTROL.png", link: "pest-control" },
    { id: 9, name: "Water Purifier", image: "/subCatImage/RO.png", link: "water-purifier-service" },
    { id: 10, name: "Air Conditioner", image: "/subCatImage/ac.png", link: "ac-service" },
    { id: 11, name: "Washing Machine", image: "/HomeIcons/WASHINGMACHINE.png", link: "washing-machine-repair" },
    { id: 12, name: "Fridge", image: "/HomeIcons/REFRIGERATOR.png", link: "refrigerator-repair-service" },
    { id: 13, name: "Air Purifier", image: "/HomeIcons/air-purifier.png", link: "air-purifier-repair-service" },
    { id: 14, name: "Kitchen Chimney", image: "/HomeIcons/KitchenChimney.png", link: "kitchen-chimney-repair-service" },
  ];

  const toggleAllServices = () => setShowAllServices((prev) => !prev);

  return (
    <div className="w-full px-4 md:px-16 py-12 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <h3
        className="text-center mb-10 text-3xl sm:text-4xl font-extrabold tracking-tight"
        style={{
          background: "linear-gradient(to right, #e7516c, #21679c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Home Appliance Services
      </h3>

      {/* Service Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {services.map((service, index) => {
          const href = `/${city}/${service.link}`;
          const showItem = showAllServices || index < 10;

          return (
            <div
              key={service.id}
              className={`${
                !showItem ? "hidden sm:block" : ""
              } group relative flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer`}
            >
              <Link href={href} className="flex flex-col items-center">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-4 overflow-hidden rounded-full border-2 border-gray-300 group-hover:border-indigo-400 transition-transform duration-300">
                  <Image
                    src={service.image}
                    alt={`${service.name} services`}
                    title={`${service.name} services`}
                    fill
                    sizes="(min-width: 640px) 128px, 112px"
                    className="object-contain"
                    priority
                  />
                </div>
                <p className="text-center text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                  {service.name}
                </p>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Toggle Button */}
      <div className="text-center mt-8">
        <button
          onClick={toggleAllServices}
          className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-indigo-600 rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300 focus:outline-none"
        >
          {showAllServices ? "Show Less" : "View All Services"}
        </button>
      </div>
    </div>
  );
}

export default HomeCareService;
