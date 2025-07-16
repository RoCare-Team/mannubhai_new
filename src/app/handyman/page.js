"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
import HandymanServics from "../_components/Home/HandymanServices";
import Head from "./head";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// Constants
const SERVICE_CONFIG = {
  images: {
    Carpenter: "/HandyMan/CARPENTER.png",
    Electrician: "/HandyMan/ELECTRICIAN.png",
    Painter: "/HandyMan/PAINTER.png",
    Plumber: "/HandyMan/PLUMBER.png",
    Masons: "/HandyMan/OTHER.jpeg",
    default: "/BeautyCare/default.png"
  },
  banners: {
    main: "/All Front Banners/HandymanService.webp",
    promo: "/HomeBanner/handyman.webp"
  },

sliderImages: [
    {
      src: "/All Handyman Service Slider Banner/painter.webp",
      link: "/painting-services",
      alt: "painting servicess",
      width: 800,
      height: 450
    },
    {
      src: "/All Handyman Service Slider Banner/plumber.webp",
      link: "/plumber",
      alt: "plumber",
      width: 800,
      height: 450
    },
    {
      src: "/All Handyman Service Slider Banner/carpenter.webp",
      link: "/carpenter",
      alt: "carpenter",
      width: 800,
      height: 450
    },
    {
      src: "/All Handyman Service Slider Banner/Electrician.webp",
      link: "/electrician",
      alt: "electrician",
       width: 800,
       height: 450
    },
      {
      src: "/All Handyman Service Slider Banner/Masons.webp",
      link: "/mason-service",
      alt: "mason service",
       width: 800,
       height: 450
    }
  ],
  serviceOrder: ["Painter", "Plumber", "Carpenter", "Electrician", "Masons"],
  serviceId: "4",
  loader: "/logo.png"
};





const CONTENT_SECTIONS = [
  {
    title: "Handyman Services",
    content: "The organization has emerged as the leading online platform for offering handyman services at the customer's doorstep in PAN India. This organization has the best and most reliable professionals for providing amazing and best handyman services.",
    features: []
  },
  {
    title: "Painter Service",
    content: "Painting is an art, and very few are the best in offering attractive and exciting services. Thus, you need a professional painter to provide your house with an amazing look. At Mannu Bhai, you will get a trusted and reliable painter for complete painting needs.",
    features: []
  },
  {
    title: "Plumber Service",
    content: "Whether your kitchen's tap is not working or you face issues with the bathroom tap, the plumber at Mannu Bhai offers you the complete solution. Here you can get a higher professional for your plumbing needs at an affordable price.",
    features: []
  },
  {
    title: "Carpenter Service",
    content: "Mannu Bhai promises you to deliver the best carpenter service at the comfort of your home. Here you can hire India's best carpenter to get satisfactory services at an affordable and reliable cost. Our carpenter uses the latest technology-based tool to provide satisfactory services to the customers.",
    features: []
  },
  {
    title: "Electrician Service",
    content: "Looking for an electrician at your doorstep? Great, here you can hire a top-class and reliable electrician for all your electric equipment repair and maintenance services. To hire a professional electrician, contact our service center now.",
    features: []
  },
  {
    title: "Masons Service",
    content: "Having your own house is the dream of everyone. So make your dream true with the finest Masons. At Mannu Bhai, we have the best professional Masons who are experts is building your dream houses with the latest design and technology. So get in touch with the expert professional and build your dream house.",
    features: []
  },
  {
    title: "Why Choose Mannu Bhai Handyman Services?",
    content: "",
    features: [
      "PAN India availability with local experts",
      "Verified and background-checked professionals",
      "Same-day service availability",
      "Affordable pricing with no hidden costs",
      "Latest tools and technology for all services",
    ]
  }
];

// Utility functions
const getSubServiceImage = (type) => SERVICE_CONFIG.images[type] || SERVICE_CONFIG.images.default;

// Custom hooks
const usePageLoading = (delay = 2000) => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return [pageLoading, setPageLoading];
};

// Components
const LoadingSpinner = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-700">
    <div className="flex flex-col items-center gap-4">
      <Image
        src={SERVICE_CONFIG.loader}
        alt="Mannubhai Logo"
        width={100}
        height={100}
        className="animate-bounce"
        priority
        unoptimized
      />
      <div className="text-gray-600 font-medium animate-pulse text-sm">
        Loading Mannubhai...
      </div>
    </div>
  </div>
);

const DataLoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="text-red-500 text-center max-w-md px-4">
      <h2 className="text-xl font-semibold mb-2">Error loading services</h2>
      <p className="mb-4">{error}</p>
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

const ServiceCard = ({ service, onClick }) => (
  <article
    className="flex flex-col items-center p-3 sm:p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer group"
    onClick={() => onClick(service)}
    aria-label={`Book ${service.ServiceName} service`}
  >
    <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110">
      <Image
        src={service.ServiceIcon}
        alt={`${service.ServiceName} service icon`}
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
);

const StatCard = ({ icon: Icon, value, label, iconColor }) => (
  <article className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-100">
    <Icon className={`${iconColor} text-2xl sm:text-3xl flex-shrink-0`} aria-hidden="true" />
    <div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-800">{value}</h3>
      <p className="text-xs sm:text-sm text-gray-600">{label}</p>
    </div>
  </article>
);

const ContentSection = ({ section }) => (
  <article className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
    <h3 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-3 sm:mb-4">
      {section.title}
    </h3>
    {section.content && (
      <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
        {section.content}
      </p>
    )}
    {section.features?.length > 0 && (
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
);

const ServiceSlider = () => (
  <section className="my-8 sm:my-12 w-full px-4 sm:px-6 lg:px-8" aria-labelledby="services-slider-heading">
    <div className="max-w-7xl mx-auto">
      <h2 id="services-slider-heading" className="text-xl sm:text-2xl font-semibold text-center mb-6 text-gray-800">
        Popular Handyman Services
      </h2>
      <div className="w-full">
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
          {SERVICE_CONFIG.sliderImages.map((item, idx) => {
            const imageData = typeof item === 'string' 
              ? { 
                  src: item, 
                  width: 800, 
                  height: 450,
                  alt: `Handyman service ${idx + 1}`
                }
              : {
                  ...item,
                  width: item.width || 800,
                  height: item.height || 450
                };
              
            const link = typeof item === 'object' ? item.link : [
              "/electrician-services",
              "/appliance-repair",
              "/water-purifier-services"
            ][idx];

            return (
              <SwiperSlide key={idx}>
                <Link href={link} className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <div className="relative aspect-video w-full h-auto">
                    <Image
                      src={imageData.src}
                      alt={imageData.alt}
                      width={imageData.width}
                      height={imageData.height}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                      priority={idx === 0}
                      quality={80}
                    />
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
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
          src={SERVICE_CONFIG.banners.promo}
          alt="Handyman services promotional offer"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px"
  fetchPriority="high"  // Explicit fetch priority
  loading="eager"      // Force immediate loading
  quality={80}         // Optimized quality for mobile
     // Full viewport width on all devices
  unoptimized={false}
        />
      </div>
    </div>
  </section>
);

const HeroSection = ({ subServices, onServiceClick }) => (
  <section className="hero-section w-full px-4 sm:px-6 lg:px-8 pb-8 mt-8">
    <div className="max-w-7xl mx-auto">
      <div className="hero-section-container flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div className="hero-section-service flex-1 w-full order-2 lg:order-1">
          <header className="text-center lg:text-left mb-6 lg:mb-8">
            <h1 className="font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-600 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              Handyman Services at Your Doorstep
            </h1>
            <p className="text-gray-600 mt-3 text-sm sm:text-base lg:text-lg">
              Book professional handyman services for your home at affordable rates
            </p>
          </header>

          <section aria-labelledby="sub-services-heading" className="services-part mb-6 lg:mb-8">
            <h2 id="sub-services-heading" className="text-lg sm:text-xl font-semibold mb-4 text-center lg:text-left text-gray-800">
              What are you looking for?
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 border border-gray-200 rounded-xl p-3 sm:p-4 bg-white shadow-sm">
              {subServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onClick={onServiceClick}
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-0">
            <StatCard
              icon={CiStar}
              value="4.5"
              label="Service Rating"
              iconColor="text-yellow-500"
            />
            <StatCard
              icon={PiUsersThree}
              value="30 Lacs+"
              label="Customers Globally"
              iconColor="text-blue-500"
            />
          </section>
        </div>

        <div className="hero-section-main-img flex-1 w-full order-1 lg:order-2 relative">
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[800px] border border-gray-200 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={SERVICE_CONFIG.banners.main}
              alt="Professional handyman services"
              fill
              className="object-cover h-full w-full hover:scale-105 transition-transform duration-500"
           fetchPriority="high"  // Explicit fetch priority
  loading="eager"      // Force immediate loading
  quality={80}         // Optimized quality for mobile
     // Full viewport width on all devices
  unoptimized={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Main Component
const Handyman = () => {
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageLoading, setPageLoading] = usePageLoading();
  const router = useRouter();
  const swiperRef = useRef(null);

  const sortedSubServices = useMemo(() => {
    return [...subServices].sort((a, b) => {
      const indexA = SERVICE_CONFIG.serviceOrder.indexOf(a.type);
      const indexB = SERVICE_CONFIG.serviceOrder.indexOf(b.type);
      
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      
      return indexA - indexB;
    });
  }, [subServices]);

  const fetchSubServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const q = query(
        collection(db, "lead_type"),
        where("mannubhai_cat_id", "==", SERVICE_CONFIG.serviceId)
      );
      const snapshot = await getDocs(q);

      const subServicesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        ServiceName: doc.data().type,
        ServiceIcon: getSubServiceImage(doc.data().type),
      }));

      setSubServices(subServicesData);
    } catch (err) {
      console.error("Error fetching sub-services:", err);
      setError(err.message);
      setSubServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategoryUrlByLeadTypeId = useCallback(async (lead_type_id) => {
    try {
      const q = query(
        collection(db, "category_manage"),
        where("lead_type_id", "==", lead_type_id)
      );
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : snapshot.docs[0].data().category_url;
    } catch (err) {
      console.error("Error fetching category URL:", err);
      return null;
    }
  }, []);

  const handleSubServiceClick = useCallback(async (service) => {
    try {
      setPageLoading(true);
      const category_url = await getCategoryUrlByLeadTypeId(service.id);
      
      if (category_url) {
        router.push(`/${category_url}`);
      } else {
        alert("Service category not found");
      }
    } catch (err) {
      console.error("Error handling service click:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setPageLoading(false);
    }
  }, [getCategoryUrlByLeadTypeId, router, setPageLoading]);

  useEffect(() => {
    fetchSubServices();
  }, [fetchSubServices]);

  if (pageLoading) return <LoadingSpinner />;
  if (loading) return <DataLoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={fetchSubServices} />;

  return (
    <>
     <Header />
      <Head />
      <main className="relative min-h-screen bg-gray-50" role="main">
        <HeroSection 
          subServices={sortedSubServices} 
          onServiceClick={handleSubServiceClick} 
        />
        
        <ServiceSlider />
        
        <PromotionalBanner />
        
        <section className="mt-8 sm:mt-12 lg:mt-16 w-full" aria-labelledby="handyman-services-heading">
          <h2 id="handyman-services-heading" className="text-xl sm:text-2xl font-semibold mb-6 text-center text-gray-800">
            Explore More Handyman Services
          </h2>
          <HandymanServics />
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            {CONTENT_SECTIONS.map((section, index) => (
              <ContentSection key={index} section={section} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Handyman;