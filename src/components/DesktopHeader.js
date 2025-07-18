"use client";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineShoppingCart } from "react-icons/md";
import DesktopNavigation from "./DesktopNavigation";
import CategorySearch from "./CategorySearch";
import UserDropdown from "./UserDropdown";
import useCartCount from "./useCartCount";
import LocationBar from "./LocationBar";
import PropTypes from 'prop-types';

export default function DesktopHeader({
  locationText = "Detecting location…",
  onLocationClick, 
  setShowLogin,
  user,
  navigationItems = [],
  pathname = "/",
  handleLogout,
  isLoading = false,
  location = {}
}) {
  const cartCount = useCartCount();

  return (
    <header className="hidden lg:block sticky top-0 z-30 bg-white">
      <div className="mx-auto w-full max-w-screen-2xl flex flex-wrap items-center justify-between gap-4 px-4 py-3 lg:py-4">
        {/* Logo + Nav */}
        <div className="flex items-center gap-2 min-w-[250px]">
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
            items={navigationItems}
            currentPath={pathname}
            className="text-sm font-medium"
          />
        </div>

        {/* Search + Location + Cart + User */}
        <div className="flex flex-wrap items-center justify-end gap-2 flex-1">
          {/* Location + Search */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="min-w-[200px] max-w-[240px]">
              <LocationBar
                locationText={locationText}
                onLocationClick={onLocationClick}
                isLoading={isLoading}
                isError={!!location?.error || !location?.city}
              />
            </div>

            <CategorySearch isDesktop className="w-56" />
          </div>

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
            />
          </div>
        </div>
      </div>
    </header>
  );
}

DesktopHeader.propTypes = {
  locationText: PropTypes.string,
  onLocationClick: PropTypes.func.isRequired, 
  setShowLogin: PropTypes.func.isRequired,
  user: PropTypes.object,
  navigationItems: PropTypes.array,
  pathname: PropTypes.string,
  handleLogout: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  location: PropTypes.object
};