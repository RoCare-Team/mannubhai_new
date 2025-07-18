'use client';

import { useState } from 'react';
import { FaApple, FaGooglePlay, FaMobileAlt, FaPhone } from 'react-icons/fa';

export default function FloatingContactButtons() {
  const phoneNumber = "+917065012902";
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 mb-[70px] md:mb-0">
      <div className="flex flex-col items-end gap-3">
        {/* Toggle Download App Modal */}
        <div className="relative">
          <button
            onClick={() => setShowDownloadOptions(!showDownloadOptions)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-lg"
            aria-label="Download App"
          >
            <FaMobileAlt className="text-xl" />
          </button>

          {showDownloadOptions && (
            <div className="absolute bottom-14 right-0 bg-white p-3 rounded-xl shadow-xl w-52">
              <div className="flex flex-col gap-3">
                {/* App Store */}
                <a
                  href="https://apps.apple.com/in/app/mannu-bhai-service-expert/id6744962904"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-black text-white px-3 py-2 rounded-lg text-xs hover:bg-gray-800 transition"
                >
                  <FaApple className="mr-2 text-base" />
                  <div>
                    <p className="text-[10px] leading-3">Download on the</p>
                    <p className="text-sm font-medium">App Store</p>
                  </div>
                </a>

                {/* Google Play */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.mannubhai.customer&hl=en_IN&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-lg text-xs hover:from-blue-500 hover:to-indigo-500 transition"
                >
                  <FaGooglePlay className="mr-2 text-base" />
                  <div>
                    <p className="text-[10px] leading-3">Get it on</p>
                    <p className="text-sm font-medium">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Phone */}
        <a
          href={`tel:${phoneNumber.replace(/[^\d]/g, '')}`}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg"
          aria-label="Call us"
        >
          <FaPhone className="text-xl" />
        </a>
      </div>
    </div>
  );
}