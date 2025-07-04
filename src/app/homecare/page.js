"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Image from "next/image";
import { CiStar } from "react-icons/ci";
import { PiUsersThree } from "react-icons/pi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../_components/Home/swiper-custom.css";
import HomecareServcies from "../_components/Home/HomecareServcies";
import Head from "./head";
import Link from "next/link";
// Constants moved outside component
const SUBSERVICE_IMAGES = {
  "Home Deep Cleaning": "/HomeCare/HOMEDEEPCLEANING.png",
  "Sofa Cleaning": "/HomeCare/SOFA-CLEANING.png",
  "Bathroom Cleaning": "/HomeCare/BATHROOM-CLEANING.png",
  "Kitchen Cleaning": "/HomeCare/KITCHEN-CLEANING.png",
  "Pest Control": "/HomeCare/PEST-CONTROL.png",
  "Tank Cleaning": "/HomeCare/TANK-CLEANING.png",
};

const DEFAULT_SERVICE_IMAGE = "/BeautyCare/default.png";
const LOADER_LOGO = "/logo.png";
const MAIN_BANNER = "/All Front Banners/HomeCareServices.webp";
const PROMO_BANNER = "/HomeBanner/homecare.webp";

const DESIRED_ORDER = [
  "Sofa Cleaning",
  "Bathroom Cleaning",
  "Home Deep Cleaning",
  "Kitchen Cleaning",
  "Pest Control",
  "Water Tank Cleaning",
];

const FEATURED_SERVICES = [
  {
    src: "/HomeCare/deepcleaning-services-banner.png",
    alt: "Deep cleaning services",
    href: "/home-deep-cleaning",
  },
  {
    src: "/HomeCare/kitchen-cleaning-service-banner.png",
    alt: "Kitchen cleaning service",
    href: "/kitchen-cleaning",
  },
  {
    src: "/HomeCare/pest-control-service-banner.png",
    alt: "Pest control service",
    href: "/pest-control-service",
  },
  {
    src: "/HomeCare/sofa-cleaning-service-banner.png",
    alt: "Sofa cleaning service",
    href: "/sofa-cleaning",
  },
  {
    src: "/HomeCare/Bathroom-service-banner.png",
    alt: "Bathroom cleaning service",
    href: "/bathroom-cleaning",
  },
];
const CONTENT_SECTIONS = [
  {
    title: "Home Care Services",
    content: [
      "The organization has established itself as the leading home care service provider in PAN India. Mannu Bhai started its journey in 2018, and in its short period, this organization has achieved a great position among Home Care service providers.",
      "In recent years, Mannu Bhai has expanded its service, and now its home care services are available in the entire country. Thus people can book Mannu Bhai home care services irrespective of the city in which they live. Here we cover a large number of services, therefore hiring Mannu Bhai can be the best option. At Mannu Bhai, all the service providers are experts and experienced in what they do."
    ],
    gradient: true
  },
  {
    title: "#1. Sofa Cleaning",
    content: "Mannu Bhai offers top-rated reliable Sofa cleaning services at your convenience at your doorstep at a reasonable price. In addition, the organization offers Sofa cleaning services across PAN India. So contact Mannu Bhai and avail of the sofa cleaning service."
  },
  {
    title: "#2. Bathroom Cleaning",
    content: "The company offers deep bathroom cleaning services in PAN India. Our well-trained staff uses 5-star cleaning equipment to clean your bathroom diligently. So book your bathroom cleaning services at Mannu Bhai and get satisfactory services at your doorstep."
  },
  {
    title: "#3. Home Deep Cleaning",
    content: "Mannu Bhai promises you to home deep cleaning services at an affordable cost. The organization has trained professionals who satisfactorily and effectively complete the home cleaning process across PAN India."
  },
  {
    title: "#4. Kitchen Cleaning",
    content: "From stove cleaning to floor and kitchen tiles cleaning, Mannu Bhai offers complete services at an affordable price in PAN India. So if you are looking for an affordable and professional kitchen cleaning service, contact Mannu Bhai service centre."
  },
  {
    title: "#5. Pest Control",
    content: "We are the leading Pest Control service provider in India. Here we offer cheap and best Pest Control services at the customer doorstep in PAN India. Our expert uses a high-quality sprayer that produces very small droplets that ensures better covering at even low quantities."
  },
  {
    title: "#6. Tank Cleaning",
    content: "This organization offer 100% satisfactory and customer friendly water tank cleaning services. These company services are available across the nation at an economical and affordable price. Contact Mannu Bhai and avail of top-rated tank cleaning services."
  },
  {
    title: "Why Choose Mannu Bhai Home Care?",
    content: "With years of experience and a commitment to excellence, Mannu Bhai has become the trusted choice for home care services across India.",
    features: [
      "PAN India service coverage since 2018",
      "Expert and experienced service providers",
      "5-star cleaning equipment and techniques",
      "Affordable and reasonable pricing",
      "Doorstep service convenience",
      "100% customer satisfaction guarantee",
      "Professional and reliable service"
    ]
  },
  {
    title: "Book Your Service Today",
    content: "Experience the convenience and quality of Mannu Bhai's professional home care services. Contact us today to book your preferred service and enjoy hassle-free cleaning solutions at your doorstep."
  }
];

const getSubServiceImage = (type) => SUBSERVICE_IMAGES[type] || DEFAULT_SERVICE_IMAGE;

const Homecare = () => {
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();
  const swiperRef = useRef(null);

  // Memoized sorted subservices
  const sortedSubServices = useMemo(() => {
    return [...subServices].sort((a, b) => {
      const indexA = DESIRED_ORDER.indexOf(a.type);
      const indexB = DESIRED_ORDER.indexOf(b.type);
      
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      
      return indexA - indexB;
    });
  }, [subServices]);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const fetchSubServices = useCallback(async () => {
    try {
      setLoading(true);
      const mainServiceId = "2";
      const leadTypeCollection = collection(db, "lead_type");
      const q = query(
        leadTypeCollection,
        where("mannubhai_cat_id", "==", mainServiceId)
      );
      const snapshot = await getDocs(q);

      const subServicesData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          ServiceName: data.type,
          ServiceIcon: getSubServiceImage(data.type),
        };
      });

      setSubServices(subServicesData);
    } catch (err) {
      console.error("Error fetching sub-services:", err);
      setError(err.message);
      setSubServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubServices();
  }, [fetchSubServices]);

  const getCategoryUrlByLeadTypeId = useCallback(async (lead_type_id) => {
    const q = query(
      collection(db, "category_manage"),
      where("lead_type_id", "==", lead_type_id)
    );
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
        alert("Category URL not found!");
      }
    } catch (err) {
      console.error("Navigation error:", err);
      alert("An error occurred during navigation");
    } finally {
      setPageLoading(false);
    }
  }, [getCategoryUrlByLeadTypeId, router]);

  if (pageLoading) {
    return <LoadingScreen />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorScreen error={error} onRetry={fetchSubServices} />;
  }

  return (
    <>
      <Head />
      <main className="relative min-h-screen bg-gray-50" role="main">
        {/* Hero Section */}
        <HeroSection 
          subServices={sortedSubServices} 
          handleSubServiceClick={handleSubServiceClick} 
        />
        
        {/* Services Swiper Slider */}
        <ServicesSlider />
        
        {/* Promotional Banner */}
        <PromotionalBanner />
        
        {/* HomecareServices Component */}
        <section className="mt-8 sm:mt-12 lg:mt-16 w-full" aria-labelledby="homecare-services-heading">
          <h2 id="homecare-services-heading" className="sr-only">
            Home Care Services
          </h2>
          <HomecareServcies brightbanner={true} />
        </section>
        
        {/* Content Sections */}
        <ContentSections />
      </main>
    </>
  );
};

// Extracted components for better organization
const LoadingScreen = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-700">
    <div className="flex flex-col items-center gap-4">
      <Image
        src={LOADER_LOGO}
        alt="Mannubhai Logo"
        width={100}
        height={100}
        className="animate-bounce"
        priority
        unoptimized
      />
      <div className="text-gray-600 font-medium animate-pulse text-sm">Loading Mannubhai...</div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorScreen = ({ error, onRetry }) => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="text-red-500 text-center">
      <h2 className="text-xl font-semibold mb-2">Error loading services</h2>
      <p>{error}</p>
      <button 
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

const HeroSection = ({ subServices, handleSubServiceClick }) => (
  <section className="hero-section w-full px-4 sm:px-6 lg:px-8 pb-8 mt-8">
    <div className="max-w-7xl mx-auto">
      <div className="hero-section-container flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left Content */}
        <div className="hero-section-service flex-1 w-full order-2 lg:order-1">
          <header className="text-center lg:text-left mb-6 lg:mb-8">
            <h1 className="font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-600 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              Home Care services at your doorstep
            </h1>
            <p className="text-gray-600 mt-3 text-sm sm:text-base lg:text-lg">
              Professional home care services in the comfort of your home
            </p>
          </header>

          <section aria-labelledby="sub-services-heading" className="services-part mb-6 lg:mb-8">
            <h2 id="sub-services-heading" className="text-lg sm:text-xl font-semibold mb-4 text-center lg:text-left text-gray-800">
              What are you looking for?
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 border border-gray-200 rounded-xl p-3 sm:p-4 bg-white shadow-sm">
              {subServices.map((service) => (
                <article
                  key={service.id}
                  className="flex flex-col items-center p-3 sm:p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleSubServiceClick(service)}
                  aria-label={`Book ${service.ServiceName} service`}
                >
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={service.ServiceIcon}
                      alt={`${service.ServiceName} icon`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 80px"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xs sm:text-sm font-medium text-center text-gray-700 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                    {service.ServiceName}
                  </h3>
                </article>
              ))}
            </div>
          </section>

          <section className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-0">
            <RatingCard 
              icon={<CiStar className="text-yellow-500 text-2xl sm:text-3xl flex-shrink-0" aria-hidden="true" />}
              value="4.5"
              label="Service Rating"
            />
            <RatingCard 
              icon={<PiUsersThree className="text-blue-500 text-2xl sm:text-3xl flex-shrink-0" aria-hidden="true" />}
              value="30 Lacs+"
              label="Customers Globally"
            />
          </section>
        </div>

        {/* Main Banner */}
        <div className="hero-section-main-img flex-1 w-full order-1 lg:order-2 relative">
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[800px] border border-gray-200 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={MAIN_BANNER}
              alt="Professional home care services"
              fill
              className="object-cover h-full w-full hover:scale-105 transition-transform duration-500"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const RatingCard = ({ icon, value, label }) => (
  <article className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-100">
    {icon}
    <div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-800">{value}</h3>
      <p className="text-xs sm:text-sm text-gray-600">{label}</p>
    </div>
  </article>
);

const ServicesSlider = () => (
  <section className="my-8 sm:my-12 w-full px-4 sm:px-6 lg:px-8" aria-labelledby="services-slider-heading">
    <div className="max-w-7xl mx-auto">
      <h2 id="services-slider-heading" className="text-xl sm:text-2xl font-semibold text-center mb-6 text-gray-800">
        Featured Services
      </h2>
      <div className="w-full relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          navigation
          loop={true}
          className="rounded-xl shadow-lg"
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 3, spaceBetween: 32 },
          }}
        >
          {FEATURED_SERVICES.map((banner, idx) => (
            <SwiperSlide key={idx}>
              <Link href={banner.href} className="block group">
                <div className="rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <Image
                    src={banner.src}
                    alt={banner.alt}
                    width={300}
                    height={200}
                    className="object-cover w-full h-auto group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  </section>
);


const PromotionalBanner = () => (
  <section className="w-full px-4 sm:px-6 lg:px-8 my-8 sm:my-12" aria-label="Promotional offer">
    <div className="max-w-7xl mx-auto">
      <div className="relative w-full h-32 sm:h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden shadow-lg">
        <Image
          src={PROMO_BANNER}
          alt="Homecare services promotional offer"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px"
          priority
        />
      </div>
    </div>
  </section>
);

const ContentSections = () => (
  <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 bg-white">
    <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
      {CONTENT_SECTIONS.map((section, index) => (
        <article 
          key={index}
          className={`rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 ${
            section.gradient 
              ? "bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100" 
              : "bg-gray-50"
          }`}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-3 sm:mb-4">
            {section.title}
          </h3>
          
          {Array.isArray(section.content) ? (
            section.content.map((paragraph, pIndex) => (
              <p key={pIndex} className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              {section.content}
            </p>
          )}
          
          {section.features && (
            <ul className="space-y-2">
              {section.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-blue-500 font-bold mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  </section>
);

export default Homecare;