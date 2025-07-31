'use client';
import { FaWhatsapp, FaHome, FaPhone, FaBars, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function FranchiseHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const whatsappNumber = "+919319408430";
  const phoneNumber = "7827506245";
  const whatsappMessage = "Hi! I'm interested in franchise opportunities.";
  
  // Create WhatsApp URL that works on both mobile and desktop
  const getWhatsAppURL = () => {
    const cleanNumber = whatsappNumber.replace(/[^\d]/g, '');
    const message = encodeURIComponent(whatsappMessage);
    
    // Check if it's mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // For mobile, use whatsapp:// protocol first, fallback to wa.me
      return `whatsapp://send?phone=${cleanNumber}&text=${message}`;
    } else {
      // For desktop, use wa.me
      return `https://wa.me/${cleanNumber}?text=${message}`;
    }
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const cleanNumber = whatsappNumber.replace(/[^\d]/g, '');
    const message = encodeURIComponent(whatsappMessage);
    
    if (isMobile) {
      // Try whatsapp:// protocol first
      const whatsappURL = `whatsapp://send?phone=${cleanNumber}&text=${message}`;
      const webURL = `https://wa.me/${cleanNumber}?text=${message}`;
      
      // Create a temporary link and click it
      const tempLink = document.createElement('a');
      tempLink.href = whatsappURL;
      tempLink.target = '_blank';
      tempLink.rel = 'noopener noreferrer';
      
      // Try to open WhatsApp app
      try {
        tempLink.click();
        
        // Fallback to web version if app doesn't open within 2 seconds
        setTimeout(() => {
          window.open(webURL, '_blank', 'noopener,noreferrer');
        }, 2000);
      } catch (error) {
        // If whatsapp:// fails, open web version
        window.open(webURL, '_blank', 'noopener,noreferrer');
      }
    } else {
      // For desktop, use wa.me
      window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = () => {
    const formElement = document.getElementById('franchise-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      formElement.classList.add('ring-4', 'ring-blue-500', 'animate-pulse');
      setTimeout(() => {
        formElement.classList.remove('ring-4', 'ring-blue-500', 'animate-pulse');
      }, 3000);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white shadow-md'
      }`}>
        <div className="container mx-auto px-4 lg:px-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between py-3 md:hidden">
            <div className="flex-shrink-0">
              <Link href="/" className="block" title="Go to home page">
                <Image
                  src="/logo.png"
                  alt="Your Brand Logo"
                  className="h-10 w-auto transition-transform hover:scale-105"
                  width={120} 
                  height={40} 
                  priority
                />
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={scrollToForm}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
              >
                Apply Now
              </button>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="h-5 w-5 text-gray-700" />
                ) : (
                  <FaBars className="h-5 w-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between py-4">
            <div className="flex-shrink-0">
              <Link href="/" title="Go to home page">
                <Image
                  src="/logo.png"
                  alt="Your Brand Logo"
                  className="h-12 w-auto transition-transform hover:scale-105"
                  width={120}
                  height={48}
                  priority
                />
              </Link>
            </div>

            {/* Right-side Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleWhatsAppClick}
                className="group flex items-center text-green-600 hover:text-white transition-all duration-300 border-2 border-green-500 rounded-xl px-4 py-2.5 hover:bg-green-500 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105"
                aria-label="Contact us on WhatsApp"
              >
                <FaWhatsapp className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                <span className="font-medium">{whatsappNumber}</span>
              </button>

              <a
                href={`tel:${phoneNumber.replace(/[^\d]/g, '')}`}
                className="group flex items-center text-blue-600 hover:text-white transition-all duration-300 border-2 border-blue-500 rounded-xl px-4 py-2.5 hover:bg-blue-500 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                aria-label="Call us"
              >
                <FaPhone className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                <span className="font-medium">{phoneNumber}</span>
              </a>

              <button
                onClick={scrollToForm}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105 relative overflow-hidden group"
              >
                <span className="relative z-10">Apply Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden transition-all duration-300 ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-6 space-y-4">
            <button
              onClick={(e) => {
                handleWhatsAppClick(e);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center w-full text-green-600 border-2 border-green-500 rounded-xl px-4 py-3 hover:bg-green-500 hover:text-white transition-all duration-300 font-medium"
            >
              <FaWhatsapp className="h-5 w-5 mr-3" />
              <span>WhatsApp: {whatsappNumber}</span>
            </button>

            <a
              href={`tel:${phoneNumber.replace(/[^\d]/g, '')}`}
              className="flex items-center justify-center w-full text-blue-600 border-2 border-blue-500 rounded-xl px-4 py-3 hover:bg-blue-500 hover:text-white transition-all duration-300 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaPhone className="h-4 w-4 mr-3" />
              <span>Call: {phoneNumber}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20"></div>

      {/* Modern Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-2xl border-t border-gray-200 md:hidden z-40">
        <div className="flex justify-around items-center h-18 py-2">
          <Link
            href="/"
            className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-all duration-200 p-2 rounded-xl hover:bg-blue-50 group"
          >
            <div className="relative">
              <FaHome className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-xs mt-1 font-medium">Home</span>
          </Link>

          <button
            onClick={handleWhatsAppClick}
            className="flex flex-col items-center justify-center text-gray-600 hover:text-green-600 transition-all duration-200 p-2 rounded-xl hover:bg-green-50 group"
          >
            <div className="relative">
              <FaWhatsapp className="h-6 w-6 group-hover:scale-110 group-hover:animate-bounce transition-all" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-xs mt-1 font-medium">WhatsApp</span>
          </button>

          <a
            href={`tel:${phoneNumber.replace(/[^\d]/g, '')}`}
            className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-all duration-200 p-2 rounded-xl hover:bg-blue-50 group"
          >
            <div className="relative">
              <FaPhone className="h-6 w-6 group-hover:scale-110 group-hover:animate-pulse transition-all" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-xs mt-1 font-medium">Call Us</span>
          </a>

          <button
            onClick={scrollToForm}
            className="flex flex-col items-center justify-center bg-gradient-to-t from-blue-600 to-blue-500 text-white p-3 rounded-2xl shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-200 group"
          >
            <div className="text-lg font-bold group-hover:animate-pulse">✨</div>
            <span className="text-xs font-semibold">Apply</span>
          </button>
        </div>
      </nav>

      {/* Bottom spacing for mobile navigation */}
    </>
  );
}