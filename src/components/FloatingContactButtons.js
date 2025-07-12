'use client';

import { useState } from 'react';
import { FaWhatsapp, FaApple, FaGooglePlay, FaMobileAlt } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';

export default function FloatingContactButtons() {
  const whatsappNumber = "+919319404430";
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

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=Hi!%20I%20would%20like%20to%20book%20your%20services.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white transition-all shadow-lg"
          aria-label="Contact us on WhatsApp"
        >
          <FaWhatsapp className="text-2xl" />
        </a>

        {/* Phone */}
      
      </div>
    </div>
    
  );
  
}
