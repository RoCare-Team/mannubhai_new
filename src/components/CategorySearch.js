import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoSearchOutline } from "react-icons/io5";

const CategorySearch = ({ isDesktop, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

 const SERVICES = [
    { name: "Air Conditioner", slug: "ac-service", image: "/HomeIcons/AIR-CONDITIONAR.png" },
    { name: "Air Purifier", slug: "air-purifier-repair-service", image: "/HomeIcons/air-purifier.png" },
    { name: "Bathroom Cleaning", slug: "bathroom-cleaning", image: "/HomeCare/BATHROOM-CLEANING.png" },
    { name: "Carpenter", slug: "carpenter", image: "/HandyMan/CARPENTER.png" },
    { name: "Electrician", slug: "electrician", image: "/HandyMan/ELECTRICIAN.png" },
    { name: "Fridge", slug: "refrigerator-repair-service", image: "/HomeIcons/REFRIGERATOR.png" },
    { name: "Geyser", slug: "geyser-repair", image: "/HomeIcons/geyser.png" },
    { name: "Hair Studio", slug: "hair-studio", image: "/BeautyCare/hair studio.png" },
    { name: "Home Deep Cleaning", slug: "home-deep-cleaning", image: "/HomeCare/HOMEDEEPCLEANING.png" },
    { name: "Kitchen Appliance", slug: "kitchen-appliance-repair-service", image: "/HomeIcons/Kitchen-Appliance.png" },
    { name: "Kitchen Chimney", slug: "kitchen-chimney-repair-service", image: "/HomeIcons/KitchenChimney.png" },
    { name: "Kitchen Cleaning", slug: "kitchen-cleaning", image: "/HomeCare/KITCHEN-CLEANING.png" },
    { name: "LED TV", slug: "led-tv-repair-service", image: "/HomeIcons/LED-TV.png" },
    { name: "Makeup", slug: "makeup", image: "/BeautyCare/makeup.png" },
    { name: "Masons", slug: "mason-service", image: "/HandyMan/OTHER.jpeg" },
    { name: "Massage For Men", slug: "men-massage-at-home", image: "/BeautyCare/massage for men.png" },
    { name: "Men Salon At Home", slug: "men-salon-at-home", image: "/BeautyCare/Men Salon at Home.png" },
    { name: "Microwave", slug: "microwave-repair-service", image: "/HomeIcons/MICROWAVE.png" },
    { name: "Painter", slug: "painting-services", image: "/HandyMan/PAINTER.png" },
    { name: "Pedicure And Manicure", slug: "manicure-and-pedicure", image: "/BeautyCare/pedicure and maniure.png" },
    { name: "Pest Control", slug: "pest-control", image: "/HomeCare/PEST-CONTROL.png" },
    { name: "Plumber", slug: "plumber", image: "/HandyMan/PLUMBER.png" },
    { name: "Sofa Cleaning", slug: "sofa-cleaning", image: "/HomeCare/SOFA-CLEANING.png" },
    { name: "Spa For Women", slug: "spa-for-women", image: "/BeautyCare/spa for women.png" },
    { name: "Tank Cleaning", slug: "tank-cleaning", image: "/HomeCare/TANK-CLEANING.png" },
    { name: "Vacuum Cleaner", slug: "vacuum-cleaner-repair-service", image: "/HomeIcons/vacuum-cleaner.png" },
    { name: "Washing Machine", slug: "washing-machine-repair", image: "/HomeIcons/WASHINGMACHINE.png" },
    { name: "Water Purifier", slug: "water-purifier-service", image: "/HomeIcons/RO.png" },
    { name: "Women Salon At Home", slug: "women-salon-at-home", image: "/BeautyCare/women salon at home.png" }
  ];
  const filteredServices = SERVICES.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className={`relative ${isDesktop ? 'w-[200px]' : 'w-full'} ${className || ''}`} 
      ref={dropdownRef}
    >
      {/* Search Input - Different styling for desktop/mobile */}
      {isDesktop ? (
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
        />
      ) : (
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
          <IoSearchOutline className="text-gray-500 text-lg shrink-0" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
          />
        </div>
      )}

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <Link
                key={service.name}
                href={`/${service.slug}`}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Image 
                  src={service.image} 
                  alt={service.name} 
                  width={24}
                  height={24}
                  className="w-6 h-6 mr-3 object-contain"
                />
                <span className="text-sm">{service.name}</span>
              </Link>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-center text-sm">
              No services found for {searchTerm}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySearch;