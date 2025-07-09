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
  whatsappNumber = "+919319404430",
  phoneNumber = "+917065129020",
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

      {/* ─── Floating Connect Button ───────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 lg:hidden" style={{ marginBottom: "135px" }}>
        {/* Contact Options */}
        <div
          className={`flex flex-col items-end gap-3 transform transition-all duration-300 ${
            showContactOptions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
          }`}
        >
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=Hi!%20I%20would%20like%20to%20book%20your%20services.`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg"
          >
            <FaWhatsapp className="text-xl" />
          </a>

          {/* Phone */}
          <a
            href={`tel:${phoneNumber}`}
            aria-label="Call us"
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg"
          >
            <FaPhone className="text-lg" />
          </a>
        </div>

        {/* Get Connect Button */}
        <button
          onClick={() => setShowContactOptions((prev) => !prev)}
      className="bg-indigo-600 text-white px-5 py-2.5 rounded-full shadow-md text-sm font-semibold hover:bg-indigo-700 transition-colors"


        >
          {showContactOptions ? "Close" : "Get Connect"}
        </button>
      </div>
    </>
  );
}
