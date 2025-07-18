"use client";
import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../app/firebaseConfig";
import dynamic from "next/dynamic";
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
import MobileMenu from "./MobileMenu";
import LoginPopup from "./login";
import MobileBottomNavigation from "./MobileBottomNavigation";
import navigationItems from "./navigationItems";
import { useAuth } from "@/app/contexts/AuthContext";
import FloatingContactButtons from "./FloatingContactButtons";

const AddToCart = dynamic(() => import("../app/checkout/page.js"), { ssr: false });

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, userInfo, checkLoginStatus, logout: contextLogout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginSuccess = useCallback(() => {
    setShowLogin(false);
    checkLoginStatus();
  }, [checkLoginStatus]);

  const handleLogout = useCallback(() => {
    contextLogout();
    setIsMobileMenuOpen(false);
    router.push("/");
  }, [contextLogout, router]);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const snapshot = await getDocs(collection(db, "add_to_cart"));
        setCartCount(snapshot.size);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();
    checkLoginStatus();
  }, [checkLoginStatus]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const body = document.body;
    const originalOverflow = body.style.overflow;
    body.style.overflow = isMobileMenuOpen ? "hidden" : originalOverflow;
    return () => { body.style.overflow = originalOverflow };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={`bg-white fixed top-0 left-0 right-0 w-full z-50 border-b border-b-gray-200 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}>
        <div className="w-full px-0 sm:px-6 lg:px-8">
          <MobileHeader
            cartCount={cartCount}
            setShowLogin={setShowLogin}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            user={userInfo}
          />

          <DesktopHeader
            setShowLogin={setShowLogin}
            user={userInfo}
            navigationItems={navigationItems}
            pathname={pathname}
            handleLogout={handleLogout}
          />
        </div>
      </header>

      <MobileMenu {...{
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        user: userInfo,
        setShowLogin,
        navigationItems,
        handleLogout
      }} />

      <MobileBottomNavigation {...{ navigationItems, pathname }} />
      <LoginPopup
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <FloatingContactButtons />

      <style jsx global>{`
        @media (min-width: 1024px) {
          body { 
            padding-top: 50px; 
            padding-bottom: 0; 
          }
        }
      `}</style>
    </>
  );
};

export default Header;