"use client";
import Link from "next/link";
import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import DesktopNavigation from "./DesktopNavigation";
import CategorySearch from "./CategorySearch";
import UserDropdown from "./UserDropdown";
import useCartCount from "./useCartCount";

export default function DesktopHeader({
  locationText = "Detecting location…",
  setShowLocationSearch,
  setShowLogin,
  user,
  navigationItems,
  pathname,
  handleLogout,
  getbookingdata,
  location = {},
  whatsappNumber = "+919319404430",
  phoneNumber = "+917065129020"
}) {
  const cartCount = useCartCount();

  return (
    <header className="hidden lg:block sticky top-0 z-30 bg-white ">
      <div className="mx-auto w-full max-w-screen-2xl flex flex-wrap items-center justify-between gap-4 px-4 py-3 lg:py-4">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6 min-w-[250px]">
          <Link href="/" className="shrink-0" aria-label="Go to home page">
            <div className="relative w-[120px] h-[40px] sm:w-[140px] sm:h-[50px]">
              <Image
                src="/logo.png"
                alt="Company logo"
                fill
                className="object-contain"
                priority
                sizes="(min-width: 1024px) 140px, 120px"
              />
            </div>
          </Link>

          <DesktopNavigation
            navigationItems={navigationItems}
            pathname={pathname}
          />
        </div>

        {/* Search + Location + WhatsApp + Phone + Cart + User */}
        <div className="flex flex-wrap items-center justify-end gap-6 flex-1">
          {/* Location + Search */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 h-10 min-w-[200px] max-w-[240px]">
              <CiLocationOn className="text-lg shrink-0" />
              <span
                className="truncate flex-1"
                title={locationText || "Select location"}
              >
                {locationText || "Select location"}
              </span>
              <button
                type="button"
                onClick={() => setShowLocationSearch(true)}
                className="ml-1 text-xs text-blue-500 underline focus:outline-none hover:text-blue-600 transition-colors"
                aria-label="Change location"
              >
                Change
              </button>
              {location?.error && (
                <span
                  className="ml-1 text-red-500 text-xs"
                  title={location.error}
                >
                  !
                </span>
              )}
            </div>

            <CategorySearch isDesktop className="w-56" />
          </div>

          {/* WhatsApp + Phone */}
        

          {/* Cart + User */}
          <div className="flex items-center gap-4">
            <Link
              href="/checkout"
              className="relative text-xl text-gray-700 hover:text-blue-500 transition-colors"
              aria-label={`Cart ${cartCount > 0 ? `with ${cartCount} items` : ''}`}
            >
              <MdOutlineShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 rounded-full leading-none min-w-[18px] h-[18px] flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            <UserDropdown
              user={user}
              setShowLogin={setShowLogin}
              handleLogout={handleLogout}
              getbookingdata={getbookingdata}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
