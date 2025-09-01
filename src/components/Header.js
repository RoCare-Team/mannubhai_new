"use client";
import { useState, useEffect, useCallback, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Hooks and Context
import { useAuth } from "@/app/contexts/AuthContext";
import useCartCount from "./useCartCount";

// Icons
import { MdOutlineShoppingCart, MdPhone } from "react-icons/md";
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

// Dynamic Imports for Client-Side Components
const LoginPopup = dynamic(() => import("./login"));
const UserDropdown = dynamic(() => import("./UserDropdown"));
const CategorySearch = dynamic(() => import("./CategorySearch"));
const MobileMenu = dynamic(() => import("./MobileMenu"));

// Navigation items for the main desktop header and mobile slide-out menu
const desktopNavigationItems = [
  { name: "Appliance", href: "/appliance-care" },
  { name: "Beauty", href: "/beauty-care" },
  { name: "Homecare", href: "/homecare" },
  { name: "Handyman", href: "/handyman" },
  { name: "Become Franchise Partner", href: "/franchise/franchise-opportunities" },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, userInfo, checkLoginStatus, logout: contextLogout } = useAuth();
  const cartCount = useCartCount();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [protectedRoute, setProtectedRoute] = useState(null);

  const phoneNumber = "+917065012902";

  // Memoized callbacks for performance
  const handleLoginSuccess = useCallback(() => {
    setShowLogin(false);
    checkLoginStatus();
    if (protectedRoute) {
      router.push(protectedRoute);
      setProtectedRoute(null);
    }
  }, [checkLoginStatus, protectedRoute, router]);

  const handleLogout = useCallback(() => {
    contextLogout();
    setIsMobileMenuOpen(false);
    router.push("/");
  }, [contextLogout, router]);

  const handleMobileNav = (url, requiresAuth = false) => {
    if (requiresAuth && !isLoggedIn) {
      setProtectedRoute(url);
      setShowLogin(true);
      return;
    }
    router.push(url);
  };

  // Effect to check login status on mount
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  // Effect to close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Effect to prevent body scroll when mobile menu is open
  useEffect(() => {
    const body = document.body;
    const originalOverflow = body.style.overflow;
    body.style.overflow = isMobileMenuOpen ? "hidden" : originalOverflow;
    return () => {
      body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);
  
  // Navigation items for the mobile bottom bar
  const mobileBottomNavItems = [
    { name: "Home", href: "/", icon: HomeIcon, current: pathname === "/" },
    { name: "Bookings", href: "/my-bookings", icon: CalendarIcon, current: pathname === "/my-bookings", requiresAuth: true },
    { name: "Profile", href: "/account", icon: UserIcon, current: pathname === "/account", requiresAuth: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
        {/* ─── Desktop Header (hidden on mobile) ────────────────────────────────── */}
        <div className="hidden lg:flex mx-auto w-full max-w-screen-2xl flex-wrap items-center justify-between gap-4 px-4 py-3 lg:py-4">
          <div className="flex items-center gap-2 min-w-[250px]">
            <Link href="/" className="shrink-0" aria-label="Go to home page">
              <div className="relative w-[120px] h-[40px] sm:w-[140px] sm:h-[50px]">
                <Image src="/logo.png" alt="Company logo" fill className="object-contain" priority sizes="(min-width: 1024px) 140px, 120px" />
              </div>
            </Link>
            <nav>
              <ul className="flex space-x-8 text-sm font-medium">
                {desktopNavigationItems.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className={`capitalize transition-colors px-1 py-2 ${pathname === item.href ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500"}`}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-4 flex-1">
            <div className="flex items-center gap-4 flex-wrap">
              <CategorySearch isDesktop className="w-56" />
              <div className="flex items-center rounded-lg px-3 py-2 border border-gray-200 hover:border-blue-400 transition-colors">
                <MdPhone className="text-gray-500 mr-2" />
                <a href={`tel:${phoneNumber.replace(/\D/g, "")}`} className="text-sm text-gray-700 hover:text-blue-500">
                  {phoneNumber}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/checkout" className="relative text-xl text-gray-700 hover:text-blue-500 transition-colors" aria-label={`Cart ${cartCount > 0 ? `with ${cartCount} items` : ""}`}>
                <MdOutlineShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 rounded-full leading-none min-w-[18px] h-[18px] flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
              <UserDropdown user={userInfo} setShowLogin={setShowLogin} handleLogout={handleLogout} />
            </div>
          </div>
        </div>

        {/* ─── Mobile Header (hidden on desktop) ─────────────────────────────────── */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Link href="/" className="block shrink-0 max-w-[120px] sm:max-w-[160px]">
                <Image src="/logo.png" alt="logo" width={160} height={60} className="h-8 sm:h-10 w-auto object-contain" priority />
              </Link>
            </div>
            <Link href="/checkout" className="relative text-xl text-emerald-600 hover:text-emerald-700 transition-colors mr-2" aria-label={`Cart ${cartCount > 0 ? `with ${cartCount} items` : ""}`}>
              <MdOutlineShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-1.5 rounded-full leading-none min-w-[18px] h-[18px] flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
          <div className="border-t border-gray-100 px-3 py-1.5 sm:px-4 sm:py-2">
            <CategorySearch />
          </div>
        </div>
      </header>

      {/* ─── Mobile Slide-out Menu ────────────────────────────────── */}
      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        user={userInfo}
        setShowLogin={setShowLogin}
        navigationItems={desktopNavigationItems} // Using same items as desktop
        handleLogout={handleLogout}
      />

      {/* ─── Mobile Bottom Navigation (hidden on desktop) ───────────────────────── */}
      <nav aria-label="Main navigation" className="lg:hidden fixed inset-x-0 bottom-0 bg-white border-t border-gray-100 z-40 shadow-lg">
        <div className="flex justify-around items-center py-2 px-4">
          {mobileBottomNavItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleMobileNav(item.href, item.requiresAuth)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${item.current ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              aria-label={item.name}
              aria-current={item.current ? "page" : undefined}
            >
              <item.icon className={`w-6 h-6 ${item.current ? "text-blue-600" : "text-gray-500"}`} aria-hidden="true" />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </button>
          ))}
          <a href={`tel:${phoneNumber}`} className="flex flex-col items-center justify-center p-2 rounded-lg transition-all text-green-800 hover:text-green-900" aria-label="Call us">
            <PhoneIcon className="w-6 h-6" aria-hidden="true" />
            <span className="text-xs mt-1 font-medium">Call</span>
          </a>
        </div>
      </nav>

      {/* ─── Login Popup (portal) ─────────────────────────────────── */}
      <LoginPopup
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Header;