// components/UserDropdown.js
"use client";
import { useState, useRef, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineEventNote } from "react-icons/md";
import { IoHelpCircleOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import Link from "next/link";

export default function UserDropdown({
  user,
  setShowLogin,
  handleLogout,
  getbookingdata
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) {
    return (
      <button
        onClick={() => setShowLogin(true)}
        className="text-xl text-gray-700 hover:text-blue-500 transition-colors"
        aria-label="Profile"
      >
        <CgProfile />
      </button>
    );
  }

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
          {user.name ? user.name.charAt(0).toUpperCase() : <CgProfile />}
        </div>
      </div>

      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-medium text-gray-900">
              {user.name || "Customer"}
            </p>
            <p className="text-xs text-gray-500 mt-1 truncate">
              {user.mobile}
            </p>
          </div>
          <div className="py-1">
            <Link
              href="/account"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <CgProfile className="mr-3 text-lg" />
              Profile
            </Link>
            <Link
              href="/my-bookings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={getbookingdata}
            >
              <MdOutlineEventNote className="mr-3 text-lg" />
              My Bookings
            </Link>
            <Link
              href="/helpCenter"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <IoHelpCircleOutline className="mr-3 text-lg" />
              Help Center
            </Link>
          </div>
          <div className="py-1 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              <FiLogOut className="mr-3 text-lg" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}