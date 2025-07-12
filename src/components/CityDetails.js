"use client";
import React, { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import AboutMannuBhaiExpert from "./AboutMannuBhaiExpert";
import 'react-toastify/dist/ReactToastify.css';

// Components
import HeroSection from "@/app/_components/Home/HeroSection";
import Appliances from "@/app/_components/Home/Appliances";
import HandymanServices from "@/app/_components/Home/HandymanServices";
import BeautyCare from "@/app/_components/Home/BeautyCare";
import HomecareServcies from '@/app/_components/Home/HomecareServcies';
import BrandsWeRepair from '@/components/BrandsWeRepair';
import Services from '@/app/_components/Home/Services';
import PopularCities from "@/app/_components/Home/PopularCities";
import ClientReviews from "@/app/_components/Home/ClientReviews";
import FooterLinks from "@/app/_components/Home/FooterLinks";
import AppDownloadCard from '@/app/_components/Home/AppDownloadCard';
import BeautyBrand from "@/app/_components/Home/BeautyBrand";
import FloatingContactButtons from '@/components/FloatingContactButtons';

// UI
import { ToastContainer } from 'react-toastify';

const CityDetails = ({ city }) => {
  const [showCitySearch, setShowCitySearch] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [selectedService, setSelectedService] = useState(null);
  const serviceRefs = useRef({});

  const ServiceWrapper = ({ children, categoryUrl, className = "" }) => {
    const handleClick = (serviceUrl) => {
      router.push(`/${city.city_url}/${serviceUrl}`);
    };

    return React.cloneElement(children, {
      onServiceClick: handleClick,
      cityUrl: city.city_url,
      className
    });
  };

  const handleSelectCity = (selectedCity) => {
    const segments = pathname.split('/').filter(Boolean);

    // Case 1: On a city page (/delhi)
    if (segments.length === 1) {
      window.location.href = `/${selectedCity.city_url}`;
    }
    // Case 2: On a category page (/air-purifier-repair-service)
    else if (segments.length === 1 && segments[0] === selectedCity.city_url) {
      setShowCitySearch(false);
    }
    // Case 3: On city+category page (/delhi/air-purifier-repair-service)
    else if (segments.length === 2) {
      window.location.href = `/${selectedCity.city_url}/${segments[1]}`;
    }
  };

  if (!city) {
    return (
      <div className="w-full px-4 sm:px-6 py-8 md:py-12 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="bg-gray-200 rounded-full w-16 h-16 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="w-full bg-white">
        {/* Hero Section - Full width */}
        <section className="w-full mb-8 md:mb-12">
          <HeroSection />
        </section>

        {/* Main content container with responsive padding */}
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mx-auto">
          {/* Services Sections with consistent spacing */}
          <div className="space-y-12 md:space-y-16 lg:space-y-20 w-full">
            <ServiceWrapper categoryUrl="appliances">
              <Appliances />
            </ServiceWrapper>

            <ServiceWrapper categoryUrl="beauty-care">
              <BeautyCare />
            </ServiceWrapper>

            <section className="w-full mb-8 md:mb-12">
              <BeautyBrand />
            </section>

            <ServiceWrapper categoryUrl="homecare-services">
              <HomecareServcies />
            </ServiceWrapper>

            <ServiceWrapper categoryUrl="handyman-services" className="mb-0">
              <HandymanServices />
            </ServiceWrapper>

            {/* App Download - Full width */}
            <section className="w-full my-8 md:my-12">
              <AppDownloadCard />
            </section>

            {/* About Expert */}
            <section 
              className="w-full my-8 md:my-12"
              aria-labelledby="expert-heading"
            >
              <h2 id="expert-heading" className="sr-only">
                About MannuBhai Expert Services in {city.city_name}
              </h2>
              <AboutMannuBhaiExpert />
            </section>

            {/* Client Reviews */}
            <section className="w-full my-8 md:my-12">
              <ClientReviews />
            </section>

            {/* Popular Cities - Full width */}
            <section className="w-full my-8 md:my-12">
              <PopularCities />
            </section>

            {/* Brands We Repair */}
            <section className="w-full my-8 md:my-12">
              <BrandsWeRepair />
            </section>

            {/* Services */}
            <section className="w-full my-8 md:my-12">
              <Services />
            </section>
          </div>
        </div>

        {/* Footer Links - Full width */}
        <section className="w-full mt-12 md:mt-16">
          <FooterLinks />
        </section>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName="!rounded-lg !shadow-md !w-fit !min-w-[200px] !max-w-[80vw] !px-4 !py-2 !text-sm !text-gray-800 !bg-white"
          bodyClassName="!text-sm"
        />
      </main>

      {/* Floating Contact Buttons */}
      <FloatingContactButtons />
    </>
  );
};

export default CityDetails;