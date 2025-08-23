"use client";

import React, { useState } from "react";
import Link from "next/link";

const services = [
  {
    title: "Home Appliance",
    icon: "🛠️",
    description: "Expert repair and maintenance for all home appliances",
    subServices: [
      {
        title: "Water Purifier",
        slug: "water-purifier-service",
        icon: "💧",
        description: "Complete installation, maintenance, and repair of all water purifiers",
      },
      {
        title: "Air Conditioners",
        slug: "ac-service",
        icon: "❄️",
        description: "AC installation, servicing, gas refilling, and repair at your doorstep",
      },
      {
        title: "Washing Machine",
        slug: "washing-machine-repair",
        icon: "🧺",
        description: "Quick and affordable repair and maintenance for all types of washing machines",
      },
      {
        title: "Kitchen Chimney",
        slug: "kitchen-chimney-repair-service",
        icon: "🍳",
        description: "Deep cleaning, installation, and repair of all brands of kitchen chimneys",
      },
      {
        title: "Refrigerator",
        slug: "refrigerator-repair-service",
        icon: "🧊",
        description: "Expert refrigerator servicing, gas filling, and compressor replacement",
      },
      {
        title: "LED TV",
        slug: "led-tv-repair-service",
        icon: "📺",
        description: "LED TV screen repair, motherboard issues, and general troubleshooting",
      },
    ],
  },
  {
    title: "Beauty Care",
    icon: "💅",
    description: "Salon-quality beauty services delivered at your home",
    subServices: [
      {
        title: "Women Salon At Home",
        slug: "women-salon-at-home",
        icon: "💄",
        description: "Full range of salon services for women in the comfort of your home",
      },
      {
        title: "Makeup",
        slug: "makeup",
        icon: "💋",
        description: "Professional makeup services for weddings, parties, and special occasions",
      },
      {
        title: "Spa for Women",
        slug: "spa-for-women",
        icon: "💆‍♀️",
        description: "Relaxing spa treatments including facials, massages, and more",
      },
      {
        title: "Men Salon At Home",
        slug: "men-salon-at-home",
        icon: "💇‍♂️",
        description: "Haircut, beard grooming, and salon services for men at home",
      },
      {
        title: "Massage for Men",
        slug: "men-massage-at-home",
        icon: "💆‍♂️",
        description: "Professional body massage services for men at your doorstep",
      },
      {
        title: "Pedicure & Manicure",
        slug: "manicure-and-pedicure",
        icon: "💅",
        description: "Refreshing manicure and pedicure services at home",
      },
    ],
  },
  {
    title: "Handyman Service",
    icon: "🛠️",
    description: "Quick and reliable handyman services for your home",
    subServices: [
      {
        title: "Painter",
        slug: "painting-services",
        icon: "🎨",
        description: "Professional wall painting and texture painting services",
      },
      {
        title: "Plumber",
        slug: "plumber",
        icon: "🔧",
        description: "Expert plumbing services including leak fixing and new installations",
      },
      {
        title: "Carpenter",
        slug: "carpenter",
        icon: "🪚",
        description: "Carpentry services for furniture repair, fitting, and installations",
      },
      {
        title: "Electrician",
        slug: "electrician",
        icon: "💡",
        description: "Electrical installation, wiring, repair, and troubleshooting",
      },
    ],
  },
  {
    title: "Home Care",
    icon: "🧹",
    description: "Professional cleaning and maintenance services for your home",
    subServices: [
      {
        title: "Sofa Cleaning",
        slug: "sofa-cleaning",
        icon: "🛋️",
        description: "Deep cleaning and shampooing of all types of sofas",
      },
      {
        title: "Kitchen Cleaning",
        slug: "kitchen-cleaning",
        icon: "🍳",
        description: "Thorough cleaning of kitchen walls, cabinets, tiles, and appliances",
      },
      {
        title: "Bathroom Cleaning",
        slug: "bathroom-cleaning",
        icon: "🚿",
        description: "Removal of stains, scaling, and sanitization of bathrooms",
      },
      {
        title: "Home Deep Cleaning",
        slug: "home-deep-cleaning",
        icon: "🏠",
        description: "Complete home deep cleaning including floors, walls, and furniture",
      },
      {
        title: "Pest Control",
        slug: "pest-control-service",
        icon: "🐜",
        description: "Pest control treatments for cockroaches, ants, termites, and more",
      },
      {
        title: "Tank Cleaning",
        slug: "tank-cleaning-service",
        icon: "🛢️",
        description: "Comprehensive cleaning and sanitization of water storage tanks",
      },
    ],
  },
];


const ServicesWithTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 font-sans text-gray-800"
      aria-labelledby="our-services-heading"
    >
      <header className="text-center mb-6 md:mb-8">
        <h2
          id="our-services-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-700 mb-2 md:mb-4"
        >
          Our Services
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our wide range of professional services tailored for your home and lifestyle needs.
        </p>
      </header>

      {/* Tabs */}
      <nav
        className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-6 md:mb-10"
        role="tablist"
        aria-label="Service categories"
      >
        {services.map((service, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`service-panel-${index}`}
            id={`service-tab-${index}`}
            onClick={() => setActiveTab(index)}
            className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold border transition ${
              activeTab === index
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-100"
            }`}
          >
            <span className="text-xl sm:text-2xl" aria-hidden="true">{service.icon}</span>
            <span>{service.title}</span>
          </button>
        ))}
      </nav>

      {/* Sub Services */}
      <section
        id={`service-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`service-tab-${activeTab}`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {services[activeTab].subServices.length > 0 ? (
            services[activeTab].subServices.map((subService, index) => (
              <article
                key={index}
                className="flex flex-col justify-between h-full border border-indigo-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 bg-white shadow-sm hover:shadow-md transition hover:bg-indigo-50 cursor-pointer"
              >
                <header className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  <div
                    className="text-2xl sm:text-3xl p-1 sm:p-2 bg-indigo-100 rounded-full group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  >
                    {subService.icon}
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-indigo-700">
                    <Link href={`/${subService.slug}`} className="hover:underline">
                      {subService.title}
                    </Link>
                  </h3>
                </header>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {subService.description}
                </p>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center text-indigo-700 font-semibold text-base sm:text-lg md:text-xl py-8 sm:py-12 animate-pulse">
              Coming Soon 🚀
            </div>
          )}
        </div>
      </section>
    </section>
  );
};

export default ServicesWithTabs;