"use client";
import Link from "next/link";

const navigationItems = [
  { name: "Appliance", href: "/appliance" },
  { name: "Beauty", href: "/beauty" },
  { name: "Homecare", href: "/homecare" },
  { name: "Handyman", href: "/handyman" },
  { name:"Become Franchise Partner", href:"/franchise-opportunities"},
];

export default function DesktopNavigation({ pathname }) {
  return (
    <nav>
      <ul className="flex space-x-8 text-sm font-medium">
        {navigationItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`capitalize transition-colors px-1 py-2 ${
                pathname === item.href
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-500"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
