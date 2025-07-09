"use client";
import Link from "next/link";
import Image from "next/image";
import CategorySearch from "./CategorySearch";
import LocationBar from "./LocationBar";
import { FaWhatsapp, FaPhone } from "react-icons/fa";
import { useState } from "react";
import { Margin } from "@mui/icons-material";
import { MailWarningIcon } from "lucide-react";

export default function MobileHeader({
  locationText,
  setShowLocationSearch,
  location,
  setIsMobileMenuOpen,
  whatsappNumber = "+919319408930",
  phoneNumber = "+917065012902",
}) {
  const [showContactOptions, setShowContactOptions] = useState(false);

  return (
    <>
      {/* ─── Header ───────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm lg:hidden">
        {/* Row 1: Logo + Location */}
        <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              href="/"
              className="block shrink-0 max-w-[120px] sm:max-w-[160px]"
            >
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

          {/* Location */}
          <div className="flex-shrink min-w-0 ml-2">
            <LocationBar
              locationText={locationText}
              setShowLocationSearch={setShowLocationSearch}
              location={location}
            />
          </div>
        </div>

        {/* Category Search */}
        <div className="border-t border-gray-100 px-3 py-1.5 sm:px-4 sm:py-2">
          <CategorySearch />
        </div>
      </header>

  
    </>
  );
}
