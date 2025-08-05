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
import ServiceBannerSlider from "./ServiceBannerSlider";

const SERVICE_IMAGES = {
  "Appliances Care": "/herosection/home appliances.webp",
  "Home Care": "/herosection/sofa-bathroom-and-kitchen-cleaning.webp",
  "Beauty Care": "/herosection/BEAUTY CARE.webp",
  "Handyman": "/herosection/Electrician.webp",
};

const DEFAULT_SERVICE_IMAGE = "/default-images/deafult.jpeg";
const MAIN_BANNER = "/MainBanner/HomeBanner.webp";

// Skeleton components to prevent layout shift
const ServiceCardSkeleton = ({ isMobile = false }) => (
  <div className={`flex flex-col items-center ${isMobile ? 'p-2' : 'p-3 md:p-4'} rounded-lg border border-gray-200 bg-gray-50 animate-pulse`}>
    <div className={`${isMobile ? 'w-14 h-14' : 'w-14 h-14 md:w-16 md:h-16'} bg-gray-300 rounded mb-2 md:mb-3`}></div>
    <div className={`bg-gray-300 rounded ${isMobile ? 'h-3 w-12' : 'h-4 w-16'}`}></div>
  </div>
);

const HeroSection = () => {
  const router = useRouter();
   const [hasMounted, setHasMounted] = useState(false)
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

  // ✅ 2. Guard after all hooks
  if (!hasMounted) return null;

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

  // Render service cards with proper loading states
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
          className={`flex flex-col items-center ${isMobile ? 'p-2' : 'p-3 md:p-4'} rounded-lg border border-gray-200 bg-gray-50`}
        >
          <div className={`${isMobile ? 'w-14 h-14' : 'w-14 h-14 md:w-16 md:h-16'} bg-gray-200 rounded mb-2 md:mb-3 flex items-center justify-center`}>
            <span className="text-gray-400 text-xs">N/A</span>
          </div>
          <span className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>Service</span>
        </div>
      ));
    }

    return services.map((service) => (
      <button
        key={service.id}
        className={`flex flex-col items-center ${isMobile ? 'p-2' : 'p-3 md:p-4'} rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer shadow-sm group hover:shadow-md`}
        onClick={(e) => handleServiceClick(service, e)}
        title={`Navigate to ${service.name} services`}
        role="button"
      >
        <div className={`relative ${isMobile ? 'w-14 h-14' : 'w-14 h-14 md:w-16 md:h-16'} mb-2 md:mb-3 transition-transform duration-200 group-hover:scale-105`}>
          <Image
            src={service.imageUrl}
            alt={`${service.name} service icon`}
            fill
            sizes={isMobile ? "56px" : "(max-width: 768px) 56px, 64px"}
            className="object-contain"
            loading="lazy"
            quality={80}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHR4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDSEIzTHshf3ow6jsTEfLxQAb+ABSx0PkWrBXMJG3cDaJLcZGtLRrLbX9eMeJ/9k="
          />
        </div>
        <span className={`font-medium text-center leading-tight ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {service.name}
        </span>
      </button>
    ));
  };

  return (
    <section className="relative pt-10">
      {/* Mobile Only - Services Section */}
      <div className="lg:hidden w-full px-2 py-3 bg-white mt-10">
        <div className="flex items-center justify-between">
          <h2 className="block sm:hidden text-lg font-semibold mb-4 text-left flex justify-start gap-2 mt-3">
            <span>Our Services</span>
            <span role="img" aria-label="mechanic">👨‍🔧</span>
          </h2>
        </div>
        {/* Fixed height container to prevent layout shift */}
        <div className="min-h-[120px]">
          <div className="grid grid-cols-4 gap-1 border border-gray-200 rounded-lg shadow-sm">
            {renderServiceCards(true)}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block hero-section w-full px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-0">
        <div className="hero-section-container max-w-7xl mx-auto mt-5">
          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 xl:gap-12">
            {/* Left Content */}
            <div className="w-full lg:flex-1 lg:max-w-2xl">
              <header className="flex items-center gap-3 mb-6 md:mb-8">
                <h1 className="text-4xl md:text-4xl font-bold leading-tight text-gradient">
                  Home services at your doorstep
                </h1>
              </header>
              <section className="services-part mb-6 lg:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">
                  What are you looking for?
                </h2>
                <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm">
                  {/* Fixed height container to prevent layout shift */}
                  <div className="min-h-[140px] md:min-h-[160px]">
                    <div className="grid grid-cols-4 gap-4 md:gap-5">
                      {renderServiceCards(false)}
                    </div>
                  </div>
                </div>
              </section>
              <div className="flex flex-row justify-start gap-6 md:gap-8 mb-6 mt-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm">
                  <CiStar className="text-yellow-500 text-2xl lg:text-3xl flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="text-base lg:text-lg font-bold">4.5</h3>
                    <p className="text-sm text-gray-600">Service Rating</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm">
                  <PiUsersThree className="text-blue-500 text-2xl lg:text-3xl flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="text-base lg:text-lg font-bold">30 Lacs+</h3>
                    <p className="text-sm text-gray-600">Customer Globally</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Image - Fixed aspect ratio to prevent layout shift */}
            <div className="w-full lg:flex-1 lg:max-w-2xl">
              <div className="relative w-full aspect-[4/5] max-h-[550px] border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Image
                  src={MAIN_BANNER}
                  alt="Professional home services team working"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  fetchPriority="high"
                  priority
                  quality={85}
                  style={{ objectPosition: "center 30%" }}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHR4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDSEIzTHshf3ow6jsTEfLxQAb+ABSx0PkWrBXMJG3cDaJLcZGtLRrLbX9eMeJ/9k="
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swiper Section - Hidden on Mobile */}
      <div className="hidden lg:block w-full px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mt-5">
        <div className="max-w-7xl mx-auto">
          <ServiceBannerSlider />
        </div>
      </div>

      {/* Single Banner for all devices - Fixed aspect ratio */}
      <div className="w-full px-2 lg:px-12 mt-3 lg:mt-10 mb-0">
        <div className="max-w-7xl mx-auto">
          <div className="shadow-lg rounded-lg overflow-hidden">
            <div className="relative w-full aspect-[91/20]">
              <Image
                src="/HomeBanner/appliance.webp"
                alt="Professional home appliance services banner"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1820px"
                className="object-cover"
                priority
                quality={90}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARDAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHR4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDSEIzTHshf3ow6jsTEfLxQAb+ABSx0PkWrBXMJG3cDaJLcZGtLRrLbX9eMeJ/9k="
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;