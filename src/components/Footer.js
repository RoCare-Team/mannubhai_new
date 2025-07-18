"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { TiSocialFacebook, TiSocialLinkedin } from "react-icons/ti";
import { FaInstagram } from "react-icons/fa6";
import { AiOutlineYoutube } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-800 w-full">
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          {/* Company */}
          <div className="flex flex-col h-full">
            <h4 className="text-base font-semibold mb-2 bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent">
              Company
            </h4>
            <ul className="text-sm space-y-2">
              <li><Link href="/about">About</Link></li>
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
              {/* <li><Link href="#">Categories Near You</Link></li> */}
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

        {/* Footer Bottom */}
        <div className="mt-10 border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
          © 2025 Mannubhai. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
