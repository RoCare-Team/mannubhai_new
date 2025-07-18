"use client";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineShoppingCart } from "react-icons/md";
import CategorySearch from "./CategorySearch";
import useCartCount from "./useCartCount";

export default function MobileHeader({
  setIsMobileMenuOpen,
}) {
  const cartCount = useCartCount();

  return (
    <>
      {/* ─── Header ───────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm lg:hidden">
        {/* Row 1: Logo + Cart */}
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

          {/* Modern Green Cart Icon */}
          <Link
            href="/checkout"
            className="relative text-xl text-emerald-600 hover:text-emerald-700 transition-colors mr-2"
            aria-label={`Cart ${cartCount > 0 ? `with ${cartCount} items` : ''}`}
          >
            <MdOutlineShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-1.5 rounded-full leading-none min-w-[18px] h-[18px] flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Category Search */}
        <div className="border-t border-gray-100 px-3 py-1.5 sm:px-4 sm:py-2">
          <CategorySearch />
        </div>
      </header>
    </>
  );
}