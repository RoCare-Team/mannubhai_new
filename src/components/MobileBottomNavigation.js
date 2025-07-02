"use client";
import { useRouter } from "next/navigation";
import React from "react";

const MobileBottomNavigation = ({ navigationItems, pathname }) => {
  const router = useRouter();

  const handleNavigation = (url) => {
    router.push(url);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-pb">
      <div className="flex justify-around items-center py-3 px-2">
        {navigationItems?.slice(0, 5).map((item, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(item.href)}
            className={`flex flex-col items-center justify-center min-w-0 flex-1 relative transition-colors`}
          >
            <div className="relative mb-1">
              <div className="w-7 h-7 flex items-center justify-center">
                {React.cloneElement(item.icon, {
                  className: `w-6 h-6 transition-colors ${
                    pathname === item.href ? item.colorClass : "text-gray-500"
                  }`,
                })}
              </div>
              {item.badge && (
                <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[1.5rem] h-6 flex items-center justify-center">
                  {item.badge}
                </div>
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                pathname === item.href ? "text-black" : "text-gray-500"
              }`}
            >
              {item.label || item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNavigation;
