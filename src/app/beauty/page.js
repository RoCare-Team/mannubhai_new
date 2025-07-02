"use client";
import { useState, useEffect, useRef } from "react";
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
import BeautyCare from "../_components/Home/BeautyCare";
import Head from "./head";

const SUBSERVICE_IMAGES = {
  "Women Salon At Home": "/BeautyCare/women salon at home.png",
  "Makeup": "/BeautyCare/makeup.png",
  "Spa For Women": "/BeautyCare/spa for women.png",
  "Men Salon At Home": "/BeautyCare/Men Salon at Home.png",
  "Massage For Men": "/BeautyCare/massage for men.png",
  "Pedicure And Manicure": "/BeautyCare/pedicure and maniure.png",
  "Hair Studio": "/BeautyCare/hair studio.png",
};
const DEFAULT_SERVICE_IMAGE = "/BeautyCare/default.png";
const LOADER_LOGO = "/logo.png";
const getSubServiceImage = (type) =>
  SUBSERVICE_IMAGES[type] || DEFAULT_SERVICE_IMAGE;

const Beauty = () => {
  const MAIN_BANNER = "/All Front Banners/BeautyServices.png";
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const swiperRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchSubServices = async () => {
      try {
        setLoading(true);
        const mainServiceId = "3";
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

        const DESIRED_ORDER = [
          "Women Salon At Home",
          "Makeup",
          "Spa For Women",
          "Men Salon At Home",
          "Massage For Men",
          "Pedicure And Manicure",
          "Hair Studio",
        ];

        const sortedSubServices = subServicesData.sort((a, b) => {
          const indexA = DESIRED_ORDER.indexOf(a.type);
          const indexB = DESIRED_ORDER.indexOf(b.type);
          
          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          
          return indexA - indexB;
        });

        setSubServices(sortedSubServices);
      } catch (err) {
        console.error("Error fetching sub-services:", err);
        setError(err.message);
        setSubServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubServices();
  }, []);

  const getCategoryUrlByLeadTypeId = async (lead_type_id) => {
    const q = query(collection(db, "category_manage"), where("lead_type_id", "==", lead_type_id));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].data().category_url;
  };

  const handleSubServiceClick = async (service) => {
    setPageLoading(true);
    const category_url = await getCategoryUrlByLeadTypeId(service.id);
    if (category_url) {
      router.push(`/${category_url}`);
    } else {
      setPageLoading(false);
      alert("Category URL not found!");
    }
  };

  if (pageLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-700">
        <div className="flex flex-col items-center gap-4">
          <Image
            src={LOADER_LOGO}
            alt="Mannubhai Logo"
            width={100}
            height={100}
            className="animate-bounce"
            priority
          />
          <div className="text-gray-600 font-medium animate-pulse text-sm">Loading Mannubhai...</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold mb-2">Error loading services</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head />
      <main className="relative min-h-screen bg-gray-50" role="main">
        {/* Hero Section */}
        <section className="hero-section w-full px-4 sm:px-6 lg:px-8 pb-8 mt-8">
          <div className="max-w-7xl mx-auto">
            <div className="hero-section-container flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Left Content */}
              <div className="hero-section-service flex-1 w-full order-2 lg:order-1">
                {/* Main Heading - Visible on all screens */}
                <header className="text-center lg:text-left mb-6 lg:mb-8">
                  <h1 className="font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                    Beauty services at your doorstep
                  </h1>
                  <p className="text-gray-600 mt-3 text-sm sm:text-base lg:text-lg">
                    At Mannubhai, we believe beauty and relaxation should come to you.
                  </p>
                </header>

                {/* Sub Services Section */}
                <section aria-labelledby="sub-services-heading" className="services-part mb-6 lg:mb-8">
                  <h2
                    id="sub-services-heading"
                    className="text-lg sm:text-xl font-semibold mb-4 text-center lg:text-left text-gray-800"
                  >
                    Our Beauty Care Services
                  </h2>
                  
                  {/* Services Grid - 4 columns on mobile */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 border border-gray-200 rounded-xl p-3 sm:p-4 bg-white shadow-sm">
                    {subServices.map((service) => (
                      <article
                        key={service.id}
                        className="flex flex-col items-center p-3 sm:p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md hover:border-pink-200 transition-all duration-300 cursor-pointer group"
                        onClick={() => handleSubServiceClick(service)}
                      >
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mb-2 sm:mb-3 transition-transform duration-300 group-hover:scale-110">
                          <Image
                            src={service.ServiceIcon}
                            alt={`Beauty service: ${service.ServiceName}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 80px"
                          />
                        </div>
                        <h3 className="text-xs sm:text-sm font-medium text-center text-gray-700 group-hover:text-pink-600 transition-colors duration-300 leading-tight">
                          {service.ServiceName}
                        </h3>
                      </article>
                    ))}
                  </div>
                </section>

                {/* Rating & Customers - Hidden on mobile */}
                <section className="hidden sm:flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-0">
                  <article className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-100">
                    <CiStar className="text-yellow-500 text-2xl sm:text-3xl flex-shrink-0" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">4.5</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Service Rating</p>
                    </div>
                  </article>

                  <article className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-100">
                    <PiUsersThree className="text-pink-500 text-2xl sm:text-3xl flex-shrink-0" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">30 Lacs+</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Customers Globally</p>
                    </div>
                  </article>
                </section>
              </div>

              {/* Main Banner - Hidden on mobile */}
              <div className="hidden lg:block hero-section-main-img flex-1 w-full order-1 lg:order-2 relative">
                <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={MAIN_BANNER}
                    alt="Professional home beauty services banner"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Swiper Slider - Fixed for mobile */}
        <section className="my-8 sm:my-12 w-full px-4 sm:px-6 lg:px-8" aria-labelledby="services-slider-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="services-slider-heading" className="text-xl sm:text-2xl font-semibold text-center mb-6 text-gray-800">
              Featured Services
            </h2>
            <div className="w-full">
              <Swiper
                ref={swiperRef}
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={1.2} // Slightly more than 1 on mobile for better UX
                navigation={{
                  prevEl: '.swiper-button-prev',
                  nextEl: '.swiper-button-next',
                }}
                loop={true}
                className="rounded-xl shadow-lg"
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20
                  },
                  768: {
                    slidesPerView: 2.5,
                    spaceBetween: 24
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 24
                  },
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 32
                  },
                }}
              >
                {[
                  { src: "/BeautyCare/hairstudioforwomen.webp", alt: "hairstudio at home" },
                  { src: "/BeautyCare/haircutathome.webp", alt: "haircut at home" },
                  { src: "/BeautyCare/massageforman.webp", alt: "massage for man" },
                  { src: "/BeautyCare/spaforwoman.webp", alt: "spa for women" },
                  { src: "/BeautyCare/waxing.webp", alt: "waxing and facials" },
                ].map((banner, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                      <Image
                        src={banner.src}
                        alt={banner.alt}
                        width={300}
                        height={200}
                        className="object-cover w-full h-auto hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="w-full px-4 sm:px-6 lg:px-8 my-8 sm:my-12" aria-label="Promotional Banner">
          <div className="max-w-7xl mx-auto">
            <div className="relative w-full h-32 sm:h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/HomeBanner/beauty.webp"
                alt="Beauty Services Promotional Banner"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px"
              />
            </div>
          </div>
        </section>

        {/* BeautyCare Component */}
        <section className="mt-8 sm:mt-12 lg:mt-16 w-full" aria-labelledby="beauty-care-heading">
          <h2 id="beauty-care-heading" className="sr-only">
            Beauty Care Services
          </h2>
          <BeautyCare brightbanner={true} />
        </section>

        {/* Content Sections */}
        <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            {/* Introduction */}
            <article className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-xl sm:text-2xl font-semibold text-pink-700 mb-3 sm:mb-4">
                  Welcome to Mannubhai: Your Trusted Partner for Beauty Care Services at Home
              </h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                At Mannubhai, we believe beauty and relaxation should come to you. Our mission is to deliver top-notch beauty and wellness services that you can enjoy in the comfort of your home. Whether you're preparing for a special occasion, need some self-care, or simply want to unwind, Mannubhai is here to make it happen.
              </p>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
                Our team of experienced professionals ensures that you get premium services customized to your needs. Let us pamper you with our exceptional offerings, designed for both men and women.
              </p>
            </article>

            {/* Women Salon at Home */}
            <article className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-pink-700 mb-3 sm:mb-4">
                Women Salon at Home
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                Why step out when luxury can come to your doorstep? Our Women Salon at Home service brings the best salon experience to you. Whether it's haircuts, hairstyling, waxing, facials, threading, or other grooming needs, our trained beauticians use high-quality products and adhere to strict hygiene protocols to ensure your satisfaction.
              </p>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Popular Services for Women:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Haircuts and hairstyling for every occasion</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Customized facials to suit your skin type</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Body waxing with gentle and effective techniques</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Threading for perfectly shaped eyebrows</span>
                </li>
              </ul>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
                Our beauticians are not just skilled but also friendly, ensuring you feel at ease throughout your salon experience.
              </p>
            </article>

            {/* Men Salon at Home */}
            <article className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-pink-700 mb-3 sm:mb-4">
                Men Salon at Home
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                At Mannubhai, we understand that men, too, deserve top-notch grooming services. Our Men Salon at Home service caters to all your grooming needs, from stylish haircuts to beard trimming and facials. We bring the expertise of a professional barber directly to your home.
              </p>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Popular Services for Men:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Modern and classic haircuts tailored to your style</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Beard styling, trimming, and shaping</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Skin-friendly facials to rejuvenate your skin</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Head massages for ultimate relaxation</span>
                </li>
              </ul>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
                With Mannubhai, you can look sharp and feel confident without stepping out of your home.
              </p>
            </article>

            {/* Makeup Service at Home */}
            <article className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-pink-700 mb-3 sm:mb-4">
                Makeup Service at Home
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                Be it a wedding, party, or corporate event, looking your best is non-negotiable. Our Makeup Service at Home ensures you shine on your special day. From subtle, natural looks to bold, glamorous transformations, our professional makeup artists use top-quality products to enhance your natural beauty.
              </p>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Our Makeup Services Include:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Bridal makeup for your big day</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Party makeup to dazzle every occasion</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Natural, everyday makeup for a polished look</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Hairstyling services to complement your makeup</span>
                </li>
              </ul>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
                With our expertise, you're guaranteed to turn heads and make a lasting impression.
              </p>
            </article>

            {/* Spa for Women */}
            <article className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-pink-700 mb-3 sm:mb-4">
                Spa for Women
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                Relaxation and rejuvenation are just a call away with our Spa for Women service. Our expert therapists bring a tranquil spa experience to your home, helping you unwind and recharge.
              </p>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Our Spa Services Include:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Body massages to relieve stress and tension</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Aromatherapy for a calming experience</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Body scrubs for smooth and glowing skin</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Detoxifying body wraps</span>
                </li>
              </ul>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
                Indulge in some well-deserved me-time with Mannubhai's spa services, designed to leave you feeling refreshed and radiant.
              </p>
            </article>

            {/* Men Massage at Home */}
            <article className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-pink-700 mb-3 sm:mb-4">
                Men Massage at Home
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                Men, too, deserve a break! Our Men Massage at Home service is tailored to provide relaxation and relief after a long day. Whether it's deep tissue therapy or a simple stress-relieving massage, our trained therapists ensure you feel rejuvenated.
              </p>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Our Massage Options Include:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Swedish massage for overall relaxation</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Deep tissue massage for muscle recovery</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Head and shoulder massage to ease tension</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Foot reflexology for stress relief</span>
                </li>
              </ul>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
                Experience the ultimate comfort as our therapists bring the spa experience to your living room.
              </p>
            </article>

            {/* Best Hair Studio */}
            <article className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-pink-700 mb-3 sm:mb-4">
                Best Hair Studio
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                At Mannubhai, your hair is in expert hands. Whether you're looking for a trendy new look or a classic style, our Best Hair Studio service provides exceptional hair care at home.
              </p>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Our Hair Services Include:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Haircuts for men, women, and kids</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Hair coloring and highlights</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Hair treatments for dryness, dandruff, and damage</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Hair spa for soft, silky locks</span>
                </li>
              </ul>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
                Let our professionals bring out the best in your hair while ensuring you enjoy a salon-like experience at home.
              </p>
            </article>

            {/* Manicure and Pedicure Services */}
            <article className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-pink-700 mb-3 sm:mb-4">
                Manicure and Pedicure Services
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                Your hands and feet deserve some TLC, and our Manicure and Pedicure Services are here to provide just that. Our experts use the finest products and tools to leave your nails clean, shaped, and polished, while also caring for your skin.
              </p>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Our Offerings Include:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Classic manicure and pedicure for basic care</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Gel polish for long-lasting color</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Nail art for a creative touch</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Foot scrubs and exfoliation for soft, smooth feet</span>
                </li>
              </ul>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
                Experience a luxurious pampering session that leaves your hands and feet feeling fabulous.
              </p>
            </article>

            {/* Why Choose Mannubhai? */}
            <article className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-pink-700 mb-3 sm:mb-4">
                Why Choose Mannubhai?
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                At Mannubhai, we are committed to delivering exceptional beauty care experiences. Here's what sets us apart:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Professional Expertise: Our team comprises highly skilled professionals with years of experience in the beauty and wellness industry.</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Convenience at Your Doorstep: No need to brave traffic or wait in long queues. We bring the salon and spa experience to your home, saving you time and effort.</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Hygiene and Safety First: We adhere to the highest hygiene standards, using sanitized tools and disposable kits to ensure your safety.</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Customized Services: We tailor our services to meet your unique needs and preferences, ensuring a personalized experience every time.</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">•</span>
                  <span>Affordable Luxury: Enjoy premium services at competitive prices. With Mannubhai, luxury doesn't have to come with a hefty price tag.</span>
                </li>
              </ul>
            </article>

            {/* Book Your Appointment Today */}
            <article className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-pink-700 mb-3 sm:mb-4">
                Book Your Appointment Today
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                Ready to experience beauty and relaxation like never before? Booking your appointment with Mannubhai is simple:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">1.</span>
                  <span>Visit our website and choose the service you need.</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">2.</span>
                  <span>Select a date and time that works for you.</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                  <span className="text-pink-500 font-bold mt-1">3.</span>
                  <span>Relax and let us handle the rest.</span>
                </li>
              </ul>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                At Mannubhai, we're committed to making you look and feel your best. Our services are available across multiple cities, ensuring that quality beauty care is always within your reach.
              </p>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                At Mannubhai, we don't just provide beauty services; we deliver experiences that rejuvenate your mind, body, and spirit. Trust us to make every day your best day.
              </p>
            
            </article>
          </div>
        </section>
      </main>
    </>
  );
};

export default Beauty;