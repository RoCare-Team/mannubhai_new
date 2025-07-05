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
        <div className="flex items-center gap-2 sm:gap-3">
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

        {/* Right side: Location */}
        <div className="flex-shrink-0">
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