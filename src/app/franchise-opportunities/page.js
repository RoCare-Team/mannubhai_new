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

    const inaugurationEvents = [
        // ... (same as before)
        // Assuming your inaugurationEvents array was complete in the original code,
        // if there are apostrophes inside the strings here, they would also need escaping.
        // Example:
        // { city: "Mumbai", image: "/path/to/img.webp", guestName: "John Doe", guestDesc: "Mayor of Mumbai" },
        // If guestDesc was "Mayor's Office", it would be "Mayor&apos;s Office"
    ];

    return (
        <main className="w-full font-sans overflow-x-hidden">
            {/* Hero Banner Section */}
            <header
                className="relative text-white py-12 md:py-16 px-4 md:px-8 lg:px-16"
                style={{ background: "linear-gradient(to right, #4a8bbd, #f38a93)" }}
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mt-6 md:mt-10">
                    <div className="md:w-1/2 space-y-4 md:space-y-6 text-center md:text-left animate-fadeIn">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                            Join India&apos;s Leading Network
                        </h1>
                        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-300">
                            MannuBhai Quick Service Delivery Hub
                        </p>
                        <p className="text-base md:text-lg lg:text-xl opacity-90">
                            150+ Quick Service Delivery Centers Across 100+ Cities Nationwide
                        </p>
                        <div className="space-y-3 mt-4 md:mt-6">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 bg-white/10 p-3 md:p-4 rounded-xl backdrop-blur-sm">
                                <span className="text-xl md:text-2xl font-bold text-green-400">95%</span>
                                <span className="text-sm md:text-base">Year-on-Year Return on Investment (ROI)</span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 bg-white/10 p-3 md:p-4 rounded-xl backdrop-blur-sm">
                                <span className="text-xl md:text-2xl font-bold text-pink-300">
                                    3 Million+
                                </span>
                                <span className="text-sm md:text-base">Satisfied Customers</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
                        <div className="relative w-full h-56 md:h-64 lg:h-80 xl:h-96 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                            <Image
                                src="/franchies/map.webp"
                                alt="MannuBhai service coverage across India showing 100+ cities"
                                fill
                                className="object-contain mt-2 md:mt-5"
                                priority
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
            <section
                className="py-12 md:py-16 bg-[#faf9f6]"
                aria-labelledby="comparison-heading"
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 bg-white rounded-xl shadow p-5 md:p-8">
                    <h2 id="comparison-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-12 leading-relaxed">
                        Why <strong>Home Appliance Service, Home Care, Beauty Care</strong> and <strong>Handyman Service</strong> Are India&apos;s <span className="text-indigo-700">Most Profitable Franchise Business?</span>
                    </h2>

                    <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                        <table className="min-w-full text-center border-collapse">
                            <caption className="sr-only">Comparison of service business attributes</caption>
                            <thead className="bg-white text-gray-900 text-sm md:text-base font-bold border-b border-gray-200">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left">Attributes</th>
                                    <th scope="col" className="px-4 py-3">Appliance Service</th>
                                    <th scope="col" className="px-4 py-3">Home Care</th>
                                    <th scope="col" className="px-4 py-3">Beauty Care</th>
                                    <th scope="col" className="px-4 py-3">Handyman Service</th>
                                    <th scope="col" className="px-4 py-3">Food</th>
                                    <th scope="col" className="px-4 py-3">Gym</th>
                                    <th scope="col" className="px-4 py-3">Retail</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm md:text-base font-medium text-gray-800">
                                {[
                                    ["Recession Proof", ["✅", "✅", "✅", "✅", "❌", "❌", "✅"]],
                                    ["Easy Setup", ["✅", "✅", "✅", "✅", "❌", "❌", "❌"]],
                                    ["Recurring Revenue", ["✅", "✅", "✅", "✅", "✅", "❌", "❌"]],
                                    ["High Retention", ["✅", "✅", "✅", "✅", "❌", "❌", "❌"]],
                                    ["High Margins", ["✅", "✅", "✅", "✅", "❌", "❌", "❌"]],
                                ].map(([attribute, values], index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                                    >
                                        <th scope="row" className="px-4 py-3 text-left font-bold text-gray-900 whitespace-normal">
                                            {attribute}
                                        </th>
                                        {values.map((value, idx) => (
                                            <td key={idx} className="px-4 py-3">
                                                <div
                                                    className={`inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full ${
                                                        value === "✅"
                                                            ? "bg-lime-400 text-white"
                                                            : "bg-red-400 text-white"
                                                    }`}
                                                    aria-label={value === "✅" ? "Yes" : "No"}
                                                >
                                                    {value === "✅" ? "✓" : "✕"}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-center mt-4 text-sm md:text-base">These Local Service businesses offer high growth with High ROI, Low Risk and Zero Hassles.</p>
                </div>
            </section>

            {/* Growth Timeline Section */}
            <section
                className="py-12 md:py-16 bg-white"
                aria-labelledby="growth-heading"
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <h2 id="growth-heading" className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
                        India&apos;s Fastest Growing Local Service Provider<br />
                        <span className="text-indigo-600">Adding 10+ New Stores Every Month</span>
                    </h2>
                    <div className="relative overflow-x-auto">
                        <Image
                            src="/franchies/road-img.webp"
                            alt="MannuBhai franchise growth timeline showing expansion milestones"
                            width={1200}
                            height={400}
                            className="min-w-[800px] md:min-w-full mx-auto"
                        />
                    </div>
                </div>
            </section>

            {/* Profit Section */}
            <ProfitSection />

            {/* Inauguration Gallery */}
            <section
                className="py-12 md:py-16 bg-white"
                aria-labelledby="inauguration-heading"
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                    <div className="mb-12 md:mb-16">
                        <h2 id="inauguration-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-indigo-700 mb-6 md:mb-8">
                            Check our Inauguration
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                            {inaugurationEvents.map((event, i) => (
                                <article key={i} className="text-center bg-gray-50 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                                    <h3 className="text-lg md:text-xl font-bold mb-2">{event.city}</h3>
                                    <div className="relative h-40 md:h-48 rounded-xl overflow-hidden shadow-md mb-2">
                                        <Image
                                            src={event.image}
                                            alt={`Inauguration event in ${event.city} with ${event.guestName}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <p className="font-semibold text-sm md:text-base">
                                        Chief Guest: <span className="text-black font-bold">{event.guestName}</span>
                                    </p>
                                    <p className="text-gray-600 text-xs md:text-sm">{event.guestDesc}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6 md:mb-8">
                            Check our New Onboarding Franchise
                        </h3>
                        <Testimonials />
                    </div>
                </div>
            </section>

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