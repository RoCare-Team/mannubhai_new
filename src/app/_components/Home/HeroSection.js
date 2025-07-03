"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CiStar } from "react-icons/ci";
import { PiUsersThree } from "react-icons/pi";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./swiper-custom.css";
import ServiceBannerSlider from "./ServiceBannerSlider";

const SERVICE_IMAGES = {
  "Appliances Care": "/HomeIcons/home appliances.png",
  "Home Care": "/HomeIcons/sofa-bathroom-and-kitchen-cleaning.png",
  "Beauty Care": "/HomeIcons/BEAUTY CARE.png",
  "Handyman": "/HomeIcons/Electrician.png",
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
        // First scroll to the section
        section.scrollIntoView({ behavior: 'smooth' });
        
        // Add highlight class
        section.classList.add('highlight-section');
        
        // Remove highlight after animation
        setTimeout(() => {
          section.classList.remove('highlight-section');
        }, 2000);
        
        // Focus for accessibility
     
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
    <section className="relative mt-0 pt-0">
      {/* Hero Section */}
      <div className="hero-section w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-0">
        <div className="hero-section-container max-w-7xl mx-auto mt-5">
          {/* Mobile Header - Hidden on mobile */}
          <header className="hidden">
            <h1 className="text-base sm:text-lg  text[20px]font-bold leading-tight text-center text-gradient">
              Home services at your doorstep
            </h1>
          </header>

          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 xl:gap-12">
            {/* Left Content */}
            <div className="w-full lg:flex-1 lg:max-w-2xl">
              {/* Desktop Header - Hidden on mobile */}
              <header className="hidden md:flex items-center gap-3 mb-6 lg:mb-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-gradient">
                  Home services at your doorstep
                </h2>
              </header>

              {/* Services Section */}
              <section className="services-part mb-6 lg:mb-8 mt-4 sm:mt-6 md:mt-0">
                {/* Mobile Only Heading */}
                <div className="sm:hidden text-center mb-4">
                 <h2 className="block sm:hidden text-lg font-semibold mb-4 text-left flex justify-start gap-2 mt-5">
                  <span>Our Services</span>
                  <span>👨‍🔧</span>
                </h2>
                </div>

                {/* Desktop Heading */}
                <h2 className="hidden md:block text-lg md:text-xl lg:text-2xl font-semibold mb-4">
                  What are you looking for?
                </h2>

                {/* Services Grid - Single Row Layout */}
                <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 lg:p-5 shadow-sm mt-6 sm:mt-8 md:mt-0">
                  {/* Mobile: Single Row with 4 columns - INCREASED IMAGE SIZE */}
                  <div className="grid grid-cols-4 gap-2 sm:hidden">
                    {displayServices
                      .sort((a, b) => {
                        const order = [
                          "Appliances Care",
                          "Home Care",
                          "Beauty Care",
                          "Handyman",
                        ];
                        return order.indexOf(a.name) - order.indexOf(b.name);
                      })
                      .map((service) => (
                        <article
                          key={service.id}
                          className="flex flex-col items-center p-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer shadow-sm group hover:shadow-md"
                          onClick={(e) => handleServiceClick(service, e)}
                        >
                          <div className="relative w-14 h-14 mb-2 transition-transform duration-200 group-hover:scale-105">
                            <Image
                              src={service.imageUrl}
                              alt={`${service.name} service`}
                              width={56}
                              height={56}
                              className="object-contain"
                              priority
                            />
                          </div>
                          <h3 className="text-xs font-medium text-center leading-tight">
                            {service.name}
                          </h3>
                        </article>
                      ))}
                  </div>

                  {/* Tablet & Desktop: Single Row */}
                  <div className="hidden sm:grid sm:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
                    {displayServices
                      .sort((a, b) => {
                        const order = [
                          "Appliances Care",
                          "Home Care",
                          "Beauty Care",
                          "Handyman",
                        ];
                        return order.indexOf(a.name) - order.indexOf(b.name);
                      })
                      .map((service) => (
                        <article
                          key={service.id}
                          className="flex flex-col items-center p-3 md:p-3 lg:p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer shadow-sm group hover:shadow-md"
                          onClick={(e) => handleServiceClick(service, e)}
                        >
                          <div className="relative w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-2 md:mb-3 transition-transform duration-200 group-hover:scale-105">
                            <Image
                              src={service.imageUrl}
                              alt={`${service.name} service`}
                              width={64}
                              height={64}
                              className="object-contain"
                              priority
                            />
                          </div>
                          <h3 className="text-xs md:text-sm font-medium text-center leading-tight relative after:content-[''] after:block after:h-[1px] after:bg-blue-500 after:scale-x-0 after:transition-transform after:duration-200 group-hover:after:scale-x-100 after:origin-left">
                            {service.name}
                          </h3>
                        </article>
                      ))}
                  </div>
                </div>
              </section>

              {/* Stats Section - Hidden on mobile */}
              <div className="hidden sm:flex flex-row justify-center lg:justify-start gap-4 md:gap-6 lg:gap-8 mb-6 mt-6 lg:mt-0">
                <article className="flex items-center gap-3 md:gap-4 p-3 md:p-3 lg:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 shadow-sm">
                  <CiStar className="text-yellow-500 text-xl md:text-2xl lg:text-3xl" />
                  <div>
                    <h3 className="text-sm md:text-base lg:text-lg font-bold">
                      4.5
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600">
                      Service Rating
                    </p>
                  </div>
                </article>
                <article className="flex items-center gap-3 md:gap-4 p-3 md:p-3 lg:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 shadow-sm">
                  <PiUsersThree className="text-blue-500 text-xl md:text-2xl lg:text-3xl" />
                  <div>
                    <h3 className="text-sm md:text-base lg:text-lg font-bold">
                      30 Lacs+
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600">
                      Customer Globally
                    </p>
                  </div>
                </article>
              </div>
            </div>

            {/* Right Image - Hidden on mobile */}
            <div className="hidden lg:block w-full lg:flex-1 lg:max-w-2xl">
              <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-[340px] xl:h-[380px] 2xl:h-[420px] border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200" style={{ height: '550px' }}>
                <Image
                  src={MAIN_BANNER}
                  alt="Professional home services"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  style={{
                    objectPosition: "center 30%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Swiper Section - Hidden on Mobile */}
      <div className="hidden sm:block w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mt-5">
        <div className="max-w-7xl mx-auto">
          <ServiceBannerSlider />
        </div>
      </div>
      
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 2xl:px-20 mt-0 sm:mt-0">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="w-full rounded-lg overflow-hidden">
            <div className="mx-2 sm:mx-4 md:mx-6 lg:mx-8 mt-0 sm:mt-0">
              {/* Mobile Banner */}
              <div className="block sm:hidden relative w-full rounded-lg overflow-hidden mt-0">
                <Image
                  src="/HomeBanner/app_mob.webp"
                  alt="Mobile promotional banner"
                  width={768}
                  height={300}
                  className="object-contain w-full h-auto rounded-lg"
                  priority
                />
              </div>

              {/* Desktop Banner */}
              <div className="hidden sm:block">
                <Image
                  src="/HomeBanner/appliance.webp"
                  alt="Desktop promotional banner"
                  width={1920}
                  height={300}
                  className="object-cover w-full h-auto rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;