'use client';
import { FaWhatsapp, FaHome, FaPhone } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
export default function FranchiseHeader() {
  const whatsappNumber = "+919319408430";
  const phoneNumber = "7827506245";
  const whatsappMessage = "Hi! I'm interested in franchise opportunities.";

  const scrollToForm = () => {
    const formElement = document.getElementById('franchise-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });

      // Add highlight effect
      formElement.classList.add('ring-4', 'ring-blue-500', 'animate-pulse');

      // Remove highlight after 3 seconds
      setTimeout(() => {
        formElement.classList.remove('ring-4', 'ring-blue-500', 'animate-pulse');
      }, 3000);
    }
  };
  return (
    <>
      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-between py-4 md:hidden">
           <div className="flex-shrink-0">
              <Link href="/" className="shrink-0" title="Go to home page">
                <Image
                  src="/logo.png"
                  alt="Your Brand Logo"
                  className="h-12 w-auto"
                  width={120} 
                  height={40} 
                  priority
                />
              </Link>
          </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={scrollToForm}
                className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between py-4">
            <div className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="Your Brand Logo"
                className="h-12 w-auto"
              />
            </div>

            {/* Right-side Icons */}
            <div className="flex items-center space-x-6">
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-green-600 hover:text-green-700 transition-colors border border-green-300 rounded-lg px-3 py-2 hover:bg-green-50"
                aria-label="Contact us on WhatsApp"
              >
                <FaWhatsapp className="h-6 w-6 mr-2" />
                <span>{whatsappNumber}</span>
              </a>

              {/* Call Icon with Number */}
              <a
                href={`tel:${phoneNumber.replace(/[^\d]/g, '')}`}
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors border border-blue-300 rounded-lg px-3 py-2 hover:bg-blue-50"
                aria-label="Call us"
              >
                <FaPhone className="h-5 w-5 mr-2" />
                <span>{phoneNumber}</span>
              </a>

              {/* Apply Now Button */}
              <button
                onClick={scrollToForm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 md:hidden z-40">
        <div className="flex justify-around items-center h-16">
          <a href="/" className="flex flex-col items-center justify-center text-blue-600">
            <FaHome className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </a>

          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center text-green-600"
          >
            <FaWhatsapp className="h-6 w-6" />
            <span className="text-xs mt-1">WhatsApp</span>
          </a>

          {/* Call Icon with Number */}
          <a
            href={`tel:${phoneNumber.replace(/[^\d]/g, '')}`}
            className="flex flex-col items-center justify-center text-blue-600"
          >
            <FaPhone className="h-6 w-6" />
            <span className="text-xs mt-1">Call Us</span>
          </a>

          {/* Apply Now Button (Mobile) */}

        </div>
      </nav>
    </>
  );
}