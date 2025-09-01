'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LogoLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-700 ${
        loading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Logo + Text */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png" // replace with actual path like '/assets/logo.png'
            alt="Mannubhai Logo"
            width={100}
            height={100}
            className="object-contain"
            priority
          />
          <span className="text-xl font-semibold text-purple-600 tracking-wide">
         
          </span>
        </div>

        {/* Animated Underline */}
        <div className="w-40 h-1 bg-purple-500 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
