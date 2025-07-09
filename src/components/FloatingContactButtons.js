'use client';

import { useState } from 'react';
import { FaWhatsapp, FaCommentDots } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';

export default function FloatingContactButtons() {
  const whatsappNumber = "+919319408930"; // Replace with your WhatsApp number
  const phoneNumber = "+917065012902"; // Replace with your phone number
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 mb-[70px] md:mb-0">
      <div className="flex flex-col items-end gap-3">
        {isExpanded && (
          <>
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=Hi!%20I%20would%20like%20to%20book%20your%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white transition-all shadow-lg animate-fade-in"
              aria-label="Contact us on WhatsApp"
            >
              <FaWhatsapp className="text-2xl" />
            </a>

            {/* Phone */}
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg animate-fade-in"
              aria-label="Call us"
            >
              <FiPhone className="text-xl" />
            </a>
          </>
        )}
        
        {/* Main Chat Button */}
        <button
          onClick={toggleExpand}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg"
          aria-label="Contact options"
        >
          <FaCommentDots className="text-2xl" />
        </button>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}