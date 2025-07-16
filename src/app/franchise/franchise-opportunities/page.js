"use client";

import React, { useState } from "react";
import Image from "next/image";
import ServicesWeProvide from "./franchiesServices/page";
import FranchiseeDetails from "./franchiseeDetails/page";
import Testimonials from "./OnboardingFranchise/page";
import ProfitSection from "./profitSection/page";
import FranchiseContactForm from "./franchiseContactForm/page";

const LandingContent = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index); // Fixed typo: activeFag to activeFaq
    };
    return (
        <>

            <main className="w-full font-sans overflow-x-hidden">
                {/* Hero Banner Section */}
                <header
                    className="relative text-white py-8 md:py-16 px-4 sm:px-6 lg:px-8"
                    style={{ background: "linear-gradient(to right, #4a8bbd, #f38a93)" }}
                >
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
                        {/* Text Content */}
                        <div className="w-full md:w-1/2 space-y-3 md:space-y-6 text-center md:text-left">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                                Join India&apos;s Leading Network
                            </h1>
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-yellow-300">
                                MannuBhai Quick Service Delivery Hub
                            </p>
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90">
                                150+ Quick Service Delivery Centers Across 100+ Cities Nationwide
                            </p>

                            {/* Stats Cards - Stacked on mobile */}
                            <div className="space-y-2 mt-3 md:mt-6">
                                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                    <span className="text-xl sm:text-2xl font-bold text-green-400">95%</span>
                                    <span className="text-xs sm:text-sm md:text-base">Year-on-Year ROI</span>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                    <span className="text-xl sm:text-2xl font-bold text-pink-300">
                                        3 Million+
                                    </span>
                                    <span className="text-xs sm:text-sm md:text-base">Satisfied Customers</span>
                                </div>
                            </div>
                        </div>

                        {/* Image - Centered on mobile */}
                        <div className="w-full md:w-1/2 flex justify-center mt-4 md:mt-0">
                            <div className="relative w-full max-w-md h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/franchies/map.webp"
                                    alt="MannuBhai service coverage across India"
                                    fill
                                    className="object-contain"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                    </div>
                </header>
                {/* About Us + Achievements */}
                <section
                    className="py-12 md:py-16 bg-gradient-to-br from-white to-indigo-50"
                    aria-labelledby="about-heading"
                >
                    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 md:gap-12">
                            <article className="lg:w-1/2 text-center md:text-left space-y-4 md:space-y-6">
                                <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-1.5 md:px-6 md:py-2 rounded-full text-sm font-bold mb-3 md:mb-4 shadow-lg">
                                    Who We Are
                                </div>

                                <h2 id="about-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                                    Redefining Service Excellence
                                </h2>

                                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                                    MannuBhai Service Expert is a technology-driven company,
                                    redefining service excellence through its innovative hybrid
                                    model. Leveraging advanced technology, we provide swift and
                                    seamless solutions in home appliance care, home care, and beauty
                                    care.
                                </p>

                                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                                    Our platform integrates intelligent systems to ensure precision,
                                    reliability, and exceptional customer experiences. Supported by
                                    a team of highly skilled professionals, we combine cutting-edge
                                    tools with human expertise to deliver unmatched service quality.
                                </p>


                            </article>

                            {/* Achievements */}
                            <aside
                                className="lg:w-1/2 bg-gradient-to-br from-indigo-700 to-purple-800 rounded-3xl p-6 md:p-8 shadow-2xl mt-8 lg:mt-0"
                                aria-labelledby="achievements-heading"
                            >
                                <h3 id="achievements-heading" className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center">
                                    Our Impact Across India
                                </h3>

                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    {[
                                        { value: "2.5 Million+", label: "Orders Completed" },
                                        { value: "3.62 Lakh+", label: "Happy Customers" },
                                        { value: "3000+", label: "Verified Partners" },
                                        { value: "PAN India", label: "Service Coverage" },
                                    ].map((stat, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white/10 backdrop-blur-sm p-4 md:p-5 rounded-2xl text-center border border-white/20"
                                            role="region"
                                            aria-label={`${stat.value} ${stat.label}`}
                                        >
                                            <div className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">
                                                {stat.value}
                                            </div>
                                            <div className="text-indigo-200 text-xs md:text-sm font-medium">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 md:mt-10 text-center">
                                    <div className="inline-flex items-center text-white/80 text-sm md:text-base">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 md:h-5 md:w-5 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span>Trusted by clients nationwide</span>
                                    </div>
                                    <p className="text-white mt-3 md:mt-4 text-base md:text-lg italic">
                                        &quot;Setting new standards in convenience and efficiency&quot;
                                    </p>
                                </div>
                            </aside>

                        </div>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 p-4 md:p-6 border border-gray-200 rounded-2xl bg-white shadow-md mt-5">
  {[
    {
      icon: "/franchies/time.png",
      title: "On time Service",
      desc: "Guaranteed punctuality",
    },
    {
      icon: "/franchies/rupees.png",
      title: "Transparent Price",
      desc: "No hidden fees",
    },
    {
      icon: "/franchies/professional.png",
      title: "Trained Professionals",
      desc: "Certified experts",
    },
    {
      icon: "/franchies/award.png",
      title: "Assured Quality",
      desc: "Performance guaranteed",
    },
  ].map((item, idx) => (
    <div
      key={idx}
      className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
      role="region"
      aria-label={item.title}
    >
      <div className="flex items-start space-x-3">
        <div className="bg-indigo-100 p-2 md:p-3 rounded-lg">
          <Image
            src={item.icon}
            alt={`${item.title} icon`}
            width={36}
            height={36}
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm md:text-base">
            {item.title}
          </h3>
          <p className="text-gray-600 text-xs md:text-sm mt-1">{item.desc}</p>
        </div>
      </div>
    </div>
  ))}
</div>


                    </div>
                </section>
                {/* Services We Provide */}
                <ServicesWeProvide />
                {/* Business Opportunity Section */}
                <section
                    className="py-14 md:py-20 bg-gradient-to-br from-indigo-50 to-purple-50"
                    aria-labelledby="opportunity-heading"
                >
                    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                        {/* Heading */}
                        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                            <h2
                                id="opportunity-heading"
                                className="text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-700 mb-4"
                            >
                                Invest in Quick Service Delivery Business 🚀
                            </h2>
                            <p className="text-gray-600 text-lg md:text-xl">
                                India’s fastest-growing industry with high returns and low risk.
                            </p>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            {/* Image */}
                            <div className="relative h-64 md:h-80 lg:h-[22rem] rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
                                <Image
                                    src="/franchies/industries-chart.webp"
                                    alt="Service industry growth chart"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Info Section */}
                            <div className="space-y-6 order-1 lg:order-2">
                                {/* Why Franchise */}
                                <article className="bg-white p-6 md:p-8 rounded-2xl shadow-xl transition hover:shadow-2xl">
                                    <h3 className="text-xl md:text-2xl font-bold text-indigo-700 mb-5">
                                        Why Choose Our Franchise?
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            "💰 Low Investment with High ROI",
                                            "📈 Quick Break-Even (6–8 months)",
                                            "📊 Monthly Profit: ₹1–2 Lakhs",
                                            "🎯 360° Marketing Support",
                                            "🚀 Massive Growth Opportunity",
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start text-gray-700 text-base">
                                                <div className="mr-3 mt-1 text-green-500">
                                                    <svg
                                                        className="h-5 w-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </article>

                                {/* Franchisee Benefits */}

                            </div>
                        </div>
                        <article className="bg-white/30 mt-2 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border border-white/20 text-white bg-gradient-to-br from-indigo-600 to-purple-600">
                            <h3 className="text-xl md:text-2xl font-bold mb-5">
                                🎁 Franchisee Benefits
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
                                {[
                                    "Exclusive Territory",
                                    "Training & Certification",
                                    "Marketing Support",
                                    "Technology Platform",
                                    "Operational Manuals",
                                    "Dedicated Manager",
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="bg-white/30 p-1.5 rounded-full mr-3">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-white"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </div>

                </section>

                {/* Industry Comparison Section */}
                <section className="py-8 sm:py-10 md:py-14 bg-[#faf9f6]" aria-labelledby="comparison-heading">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="p-4 sm:p-6 md:p-8">
                            <img
                                src="/franchies/profitable_franchise_chart.webp"
                                alt="Most Profitable Franchise Business Comparison"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    </div>
                </section>

                {/* Growth Timeline Section */}
                <section
                    className="py-10 sm:py-12 md:py-16 bg-white"
                    aria-labelledby="growth-heading"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center">
                        <h2
                            id="growth-heading"
                            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8"
                        >
                            India&apos;s Fastest Growing Local Service Provider
                            <br />
                            <span className="text-indigo-600">
                                Adding 10+ New Stores Every Month
                            </span>
                        </h2>

                        <div className="w-full overflow-x-auto">
                            <Image
                                src="/franchies/road-img.webp"
                                alt="MannuBhai franchise growth timeline showing expansion milestones"
                                width={1200}
                                height={400}
                                className="w-full h-auto max-w-none sm:max-w-full mx-auto"
                                priority
                            />
                        </div>
                    </div>
                </section>
                {/* Profit Section */}
                <ProfitSection />
                {/* Franchise Details */}
                <FranchiseeDetails />
                {/* FAQ Section */}
                <section
                    className="py-12 md:py-16 bg-gradient-to-br from-indigo-50 to-purple-50"
                    aria-labelledby="faq-heading"
                >
                    <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center gap-8 md:gap-12">
                        <div className="flex-shrink-0 w-full lg:w-1/3">
                            <Image
                                src="/franchies/Faq.webp"
                                alt="Frequently asked questions illustration"
                                width={400}
                                height={400}
                                className="w-56 md:w-72 mx-auto"
                            />
                        </div>

                        <div className="flex-1 w-full">
                            <div className="text-center lg:text-left mb-6 md:mb-8">
                                <h2 id="faq-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-700 mb-3 md:mb-4">
                                    Frequently Asked Questions
                                </h2>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Everything you need to know about our franchise opportunity
                                </p>
                            </div>

                            <div className="space-y-3 md:space-y-4">
                                {[
                                    {
                                        question: "What is Mannubhai track record?",
                                        answer: "Mannubhai has a proven track record of success with years of experience and a solid reputation."
                                    },
                                    {
                                        question: "Will I receive training?",
                                        answer: "We provide comprehensive training to ensure you are fully prepared."
                                    },
                                    {
                                        question: "Is Mannubhai a recognized brand?",
                                        answer: "Yes, we are a trusted brand known for reliability across India."
                                    },
                                    {
                                        question: "What financial returns can I expect?",
                                        answer: "Our franchisees enjoy exciting returns thanks to our efficient business model."
                                    },
                                    {
                                        question: "Can I offer different services?",
                                        answer: "Yes! You can diversify your service portfolio for multiple revenue streams."
                                    },
                                    {
                                        question: "How soon can I start earning?",
                                        answer: "You can start earning from day one with our established systems."
                                    }
                                ].map((faq, index) => (
                                    <article
                                        key={index}
                                        className={`bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md transition-all ${activeFaq === index ? 'border-indigo-300' : ''
                                            }`}
                                    >
                                        <h3>
                                            <button
                                                className="w-full p-4 md:p-5 flex justify-between items-center cursor-pointer"
                                                onClick={() => toggleFaq(index)}
                                                aria-expanded={activeFaq === index}
                                                aria-controls={`faq-answer-${index}`}
                                            >
                                                <span className={`font-medium text-sm md:text-base ${activeFaq === index ? 'text-indigo-700' : 'text-gray-900'} text-left`}>
                                                    {faq.question}
                                                </span>
                                                <svg
                                                    className={`w-5 h-5 transition-transform duration-300 ${activeFaq === index ? 'rotate-180 text-indigo-600' : 'text-gray-500'}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </h3>
                                        {activeFaq === index && (
                                            <div
                                                id={`faq-answer-${index}`}
                                                className="px-4 md:px-5 pb-4 md:pb-5 text-gray-600 text-sm md:text-base"
                                            >
                                                {faq.answer}
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                {/* Contact Section */}

                <section className="py-12 md:py-16 bg-white" id="franchise-form">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                        <FranchiseContactForm />
                    </div>
                </section>
            </main>

        </>

    );
};

export default LandingContent;