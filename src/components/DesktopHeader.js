"use client";
import Link from "next/link";
import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineShoppingCart } from "react-icons/md";
import DesktopNavigation from "./DesktopNavigation";
import CategorySearch from "./CategorySearch";
import UserDropdown from "./UserDropdown";
import useCartCount from "./useCartCount";

export default function DesktopHeader({
  locationText = "Detecting location…",
  onLocationClick, // Changed from setShowLocationSearch to onLocationClick
  setShowLogin,
  user,
  navigationItems = [],
  pathname = "/",
  handleLogout,
  location = {},
  isLoading = false,
}) {
  const cartCount = useCartCount();

  return (
    <header className="hidden lg:block sticky top-0 z-30 bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Left Section - Logo + Navigation */}
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="shrink-0" aria-label="Home">
              <div className="relative w-[100px] h-[35px]">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="100px"
                />
              </div>
            </Link>

            <DesktopNavigation
              navigationItems={navigationItems}
              pathname={pathname}
              className="text-sm"
            />
          </div>

          {/* Right Side Elements */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Location + Search */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center text-xs border rounded-lg px-2 py-1.5 h-8 max-w-[180px] ${
                isLoading ? 'bg-gray-100' : 'bg-white'
              }`}>
                {isLoading ? (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="truncate">Detecting...</span>
                  </div>
                ) : (
                  <>
                    <CiLocationOn className="text-base" />
                    <span className="truncate" title={locationText}>
                      {locationText || "Select location"}
                    </span>
                    <button
                      onClick={onLocationClick} // Changed to use onLocationClick
                      disabled={isLoading}
                      className="text-xs text-blue-500 underline ml-1 disabled:text-gray-400"
                    >
                      Change
                    </button>
                  </>
                )}
              </div>

              <CategorySearch 
                isDesktop 
                className="w-[160px] text-sm"
              />
            </div>

            {/* Cart + User */}
            <div className="flex items-center gap-3">
              <Link 
                href="/checkout" 
                className="relative text-lg hover:text-blue-600 transition-colors"
                aria-label={`Cart (${cartCount} items)`}
              >
                <MdOutlineShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] px-1 rounded-full h-4 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              <UserDropdown
                user={user}
                setShowLogin={setShowLogin}
                handleLogout={handleLogout}
                iconSize={18}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}