"use client";
import Link from "next/link";
import Image from "next/image";
import { IoMenuOutline } from "react-icons/io5";
import { MdPersonOutline, MdOutlineShoppingCart } from "react-icons/md";
import CategorySearch from "./CategorySearch";
import LocationBar from "./LocationBar";
import UserDropdown from "./UserDropdown";

export default function MobileHeader({
  locationText,
  setShowLocationSearch,
  location,
  setIsMobileMenuOpen,
  setShowLogin,
  user,
  cartCount = 0,
  isUserDropdownOpen,
  toggleUserDropdown,
  userDropdownRef,
  handleLogout
}) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm lg:hidden">
      {/* Row 1: Logo + Location + User */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
        {/* Left side: Menu + Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1 text-gray-700 hover:text-blue-500"
            aria-label="Open menu"
          >
            <IoMenuOutline className="text-2xl" />
          </button> */}
          
          <Link href="/" className="block shrink-0">
            <Image
              src="/logo.png"
              alt="logo"
              width={160}
              height={60}
              className="h-8 sm:h-10 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Right side: Icons */}
        <div className="flex items-center gap-4">
          {/* Location */}
          <div className="hidden sm:block flex-shrink-0">
            <LocationBar
              locationText={locationText}
              setShowLocationSearch={setShowLocationSearch}
              location={location}
            />
          </div>

          {/* Cart */}
          <Link
            href="/checkout"
            className="relative text-xl text-gray-700 hover:text-blue-500"
            aria-label={`Cart ${cartCount > 0 ? `with ${cartCount} items` : ''}`}
          >
            <MdOutlineShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 rounded-full leading-none min-w-[18px] h-[18px] flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* User Icon */}
          <div className="relative" ref={userDropdownRef}>
            {user ? (
              <button
                onClick={toggleUserDropdown}
                className="text-xl text-gray-700 hover:text-blue-500"
                aria-label="User menu"
              >
                <MdPersonOutline className="text-2xl" />
              </button>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="text-xl text-gray-700 hover:text-blue-500"
                aria-label="Login"
              >
                <MdPersonOutline className="text-2xl" />
              </button>
            )}

            {isUserDropdownOpen && user && (
              <UserDropdown
                user={user}
                handleLogout={handleLogout}
                onClose={() => setIsUserDropdownOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Category Search + Mobile Location */}
      <div className="flex items-center border-t border-gray-100">
        <div className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2">
          <CategorySearch />
        </div>
        <div className="sm:hidden pr-3">
          <LocationBar
            locationText={locationText}
            setShowLocationSearch={setShowLocationSearch}
            location={location}
            isMobile
          />
        </div>
      </div>
    </header>
  );
}