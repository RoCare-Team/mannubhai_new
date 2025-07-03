"use client";
import React from "react";
import Image from "next/image";
import Head from "./head";
const AboutUsContent = () => {
  const brandLogos = [
    { src: "/Brand/samsung-logo.webp", alt: "Samsung" },
    { src: "/Brand/lg-logo.webp", alt: "LG" },
    { src: "/Brand/haire-logo.webp", alt: "Haier" },
    { src: "/Brand/whirlpool.webp", alt: "Whirlpool" },
    { src: "/Brand/toshiba-logoo.webp", alt: "Toshiba" },
    { src: "/Brand/bosch-logo.webp", alt: "Bosch" },
    { src: "/Brand/sharp-logo.webp", alt: "Sharp" },
    { src: "/Brand/kent-logo.webp", alt: "Kent" },
    { src: "/Brand/dekin-logo.webp", alt: "Daikin" },
    { src: "/Brand/eurekha.webp", alt: "Eureka Forbes" },
    { src: "/Brand/sony.webp", alt: "Sony" },
  ];

  const leadership = [
    {
      name: "MannuBhai Sharma",
      role: "CEO & Business Analyst",
      img: "/Brand/ayurvadicfacial.png",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Anita Verma",
      role: "CTO & Product Manager",
      img: "/Brand/ayurvadicfacial.png",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Rohit Mehra",
      role: "Head of Operations",
      img: "/Brand/ayurvadicfacial.png",
      linkedin: "#",
      twitter: "#",
    },
  ];

  return (

    <>
    <Head />
       <main className="max-w-7xl mx-auto px-6 py-16 bg-gray-50 rounded-md shadow-sm">
      {/* Page Title */}
      <header className="mb-12 text-center">
        <h1 className="font-bold text-3xl text-gray-800">About Us</h1>
      </header>

      {/* Who We Are */}
      <section className="bg-white p-6 rounded-md shadow mb-12" aria-labelledby="who-we-are-heading">
        <h2 id="who-we-are-heading" className="font-bold text-2xl mb-4 text-gray-800">Who We Are</h2>
        <p className="text-gray-700 leading-relaxed text-base">
          MannuBhai Service Expert is a technology-driven company, redefining service excellence through its innovative hybrid model. Leveraging advanced technology, we provide swift and seamless solutions in home appliance care, home care, and beauty care. Our platform integrates intelligent systems to ensure precision, reliability, and exceptional customer experiences.
        </p>
        <p className="mt-4 text-gray-700 leading-relaxed text-base">
          Supported by a team of highly skilled professionals, we combine cutting-edge tools with human expertise to deliver unmatched service quality. Trusted by clients and industries nationwide, MannuBhai stands at the forefront of technological innovation, setting new standards in convenience and efficiency while transforming the way services are delivered.
        </p>
        <p className="mt-4 text-gray-700 leading-relaxed font-semibold">
          Our Vision: Deliver home services and solutions like never experienced before.
        </p>
      </section>

      {/* Achievements */}
      <section className="mb-12" aria-labelledby="achievements-heading">
        <h2 id="achievements-heading" className="font-semibold text-2xl text-center mb-6 text-gray-800">Our Achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "2.5 Million+", subtitle: "Total Customers", color: "text-blue-700" },
            { title: "3.62 Lakh+", subtitle: "Service Requests This Year", color: "text-pink-600" },
            { title: "3000+", subtitle: "Active Partners", color: "text-blue-700" },
            { title: "PAN India", subtitle: "Service Availability", color: "text-pink-600" },
          ].map((item, i) => (
            <article key={i} className="bg-white rounded-md p-6 text-center shadow-sm">
              <p className={`${item.color} font-semibold text-lg`}>{item.title}</p>
              <p className="text-gray-600 text-sm mt-1">{item.subtitle}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Brands We Repair */}
      <section className="mb-12" aria-labelledby="brands-heading">
        <h2 id="brands-heading" className="font-semibold text-2xl text-center mb-6 text-gray-800">Brands We Repair</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-11 gap-4 justify-items-center items-center">
          {brandLogos.map(({ src, alt }, i) => (
            <figure key={i} className="w-24 h-12 relative" aria-label={`${alt} brand logo`}>
              <Image
                src={src}
                alt={`${alt} logo`}
                fill
                style={{ objectFit: "contain" }}
                loading={i > 4 ? "lazy" : "eager"}
              />
            </figure>
          ))}
        </div>
      </section>

      {/* Leadership Team */}
      <section aria-labelledby="leadership-heading">
        <h2 id="leadership-heading" className="font-semibold text-2xl text-center mb-6 text-gray-800">Our Leadership Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {leadership.map(({ name, role, img, linkedin, twitter }, i) => (
            <article
              key={i}
              className="bg-white rounded-md shadow p-6 flex flex-col items-center text-center"
            >
              <figure className="w-20 h-20 rounded-full overflow-hidden mb-4 relative">
                <Image
                  src={img}
                  alt={`Photo of ${name}`}
                  fill
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                />
              </figure>
              <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
              <p className="text-gray-600 text-sm mb-3">{role}</p>
              <figcaption className="flex gap-3 text-blue-700 text-lg">
                <a
                  href={linkedin}
                  aria-label={`LinkedIn profile of ${name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* LinkedIn SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M4.98 3.5c0 1.38-1.12 2.5-2.5 2.5S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.5h5v15H0v-15zm7 0h4.6v2.1h.1c.64-1.21 2.2-2.5 4.5-2.5 4.8 0 5.7 3.16 5.7 7.26V23.5h-5v-7.65c0-1.82-.03-4.17-2.55-4.17-2.55 0-2.94 2-2.94 4.05V23.5H7v-15z" />
                  </svg>
                </a>
                <a
                  href={twitter}
                  aria-label={`Twitter profile of ${name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* Twitter SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M24 4.56c-.88.39-1.82.65-2.82.77a4.93 4.93 0 002.16-2.72c-.94.56-2 .96-3.13 1.18a4.9 4.9 0 00-8.34 4.47c-4.07-.2-7.68-2.15-10.1-5.11a4.93 4.93 0 001.52 6.56 4.89 4.89 0 01-2.22-.62v.06a4.9 4.9 0 003.94 4.8c-.84.23-1.72.27-2.63.1a4.91 4.91 0 004.58 3.4 9.83 9.83 0 01-6.1 2.1c-.4 0-.8-.02-1.19-.07a13.84 13.84 0 007.53 2.2c9.04 0 14-7.5 14-14 0-.21 0-.42-.01-.63a9.92 9.92 0 002.46-2.54z" />
                  </svg>
                </a>
              </figcaption>
            </article>
          ))}
        </div>
      </section>
    </main>
    </>
 
  );
};

export default AboutUsContent;
