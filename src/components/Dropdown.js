"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaCaretDown } from "react-icons/fa";

const Dropdown = ({ countries }) => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleChange = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-all"
      >
        <Image
          src={selectedCountry.flag}
          alt={`${selectedCountry.code} flag`}
          width={24}
          height={16}
          className="rounded object-cover"
        />
        <span className="font-medium">{selectedCountry.code}</span>
        <FaCaretDown className="text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
          {countries.map((country) => (
            <button
              key={country.code}
              onClick={() => handleChange(country)}
              className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 transition-all"
            >
              <Image
                src={country.flag}
                alt={`${country.code} flag`}
                width={24}
                height={16}
                className="rounded object-cover"
              />
              <span className="font-medium">{country.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
