'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { IoSearchOutline } from "react-icons/io5";

 const SERVICES = [
    { name: "Air Conditioner", slug: "ac-service", image: "/HomeIcons/AIR-CONDITIONAR.png" },
    { name: "Air Purifier", slug: "air-purifier-repair-service", image: "/HomeIcons/air-purifier.png" },
    { name: "Bathroom Cleaning", slug: "bathroom-cleaning", image: "/HomeCare/BATHROOM-CLEANING.png" },
    { name: "Carpenter", slug: "carpenter", image: "/HandyMan/CARPENTER.webp" },
    { name: "Electrician", slug: "electrician", image: "/HandyMan/ELECTRICIAN.webp" },
    { name: "Fridge", slug: "refrigerator-repair-service", image: "/HomeIcons/REFRIGERATOR.png" },
    { name: "Geyser", slug: "geyser-repair", image: "/HomeIcons/geyser.png" },
    { name: "Hair Studio", slug: "hair-studio", image: "/BeautyCare/hair studio.png" },
    { name: "Home Deep Cleaning", slug: "home-deep-cleaning", image: "/HomeCare/HOMEDEEPCLEANING.png" },
    { name: "Kitchen Appliance", slug: "kitchen-appliance-repair-service", image: "/HomeIcons/Kitchen-Appliance.png" },
    { name: "Kitchen Chimney", slug: "kitchen-chimney-repair-service", image: "/HomeIcons/KitchenChimney.png" },
    { name: "Kitchen Cleaning", slug: "kitchen-cleaning", image: "/HomeCare/KITCHEN-CLEANING.png" },
    { name: "LED TV", slug: "led-tv-repair-service", image: "/HomeIcons/LED-TV.png" },
    { name: "Makeup", slug: "makeup", image: "/BeautyCare/makeup.png" },
    { name: "Masons", slug: "mason-service", image: "/HandyMan/OTHER.webp" },
    { name: "Massage For Men", slug: "men-massage-at-home", image: "/BeautyCare/massage for men.png" },
    { name: "Men Salon At Home", slug: "men-salon-at-home", image: "/BeautyCare/Men Salon at Home.png" },
    { name: "Microwave", slug: "microwave-repair-service", image: "/HomeIcons/MICROWAVE.png" },
    { name: "Painter", slug: "painting-services", image: "/HandyMan/PAINTER.webp" },
    { name: "Pedicure And Manicure", slug: "manicure-and-pedicure", image: "/BeautyCare/pedicure and maniure.png" },
    { name: "Pest Control", slug: "pest-control", image: "/HomeCare/PEST-CONTROL.png" },
    { name: "Plumber", slug: "plumber", image: "/HandyMan/PLUMBER.webp" },
    { name: "Sofa Cleaning", slug: "sofa-cleaning", image: "/HomeCare/SOFA-CLEANING.png" },
    { name: "Spa For Women", slug: "spa-for-women", image: "/BeautyCare/spa for women.png" },
    { name: "Tank Cleaning", slug: "tank-cleaning", image: "/HomeCare/TANK-CLEANING.png" },
    { name: "Vacuum Cleaner", slug: "vacuum-cleaner-repair-service", image: "/HomeIcons/vacuum-cleaner.png" },
    { name: "Washing Machine", slug: "washing-machine-repair", image: "/ApplianceHomeIcons/WASHING-MACHINE.webp" },
    { name: "Water Purifier", slug: "water-purifier-service", image: "/HomeIcons/RO.png" },
    { name: "Women Salon At Home", slug: "women-salon-at-home", image: "/BeautyCare/women salon at home.png" }
  ];
const CategorySearch = ({ isDesktop, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter services based on search term
  const filteredServices = SERVICES.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



const getServiceUrl = (serviceSlug) => {
  const segments = pathname.split('/').filter(Boolean);
  
  // If we're on a city+service page (/city-name/service-slug)
  if (segments.length === 2 && segments[0] !== 'franchise-opportunities') {
    return `/${segments[0]}/${serviceSlug}`;
  }
  
  // If we're on a city page (/city-name)
  if (segments.length === 1 && !SERVICES.some(s => s.slug === segments[0])) {
    return `/${segments[0]}/${serviceSlug}`;
  }
  
  // Default to root-level service page
  return `/${serviceSlug}`;
};

  const handleServiceClick = (slug) => {
    setIsOpen(false);
    setSearchTerm('');
    router.push(getServiceUrl(slug));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm && filteredServices.length > 0) {
      handleServiceClick(filteredServices[0].slug);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div 
      className={`relative ${isDesktop ? 'w-[200px]' : 'w-full'} ${className || ''}`} 
      ref={dropdownRef}
    >
      {/* Search Input */}
      <div className={`flex items-center ${isDesktop ? 'border border-gray-300 rounded-lg' : 'bg-gray-50 rounded-lg'} px-3 py-2`}>
        <IoSearchOutline className="text-gray-500 text-lg shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={`flex-1 bg-transparent outline-none text-sm ${isDesktop ? 'px-2' : ''}`}
        />
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {filteredServices.length > 0 ? (
            <ul>
              {filteredServices.map((service) => (
                <li 
                  key={service.slug}
                  onClick={() => handleServiceClick(service.slug)}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 flex items-center justify-center mr-3">
                    <Image 
                      src={service.image} 
                      alt={service.name} 
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{service.name}</p>
                    <p className="text-xs text-gray-500">
                      {getServiceUrl(service.slug).replace(/^\//, '')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-gray-500 text-sm">
                {searchTerm ? `No services found for "${searchTerm}"` : 'Start typing to search'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySearch;