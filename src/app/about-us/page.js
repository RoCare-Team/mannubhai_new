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

  const uniqueFeatures = [
    {
      icon: "🎯",
      title: "Customer-First",
      description: "Solutions designed specifically for your needs.",
      color: "from-teal-500 to-emerald-500"
    },
    {
      icon: "💎",
      title: "Integrity",
      description: "Honest prices, precise solutions, and work guaranteed.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: "⚡",
      title: "Reliability",
      description: "On-time, consistent service for every brand, every order, all of India.",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: "🚀",
      title: "Innovation",
      description: "Effortless booking, scheduling, and support with our smart app and mobile app.",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: "🌟",
      title: "Community",
      description: "Reaching beyond homes by serving and connecting local communities.",
      color: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <>
      <Head />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-slate-100">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
            <div className="absolute -bottom-8 left-32 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-500"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="text-center">
              <div className="inline-block">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-slate-700 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  About Us
                </h1>
                <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 rounded-full"></div>
              </div>
              <p className="text-xl sm:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mt-8">
                India&apos;s <span className="text-teal-600 font-semibold">most trusted</span> professional home service company, 
                bringing <span className="text-blue-600 font-semibold">premium quality</span> peace of mind and care to every home.
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-teal-200 shadow-lg">
                  <span className="text-teal-500 text-2xl">✨</span>
                  <span className="text-slate-700 font-medium">Premium Service</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200 shadow-lg">
                  <span className="text-blue-500 text-2xl">🏆</span>
                  <span className="text-slate-700 font-medium">30 lack Happy Customers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          {/* Who We Are Section */}
          <section className="relative">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center mb-10">
                <div className="w-2 h-16 bg-gradient-to-b from-teal-500 to-blue-500 rounded-full mr-6"></div>
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-800">Who We Are</h2>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <p className="text-slate-600 leading-relaxed text-lg">
                    Mannu Bhai Service Expert is one of India&apos;s leading professional home service companies, working to bring peace of mind, comfort, and quality care to every home. From busy metros such as <span className="text-teal-600 font-medium">Delhi and Mumbai</span>, to developing towns across the nation, we work to make daily life easier with services founded on <span className="text-blue-600 font-medium">trust, technology, and a personal touch</span>.
                  </p>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    We are a <span className="text-purple-600 font-medium">technology company</span>, remaking the standard of service excellence by an innovative hybrid approach that marries cutting-edge digital platforms with human know-how. Our smart systems offer <span className="text-teal-600 font-medium">precision, efficiency, and convenience</span>, with our team of experienced and background-checked experts.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 border border-teal-100 shadow-lg">
                  <div className="space-y-5">
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Born of the conviction that living in a house today does not need to be stressful, <span className="text-blue-600 font-medium">Mannu Bhai Service Expert</span> was created to bring together families with trusted experts who can deal with everything.
                    </p>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Today, we serve more than <span className="text-teal-600 font-bold text-xl">3 million happy customers</span> across the country, whose faith and word-of-mouth drive us to continue pushing boundaries.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 relative overflow-hidden rounded-2xl shadow-lg">
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-8">
                  <p className="text-xl font-semibold text-center text-white">
                    🎯 <span className="text-teal-300">Our Vision:</span> Deliver home services and solutions like never experienced before.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What Makes Us Unique Section */}
          <section className="relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">What Makes Us <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Unique</span></h2>
              <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {uniqueFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 hover:border-teal-300 transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl mb-6 text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-teal-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-10 border border-slate-200 shadow-xl">
              <p className="text-slate-700 leading-relaxed text-lg text-center max-w-5xl mx-auto">
                Our vision is not just to deliver outstanding service but to forge <span className="text-teal-600 font-medium">enduring relationships</span>, the gold standard of <span className="text-blue-600 font-medium">trust, convenience, and customer delight</span>. With ongoing innovation, polished processes, and a people-first culture, we are <span className="text-purple-600 font-medium">revolutionizing the delivery of home services</span>—professional, reliable, and future-proof.
              </p>
            </div>
          </section>

          {/* Achievements Section */}
          <section>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">Our <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Achievements</span></h2>
              <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "2.5M+", subtitle: "Total Customers", color: "from-teal-500 to-emerald-500", icon: "👥", bgColor: "teal" },
                { title: "3.62L+", subtitle: "Service Requests This Year", color: "from-pink-500 to-rose-500", icon: "📊", bgColor: "pink" },
                { title: "3000+", subtitle: "Active Partners", color: "from-purple-500 to-violet-500", icon: "🤝", bgColor: "purple" },
                { title: "PAN India", subtitle: "Service Availability", color: "from-orange-500 to-amber-500", icon: "🌍", bgColor: "orange" },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-slate-200 hover:border-teal-300 transition-all duration-500 hover:scale-110 hover:shadow-2xl shadow-lg"
                >
                  <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className={`bg-gradient-to-r ${item.color} bg-clip-text text-transparent font-bold text-3xl sm:text-4xl mb-3`}>
                    {item.title}
                  </div>
                  <p className="text-slate-600 text-sm font-medium uppercase tracking-wide">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Brands We Repair Section */}
          <section className="bg-white/70 backdrop-blur-sm rounded-3xl p-10 border border-slate-200 shadow-xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">Brands We <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Repair</span></h2>
              <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mx-auto"></div>
              <p className="text-slate-600 mt-6 max-w-2xl mx-auto">
                We service and repair all major home appliance brands with <span className="text-teal-600 font-medium">certified expertise</span> and <span className="text-blue-600 font-medium">premium quality service</span>.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-6">
              {brandLogos.map(({ src, alt }, index) => (
                <div 
                  key={index}
                  className="group bg-slate-50 hover:bg-white rounded-xl p-4 transition-all duration-300 hover:shadow-lg border border-slate-200 hover:border-teal-300 hover:scale-110"
                >
                  <div className="w-full h-12 relative">
                    <Image
                      src={src}
                      alt={`${alt} logo`}
                      fill
                      style={{ objectFit: "contain" }}
                      loading={index > 4 ? "lazy" : "eager"}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Leadership Team Section */}
          <section>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">Our <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Leadership</span> Team</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mx-auto"></div>
              <p className="text-slate-600 mt-6 max-w-2xl mx-auto">
                Meet the <span className="text-teal-600 font-medium">visionary leaders</span> driving our mission to revolutionize home services.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {leadership.map(({ name, role, img, linkedin }, index) => (
                <div
                  key={index}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-slate-200 hover:border-teal-300 transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg"
                >
                  <div className="relative inline-block mb-8">
                    <div className="w-36 h-36 mx-auto overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 border-4 border-transparent group-hover:border-teal-300">
                      <Image
                        src={img}
                        alt={`Photo of ${name}`}
                        width={144}
                        height={144}
                        className="object-cover object-top w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">👑</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 group-hover:text-teal-600 transition-colors">
                    {name}
                  </h3>
                  <p className="text-slate-600 mb-8 font-medium text-lg">{role}</p>

                  {linkedin && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-blue-600 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl transform"
                    >
                      <span className="mr-3 text-lg">💼</span>
                      Connect on LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default AboutUsContent;