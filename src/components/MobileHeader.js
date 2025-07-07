"use client";
import Link from "next/link";
import Image from "next/image";
import CategorySearch from "./CategorySearch";
import LocationBar from "./LocationBar";

export default function MobileHeader({
  locationText,
  setShowLocationSearch,
  location,
  setIsMobileMenuOpen,
}) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm lg:hidden">
      {/* Row 1: Logo + Location */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
        {/* Left side: Menu + Logo */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1 text-gray-700"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="block shrink-0 max-w-[120px] sm:max-w-[160px]">
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

        {/* Right side: Location */}
        <div className="flex-shrink min-w-0 ml-2">
          <LocationBar
            locationText={locationText}
            setShowLocationSearch={setShowLocationSearch}
            location={location}
          />
        </div>
      </div>

      {/* Row 2: Category Search */}
      <div className="border-t border-gray-100 px-3 py-1.5 sm:px-4 sm:py-2">
        <CategorySearch />
      </div>
    </header>
  );
}