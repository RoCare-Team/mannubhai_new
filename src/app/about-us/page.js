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
      name: "Manoj Sharma",
      role: "Founder",
      img: "/Brand/Manoj Sir Image.webp",
      linkedin: "https://www.linkedin.com/in/manoj-sharma-516b56125?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",

    },
    {
      name: "Kunnu Singh",
      role: "Co-Founder & CEO",
      img: "/Brand/Kunnu Ma'am image.webp",
      linkedin: "https://www.linkedin.com/in/kunnu-singh-b51521141?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    }
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
  <section aria-labelledby="leadership-heading" className="py-12 bg-gray-50">
    <h2 id="leadership-heading" className="text-3xl font-bold text-center text-gray-800 mb-10">
      Our Leadership Team
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
      {leadership.map(({ name, role, img, linkedin }, i) => (
        <article
          key={i}
          className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition duration-300"
        >
          {/* Square Image */}
          <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-lg shadow">
            <Image
              src={img}
              alt={`Photo of ${name}`}
              width={128}
              height={128}
              className="object-cover object-top w-full h-full"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-600 mb-3">{role}</p>

          {/* LinkedIn Only */}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold text-sm hover:underline"
            >
              LinkedIn
            </a>
          )}
        </article>
      ))}
    </div>
  </section>


      </main>

    </>
 
  );
};

export default AboutUsContent;
