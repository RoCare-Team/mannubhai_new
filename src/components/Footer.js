"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { TiSocialFacebook, TiSocialLinkedin } from "react-icons/ti";
import { FaInstagram } from "react-icons/fa6";
import { CiTwitter } from "react-icons/ci";
import { AiOutlineYoutube } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 items-start">
          {/* Company Column */}
          <div className="w-full md:w-[200px]">
            {/* <Image src="/logo.png" alt="MB Logo" width={160} height={50} /> */}
            <h4 className="mt-6 text-base font-semibold bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent">
              Company
            </h4>
            <ul className="pt-2 text-sm space-y-2">
              <li className="hover:-translate-y-1 transition-transform duration-300 ease-in-out mt-2">
                <Link href="/about">About</Link>
              </li>
              <li className="hover:-translate-y-1 transition-transform duration-300 ease-in-out mt-2">
                <Link href="/terms-conditions">Terms & conditions</Link>
              </li>
              <li className="hover:-translate-y-1 transition-transform duration-300 ease-in-out mt-2">
                <Link href="/privacy-policy">Privacy policy</Link>
              </li>
              <li className="hover:-translate-y-1 transition-transform duration-300 ease-in-out mt-2">
                <Link href="/return-policy">Return & Refund Policy</Link>
              </li>
            </ul>
          </div>

          {/* For Customers */}
          <div className="w-full md:w-[200px] mt-6 md:mt-14">
            <h4 className="mt-6 text-base font-semibold bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent">
              For customers
            </h4>
            <ul className="pt-2 text-sm space-y-2">
              <li className="hover:-translate-y-1 transition-transform duration-300 ease-in-out mt-2">
                <Link href="javascript:void(0)">Categories near you</Link>
              </li>
              <li className="hover:-translate-y-1 transition-transform duration-300 ease-in-out mt-2">
                <Link href="javascript:void(0)">Blog</Link>
              </li>
              <li className="hover:-translate-y-1 transition-transform duration-300 ease-in-out mt-2">
                <Link href="javascript:void(0)">Contact us</Link>
              </li>
            </ul>
          </div>

          {/* For Partners */}
          <div className="w-full md:w-[200px] mt-6 md:mt-14">
            <h4 className="mt-6 text-base font-semibold bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent">
              For partners
            </h4>
            <ul className="pt-2 text-sm space-y-2">
              <li className="hover:-translate-y-1 transition-transform duration-300 ease-in-out mt-2">
                <Link href="javascript:void(0)">Register as a professional</Link>
              </li>
              <li className="hover:-translate-y-1 transition-transform duration-300 ease-in-out mt-2">
                <Link href="/franchise-opportunities">Become a Franchise Partner</Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="w-full md:w-[200px] mt-6 md:mt-14">
            <h4 className="mt-6 text-base font-semibold bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent">
              Social links
            </h4>
            <ul className="pt-2 text-sm space-y-2">
              <li className="flex flex-wrap gap-3 text-xl mt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  className="hover:animate-bounce hover:scale-110 transition-transform duration-300"
                >
                  <TiSocialFacebook />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  className="hover:animate-bounce hover:scale-110 transition-transform duration-300"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  className="hover:animate-bounce hover:scale-110 transition-transform duration-300"
                >
                  <CiTwitter />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  className="hover:animate-bounce hover:scale-110 transition-transform duration-300"
                >
                  <TiSocialLinkedin />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  className="hover:animate-bounce hover:scale-110 transition-transform duration-300"
                >
                  <AiOutlineYoutube />
                </a>
              </li>
             <li className="flex flex-wrap gap-3 pt-2">
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
</li>
            </ul>
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
