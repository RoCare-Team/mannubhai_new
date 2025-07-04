"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Image from "next/image";
import { CiStar } from "react-icons/ci";
import { PiUsersThree } from "react-icons/pi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../_components/Home/swiper-custom.css";
import Appliances from "../_components/Home/Appliances";
import Head from "./head";

// Constants
const SUBSERVICE_IMAGES = {
  "Water Purifier": "/HomeIcons/water-purifier.png",
  "Air Conditioner": "/HomeIcons/AIR-CONDITIONAR.png",
  "Fridge": "/HomeIcons/REFRIGERATOR.png",
  "Washing Machine": "/HomeIcons/WASHINGMACHINE.png",
  "Microwave": "/HomeIcons/MICROWAVE.png",
  "Kitchen Chimney": "/HomeIcons/KitchenChimney.png",
  "LED TV": "/HomeIcons/LED-TV.png",
  "Vacuum Cleaner": "/HomeIcons/vacuum-cleaner.png",
  "Air Purifier": "/HomeIcons/air-purifier.png",
  "Air Cooler": "/HomeIcons/air-cooler.png",
  "Kitchen Appliance": "/HomeIcons/Kitchen-Appliance.png",
  "Geyser": "/HomeIcons/geyser.png",
};

const DEFAULT_SERVICE_IMAGE = "/HomeIcons/default-service.png";
const LOADER_LOGO = "/logo.png";
const MAIN_BANNER = "/All Front Banners/HomeAppliancesService.webp";
const PROMO_BANNER = "/HomeBanner/appliance.webp";

const SLIDER_BANNERS = [
  { 
    src: "/ServiceSlider/Electrician_banner.webp", 
    fallback: DEFAULT_SERVICE_IMAGE, 
    alt: "Electrician service", 
    title: "Electrician Service",
    link: "/electrician",
    description: "24/7 emergency electrical services"
  },
  { 
    src: "/ServiceSlider/refridgerator-service-banner.png", 
    fallback: DEFAULT_SERVICE_IMAGE, 
    alt: "Refrigerator service", 
    title: "Refrigerator Service",
    link: "/refrigerator-repair-service",
    description: "Expert repair for all fridge brands"
  },
  { 
    src: "/ServiceSlider/ro-service-banner.png", 
    fallback: DEFAULT_SERVICE_IMAGE, 
    alt: "RO service", 
    title: "RO Service",
    link: "/water-purifier-service",
    description: "Water purifier installation & maintenance"
  },
  { 
    src: "/ServiceSlider/washingBanner.webp", 
    fallback: DEFAULT_SERVICE_IMAGE, 
    alt: "Washing machine service", 
    title: "Washing Machine Service",
    link: "washing-machine-repair",
    description: "Complete washing machine solutions"
  },
];

const SERVICE_ORDER = [
  "Water Purifier",
  "Air Conditioner",
  "Fridge",
  "Washing Machine",
  "Microwave",
  "Kitchen Chimney",
  "LED TV",
  "Vacuum Cleaner",
  "Air Purifier",
  "Air Cooler",
  "Small Appliances",
  "Geyser",
];

const CONTENT_SECTIONS = [
  {
    title: "Home Appliances Care",
    content: "Home appliances have gone from luxuries to become the necessities of every house. These appliances have made human life hassle-free and easy. But with the busy lifestyle and heavy traffic outside, getting your home appliance care is challenging. To make people's life easy, Mannu Bhai brings home appliance care at the convenience of your home in PAN India."
  },
  {
    title: "Water Purifier",
    content: "With trained and skilful service engineers, the organization offers highly rated water purifier services. Here you can avail all brands and water purifier services at your house at an affordable price. Furthermore, at Mannu Bhai, you can hire a technician for installation, repair, and routine services."
  },
  {
    title: "Air Conditioner",
    content: "Get top class and reliable AC services at your doorstep across PAN India. The organization has highly trained professionals for all brand's air conditioner services. Here you can hire a professional for the window to split air conditioner service."
  },
  {
    title: "Washing Machine",
    content: "Mannu Bhai is a trusted name in offering washing machine service across PAN India. Here the technician is an expert and can fix the washing machine issues of all brands and models. Moreover, our expert will test the appliance after services and only when you are satisfied completely."
  },
  {
    title: "Refrigerator",
    content: "From gas filling services to regular maintenance and routine service, Mannu Bhai is offering all refrigerator services at your doorstep in PAN India. So to avail mind-blowing and satisfactory at your doorstep in PAN India, contact Mannu Bhai."
  }
];

const Appliance = () => {
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();
  const swiperRef = useRef(null);

  // Fetch data on mount
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1500);
    
    const fetchSubServices = async () => {
      try {
        const q = query(collection(db, "lead_type"), where("mannubhai_cat_id", "==", "1"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          ServiceName: doc.data().type,
          ServiceIcon: SUBSERVICE_IMAGES[doc.data().type] || DEFAULT_SERVICE_IMAGE,
        }));

        const sortedData = data.sort((a, b) => 
          SERVICE_ORDER.indexOf(a.ServiceName) - SERVICE_ORDER.indexOf(b.ServiceName)
        );

        setSubServices(sortedData);
      } catch (err) {
        console.error("Error fetching sub-services:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubServices();
    return () => clearTimeout(timer);
  }, []);

  const getCategoryUrlByLeadTypeId = useCallback(async (lead_type_id) => {
    const q = query(collection(db, "category_manage"), where("lead_type_id", "==", lead_type_id));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].data().category_url;
  }, []);

  const handleSubServiceClick = useCallback(async (service) => {
    setPageLoading(true);
    try {
      const category_url = await getCategoryUrlByLeadTypeId(service.id);
      if (category_url) {
        router.push(`/${category_url}`);
      } else {
        alert("Service not available at the moment!");
      }
    } catch (err) {
      console.error("Navigation error:", err);
      alert("Failed to navigate. Please try again.");
    } finally {
      setPageLoading(false);
    }
  }, [getCategoryUrlByLeadTypeId, router]);

  const handleBannerClick = useCallback((link) => {
    router.push(link);
  }, [router]);

  if (pageLoading) return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Image
          src={LOADER_LOGO}
          alt="Loading"
          width={100}
          height={100}
          className="animate-bounce"
          priority
        />
        <div className="text-gray-600 font-medium animate-pulse text-sm">Loading...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Service Unavailable</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <>
      <Head />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 pb-8 mt-8">
          <div className="max-w-7xl mx-auto">
            <div className="HeroSection flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Left Content */}
              <div className="flex-1 w-full order-2 lg:order-1">
                <header className="text-center lg:text-left mb-6 lg:mb-8 hidden md:block">
                  <h1 className="font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                    Home Appliance Services at Your Doorstep
                  </h1>
                  <p className="text-gray-600 mt-3 text-sm sm:text-base lg:text-lg max-w-2xl">
                    Professional appliance repair and maintenance services
                  </p>
                </header>

                <section aria-labelledby="sub-services-heading" className="mb-6 lg:mb-8">
                  <h2 id="sub-services-heading" className="text-lg sm:text-xl font-semibold mb-4 text-center lg:text-left text-gray-800 hidden md:block">
                    What are you looking for?
                  </h2>
                  <div className="grid grid-cols-4 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 border border-gray-200 rounded-xl p-2 sm:p-4 bg-white shadow-sm">
                    {subServices.map(service => (
                      <article
                        key={service.id}
                        className="flex flex-col items-center p-2 sm:p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                        onClick={() => handleSubServiceClick(service)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubServiceClick(service)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Select ${service.ServiceName} service`}
                      >
                        <div className="relative w-8 h-8 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mb-1 sm:mb-3 transition-transform group-hover:scale-110">
                          <Image
                            src={service.ServiceIcon}
                            alt=""
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 32px, (max-width: 1024px) 64px, 80px"
                            onError={(e) => e.target.src = DEFAULT_SERVICE_IMAGE}
                          />
                        </div>
                        <h3 className="text-[10px] sm:text-sm font-medium text-center text-gray-700 group-hover:text-blue-600 transition-colors leading-tight">
                          {service.ServiceName}
                        </h3>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-0 hidden md:flex">
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm border border-gray-100">
                    <CiStar className="text-yellow-500 text-2xl sm:text-3xl flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">4.5</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Service Rating</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm border border-gray-100">
                    <PiUsersThree className="text-blue-500 text-2xl sm:text-3xl flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">30 Lacs+</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Customers Globally</p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Main Banner */}
              <div className="HeroBanner flex-1 w-full order-1 lg:order-2 relative hidden md:block">
                <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[800px] border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-gray-100">
                  <Image
                    src={MAIN_BANNER} 
                    alt="Professional home appliance services" 
                    height={100}
                    width={100}
                    className="object-cover h-full w-full hover:scale-105 transition-transform duration-500"
                    priority
                    onError={(e) => e.target.src = DEFAULT_SERVICE_IMAGE}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Slider */}
        <section className="my-8 sm:my-12 w-full px-4 sm:px-6 lg:px-8" aria-labelledby="services-slider-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="services-slider-heading" className="text-xl sm:text-2xl font-semibold text-center mb-6 text-gray-800">
              Featured Services
            </h2>
            <div className="relative">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={8}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                loop={SLIDER_BANNERS.length > 1}
                className="services-swiper rounded-xl shadow-lg pb-12"
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 16 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                  1280: { slidesPerView: 4, spaceBetween: 32 }
                }}
              >
                {SLIDER_BANNERS.map((banner, idx) => (
                  <SwiperSlide key={`banner-${idx}`}>
                    <div 
                      className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group cursor-pointer bg-gray-100 relative aspect-video"
                      onClick={() => handleBannerClick(banner.link)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleBannerClick(banner.link)}
                      aria-label={`View ${banner.title} service`}
                    >
                      <Image
                        src={banner.src}
                        alt={banner.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => e.target.src = banner.fallback}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                        <div className="w-full p-4 text-white">
                          <h3 className="text-lg font-semibold">{banner.title}</h3>
                          <p className="text-sm opacity-90">{banner.description}</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="w-full px-4 sm:px-6 lg:px-8 my-8 sm:my-12">
          <div className="max-w-7xl mx-auto">
            <div className="relative w-full h-32 sm:h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden shadow-lg bg-gray-100">
              <Image 
                src={PROMO_BANNER} 
                alt="Special offers on appliance services" 
                fill
                className="object-cover"
                onError={(e) => e.target.src = DEFAULT_SERVICE_IMAGE}
              />
            </div>
          </div>
        </section>

        {/* Appliances Component */}
        <section className="mt-8 sm:mt-12 lg:mt-16 w-full">
          <Appliances hideBeautyBanner />
        </section>

        {/* Content Sections */}
        <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            {CONTENT_SECTIONS.map((section, index) => (
              <article key={index} className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-3 sm:mb-4">
                  {section.title}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {section.content}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Appliance;