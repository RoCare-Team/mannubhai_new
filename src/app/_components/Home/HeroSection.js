"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CiStar } from "react-icons/ci";
import { PiUsersThree } from "react-icons/pi";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "./swiper-custom.css";
import dynamic from 'next/dynamic';

const ServiceBannerSlider = dynamic(() => import("./ServiceBannerSlider"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl animate-pulse" />
  ),
});

const SERVICE_IMAGES = {
  "Appliances Care": "/herosection/home appliances.webp",
  "Home Care": "/herosection/sofa-bathroom-and-kitchen-cleaning.webp",
  "Beauty Care": "/herosection/BEAUTY CARE.webp",
  "Handyman": "/herosection/Electrician.webp",
};

const DEFAULT_SERVICE_IMAGE = "/default-images/deafult.jpeg";
const MAIN_BANNER = "/MainBanner/HomeBanner.webp";

// Optimized skeleton components with proper aspect ratios
const ServiceCardSkeleton = ({ isMobile = false }) => (
  <div className={`
    relative overflow-hidden
    ${isMobile ? 'p-3' : 'p-4 md:p-5'} 
    bg-gradient-to-br from-white/80 to-gray-50/80 
    rounded-2xl shadow-lg animate-pulse
    flex flex-col items-center
    ${isMobile ? 'h-[120px]' : 'h-[180px]'}
  `}>
    <div className={`
      ${isMobile ? 'w-12 h-12' : 'w-14 h-14 md:w-16 md:h-16'} 
      bg-gray-200 rounded-xl mb-3 mt-2
    `}></div>
    <div className="bg-gray-200 rounded-lg h-4 w-3/4"></div>
  </div>
);

const StatsCardSkeleton = () => (
  <div className="flex items-center gap-4 p-5 md:p-6 bg-gray-100 rounded-2xl shadow-lg animate-pulse">
    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
    <div className="space-y-2">
      <div className="bg-gray-200 rounded-lg h-6 w-20"></div>
      <div className="bg-gray-200 rounded-lg h-4 w-24"></div>
    </div>
  </div>
);

const HeroImageSkeleton = () => (
  <div className="relative w-full aspect-[4/5] max-h-[600px] bg-gray-200 rounded-3xl overflow-hidden animate-pulse"></div>
);

const HeroSection = () => {
  const router = useRouter();
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

  const scrollToSection = (serviceName) => {
    if (typeof window === "undefined") return;

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

  const renderServiceCards = (isMobile = true) => {
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
            ${isMobile ? 'p-3 h-[120px]' : 'p-4 md:p-5 h-[180px]'} 
            bg-gradient-to-br from-gray-100/80 to-gray-200/80 
            rounded-2xl shadow-md flex flex-col items-center justify-center
          `}
        >
          <div className={`
            ${isMobile ? 'w-12 h-12' : 'w-14 h-14 md:w-16 md:h-16'} 
            bg-gray-200 rounded-xl mb-3 flex items-center justify-center
          `}>
            <span className="text-gray-400 text-xs font-medium">N/A</span>
          </div>
          <span className="text-gray-400 font-medium text-center block text-sm">
            Service
          </span>
        </div>
      ));
    }

    return services.map((service) => (
      <button
        key={service.id}
        className={`
          relative overflow-hidden
          ${isMobile ? 'p-3 h-[120px]' : 'p-4 md:p-5 h-[180px]'} 
          bg-gradient-to-br from-white/90 to-gray-50/90 
          rounded-2xl shadow-lg hover:shadow-xl 
          transition-all duration-300 ease-out
          hover:scale-[1.02] hover:-translate-y-1
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2
          flex flex-col items-center
        `}
        onClick={(e) => handleServiceClick(service, e)}
        title={`Navigate to ${service.name} services`}
      >
        <div className={`
          relative
          ${isMobile ? 'w-12 h-12' : 'w-14 h-14 md:w-16 md:h-16'} 
          mb-3 mt-2
        `}>
          <Image
            src={service.imageUrl}
            alt={`${service.name} service icon`}
            fill
            sizes={isMobile ? "48px" : "(max-width: 768px) 56px, 64px"}
            className="object-contain"
            loading="eager"
            quality={90}
            priority={!isMobile} // Only prioritize desktop images
          />
        </div>
        <span className="font-semibold text-center block leading-tight text-gray-800 text-sm">
          {service.name}
        </span>
      </button>
    ));
  };

  return (
    <section className="relative overflow-hidden">
      {/* Mobile Services Section */}
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

      {/* Desktop View */}
      <div className="hidden lg:block hero-section w-full px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-0 relative z-10">
        <div className="hero-section-container max-w-7xl mx-auto mt-8">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 xl:gap-16">
            
            {/* Left Content */}
            <div className="w-full lg:flex-1 lg:max-w-2xl">
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

              <section className="services-part mb-8 lg:mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
                  What are you looking for?
                </h2>
                
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/5">
                  <div className="min-h-[200px]">
                    <div className="grid grid-cols-4 gap-4 md:gap-6">
                      {renderServiceCards(false)}
                    </div>
                  </div>
                </div>
              </section>

              {/* Stats Cards */}
              <div className="flex flex-row justify-start gap-6 md:gap-8 mb-8">
                {loading ? (
                  <>
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4 p-5 md:p-6 bg-yellow-50 rounded-2xl shadow-lg">
                      <CiStar className="text-yellow-500 text-3xl lg:text-4xl" />
                      <div>
                        <h3 className="text-xl lg:text-2xl font-black text-yellow-600">4.5</h3>
                        <p className="text-sm font-medium text-gray-600">Service Rating</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-5 md:p-6 bg-blue-50 rounded-2xl shadow-lg">
                      <PiUsersThree className="text-blue-500 text-3xl lg:text-4xl" />
                      <div>
                        <h3 className="text-xl lg:text-2xl font-black text-blue-600">30 Lacs+</h3>
                        <p className="text-sm font-medium text-gray-600">Customer Globally</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full lg:flex-1 lg:max-w-2xl">
              {loading ? (
                <HeroImageSkeleton />
              ) : (
                <div className="relative w-full aspect-[4/5] max-h-[600px] bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
                  <Image
                    src={MAIN_BANNER}
                    alt="Professional home services team working"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    quality={95}
                    className="object-cover object-center"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Swiper Section */}
      <div className="hidden lg:block w-full px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mt-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <ServiceBannerSlider />
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="w-full px-2 lg:px-12 mt-6 lg:mt-12 mb-0 relative z-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="w-full aspect-[91/20] bg-gray-200 rounded-3xl animate-pulse"></div>
          ) : (
            <div className="relative w-full aspect-[91/20] bg-white rounded-3xl shadow-2xl shadow-black/5 overflow-hidden">
              <Image
                src="/HomeBanner/appliance.webp"
                alt="Professional home appliance services banner"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1820px"
                className="object-cover"
                priority
                quality={95}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;