"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CiStar } from "react-icons/ci";
import { PiUsersThree } from "react-icons/pi";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
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

const DEFAULT_SERVICE_IMAGE = "/HomeIcons/default-service.png";
const MAIN_BANNER = "/MainBanner/HomeBanner.webp";

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
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        section.classList.add('highlight-section');
        setTimeout(() => {
          section.classList.remove('highlight-section');
        }, 2000);

        section.setAttribute('tabindex', '-1');
        section.focus();
      }
    }
  };

  const handleServiceClick = (service, e) => {
    if (e) e.preventDefault();
    scrollToSection(service.name);
  };

  const displayServices = loading || error ? [] : services;

  return (
    <section className="relative mt-10 pt-10">
      {/* Mobile Only - Services Section */}
      <div className="lg:hidden w-full px-2 py-3 bg-white">
        <div className="flex items-center justify-between mb-2">
           <h2 className="block sm:hidden text-lg font-semibold mb-4 text-left flex justify-start gap-2 mt-5">
                    <span>Our Services</span>
                    <span>👨‍🔧</span>
                  </h2>
         
        </div>
        
        <div className="grid grid-cols-4 gap-1 border border-gray-200 rounded-lg  shadow-sm ">
          {displayServices.map((service) => (
            <button
              key={service.id}
             className="flex flex-col items-center p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer shadow-sm group hover:shadow-md"
              onClick={(e) => handleServiceClick(service, e)}
              aria-label={`Navigate to ${service.name} services`}
            >
            <div className="relative w-14 h-14 mb-2 transition-transform duration-200 group-hover:scale-105">
                <Image
                  src={service.imageUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-medium text-center">
                {service.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block hero-section w-full px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-0">
        <div className="hero-section-container max-w-7xl mx-auto mt-5">
          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 xl:gap-12">
            
            {/* Left Content */}
            <div className="w-full lg:flex-1 lg:max-w-2xl">
              <header className="flex items-center gap-3 mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gradient">
                  Home services at your doorstep
                </h1>
              </header>

              <section className="services-part mb-6 lg:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">
                  What are you looking for?
                </h2>

                <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm">
                  <div className="grid grid-cols-4 gap-4 md:gap-5">
                    {displayServices.map((service) => (
                      <button
                        key={service.id}
                        className="flex flex-col items-center p-3 md:p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all shadow-sm group hover:shadow-md"
                        onClick={(e) => handleServiceClick(service, e)}
                        aria-label={`Navigate to ${service.name} services`}
                      >
                        <div className="relative w-14 h-14 md:w-16 md:h-16 mb-3 transition-transform group-hover:scale-105">
                          <Image
                            src={service.imageUrl}
                            alt=""
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        </div>
                        <span className="text-sm font-medium text-center">
                          {service.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <div className="flex flex-row justify-start gap-6 md:gap-8 mb-6 mt-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm">
                  <CiStar className="text-yellow-500 text-2xl lg:text-3xl" />
                  <div>
                    <h3 className="text-base lg:text-lg font-bold">4.5</h3>
                    <p className="text-sm text-gray-600">Service Rating</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm">
                  <PiUsersThree className="text-blue-500 text-2xl lg:text-3xl" />
                  <div>
                    <h3 className="text-base lg:text-lg font-bold">30 Lacs+</h3>
                    <p className="text-sm text-gray-600">Customer Globally</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full lg:flex-1 lg:max-w-2xl">
              <div className="relative w-full h-[550px] border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Image
                  src={MAIN_BANNER}
                  alt="Professional home services team working"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center 30%" }}
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
      
      {/* Single Banner for all devices */}
      <div className="w-full px-2 lg:px-12 mt-3 lg:mt-10 mb-0">
        <div className="max-w-7xl mx-auto">
          <div className="shadow-lg rounded-lg overflow-hidden">
            <Image
              src="/HomeBanner/appliance.webp"
              alt="Professional home appliance services"
              width={1820}
              height={400}
              className="object-cover w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;