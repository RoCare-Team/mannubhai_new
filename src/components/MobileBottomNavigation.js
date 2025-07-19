"use client";
import { useRouter } from "next/navigation";
import React from "react";
import LoginPopup from "./login";
import { useAuth } from "@/app/contexts/AuthContext";
import { 
  HomeIcon, 
  UserIcon, 
  CalendarIcon, 
  PhoneIcon 
} from "@heroicons/react/24/outline";

const MobileBottomNavigation = ({ pathname }) => {
  const router = useRouter();
  const [showLoginPopup, setShowLoginPopup] = React.useState(false);
  const { isLoggedIn } = useAuth();

  const phoneNumber = "+917065012902";

  const navigationItems = [
    {
      name: "Home",
      href: "/",
      icon: <HomeIcon className="w-6 h-6" />,
      current: pathname === "/",
    },
    {
      name: "Bookings",
      href: "/bookings",
      icon: <CalendarIcon className="w-6 h-6" />,
      current: pathname === "/bookings",
      requiresAuth: true,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <UserIcon className="w-6 h-6" />,
      current: pathname === "/profile",
      requiresAuth: true,
    },
  ];

  const handleNavigation = (url, requiresAuth = false) => {
    if (requiresAuth && !isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    router.push(url);
  };

  return (
    <>
      <nav 
        aria-label="Main navigation"
        className="lg:hidden fixed inset-x-0 bottom-0 bg-white border-t border-gray-100 z-40 safe-area-pb shadow-lg"
      >
        <div className="flex justify-around items-center py-2 px-4">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href, item.requiresAuth)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                item.current ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label={item.name}
              aria-current={item.current ? "page" : undefined}
            >
              {React.cloneElement(item.icon, {
                className: `w-6 h-6 ${item.current ? "text-blue-600" : "text-gray-500"}`,
                "aria-hidden": "true"
              })}
              <span className="text-xs mt-1 font-medium">
                {item.name}
              </span>
            </button>
          ))}

          {/* Call Button */}
          <a
            href={`tel:${phoneNumber}`}
            className="flex flex-col items-center justify-center p-2 rounded-lg transition-all text-green-800 hover:text-green-900"
            aria-label="Call us"
          >
            <PhoneIcon className="w-6 h-6" aria-hidden="true" />
            <span className="text-xs mt-1 font-medium">Call</span>
          </a>
        </div>
      </nav>

      <LoginPopup
        show={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLoginSuccess={() => setShowLoginPopup(false)}
      />
    </>
  );
};

export default MobileBottomNavigation;