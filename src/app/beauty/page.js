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
import BeautyCare from "../_components/Home/BeautyCare";
import Head from "./head";
import Link from "next/link";
// Constants moved outside component to prevent recreation on every render
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
const MAIN_BANNER = "/All Front Banners/BeautyServices.webp";

const DESIRED_ORDER = [
  "Women Salon At Home",
  "Makeup",
  "Spa For Women",
  "Men Salon At Home",
  "Massage For Men",
  "Pedicure And Manicure",
  "Hair Studio",
];

const FEATURED_SERVICES = [
  {
    src: "/BeautyCare/hairstudioforwomen.webp",
    alt: "hairstudio at home",
    link: "/hair-studio",
  },
  {
    src: "/BeautyCare/haircutathome.webp",
    alt: "haircut at home",
    link: "/men-salon-at-home",
  },
  {
    src: "/BeautyCare/massageforman.webp",
    alt: "massage for man",
    link: "/men-massage-at-home",
  },
  {
    src: "/BeautyCare/spaforwoman.webp",
    alt: "spa for women",
    link: "/spa-for-women",
  },
  {
    src: "/BeautyCare/waxing.webp",
    alt: "waxing and facials",
    link: "/women-salon-at-home",
  },
];


const getSubServiceImage = (type) => SUBSERVICE_IMAGES[type] || DEFAULT_SERVICE_IMAGE;

const Beauty = () => {
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
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
        alert("Category URL not found!");
      }
    } catch (err) {
      console.error("Error navigating:", err);
      alert("An error occurred while navigating");
    } finally {
      setPageLoading(false);
    }
  }, [getCategoryUrlByLeadTypeId, router]);

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
            unoptimized // For animated images, unoptimized might be better
          />
          <div className="text-gray-600 font-medium animate-pulse text-sm">Loading Mannubhai...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold mb-2">Error loading services</h2>
          <p>{error}</p>
          <button 
            onClick={fetchSubServices}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
          >
            Retry
          </button>
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
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 border border-gray-200 rounded-xl p-3 sm:p-4 bg-white shadow-sm">
                    {sortedSubServices.map((service) => (
                      <article
                        key={service.id}
                        className="flex flex-col items-center p-3 sm:p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md hover:border-pink-200 transition-all duration-300 cursor-pointer group"
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
                        <h3 className="text-xs sm:text-sm font-medium text-center text-gray-700 group-hover:text-pink-600 transition-colors duration-300 leading-tight">
                          {service.ServiceName}
                        </h3>
                      </article>
                    ))}
                  </div>
                </section>

                {/* Rating & Customers */}
                <section className="hidden sm:flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-0">
                  <article className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-100">
                    <CiStar className="text-yellow-500 text-2xl sm:text-3xl flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">4.5</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Service Rating</p>
                    </div>
                  </article>

                  <article className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-100">
                    <PiUsersThree className="text-pink-500 text-2xl sm:text-3xl flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">30 Lacs+</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Customers Globally</p>
                    </div>
                  </article>
                </section>
              </div>

              {/* Main Banner */}
              <div className="hidden lg:block hero-section-main-img flex-1 w-full order-1 lg:order-2 relative">
                <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[800px] border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={MAIN_BANNER}
                    alt="Professional home beauty services"
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

        {/* Services Swiper Slider */}
        <section className="my-8 sm:my-12 w-full px-4 sm:px-6 lg:px-8" aria-labelledby="services-slider-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="services-slider-heading" className="text-xl sm:text-2xl font-semibold text-center mb-6 text-gray-800">
              Featured Services
            </h2>
            <div className="w-full relative">
              <Swiper
                ref={swiperRef}
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={1.2}
                navigation={{
                  prevEl: '.swiper-button-prev',
                  nextEl: '.swiper-button-next',
                }}
                loop={true}
                className="rounded-xl shadow-lg"
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  768: { slidesPerView: 2.5, spaceBetween: 24 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                  1280: { slidesPerView: 3, spaceBetween: 32 },
                }}
              >
            {FEATURED_SERVICES.map((banner, idx) => (
  <SwiperSlide key={idx}>
    <Link href={banner.link} passHref>
      <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <Image
          src={banner.src}
          alt={banner.alt}
          width={300}
          height={200}
          className="object-cover w-full h-auto hover:scale-105 transition-transform duration-500"
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

        {/* Promotional Banner */}
        <section className="w-full px-4 sm:px-6 lg:px-8 my-8 sm:my-12" aria-label="Promotional offer">
          <div className="max-w-7xl mx-auto">
            <div className="relative w-full h-32 sm:h-48 md:h-64 lg:h-80 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/HomeBanner/beauty.webp"
                alt="Beauty Services Promotional Offer"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px"
                priority
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
        <ContentSections />
      </main>
    </>
  );
};

// Extracted content sections to a separate component for better readability
const ContentSections = () => {
  const sections = [
    {
      title: "Welcome to Mannubhai: Your Trusted Partner for Beauty Care Services at Home",
      content: [
        "At Mannubhai,we believe beauty and relaxation should come to you.Our mission is to deliver top-notch beauty and wellness services that you can enjoy in the comfort of your home.Whether you’re preparing for a special occasion,need some self-care,or simply want to unwind,Mannubhai is here to make it happen.",
        "Our team of experienced professionals ensures that you get premium services customized to your needs.Let us pamper you with our exceptional offerings,designed for both men and women."
      ]
    },
    {
      title: "Our Beauty Care Services",
      content: []
    },
    {
      title: "Women Salon at Home",
      content: [
        "Why step out when luxury can come to your doorstep?OurWomen Salon at Homeservice brings the best salon experience to you.Whether it’s haircuts,hairstyling,waxing,facials,threading,or other grooming needs,our trained beauticians use high-quality products and adhere to strict hygiene protocols to ensure your satisfaction."
      ],
      list: {
        title: "Popular Services for Women:",
        items: [
          "Haircuts and hairstyling for every occasion",
          "Customized facials to suit your skin type",
          "Body waxing with gentle and effective techniques",
          "Threading for perfectly shaped eyebrows"
        ]
      },
      closing: "Our beauticians are not just skilled but also friendly,ensuring you feel at ease throughout your salon experience."
    },
    {
      title: "Men Salon at Home",
      content: [
        "At Mannubhai,we understand that men,too,deserve top-notch grooming services.OurMen Salon at Homeservice caters to all your grooming needs,from stylish haircuts to beard trimming and facials.We bring the expertise of a professional barber directly to your home."
      ],
      list: {
        title: "Popular Services for Men:",
        items: [
          "Modern and classic haircuts tailored to your style",
          "Beard styling,trimming,and shaping",
          "Skin-friendly facials to rejuvenate your skin",
          "Head massages for ultimate relaxation"
        ]
      },
      closing: "With Mannubhai,you can look sharp and feel confident without stepping out of your home."
    },
    {
      title: "Makeup Service at Home",
      content: [
        "Be it a wedding,party,or corporate event,looking your best is non-negotiable.OurMakeup Service at Homeensures you shine on your special day.From subtle,natural looks to bold,glamorous transformations,our professional makeup artists use top-quality products to enhance your natural beauty."
      ],
      list: {
        title: "Our Makeup Services Include:",
        items: [
          "Bridal makeup for your big day",
          "Party makeup to dazzle every occasion",
          "Natural,everyday makeup for a polished look",
          "Hairstyling services to complement your makeup"
        ]
      },
      closing: "With our expertise,you’re guaranteed to turn heads and make a lasting impression."
    },
    {
      title: "Spa for Women",
      content: [
        "Relaxation and rejuvenation are just a call away with ourSpa for Womenservice.Our expert therapists bring a tranquil spa experience to your home,helping you unwind and recharge."
      ],
      list: {
        title: "Our Spa Services Include:",
        items: [
          "Body massages to relieve stress and tension",
          "Aromatherapy for a calming experience",
          "Body scrubs for smooth and glowing skin",
          "Detoxifying body wraps"
        ]
      },
      closing: "Indulge in some well-deserved me-time with Mannubhai’s spa services,designed to leave you feeling refreshed and radiant."
    },
    {
      title: "Men Massage at Home",
      content: [
        "Men,too,deserve a break!OurMen Massage at Homeservice is tailored to provide relaxation and relief after a long day.Whether it’s deep tissue therapy or a simple stress-relieving massage,our trained therapists ensure you feel rejuvenated."
      ],
      list: {
        title: "Our Massage Options Include:",
        items: [
          "Swedish massage for overall relaxation",
          "Deep tissue massage for muscle recovery",
          "Head and shoulder massage to ease tension",
          "Foot reflexology for stress relief"
        ]
      },
      closing: "Experience the ultimate comfort as our therapists bring the spa experience to your living room."
    },
    {
      title: "Best Hair Studio",
      content: [
        "At Mannubhai,your hair is in expert hands.Whether you’re looking for a trendy new look or a classic style,ourBest Hair Studioservice provides exceptional hair care at home."
      ],
      list: {
        title: "Our Hair Services Include:",
        items: [
          "Haircuts for men,women,and kids",
          "Hair coloring and highlights",
          "Hair treatments for dryness,dandruff,and damage",
          "Hair spa for soft,silky locks"
        ]
      },
      closing: "Let our professionals bring out the best in your hair while ensuring you enjoy a salon-like experience at home."
    },
    {
      title: "Manicure and Pedicure Services",
      content: [
        "Your hands and feet deserve some TLC,and ourManicure and Pedicure Servicesare here to provide just that.Our experts use the finest products and tools to leave your nails clean,shaped,and polished,while also caring for your skin."
      ],
      list: {
        title: "Our Offerings Include:",
        items: [
          "Classic manicure and pedicure for basic care",
          "Gel polish for long-lasting color",
          "Nail art for a creative touch",
          "Foot scrubs and exfoliation for soft,smooth feet"
        ]
      },
      closing: "Experience a luxurious pampering session that leaves your hands and feet feeling fabulous."
    },
    {
      title: "Why Choose Mannubhai?",
      content: [
        "At Mannubhai,we are committed to delivering exceptional beauty care experiences.Here’s what sets us apart:"],
      list: {
        items: [
          "Professional Expertise",
          "Convenience at Your Doorstep",
          "Hygiene and Safety First",
          "Customized Services",
          "Affordable Luxury"
        ]
      }
    },
    {
      title: "Book Your Appointment Today",
      content: [
        "Ready to experience beauty and relaxation like never before?Booking your appointment with Mannubhai is simple:",
        "Visit our website and choose the service you need.",
        "Select a date and time that works for you.",
        "Relax and let us handle the rest."
      ],
      closing: [
        "At Mannubhai,we’re committed to making you look and feel your best.Our services are available across multiple cities,ensuring that quality beauty care is always within your reach.",
        "At Mannubhai,we don’t just provide beauty services;we deliver experiences that rejuvenate your mind,body,and spirit.Trust us to make every day your best day.",
        "Book your appointment now and let us bring beauty to your doorstep."
      ]
    }
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {sections.map((section, index) => (
          <article 
            key={index}
            className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-pink-700 mb-3 sm:mb-4">
              {section.title}
            </h2>
            
            {section.content.map((paragraph, pIndex) => (
              <p key={pIndex} className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
            {section.list && (
              <>
                {section.list.title && (
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {section.list.title}
                  </h3>
                )}
                <ul className="space-y-2 mb-4">
                  {section.list.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                      <span className="text-pink-500 font-bold mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            
            {section.closing && (
              typeof section.closing === 'string' ? (
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {section.closing}
                </p>
              ) : (
                section.closing.map((para, closingIndex) => (
                  <p key={closingIndex} className="text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
                    {para}
                  </p>
                ))
              )
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default Beauty;