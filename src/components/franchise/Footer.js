"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { TiSocialFacebook, TiSocialLinkedin } from "react-icons/ti";
import { FaInstagram } from "react-icons/fa6";
import { AiOutlineYoutube } from "react-icons/ai";

export default function FranchiseFooter() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white w-full relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#e7516c] to-[#21679c] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(231,81,108,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="max-w-screen-xl mx-auto px-6 py-16 relative z-10">
        {/* Mobile Layout */}
        <div className="block md:hidden space-y-8">
          {/* Company and For Customers in one row with cards */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <h4 className="text-lg font-bold mb-4 bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-[#e7516c] to-[#21679c] rounded-full mr-3"></span>
                Company
              </h4>
              <ul className="text-sm space-y-3">
                <li><Link href="/about-us" scroll={true} className="hover:text-[#e7516c] transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-3 group-hover:bg-[#e7516c] transition-colors"></span>
                  About
                </Link></li>
                <li><Link href="/terms-conditions" className="hover:text-[#e7516c] transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-3 group-hover:bg-[#e7516c] transition-colors"></span>
                  Terms & Conditions
                </Link></li>
                <li><Link href="/privacy-policy" className="hover:text-[#e7516c] transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-3 group-hover:bg-[#e7516c] transition-colors"></span>
                  Privacy Policy
                </Link></li>
                <li><Link href="/return-policy" className="hover:text-[#e7516c] transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-3 group-hover:bg-[#e7516c] transition-colors"></span>
                  Return & Refund Policy
                </Link></li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <h4 className="text-lg font-bold mb-4 bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-[#e7516c] to-[#21679c] rounded-full mr-3"></span>
                For Customers
              </h4>
              <ul className="text-sm space-y-3">
                <li><Link href="/blogs" className="hover:text-[#e7516c] transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-3 group-hover:bg-[#e7516c] transition-colors"></span>
                  Blog
                </Link></li>
                <li><Link href="/contact-us" className="hover:text-[#e7516c] transition-colors duration-200 flex items-center group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-3 group-hover:bg-[#e7516c] transition-colors"></span>
                  Contact Us
                </Link></li>
              </ul>
            </div>
          </div>

          {/* For Partners in card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <h4 className="text-lg font-bold mb-4 bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-[#e7516c] to-[#21679c] rounded-full mr-3"></span>
              For Partners
            </h4>
            <ul className="text-sm space-y-3">
              <li><Link href="#" className="hover:text-[#e7516c] transition-colors duration-200 flex items-center group">
                <span className="w-1 h-1 bg-gray-400 rounded-full mr-3 group-hover:bg-[#e7516c] transition-colors"></span>
                Register as a Professional
              </Link></li>
              <li><Link href="/franchise/franchise-opportunities" className="hover:text-[#e7516c] transition-colors duration-200 flex items-center group">
                <span className="w-1 h-1 bg-gray-400 rounded-full mr-3 group-hover:bg-[#e7516c] transition-colors"></span>
                Become Franchise Partner
              </Link></li>
            </ul>
          </div>

          {/* Social Links in modern card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <h4 className="text-lg font-bold mb-4 bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-[#e7516c] to-[#21679c] rounded-full mr-3"></span>
              Connect With Us
            </h4>
            <div className="flex gap-4 justify-center">
              <a
                href="https://www.facebook.com/mannubhaiserviceexperts?rdid=PSyzjy0ybEklGLdo&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1931wNYm1r%2F"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                <TiSocialFacebook />
              </a>
              <a
                href="https://www.instagram.com/mannubhaiserviceexperts/?igsh=cHZ0ZmFlZHlhbDdy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-2xl flex items-center justify-center text-white text-xl hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
              >
                <FaInstagram />
              </a>
              <a
                href="https://in.linkedin.com/company/mannubhaiserviceexpert"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-xl hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-blue-600/25"
              >
                <TiSocialLinkedin />
              </a>
              <a
                href="https://www.youtube.com/@mannubhaiserviceexpert"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-xl hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                <AiOutlineYoutube />
              </a>
            </div>
          </div>

          {/* App Links in modern card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <h4 className="text-lg font-bold mb-4 bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-[#e7516c] to-[#21679c] rounded-full mr-3"></span>
              Download Our App
            </h4>
            <div className="flex gap-4 justify-center">
              <Link
                href="https://apps.apple.com/in/app/mannu-bhai-service-expert/id6744962904"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-105 transition-transform duration-200 hover:shadow-lg rounded-xl overflow-hidden"
              >
                <Image src="/AppStore.webp" alt="App Store" width={130} height={44} className="rounded-xl" />
              </Link>
              <Link
                href="https://play.google.com/store/apps/details?id=com.mannubhai.customer&hl=en_IN&pli=1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-105 transition-transform duration-200 hover:shadow-lg rounded-xl overflow-hidden"
              >
                <Image src="/PlayStore.webp" alt="Play Store" width={130} height={44} className="rounded-xl" />
              </Link>
            </div>
          </div>

          {/* Google Map in modern card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <h4 className="text-lg font-bold mb-4 bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-[#e7516c] to-[#21679c] rounded-full mr-3"></span>
              Find Us Here
            </h4>
            <div className="w-full aspect-[4/3] overflow-hidden rounded-xl border border-white/20 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14127.340561883426!2d77.038622!3d28.419554!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d229e71ef44dd%3A0x9931b80f30d32dd3!2sJMD%20Megapolis!5e1!3m2!1sen!2sin!4v1751564206008!5m2!1sen!2sin"
                width="100%"
                height="100%"
                className="w-full h-full border-0 hover:scale-105 transition-transform duration-500"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Desktop Layout (unchanged) */}
        <div className="hidden md:grid grid-cols-5 gap-8 items-start">
          {/* Company */}
          <div className="flex flex-col h-full">
            <h4 className="text-base font-semibold mb-2 bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent">
              Company
            </h4>
            <ul className="text-sm space-y-2">
              <li><Link href="/about-us" scroll={true}>About</Link></li>
              <li><Link href="/terms-conditions">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/return-policy">Return & Refund Policy</Link></li>
            </ul>
          </div>

          {/* For Customers */}
          <div className="flex flex-col h-full">
            <h4 className="text-base font-semibold mb-2 bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent">
              For Customers
            </h4>
            <ul className="text-sm space-y-2">
              <li><Link href="/blogs">Blog</Link></li>
              <li><Link href="/contact-us">Contact Us</Link></li>
            </ul>
          </div>

          {/* For Partners */}
          <div className="flex flex-col h-full">
            <h4 className="text-base font-semibold mb-2 bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent">
              For Partners
            </h4>
            <ul className="text-sm space-y-2">
              <li><Link href="#">Register as a Professional</Link></li>
              <li><Link href="/franchise/franchise-opportunities">Become Franchise Partner</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col h-full">
            <h4 className="text-base font-semibold mb-2 bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent">
              Social Links
            </h4>
            <div className="flex gap-3 text-xl mb-4">
              <a
                href="https://www.facebook.com/mannubhaiserviceexperts?rdid=PSyzjy0ybEklGLdo&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1931wNYm1r%2F"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <TiSocialFacebook />
              </a>
              <a
                href="https://www.instagram.com/mannubhaiserviceexperts/?igsh=cHZ0ZmFlZHlhbDdy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaInstagram />
              </a>
              <a
                href="https://in.linkedin.com/company/mannubhaiserviceexpert"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <TiSocialLinkedin />
              </a>
              <a
                href="https://www.youtube.com/@mannubhaiserviceexpert"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <AiOutlineYoutube />
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="https://apps.apple.com/in/app/mannu-bhai-service-expert/id6744962904"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/AppStore.webp" alt="App Store" width={120} height={40} />
              </Link>
              <Link
                href="https://play.google.com/store/apps/details?id=com.mannubhai.customer&hl=en_IN&pli=1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/PlayStore.webp" alt="Play Store" width={120} height={40} />
              </Link>
            </div>
          </div>

          {/* Google Map */}
          <div className="flex flex-col h-full">
            <h4 className="text-base font-semibold mb-2 bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent">
              Our Location
            </h4>
            <div className="w-full aspect-[4/3] overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14127.340561883426!2d77.038622!3d28.419554!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d229e71ef44dd%3A0x9931b80f30d32dd3!2sJMD%20Megapolis!5e1!3m2!1sen!2sin!4v1751564206008!5m2!1sen!2sin"
                width="100%"
                height="100%"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Modern Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center space-x-2 text-sm text-gray-300 bg-white/5 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
              <span className="w-2 h-2 bg-gradient-to-r from-[#e7516c] to-[#21679c] rounded-full animate-pulse"></span>
              <span>© 2025 Mannubhai. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}