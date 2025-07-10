'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';

export default function FloatingContactButtons() {

  
  const whatsappNumber = "+919319404430";
 const phoneNumber = "+917065129020";

  return (
    <div className="fixed bottom-6 right-6 z-50 mb-[70px] md:mb-0">
      <div className="flex flex-col items-end gap-3">
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
        <a
          href={`tel:${phoneNumber}`}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg"
          aria-label="Call us"
        >
          <FiPhone className="text-xl" />
        </a>
      </div>
    </div>
  );
}