"use client";
import Link from "next/link";
import { CiLocationOn } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { MdOutlineEventNote } from "react-icons/md";
import { IoHelpCircleOutline, IoCloseOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";

export default function MobileMenu({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  user,
  setShowLogin,
  navigationItems,
  locationText,
  setShowLocationSearch,
  handleLogout,
  getbookingdata
}) {
  if (!isMobileMenuOpen) return null;
  
  return (
    <div className="lg:hidden fixed inset-0 z-[60] bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
      <div 
        className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close menu"
          >
            <IoCloseOutline className="text-xl" />
          </button>
        </div>

        {user ? (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {user.name ? user.name.charAt(0).toUpperCase() : <CgProfile />}
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.name || "Customer"}</p>
                <p className="text-xs text-gray-500 mt-1">{user.mobile}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-gray-100">
            <button
              onClick={() => {
                setShowLogin(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Login / Sign Up
            </button>
          </div>
        )}

        <div className="py-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 capitalize"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {user && (
          <div className="py-2 border-t border-gray-100">
            <Link
              href="/account"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <CgProfile className="mr-3 text-lg" />
              Profile
            </Link>
            <Link
              href="/my-bookings"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                getbookingdata();
                setIsMobileMenuOpen(false);
              }}
            >
              <MdOutlineEventNote className="mr-3 text-lg" />
              My Bookings
            </Link>
            <Link
              href="/helpCenter"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <IoHelpCircleOutline className="mr-3 text-lg" />
              Help Center
            </Link>
          </div>
        )}

        <div className="p-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Your Location</span>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setShowLocationSearch(true);
              }}
              className="text-xs text-blue-500 underline"
            >
              Change
            </button>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <CiLocationOn className="text-lg mt-0.5 shrink-0" />
            <p className="break-words">{locationText}</p>
          </div>
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 text-left text-red-600 border-t border-gray-100 flex items-center"
          >
            <FiLogOut className="mr-3 text-lg" />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}