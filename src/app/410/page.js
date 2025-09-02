"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function PageGone() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Illustration with optimized Next.js Image component */}
        <div className="mb-8">
          <div className="w-full max-w-md mx-auto">
            <Image 
              src="/410-illustration.svg" 
              alt="410 Gone" 
              width={400}
              height={300}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Content No Longer Available
        </h1>

        {/* Message with proper escaping */}
        <p className="text-gray-600 mb-8">
          The content you&apos;re looking for has been permanently removed or is no longer active.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => router.push('/')}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg flex items-center justify-center"
          >
            <span className="mr-2">🏠</span> Go Home
          </button>

          <button 
            onClick={() => router.back()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-full border-2 border-gray-300 transition-colors duration-300 flex items-center justify-center"
          >
            <span className="mr-2">←</span> Go Back
          </button>
        </div>
      </div>
    </main>
  );
}