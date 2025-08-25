"use client";
import { useState, useEffect, useCallback, useMemo, Suspense, memo } from "react";
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
import Link from 'next/link'; // Add this line
// Dynamic imports with loading states
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


// Optimized skeleton components
const MinimalSkeleton = memo(({ className }) => (
  <div className={`bg-gray-100 animate-pulse ${className}`}></div>
));
MinimalSkeleton.displayName = 'MinimalSkeleton';

const ServiceCardSkeleton = memo(({ isMobile = false }) => (
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
));
ServiceCardSkeleton.displayName = 'ServiceCardSkeleton';

const StatsCardSkeleton = memo(() => (
  <div className="flex items-center gap-4 p-5 md:p-6 bg-gray-100 animate-pulse rounded-2xl">
    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
    <div className="space-y-2">
      <div className="bg-gray-200 rounded-lg h-6 w-20"></div>
      <div className="bg-gray-200 rounded-lg h-4 w-24"></div>
    </div>
  </div>
));
StatsCardSkeleton.displayName = 'StatsCardSkeleton';

const HeroImageSkeleton = memo(() => (
  <div className="relative w-full aspect-[4/5] max-h-[600px] bg-gray-100 animate-pulse rounded-3xl"></div>
));
HeroImageSkeleton.displayName = 'HeroImageSkeleton';

const ServiceBannerSkeleton = memo(() => (
  <div className="w-full h-48 bg-gray-100 animate-pulse rounded-2xl"></div>
));
ServiceBannerSkeleton.displayName = 'ServiceBannerSkeleton';

const RakhiBannerSkeleton = memo(() => (
  <div className="w-full h-32 md:h-40 lg:h-48 bg-gray-100 animate-pulse rounded-2xl mb-6"></div>
));
RakhiBannerSkeleton.displayName = 'RakhiBannerSkeleton';

// Enhanced components with better hover effects


const ServiceCard = memo(({ service, isMobile, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleClick = useCallback(() => {
    onClick(service);
  }, [onClick, service]);

  return (
    <button
      className={`
        relative group
        ${isMobile ? 'p-3 h-[120px]' : 'p-4 md:p-5 h-[180px]'} 
        bg-white hover:bg-blue-50
        rounded-2xl shadow-md hover:shadow-lg 
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-blue-500
        flex flex-col items-center
        hover:scale-105 active:scale-95
      `}
      onClick={handleClick}
      title={`Navigate to ${service.name} services`}
      aria-label={`View ${service.name} services`}
    >
      <div className={`
        relative
        ${isMobile ? 'w-12 h-12' : 'w-14 h-14 md:w-16 md:h-16'} 
        mb-3 mt-2 transition-transform duration-300 group-hover:scale-110
      `}>
        <Image
          src={service.imageUrl}
          alt={`${service.name} service icon`}
          fill
          sizes={isMobile ? "48px" : "(max-width: 768px) 56px, 64px"}
          className={`object-contain transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={isMobile ? "lazy" : "eager"}
          quality={75}
          onLoad={handleImageLoad}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rw=="
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
        )}
      </div>
      <span className="font-medium text-center block text-gray-800 text-sm transition-colors duration-200 group-hover:text-blue-600">
        {service.name}
      </span>
    </button>
  );
});
ServiceCard.displayName = 'ServiceCard';

const StatsCard = memo(({ icon: Icon, value, label, bgColor, textColor, iconColor }) => (
  <div className={`
    flex items-center gap-4 p-5 md:p-6 ${bgColor} rounded-2xl shadow-md 
    transition-all duration-300 hover:shadow-lg hover:scale-105
    group cursor-pointer
  `}>
    <Icon className={`${iconColor} text-3xl lg:text-4xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`} />
    <div>
      <h3 className={`text-xl lg:text-2xl font-bold ${textColor} transition-colors duration-300`}>{value}</h3>
      <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">{label}</p>
    </div>
  </div>
));
StatsCard.displayName = 'StatsCard';

const BottomBanner = memo(() => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAppBannerClick = useCallback(() => {
    router.push('/appliance');
  }, [router]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <div className="hidden md:block w-full px-2 lg:px-12 mt-6 lg:mt-12 mb-0 relative z-10">
      <button
        onClick={handleAppBannerClick}
        className="w-full group relative overflow-hidden rounded-3xl focus:outline-none transition-all duration-500"
        aria-label="View appliance services"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full aspect-[91/20] bg-gray-100 rounded-3xl overflow-hidden">
            <Image
              src={BOTTOM_BANNER}
              alt="Professional home appliance services banner"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1820px"
              className={`object-cover transition-all duration-700 ${
                imageLoaded 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              } group-hover:scale-110`}
              priority
              quality={85}
              onLoad={handleImageLoad}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABQUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rw=="
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 -skew-x-12 translate-x-[-100%]  transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>
        </div>
      </button>
    </div>
  );
});
BottomBanner.displayName = 'BottomBanner';

const HeroSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const serviceOrder = useMemo(() => [
    "Appliances Care",
    "Home Care", 
    "Beauty Care",
    "Handyman",
  ], []);

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
    fetchMainServices();
  }, [fetchMainServices]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const preloadImages = () => {
      const imageUrls = [MAIN_BANNER, BOTTOM_BANNER, ...Object.values(SERVICE_IMAGES)];
      
      imageUrls.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadImages);
    } else {
      setTimeout(preloadImages, 0);
    }
  }, []);

  const scrollToSection = useCallback((serviceName) => {
    const sectionMap = {
      'Appliances Care': 'appliances-care',
      'Home Care': 'home-care', 
      'Beauty Care': 'beauty-care',
      'Handyman': 'handyman-services',
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
        onClick={handleServiceClick}
      />
    ));
  }, [loading, error, services, handleServiceClick]);

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

  const renderMobileServicesSlider = useCallback(() => (
    <div className="lg:hidden w-full px-2 py-3 bg-white relative">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 animate-fade-in">
        Our Services 👨‍🔧
      </h2>
      <Swiper
        slidesPerView={4}
        spaceBetween={8}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="services-swiper"
        lazy={{
          loadPrevNext: true,
          loadOnTransitionStart: true,
        }}
      >
        {services.map((service, index) => (
          <SwiperSlide key={service.id}>
            <div 
              className="animate-slide-up" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ServiceCard
                service={service}
                isMobile={true}
                onClick={handleServiceClick}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  ), [services, handleServiceClick]);

  return (
    <section className="relative">
      {renderMobileServicesSlider()}

      <div className="hidden lg:block w-full px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-0 relative">
        <div className="max-w-7xl mx-auto mt-8">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 xl:gap-16">
            
            <div className="w-full lg:flex-1 lg:max-w-2xl animate-fade-in">
              <header className="mb-8 md:mb-12">
                <h1 className="text-5xl md:text-6xl font-black leading-tight mb-4 animate-slide-up">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Home services
                  </span>
                  <br />
                  <span className="text-gray-800">at your doorstep</span>
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-slide-right"></div>
              </header>

              <section className="services-part mb-8 lg:mb-12 animate-fade-in-delayed">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
                  What are you looking for?
                </h2>
                
                <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                  <div className="min-h-[200px]">
                    <div className="grid grid-cols-4 gap-4 md:gap-6">
                      {renderServiceCards(false)}
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex gap-6 md:gap-8 mb-8 animate-slide-up-delayed">
                {loading ? (
                  <>
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                  </>
                ) : (
                  statsData.map((stat, index) => (
                    <div 
                      key={index}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <StatsCard {...stat} />
                    </div>
                  ))
                )}
              </div>
            </div>
           
            <div className="w-full lg:flex-1 lg:max-w-2xl animate-slide-right">
            
              {loading ? (
                <HeroImageSkeleton />
              ) : (

                 <Link href="/appliance-care" className="block">
                  <div className="relative w-full aspect-[4/5] max-h-[600px] bg-gray-100 rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-105 cursor-pointer">
                  <Image
                    src={MAIN_BANNER}
                    alt="Professional home services team working"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    quality={85}
                    className="object-cover transition-transform duration-700"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rw==" 
                  />
                </div> 
               </Link>
              )}
           
            </div>
           
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-full px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mt-8 relative animate-fade-in-delayed">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<ServiceBannerSkeleton />}>
            <ServiceBannerSlider />
          </Suspense>
        </div>
      </div>

      <div className="animate-slide-up-delayed">
        <BottomBanner />
      </div>
    </section>
  );
};

export default HeroSection;