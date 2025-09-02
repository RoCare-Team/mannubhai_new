"use client";
import React, { Suspense, lazy } from "react";
import Image from "next/image";
import Link from "next/link";
import { TiSocialFacebook, TiSocialLinkedin } from "react-icons/ti";
import { FaInstagram } from "react-icons/fa6";
import { AiOutlineYoutube } from "react-icons/ai";

// Lazy load the map component for better LCP
const LazyMap = lazy(() => import('./LazyMap'));

// Map loading skeleton with exact dimensions to prevent CLS
const MapSkeleton = () => (
  <div 
    className="w-full bg-gray-100 border border-gray-300 shadow-lg md:shadow-md rounded-xl md:rounded-lg flex items-center justify-center"
    style={{ aspectRatio: '4/3', minHeight: '200px' }}
  >
    <div className="text-gray-400 text-sm">Loading map...</div>
  </div>
);

// Social media links data with accessibility labels
const socialLinks = [
  {
    href: "https://www.facebook.com/mannubhaiserviceexperts?rdid=PSyzjy0ybEklGLdo&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1931wNYm1r%2F",
    icon: TiSocialFacebook,
    className: "from-blue-500 to-blue-600 hover:shadow-blue-500/25",
    hoverColor: "hover:text-blue-600",
    label: "Follow us on Facebook",
    ariaLabel: "Visit our Facebook page"
  },
  {
    href: "https://www.instagram.com/mannubhaiserviceexperts/?igsh=cHZ0ZmFlZHlhbDdy",
    icon: FaInstagram,
    className: "from-pink-500 via-red-500 to-yellow-500 hover:shadow-pink-500/25",
    hoverColor: "hover:text-pink-600",
    label: "Follow us on Instagram",
    ariaLabel: "Visit our Instagram page"
  },
  {
    href: "https://in.linkedin.com/company/mannubhaiserviceexpert",
    icon: TiSocialLinkedin,
    className: "from-blue-600 to-blue-700 hover:shadow-blue-600/25",
    hoverColor: "hover:text-blue-700",
    label: "Connect on LinkedIn",
    ariaLabel: "Visit our LinkedIn company page"
  },
  {
    href: "https://www.youtube.com/@mannubhaiserviceexpert",
    icon: AiOutlineYoutube,
    className: "from-red-500 to-red-600 hover:shadow-red-500/25",
    hoverColor: "hover:text-red-600",
    label: "Subscribe on YouTube",
    ariaLabel: "Visit our YouTube channel"
  }
];

// App store links data with better alt text
const appStoreLinks = [
  {
    href: "https://apps.apple.com/in/app/mannu-bhai-service-expert/id6744962904",
    src: "/AppStore.webp",
    alt: "Download Mannubhai Service Expert app from Apple App Store",
    width: 130,
    height: 44
  },
  {
    href: "https://play.google.com/store/apps/details?id=com.mannubhai.customer&hl=en_IN&pli=1",
    src: "/PlayStore.webp",
    alt: "Get Mannubhai Service Expert app on Google Play Store",
    width: 130,
    height: 44
  }
];

// Navigation sections data
const navigationSections = {
  company: {
    title: "Company",
    links: [
      { href: "/about-us", label: "About Us", scroll: true },
      { href: "/terms-conditions", label: "Terms & Conditions" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/return-policy", label: "Return & Refund Policy" }
    ]
  },
  customers: {
    title: "For Customers",
    links: [
      { href: "/blogs", label: "Blog" },
      { href: "/contact-us", label: "Contact Us" }
    ]
  },
  partners: {
    title: "For Partners",
    links: [
      { href: "/join-partner", label: "Register as a Professional" },
      { href: "/franchise/franchise-opportunities", label: "Become Franchise Partner" }
    ]
  }
};

// Reusable components with proper heading hierarchy
const SectionHeader = ({ title, mobile = false, level = 2 }) => {
  const HeadingTag = `h${level}`;
  
  return React.createElement(
    HeadingTag,
    {
      className: `font-bold bg-gradient-to-r from-gray-700 to-slate-600 bg-clip-text text-transparent ${
        mobile 
          ? 'text-lg mb-4 flex items-center' 
          : 'text-base mb-2'
      }`
    },
    <>
      {mobile && (
        <span className="w-2 h-2 bg-gradient-to-r from-gray-600 to-slate-500 rounded-full mr-3" />
      )}
      {title}
    </>
  );
};

const NavigationList = ({ links, mobile = false }) => (
  <ul className={`text-sm space-y-${mobile ? '3' : '2'} ${mobile ? '' : 'text-gray-700'}`}>
    {links.map((link) => (
      <li key={link.href}>
        <Link 
          href={link.href} 
          {...(link.scroll && { scroll: true })}
          className={`transition-colors duration-200 ${
            mobile 
              ? 'hover:text-gray-600 flex items-center group' 
              : 'hover:text-gray-900'
          }`}
        >
          {mobile && (
            <span className="w-1 h-1 bg-gray-400 rounded-full mr-3 group-hover:bg-gray-600 transition-colors" />
          )}
          {link.label}
        </Link>
      </li>
    ))}
  </ul>
);

const SocialIcon = ({ href, icon: Icon, className, hoverColor, label, ariaLabel, mobile = false }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel}
    title={label}
    className={
      mobile
        ? `w-12 h-12 bg-gradient-to-br ${className} rounded-2xl flex items-center justify-center text-white text-xl hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg`
        : `hover:scale-110 ${hoverColor} transition-all duration-200`
    }
  >
    <Icon aria-hidden="true" />
  </a>
);

const AppStoreButton = ({ href, src, alt, width, height, mobile = false }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="hover:scale-105 transition-transform duration-200 hover:shadow-lg rounded-xl overflow-hidden"
    aria-label={alt}
  >
    <Image 
      src={src} 
      alt={alt} 
      width={mobile ? width : 120} 
      height={mobile ? height : 40} 
      className="rounded-xl"
      loading="lazy"
      sizes="(max-width: 768px) 130px, 120px"
      style={{ width: 'auto', height: 'auto' }}
    />
  </Link>
);

// Fixed-size card to prevent layout shift
const MobileCard = ({ children, className = "" }) => (
  <div 
    className={`bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:bg-white/90 hover:shadow-lg transition-all duration-300 ${className}`}
    style={{ minHeight: 'fit-content' }}
  >
    {children}
  </div>
);

export default function FranchiseFooter() {
  return (
    <footer 
      className="bg-gradient-to-br from-slate-50 via-gray-100 to-slate-100 text-gray-800 w-full relative overflow-hidden"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Optimized Background Pattern - removed will-change for better performance */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-slate-400 opacity-30" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(156,163,175,0.2),transparent_50%)]" />
      </div>
      
      <div className="max-w-screen-xl mx-auto px-6 py-16 relative z-10">
        {/* Mobile Layout */}
        <div className="block md:hidden space-y-8">
          {/* Company and For Customers in one row with cards */}
          <div className="grid grid-cols-1 gap-6">
            <MobileCard>
              <SectionHeader title={navigationSections.company.title} mobile level={2} />
              <NavigationList links={navigationSections.company.links} mobile />
            </MobileCard>

            <MobileCard>
              <SectionHeader title={navigationSections.customers.title} mobile level={2} />
              <NavigationList links={navigationSections.customers.links} mobile />
            </MobileCard>
          </div>

          {/* For Partners in card */}
          <MobileCard>
            <SectionHeader title={navigationSections.partners.title} mobile level={2} />
            <NavigationList links={navigationSections.partners.links} mobile />
          </MobileCard>

          {/* Social Links in modern card */}
          <MobileCard>
            <SectionHeader title="Connect With Us" mobile level={2} />
            <div className="flex gap-4 justify-center">
              {socialLinks.map((social, index) => (
                <SocialIcon key={index} {...social} mobile />
              ))}
            </div>
          </MobileCard>

          {/* App Links in modern card */}
          <MobileCard>
            <SectionHeader title="Download Our App" mobile level={2} />
            <div className="flex gap-4 justify-center">
              {appStoreLinks.map((app, index) => (
                <AppStoreButton key={index} {...app} mobile />
              ))}
            </div>
          </MobileCard>

          {/* Google Map in modern card with fixed dimensions */}
          <MobileCard>
            <SectionHeader title="Find Us Here" mobile level={2} />
            <div style={{ aspectRatio: '4/3', minHeight: '200px' }}>
              <Suspense fallback={<MapSkeleton />}>
                <LazyMap className="w-full h-full overflow-hidden rounded-xl border border-gray-300 shadow-lg" />
              </Suspense>
            </div>
          </MobileCard>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-5 gap-8 items-start">
          {/* Company */}
          <nav aria-label="Company links">
            <SectionHeader title={navigationSections.company.title} level={2} />
            <NavigationList links={navigationSections.company.links} />
          </nav>

          {/* For Customers */}
          <nav aria-label="Customer links">
            <SectionHeader title={navigationSections.customers.title} level={2} />
            <NavigationList links={navigationSections.customers.links} />
          </nav>

          {/* For Partners */}
          <nav aria-label="Partner links">
            <SectionHeader title={navigationSections.partners.title} level={2} />
            <NavigationList links={navigationSections.partners.links} />
          </nav>

          {/* Social Links */}
          <div>
            <SectionHeader title="Social Links" level={2} />
            <div className="flex gap-3 text-xl mb-4 text-gray-600" role="list" aria-label="Social media links">
              {socialLinks.map((social, index) => (
                <div key={index} role="listitem">
                  <SocialIcon {...social} />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2" aria-label="App store downloads">
              {appStoreLinks.map((app, index) => (
                <AppStoreButton key={index} {...app} />
              ))}
            </div>
          </div>

          {/* Google Map with fixed dimensions */}
          <div>
            <SectionHeader title="Our Location" level={2} />
            <div style={{ aspectRatio: '4/3', minHeight: '200px' }}>
              <Suspense fallback={<MapSkeleton />}>
                <LazyMap className="w-full h-full overflow-hidden rounded-lg border border-gray-300 shadow-md" />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Optimized Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="text-center">
            <div className="inline-flex items-center justify-center space-x-2 text-sm text-gray-600 bg-white/60 px-6 py-2 rounded-full backdrop-blur-sm border border-gray-200">
              <span className="w-2 h-2 bg-gradient-to-r from-gray-500 to-slate-400 rounded-full" aria-hidden="true" />
              <span>© 2025 Mannubhai. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}