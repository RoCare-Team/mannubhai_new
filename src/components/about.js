"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const AboutMannuBhai = () => {
  const features = [
    { icon: "/franchies/time.webp", label: "ON TIME SERVICE" },
    { icon: "/franchies/rupees.webp", label: "TRANSPARENT PRICES" },
    { icon: "/franchies/professional.webp", label: "TRAINED PROFESSIONALS" },
    { icon: "/franchies/award.webp", label: "ASSURED SERVICE QUALITY" },
  ];

  return (
    <section className="bg-white py-14">
      <div className="w-full px-6 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Section */}
          <div className="bg-gradient-to-br from-sky-600 to-cyan-500 text-white rounded-2xl p-6 sm:p-10 shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 border-b border-white/60 pb-2">
              ABOUT MANNU BHAI
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Mannu Bhai is one of the most trusted service providers in India. We offer reliable solutions in home appliance care, home care, fitness, personal grooming, and gadget support. Our dedicated, experienced professionals ensure customer satisfaction through consistent service quality.
            </p>
            <Link
              href="/about-us"
              className="mt-6 inline-block bg-white/20 hover:bg-white/30 text-white font-medium px-4 py-2 rounded-md text-sm transition duration-200"
            >
              Read More
            </Link>
          </div>

          {/* Right Features */}
          <div className="grid grid-cols-2 gap-6">
            {features.map(({ icon, label }) => (
              <div
                key={label}
                className="bg-gray-50 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition duration-300"
              >
                <Image
                  src={icon}
                  alt={label}
                  width={50}
                  height={50}
                  className="mx-auto mb-3"
                />
                <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMannuBhai;
