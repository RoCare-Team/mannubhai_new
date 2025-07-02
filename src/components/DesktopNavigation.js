"use client";
import Link from "next/link";

const navigationItems = [
  { name: "Appliance", href: "/appliance" },
  { name: "Beauty", href: "/beauty" },
  { name: "Homecare", href: "/homecare" },
  { name: "Handyman", href: "/handyman" },
];

export default function DesktopNavigation({ pathname }) {
  return (
    <nav>
      <ul className="flex gap-8 text-sm font-medium">
        {navigationItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`capitalize hover:text-blue-500 transition-colors ${
                pathname === item.href
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700"
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
