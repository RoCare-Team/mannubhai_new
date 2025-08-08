"use client";
import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { CiStar } from "react-icons/ci";
import { PiUsersThree } from "react-icons/pi";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./swiper-custom.css";

const ServiceBannerSlider = dynamic(() => import("./ServiceBannerSlider"), {
  ssr: false,
  loading: () => <ServiceBannerSkeleton />,
});

// Constants
const SERVICE_IMAGES = {
  "Appliances Care": "/herosection/home appliances.webp",
  "Home Care": "/herosection/sofa-bathroom-and-kitchen-cleaning.webp",
  "Beauty Care": "/herosection/BEAUTY CARE.webp",
  "Handyman": "/herosection/Electrician.webp",
};

const DEFAULT_SERVICE_IMAGE = "/default-images/deafult.jpeg";
const MAIN_BANNER = "/MainBanner/HomeBanner.webp";
const BOTTOM_BANNER = "/HomeBanner/appliance.webp";
const RAKHI_BANNER = "/BeautyHomeIcons/rakhi_banner.webp";

// Minimal skeleton components for faster rendering
const MinimalSkeleton = ({ className }) => (
  <div className={`bg-gray-100 animate-pulse ${className}`}></div>
);

const ServiceCardSkeleton = ({ isMobile = false }) => (
  <div className={`
    ${isMobile ? 'p-3 h-[120px]' : 'p-4 md:p-5 h-[180px]'} 
    bg-gray-100 animate-pulse rounded-2xl flex flex-col items-center justify-center
  `}>
    <div className={`
      ${isMobile ? 'w-12 h-12' : 'w-14 h-14 md:w-16 md:h-16'} 
      bg-gray-200 rounded-xl mb-3
    `}></div>
    <div className="bg-gray-200 rounded-lg h-4 w-3/4"></div>
  </div>
);

const StatsCardSkeleton = () => (
  <div className="flex items-center gap-4 p-5 md:p-6 bg-gray-100 animate-pulse rounded-2xl">
    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
    <div className="space-y-2">
      <div className="bg-gray-200 rounded-lg h-6 w-20"></div>
      <div className="bg-gray-200 rounded-lg h-4 w-24"></div>
    </div>
  </div>
);

const HeroImageSkeleton = () => (
  <div className="relative w-full aspect-[4/5] max-h-[600px] bg-gray-100 animate-pulse rounded-3xl"></div>
);

const ServiceBannerSkeleton = () => (
  <div className="w-full h-48 bg-gray-100 animate-pulse rounded-2xl"></div>
);
const RakhiBannerSkeleton = () => (
  <div className="w-full h-32 md:h-40 lg:h-48 bg-gray-100 animate-pulse rounded-2xl mb-6"></div>
);

// Rakhi Banner Component
const RakhiBanner = () => {
  const router = useRouter();

  const handleBannerClick = () => {
    router.push('/rakhi_packages');
  };

  return (
    <div className="w-full mb-6">
      <button
        onClick={handleBannerClick}
        className="w-full group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-pink-300"
        aria-label="Click to view Rakhi special packages and offers"
      >
        <div className="relative w-full aspect-[3/1] min-h-[120px] md:min-h-[160px] bg-gradient-to-r from-pink-100 to-orange-100">
          <Image
            src={RAKHI_BANNER}
            alt="Rakhi special offer - Up to 30% OFF on home services"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            className="object-cover object-center"
            quality={90}
            priority
          />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </button>
    </div>
  );
};

// Optimized service card
const ServiceCard = ({ service, isMobile, onClick }) => (
  <button
    className={`
      relative group
      ${isMobile ? 'p-3 h-[120px]' : 'p-4 md:p-5 h-[180px]'} 
      bg-white hover:bg-blue-50
      rounded-2xl shadow-md hover:shadow-lg 
      transition-shadow duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500
      flex flex-col items-center
    `}
    onClick={onClick}
    title={`Navigate to ${service.name} services`}
    aria-label={`View ${service.name} services`}
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
        loading={isMobile ? "lazy" : "eager"}
        quality={75}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rw=="
      />
    </div>
    <span className="font-medium text-center block text-gray-800 text-sm">
      {service.name}
    </span>
  </button>
);

// Simplified stats card
const StatsCard = ({ icon: Icon, value, label, bgColor, textColor, iconColor }) => (
  <div className={`flex items-center gap-4 p-5 md:p-6 ${bgColor} rounded-2xl shadow-md`}>
    <Icon className={`${iconColor} text-3xl lg:text-4xl`} />
    <div>
      <h3 className={`text-xl lg:text-2xl font-bold ${textColor}`}>{value}</h3>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  </div>
);

// Bottom banner component with click functionality
const BottomBanner = () => {
  const router = useRouter();

  const handleAppBannerClick = () => {
    router.push('/appliance');
  };

  return (
    <div className="hidden md:block w-full px-2 lg:px-12 mt-6 lg:mt-12 mb-0 relative z-10">
      <button
        onClick={handleAppBannerClick}
        className="w-full group relative overflow-hidden rounded-3xl focus:outline-none"
        aria-label="View appliance services"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full aspect-[91/20] bg-gray-100 rounded-3xl overflow-hidden">
            <Image
              src={BOTTOM_BANNER}
              alt="Professional home appliance services banner"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1820px"
              className="object-cover"
              priority
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABQUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rw=="
            />
          </div>
        </div>
      </button>
    </div>
  );
};

const HeroSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Memoized service order
  const serviceOrder = useMemo(() => [
    "Appliances Care",
    "Home Care", 
    "Beauty Care",
    "Handyman",
  ], []);

  // Optimized fetch function
  const fetchMainServices = useCallback(async () => {
    try {
      const servicesCollection = collection(db, "main_category");
      const snapshot = await getDocs(servicesCollection);
      
      const servicesData = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          const name = data.name || "Service";
          return {
            id: doc.id,
            ...data,
            name,
            imageUrl: SERVICE_IMAGES[name] || DEFAULT_SERVICE_IMAGE,
          };
        })
        .sort((a, b) => serviceOrder.indexOf(a.name) - serviceOrder.indexOf(b.name));

      setServices(servicesData);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [serviceOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMainServices();
    }, 100);
    return () => clearTimeout(timer);
  }, [fetchMainServices]);

  // Image preloading
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const preloadImages = () => {
      [MAIN_BANNER, BOTTOM_BANNER, RAKHI_BANNER, ...Object.values(SERVICE_IMAGES)].forEach(src => {
        const img = new window.Image();
        img.src = src;
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadImages);
    } else {
      setTimeout(preloadImages, 100);
    }
  }, []);

  const scrollToSection = useCallback((serviceName) => {
    const sectionMap = {
      'Appliances Care': 'appliances-care',
      'Home Care': 'home-care', 
      'Beauty Care': 'beauty-care',
      'Handyman': 'handyman',
    };
    const sectionId = sectionMap[serviceName];
    if (sectionId) {
      const section = document.getElementById(sectionId);
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleServiceClick = useCallback((service) => {
    scrollToSection(service.name);
  }, [scrollToSection]);

  const renderServiceCards = useCallback((isMobile = true) => {
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
            ${isMobile ? 'p-3 h-[120px]' : 'p-4 md:p-5 h-[180px]'} 
            bg-gray-100 rounded-2xl flex flex-col items-center justify-center
          `}
        >
          <span className="text-gray-400 text-sm">Service</span>
        </div>
      ));
    }

    return services.map((service) => (
      <ServiceCard
        key={service.id}
        service={service}
        isMobile={isMobile}
        onClick={() => handleServiceClick(service)}
      />
    ));
  }, [loading, error, services, handleServiceClick]);

  // Stats data
  const statsData = useMemo(() => [
    {
      icon: CiStar,
      value: "4.5",
      label: "Service Rating",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      iconColor: "text-yellow-500"
    },
    {
      icon: PiUsersThree,
      value: "30 Lacs+",
      label: "Customer Globally", 
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      iconColor: "text-blue-500"
    }
  ], []);

  // Mobile services slider
  const renderMobileServicesSlider = () => (
    <div className="lg:hidden w-full px-2 py-3 bg-white relative">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Our Services 👨‍🔧
      </h2>
      <Swiper
        slidesPerView={4}
        spaceBetween={8}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="services-swiper"
      >
        {services.map((service) => (
          <SwiperSlide key={service.id}>
            <ServiceCard
              service={service}
              isMobile={true}
              onClick={() => handleServiceClick(service)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );

  return (
    <section className="relative">
      {/* Mobile Services Slider */}
      {renderMobileServicesSlider()}

      {/* Desktop View */}
      <div className="hidden lg:block w-full px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-0 relative">
        <div className="max-w-7xl mx-auto mt-8">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 xl:gap-16">
            
            {/* Left Content */}
            <div className="w-full lg:flex-1 lg:max-w-2xl">
              <header className="mb-8 md:mb-12">
                <h1 className="text-5xl md:text-6xl font-black leading-tight mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
                  <div className="min-h-[200px]">
                    <div className="grid grid-cols-4 gap-4 md:gap-6">
                      {renderServiceCards(false)}
                    </div>
                  </div>
                </div>
              </section>

              {/* Stats Cards */}
              <div className="flex gap-6 md:gap-8 mb-8">
                {loading ? (
                  <>
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                  </>
                ) : (
                  statsData.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                  ))
                )}
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full lg:flex-1 lg:max-w-2xl">
              {loading ? (
                <HeroImageSkeleton />
              ) : (
                <div className="relative w-full aspect-[4/5] max-h-[600px] bg-gray-100 rounded-3xl overflow-hidden">
                  <Image
                    src={MAIN_BANNER}
                    alt="Professional home services team working"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    quality={85}
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rw==" 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rakhi Banner */}
      <div className="w-full px-4 sm:px-6 lg:px-12 mt-6 relative">
        <div className="max-w-7xl mx-auto">
          {loading ? <RakhiBannerSkeleton /> : <RakhiBanner />}
        </div>
      </div>
  <div className="hidden lg:block w-full px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mt-8 relative">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<ServiceBannerSkeleton />}>
            <ServiceBannerSlider />
          </Suspense>
        </div>
      </div>
      {/* Bottom Banner */}
      <BottomBanner />
    </section>
  );
};

export default HeroSection;