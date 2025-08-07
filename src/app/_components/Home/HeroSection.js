"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CiStar } from "react-icons/ci";
import { PiUsersThree } from "react-icons/pi";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "./swiper-custom.css";
import dynamic from 'next/dynamic';

const ServiceBannerSlider = dynamic(() => import("./ServiceBannerSlider"), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl animate-pulse" />,
});

const SERVICE_IMAGES = {
  "Appliances Care": "/herosection/home appliances.webp",
  "Home Care": "/herosection/sofa-bathroom-and-kitchen-cleaning.webp",
  "Beauty Care": "/herosection/BEAUTY CARE.webp",
  "Handyman": "/herosection/Electrician.webp",
};

const DEFAULT_SERVICE_IMAGE = "/default-images/deafult.jpeg";
const MAIN_BANNER = "/MainBanner/HomeBanner.webp";

// Modern Skeleton components with glassmorphism effect
const ServiceCardSkeleton = ({ isMobile = false }) => (
  <div className={`
    relative overflow-hidden
    ${isMobile ? 'p-3' : 'p-4 md:p-5'} 
    bg-gradient-to-br from-white/80 to-gray-50/80 
    backdrop-blur-sm border border-white/20 
    rounded-2xl shadow-lg animate-pulse
    hover:shadow-xl transition-all duration-300
  `}>
    <div className={`
      ${isMobile ? 'w-12 h-12' : 'w-14 h-14 md:w-16 md:h-16'} 
      bg-gradient-to-br from-gray-200 to-gray-300 
      rounded-xl mb-3 mx-auto
    `}></div>
    <div className={`
      bg-gradient-to-r from-gray-200 to-gray-300 
      rounded-lg mx-auto
      ${isMobile ? 'h-3 w-12' : 'h-4 w-16'}
    `}></div>
  </div>
);

const HeroSection = () => {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMainServices = async () => {
      try {
        const servicesCollection = collection(db, "main_category");
        const snapshot = await getDocs(servicesCollection);
        const order = [
          "Appliances Care",
          "Home Care",
          "Beauty Care",
          "Handyman",
        ];
        const servicesData = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            const name = data.name || "Service";
            return {
              id: doc.id,
              ...data,
              name,
              pkgIconName: name,
              imageUrl: SERVICE_IMAGES[name] || DEFAULT_SERVICE_IMAGE,
            };
          })
          .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

        setServices(servicesData);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMainServices();
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;
  
  const isBrowser = typeof window !== "undefined";
  
  const scrollToSection = (serviceName) => {
    if (!isBrowser) return;

    const sectionMap = {
      'Appliances Care': 'appliances-care',
      'Home Care': 'home-care',
      'Beauty Care': 'beauty-care',
      'Handyman': 'handyman',
    };

    const sectionId = sectionMap[serviceName];
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const offsetPosition = section.offsetTop - headerHeight - 20;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

        section.classList.add('highlight-section');
        setTimeout(() => section.classList.remove('highlight-section'), 2000);

        section.setAttribute('tabindex', '-1');
        section.focus();
      }
    }
  };

  const handleServiceClick = (service, e) => {
    if (e) e.preventDefault();
    scrollToSection(service.name);
  };

  // Modern service cards with glassmorphism and micro-animations
  const renderServiceCards = (isMobile = false) => {
    if (loading) {
      return Array.from({ length: 4 }, (_, index) => (
        <ServiceCardSkeleton key={`skeleton-${index}`} isMobile={isMobile} />
      ));
    }

    if (error || services.length === 0) {
      return Array.from({ length: 4 }, (_, index) => (
        <div 
          key={`error-${index}`} 
          className={`
            relative group
            ${isMobile ? 'p-3' : 'p-4 md:p-5'} 
            bg-gradient-to-br from-gray-100/80 to-gray-200/80 
            backdrop-blur-sm border border-gray-200/30 
            rounded-2xl shadow-md hover:shadow-lg 
            transition-all duration-300
          `}
        >
          <div className={`
            ${isMobile ? 'w-12 h-12' : 'w-14 h-14 md:w-16 md:h-16'} 
            bg-gradient-to-br from-gray-200 to-gray-300 
            rounded-xl mb-3 mx-auto flex items-center justify-center
          `}>
            <span className="text-gray-400 text-xs font-medium">N/A</span>
          </div>
          <span className={`
            text-gray-400 font-medium text-center block
            ${isMobile ? 'text-xs' : 'text-sm'}
          `}>Service</span>
        </div>
      ));
    }

    return services.map((service, index) => (
      <button
        key={service.id}
        className={`
          relative group overflow-hidden
          ${isMobile ? 'p-3' : 'p-4 md:p-5'} 
          bg-gradient-to-br from-white/90 to-gray-50/90 
          backdrop-blur-sm border border-white/30 
          rounded-2xl shadow-lg hover:shadow-xl 
          transition-all duration-500 ease-out
          hover:scale-105 hover:-translate-y-1
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2
          before:absolute before:inset-0 before:bg-gradient-to-r 
          before:from-blue-500/10 before:to-purple-500/10 
          before:opacity-0 before:transition-opacity before:duration-300
          hover:before:opacity-100
        `}
        style={{
          animationDelay: `${index * 100}ms`,
          animation: hasMounted ? 'fadeInUp 0.6s ease-out forwards' : 'none'
        }}
        onClick={(e) => handleServiceClick(service, e)}
        title={`Navigate to ${service.name} services`}
      >
        <div className={`
          relative z-10
          ${isMobile ? 'w-12 h-12' : 'w-14 h-14 md:w-16 md:h-16'} 
          mb-3 mx-auto
          transition-transform duration-500 ease-out
          group-hover:scale-110 group-hover:rotate-3
        `}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Image
            src={service.imageUrl}
            alt={`${service.name} service icon`}
            fill
            sizes={isMobile ? "48px" : "(max-width: 768px) 56px, 64px"}
            className="object-contain relative z-10 filter drop-shadow-md"
            loading="lazy"
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHR4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDSEIzTHshf3ow6jsTEfLxQAb+ABSx0PkWrBXMJG3cDaJLcZGtLRrLbX9eMeJ/9k="
          />
        </div>
        <span className={`
          relative z-10 font-semibold text-center block leading-tight
          bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent
          transition-all duration-300
          group-hover:from-blue-600 group-hover:to-purple-600
          ${isMobile ? 'text-xs' : 'text-sm'}
        `}>
          {service.name}
        </span>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/10 group-hover:via-purple-400/10 group-hover:to-pink-400/10 transition-all duration-500"></div>
      </button>
    ));
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 pointer-events-none"></div>
      
      {/* Mobile Only - Services Section (keeping your original design) */}
      <div className="lg:hidden w-full px-2 py-3 bg-white relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="block sm:hidden text-lg font-semibold mb-4 text-left flex justify-start gap-2 mt-3">
            <span>Our Services</span>
            <span role="img" aria-label="mechanic">👨‍🔧</span>
          </h2>
        </div>
        <div className="min-h-[120px]">
          <div className="grid grid-cols-4 gap-1 border border-gray-200 rounded-lg shadow-sm">
            {renderServiceCards(true)}
          </div>
        </div>
      </div>

      {/* Desktop View - Modernized */}
      <div className="hidden lg:block hero-section w-full px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-0 relative z-10">
        <div className="hero-section-container max-w-7xl mx-auto mt-8">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 xl:gap-16">
            
            {/* Left Content */}
            <div className="w-full lg:flex-1 lg:max-w-2xl">
              
              {/* Modern Header with Gradient Text */}
              <header className="mb-8 md:mb-12">
                <h1 className="text-5xl md:text-6xl font-black leading-tight mb-4">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Home services
                  </span>
                  <br />
                  <span className="text-gray-800">at your doorstep</span>
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </header>

              {/* Services Section with Glassmorphism */}
              <section className="services-part mb-8 lg:mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
                  What are you looking for?
                </h2>
                
                <div className="relative">
                  {/* Glassmorphism container */}
                  <div className="
                    bg-gradient-to-br from-white/70 to-gray-50/70 
                    backdrop-blur-xl border border-white/30 
                    rounded-3xl p-6 md:p-8 
                    shadow-2xl shadow-black/5
                    hover:shadow-3xl hover:shadow-black/10
                    transition-all duration-500
                  ">
                    <div className="min-h-[180px] md:min-h-[200px]">
                      <div className="grid grid-cols-4 gap-4 md:gap-6">
                        {renderServiceCards(false)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle background decoration */}
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
                </div>
              </section>

              {/* Modern Stats Cards */}
              <div className="flex flex-row justify-start gap-6 md:gap-8 mb-8">
                <div className="group relative overflow-hidden">
                  <div className="
                    flex items-center gap-4 p-5 md:p-6 
                    bg-gradient-to-br from-yellow-50/80 to-orange-50/80 
                    backdrop-blur-sm border border-yellow-200/30 
                    rounded-2xl shadow-lg hover:shadow-xl 
                    transition-all duration-500
                    hover:scale-105 hover:-translate-y-1
                  ">
                    <div className="relative">
                      <CiStar className="text-yellow-500 text-3xl lg:text-4xl flex-shrink-0 relative z-10" aria-hidden="true" />
                      <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md scale-150 group-hover:scale-200 transition-transform duration-500"></div>
                    </div>
                    <div>
                      <h3 className="text-xl lg:text-2xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">4.5</h3>
                      <p className="text-sm font-medium text-gray-600">Service Rating</p>
                    </div>
                  </div>
                </div>
                
                <div className="group relative overflow-hidden">
                  <div className="
                    flex items-center gap-4 p-5 md:p-6 
                    bg-gradient-to-br from-blue-50/80 to-cyan-50/80 
                    backdrop-blur-sm border border-blue-200/30 
                    rounded-2xl shadow-lg hover:shadow-xl 
                    transition-all duration-500
                    hover:scale-105 hover:-translate-y-1
                  ">
                    <div className="relative">
                      <PiUsersThree className="text-blue-500 text-3xl lg:text-4xl flex-shrink-0 relative z-10" aria-hidden="true" />
                      <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md scale-150 group-hover:scale-200 transition-transform duration-500"></div>
                    </div>
                    <div>
                      <h3 className="text-xl lg:text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">30 Lacs+</h3>
                      <p className="text-sm font-medium text-gray-600">Customer Globally</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image with Modern Frame */}
            <div className="w-full lg:flex-1 lg:max-w-2xl">
              <div className="relative group">
                {/* Main image container */}
                <div className="
                  relative w-full aspect-[4/5] max-h-[600px] 
                  bg-gradient-to-br from-white/20 to-gray-100/20 
                  backdrop-blur-sm border border-white/30 
                  rounded-3xl overflow-hidden 
                  shadow-2xl shadow-black/10
                  hover:shadow-3xl hover:shadow-black/15
                  transition-all duration-700 ease-out
                  hover:scale-[1.02] hover:-translate-y-2
                ">
                  <Image
                    src={MAIN_BANNER}
                    alt="Professional home services team working"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                   priority={true}
                   fetchPriority="high"
                    quality={95}
                    style={{ objectPosition: "center 30%" }}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHR4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDSEIzTHshf3ow6jsTEfLxQAb+ABSx0PkWrBXMJG3cDaJLcZGtLRrLbX9eMeJ/9k="
                  />
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swiper Section with Modern Loading */}
      <div className="hidden lg:block w-full px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mt-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <ServiceBannerSlider />
        </div>
      </div>

      {/* Modern Banner Section */}
      <div className="w-full px-2 lg:px-12 mt-6 lg:mt-12 mb-0 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="
            group relative overflow-hidden
            bg-gradient-to-br from-white/10 to-gray-100/10 
            backdrop-blur-sm border border-white/20 
            rounded-3xl shadow-2xl shadow-black/5
            hover:shadow-3xl hover:shadow-black/10
            transition-all duration-700
            hover:scale-[1.01]
          ">
            <div className="relative w-full aspect-[91/20]">
              <Image
                src="/HomeBanner/appliance.webp"
                alt="Professional home appliance services banner"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1820px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                quality={95}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHR4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDSEIzTHshf3ow6jsTEfLxQAb+ABSx0PkWrBXMJG3cDaJLcZGtLRrLbX9eMeJ/9k="
              />
            </div>
            
            {/* Overlay gradient for better text visibility if needed */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>

     
    </section>
  );
};

export default HeroSection;