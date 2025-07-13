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
        <main className="w-full font-sans overflow-x-hidden">
            {/* Hero Banner Section */}
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-2 md:pt-4">
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
                                        className="bg-white p-3 md:p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                                        role="region"
                                        aria-label={item.title}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-indigo-100 p-1.5 md:p-2 rounded-lg">
                                                <Image
                                                    src={item.icon}
                                                    alt={`${item.title} icon`}
                                                    width={32}
                                                    height={32}
                                                    className="object-contain"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm md:text-base">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-600 text-xs md:text-sm mt-1">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                </div>
            </section>

            {/* Services We Provide */}
            <ServicesWeProvide />

            {/* Business Opportunity Section */}
            <section
                className="py-12 md:py-16 bg-gradient-to-br from-indigo-50 to-purple-50"
                aria-labelledby="opportunity-heading"
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                    <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
                        <h2 id="opportunity-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-700 mb-3 md:mb-4">
                            Invest in Quick Service Delivery Business
                        </h2>
                        <p className="text-gray-600 text-base md:text-lg">
                            Indias fastest-growing industry with high returns
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="relative h-56 md:h-64 lg:h-80 rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1">
                            <Image
                                src="/franchies/industries-chart.webp"
                                alt="Growth chart of service industry in India showing upward trend"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
                            <article className="bg-white p-5 md:p-6 rounded-2xl shadow-md">
                                <h3 className="text-lg md:text-xl font-bold text-indigo-700 mb-3 md:mb-4">
                                    Why Choose Our Franchise?
                                </h3>
                                <ul className="space-y-2 md:space-y-3">
                                    {[
                                        "Low Investment with High ROI",
                                        "Quick Break-Even (6-8 months)",
                                        "Monthly Profit: ₹1-2 Lakhs",
                                        "360° Marketing Support",
                                        "Massive Growth Opportunity",
                                      
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className="bg-green-100 p-1 rounded-full mr-2 md:mr-3 mt-0.5">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 md:h-5 md:w-5 text-green-600"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <span className="text-gray-700 text-sm md:text-base">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>

                            <article className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 md:p-6 rounded-2xl shadow-lg">
                                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Franchisee Benefits</h3>
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    {[
                                        "Exclusive Territory",
                                        "Training & Certification",
                                        "Marketing Support",
                                        "Technology Platform",
                                        "Operational Manuals",
                                        "Dedicated Manager",
                                    ].map((benefit, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="bg-white/20 p-1 rounded-full mr-2">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3 md:h-4 md:w-4"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <span className="text-xs md:text-sm">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            {/* Industry Comparison Section */}
                   <section className="py-8 sm:py-10 md:py-14 bg-[#faf9f6]" aria-labelledby="comparison-heading">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
      <h2 id="comparison-heading" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-6 sm:mb-8 md:mb-10">
        Why <span className="text-indigo-700">Home Appliance Service</span>, <span className="text-indigo-700">Home Care</span>, <span className="text-indigo-700">Beauty Care</span> and <span className="text-indigo-700">Handyman Service</span> Are India's Most Profitable Franchise Business?
      </h2>

      {/* Desktop/Tablet View (Table) */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <caption className="sr-only">Comparison of service business attributes</caption>
            <thead>
              <tr className="border-b border-gray-200">
                <th scope="col" className="px-3 py-3 text-left text-sm md:text-base font-semibold text-gray-900 min-w-[120px]">Attributes</th>
                {['Appliance', 'Home Care', 'Beauty Care', 'Handyman', 'Food', 'Gym', 'Retail'].map((service, i) => (
                  <th key={i} scope="col" className="px-2 py-3 text-center text-xs sm:text-sm md:text-base font-semibold text-gray-900 whitespace-nowrap">
                    {service}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                ['Recession Proof', ['✅', '✅', '✅', '✅', '❌', '❌', '✅']],
                ['Easy Setup', ['✅', '✅', '✅', '✅', '❌', '❌', '❌']],
                ['Recurring Revenue', ['✅', '✅', '✅', '✅', '✅', '❌', '❌']],
                ['High Retention', ['✅', '✅', '✅', '✅', '❌', '❌', '❌']],
                ['High Margins', ['✅', '✅', '✅', '✅', '❌', '❌', '❌']],
              ].map(([attribute, values], i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <th scope="row" className="px-3 py-3 text-left text-xs sm:text-sm md:text-base font-medium text-gray-900">
                    {attribute}
                  </th>
                  {values.map((value, j) => (
                    <td key={j} className="px-2 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full ${value === '✅' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {value === '✅' ? '✓' : '✕'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View (Cards) */}
      <div className="sm:hidden space-y-4">
        {[
          ['Recession Proof', ['Appliance', 'Home Care', 'Beauty Care', 'Handyman', 'Retail']],
          ['Easy Setup', ['Appliance', 'Home Care', 'Beauty Care', 'Handyman']],
          ['Recurring Revenue', ['Appliance', 'Home Care', 'Beauty Care', 'Handyman', 'Food']],
          ['High Retention', ['Appliance', 'Home Care', 'Beauty Care', 'Handyman']],
          ['High Margins', ['Appliance', 'Home Care', 'Beauty Care', 'Handyman']],
        ].map(([attribute, services], i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
            <h3 className="font-medium text-gray-900 mb-3">{attribute}</h3>
            <div className="flex flex-wrap gap-2">
              {services.map((service, j) => (
                <span key={j} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {service}
                </span>
              ))}
              {['Food', 'Gym', 'Retail'].filter(s => !services.includes(s)).map((service, j) => (
                <span key={`na-${j}`} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {service}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center mt-6 text-sm sm:text-base text-gray-600">
        These Local Service businesses offer high growth with High ROI, Low Risk and Zero Hassles.
      </p>
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
                                    className={`bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md transition-all ${
                                        activeFaq === index ? 'border-indigo-300' : ''
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
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                    <FranchiseContactForm />
                </div>
            </section>
        </main>
    );
};

export default LandingContent;