"use client";
import { useRouter } from "next/navigation";
import React from "react";
import LoginPopup from "./login";
import { toast } from "react-toastify";
import { useAuth } from "@/app/contexts/AuthContext";

const MobileBottomNavigation = ({ navigationItems, pathname }) => {
  const router = useRouter();
  const [showLoginPopup, setShowLoginPopup] = React.useState(false);
  const { isLoggedIn, logout } = useAuth();

  const phoneNumber = "+917065012902"; // ✅ Replace this with your real number

  const handleNavigation = (url, requiresAuth = false) => {
    if (requiresAuth && !isLoggedIn) {
      toast.info("Please login first to access this feature");
      setShowLoginPopup(true);
      return;
    }
    router.push(url);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push('/');
  };

  // Determine which items require authentication
  const protectedItems = ['/booking', '/profile'];

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-pb">
        <div className="flex justify-around items-center py-3 px-2">
          {navigationItems?.slice(0, 4).map((item, index) => {
            const requiresAuth = protectedItems.some(protectedPath =>
              item.href.startsWith(protectedPath)
            );

            return (
              <button
                key={index}
                onClick={() => handleNavigation(item.href, requiresAuth)}
                className={`flex flex-col items-center justify-center min-w-0 flex-1 relative transition-colors`}
              >
                <div className="relative mb-1">
                  <div className="w-7 h-7 flex items-center justify-center">
                    {React.cloneElement(item.icon, {
                      className: `w-6 h-6 transition-colors ${pathname === item.href ? item.colorClass : "text-gray-500"}`,
                    })}
                  </div>
                  {item.badge && (
                    <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[1.5rem] h-6 flex items-center justify-center">
                      {item.badge}
                    </div>
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${pathname === item.href ? "text-black" : "text-gray-500"}`}
                >
                  {item.label || item.name}
                </span>
              </button>
            );
          })}

          {/* ✅ Call Button */}
          <a
            href={`tel:${phoneNumber}`}
            className="flex flex-col items-center justify-center min-w-0 flex-1 relative transition-colors"
          >
            <div className="relative mb-1">
              <div className="w-7 h-7 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h2.586a1 1 0 01.707.293l2.914 2.914a1 1 0 01.293.707V9a1 1 0 01-.293.707L9 11l2 2 1.293-1.293a1 1 0 01.707-.293h1.086a1 1 0 01.707.293l2.914 2.914a1 1 0 01.293.707V19a2 2 0 01-2 2h-3c-6.075 0-11-4.925-11-11V5z"
                  />
                </svg>
              </div>
            </div>
            <span className="text-sm font-medium text-green-600">Call</span>
          </a>

          {/* Login/Logout Button */}
          <button
            onClick={isLoggedIn ? handleLogout : () => setShowLoginPopup(true)}
            className="flex flex-col items-center justify-center min-w-0 flex-1 relative transition-colors"
          >
            <div className="relative mb-1">
              <div className="w-7 h-7 flex items-center justify-center">
                {isLoggedIn ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm font-medium text-gray-500">
              {isLoggedIn ? "Logout" : "Login"}
            </span>
          </button>
        </div>
      </div>

      <LoginPopup
        show={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLoginSuccess={() => {
          setShowLoginPopup(false);
        }}
      />
    </>
  );
};

export default MobileBottomNavigation;
