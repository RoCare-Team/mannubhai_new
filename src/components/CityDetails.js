"use client";
import React,{ useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AboutMannuBhaiExpert from "./AboutMannuBhaiExpert";
import HeroSection from "@/app/_components/Home/HeroSection";
import Appliances from "@/app/_components/Home/Appliances";
import BeautyCare from "@/app/_components/Home/BeautyCare";
import HandymanServices from "@/app/_components/Home/HandymanServices";
import HomecareServcies from "@/app/_components/Home/HomecareServcies";
import BrandsWeRepair from "./BrandsWeRepair";
import ClientReviews from "@/app/_components/Home/ClientReviews";

const CityDetails = ({ city }) => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState(null);
  const serviceRefs = useRef({});

  // Modify service components to include city URL
 const ServiceWrapper = ({ children, categoryUrl }) => {
    const handleClick = (serviceUrl) => {
      // Navigate directly to city/service (removed category segment)
      router.push(`/${city.city_url}/${serviceUrl}`);
    };

    return React.cloneElement(children, {
      onServiceClick: handleClick,
      cityUrl: city.city_url
    });
  };


  if (!city) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
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
      <main className="w-full px-6 md:px-12 lg:px-20 py-12 mx-auto bg-white">
        <HeroSection />
        <ServiceWrapper categoryUrl="appliances">
          <Appliances />
        </ServiceWrapper>
        <ServiceWrapper categoryUrl="beauty-care">
          <BeautyCare />
        </ServiceWrapper>
        <ServiceWrapper categoryUrl="homecare-services">
          <HomecareServcies />
        </ServiceWrapper>
        <ServiceWrapper categoryUrl="handyman-services">
          <HandymanServices />
        </ServiceWrapper>
        <BrandsWeRepair />
        <section
          className="mt-8 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24"
          aria-labelledby="expert-heading"
        >
          <h2 id="expert-heading" className="sr-only">
            About MannuBhai Expert Services in {city.city_name}
          </h2>
          <AboutMannuBhaiExpert />
        </section>
        <ClientReviews />
      </main>
    </>
  );
};

export default CityDetails;