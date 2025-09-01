"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { memo } from "react";
import ServicesWeProvide from "../franchise-opportunities/components/franchiesServices";
import FranchiseeDetails from "../franchise-opportunities/components/franchiseeDetails";
import ProfitSection from "../franchise-opportunities/components/profitSection";
import FranchiseContactForm from "../franchise-opportunities/components/franchiseContactForm";
import Head from "./head";
import FranchiseFeedback from "./components/franchiesfeedback";
import AboutSection from "./components/AboutSection";
import BusinessOpportunitySection from "./components/BusinessOpportunitySection";
import MannuBhaiFranchise from "./components/MannuBhaiFranchise";
// Memoized components for better performance
const HeroSection = memo(() => (
    <header className="relative min-h-screen overflow-hidden">
        {/* Optimized Background with reduced complexity */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>

            {/* Reduced animated elements for better performance */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-32 right-16 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl animate-bounce"></div>

            {/* Simplified grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                {/* Content Section */}
                <div className="text-white space-y-6 lg:space-y-8 text-center lg:text-left order-1">

                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-xl">
                        <span className="relative flex h-3 w-3 mr-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            India's #1 Quick Service Network
                        </span>
                    </div>

                    {/* Heading */}
                    <div className="space-y-4">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                            <span className="block text-white mb-2">Join India's</span>
                            <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                                Leading Network
                            </span>
                        </h1>

                        <div className="space-y-2">
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                MannuBhai Quick Service
                            </p>
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                Delivery Hub
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        <span className="font-semibold text-white">150+</span> Quick Service Delivery Centers Across
                        <span className="font-semibold text-white"> 100+</span> Cities Nationwide
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
                        <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <div className="text-center">
                                <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                                    95%
                                </div>
                                <div className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                    Year-on-Year ROI
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <div className="text-center">
                                <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                    3M+
                                </div>
                                <div className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                    Satisfied Customers
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4">
                        <button
                            onClick={() => document.getElementById('franchise-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-lg text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                            type="button"
                            aria-label="Navigate to franchise form"
                        >
                            <span className="relative z-10">Apply Now</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </button>
                    </div>
                </div>

                {/* Image Section - Optimized */}
                <div className="order-2 flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
                        {/* Reduced decorative layers */}
                        <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>

                        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-white/20 to-white/5">
                                <Image
                                    src="/franchies/map.webp"
                                    alt="MannuBhai service coverage across India"
                                    fill
                                    className="object-contain p-4 hover:scale-105 transition-transform duration-300"
                                    priority
                                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 40vw"
                                />

                                {/* Floating Stats */}
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                    <span className="flex items-center">
                                        <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                                        100+ Cities
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                    <span className="flex items-center">
                                        <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                                        150+ Centers
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80">
            <div className="flex flex-col items-center space-y-2 animate-bounce">
                <span className="text-sm font-medium">Discover More</span>
                <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
                </div>
            </div>
        </div>
    </header>
));


const FAQSection = memo(({ activeFaq, toggleFaq }) => {
    const faqs = useMemo(() => [
        {
            question: "What makes MannuBhai one of the best low investment franchise opportunities in India with high returns?",
            answer: "Because you can start with just ₹10–15 lakhs, earn ₹1–2 lakhs monthly, and enjoy up to 95% ROI."
        },
        {
            question: "How fast can I break even?",
            answer: "MannuBhai offers quick break-even franchise opportunities in India, with most partners recovering investment in 3–8 months."
        },
        {
            question: "Is this a profitable franchise business with low risk?",
            answer: "Yes. Services like appliance repair, beauty at home, and handyman work have steady demand, making it a low-risk, high-profit franchise."
        },
        {
            question: "What industries can I serve with this franchise?",
            answer: "You can cover home appliance repair, beauty & salon at home, handyman, home care, and doorstep services—all high-demand categories."
        },
        {
            question: "What support will I receive?",
            answer: "We provide training, 360° marketing, operational manuals, a dedicated franchise manager, and a technology-driven platform."
        },
        {
            question: "Do I get exclusive territory rights?",
            answer: "Yes, every partner gets exclusive franchise opportunities with territory rights in their city or region."
        },
        {
            question: "Is it suitable for Tier 2 and Tier 3 cities?",
            answer: "Absolutely. Low investment franchise opportunities in Tier 2 and Tier 3 cities are growing fast, with huge demand for home services."
        },
        {
            question: "Which are the best cities to start?",
            answer: "Top cities include Delhi NCR, Gurgaon, Noida, Bangalore, plus pan-India franchise opportunities in the service sector."
        },
        {
            question: "I'm a first-time entrepreneur. Can I do this?",
            answer: "Yes, MannuBhai is ideal for beginners. It's a top franchise for entrepreneurs with small capital, backed by full support."
        },
        {
            question: "How is MannuBhai different from others?",
            answer: "We run a hybrid service delivery franchise model in India, combining skilled professionals, doorstep services, and advanced technology."
        }
    ], []);

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_50%)]"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center gap-12 md:gap-16 relative z-10">

                {/* FAQ Image */}
                <div className="flex-shrink-0 w-full lg:w-1/3 hidden lg:block">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                            <Image
                                src="/franchies/Faq.webp"
                                alt="Frequently asked questions illustration"
                                width={400}
                                height={400}
                                className="w-full mx-auto hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                                quality={80}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full">
                    <div className="text-center lg:text-left mb-8 md:mb-12">
                        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-bold shadow-xl mb-6">
                            <span className="mr-2">❓</span>
                            FAQ
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                            Frequently Asked
                            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Questions
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600">
                            Everything you need to know about our franchise opportunity
                        </p>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        {faqs.map((faq, index) => (
                            <article
                                key={faq.question}
                                className={`group bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${activeFaq === index ? 'border-indigo-300 shadow-xl scale-[1.02]' : 'hover:scale-[1.01]'
                                    }`}
                            >
                                <h3>
                                    <button
                                        className="w-full p-6 md:p-7 flex justify-between items-center cursor-pointer text-left"
                                        onClick={() => toggleFaq(index)}
                                        aria-expanded={activeFaq === index}
                                        aria-controls={`faq-answer-${index}`}
                                        type="button"
                                    >
                                        <span className={`font-bold text-base md:text-lg ${activeFaq === index
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
                                            : 'text-gray-900 group-hover:text-indigo-600'
                                            } transition-colors duration-300`}>
                                            {faq.question}
                                        </span>
                                        <div className={`ml-4 p-2 rounded-full transition-all duration-300 ${activeFaq === index
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 rotate-180'
                                            : 'bg-gray-100 group-hover:bg-indigo-100'
                                            }`}>
                                            <svg
                                                className={`w-5 h-5 transition-colors duration-300 ${activeFaq === index ? 'text-white' : 'text-gray-600 group-hover:text-indigo-600'
                                                    }`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>
                                </h3>
                                {activeFaq === index && (
                                    <div
                                        id={`faq-answer-${index}`}
                                        className="px-6 md:px-7 pb-6 md:pb-7 text-gray-700 text-base md:text-lg leading-relaxed animate-fade-in"
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
    );
});


<BusinessOpportunitySection />
// Main Component
const LandingContent = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleFaq = useCallback((index) => {
        setActiveFaq(activeFaq === index ? null : index);
    }, [activeFaq]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        // Throttle scroll events for better performance
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        return () => window.removeEventListener('scroll', throttledScroll);
    }, []);

    return (
        <>
            <Head />
            <main className="w-full font-sans overflow-x-hidden">
                <HeroSection />
                <AboutSection />

                {/* Services Section */}
                <ServicesWeProvide />

                <BusinessOpportunitySection />
                <MannuBhaiFranchise />
                {/* Franchise Feedback */}
                <FranchiseFeedback />
                {/* Growth Timeline - Optimized */}
                <section className="py-16 md:py-20 bg-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(59,130,246,0.03)_25%,transparent_25%),linear-gradient(-45deg,rgba(59,130,246,0.03)_25%,transparent_25%)] bg-[size:40px_40px]"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center relative z-10">
                        <div className="mb-12 md:mb-16">
                            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-bold shadow-xl mb-6">
                                <span className="mr-2">📈</span>
                                Growth Story
                            </div>

                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                                India's Fastest Growing
                                <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Local Service Provider
                                </span>
                            </h2>
                            <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                Adding 10+ New Stores Every Month
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-300">
                            <div className="w-full overflow-x-auto">
                                <Image
                                    src="/franchies/road-img.webp"
                                    alt="MannuBhai franchise growth timeline showing expansion milestones"
                                    width={2400}
                                    height={800}
                                    className="w-full h-auto mx-auto max-w-[100%] sm:max-w-screen-lg hover:scale-[1.02] transition-transform duration-300"
                                    loading="lazy"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 2400px"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Profit Section */}
                <ProfitSection />

                {/* Franchise Details */}
                <FranchiseeDetails />

                {/* FAQ Section */}
                <FAQSection activeFaq={activeFaq} toggleFaq={toggleFaq} />

                {/* Contact Section - Optimized */}
                <section className="py-16 md:py-24 bg-gradient-to-br from-white via-gray-50 to-indigo-50 relative overflow-hidden" id="franchise-form">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

                    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 relative z-10">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                                Ready to Join Our
                                <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Success Story?
                                </span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                                Take the first step towards building your successful franchise business.
                                Our team is ready to guide you through every step of the journey. </p>
                            
                              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"> Apply now at MannuBhai Franchise Opportunities
                                 and become part of the fastest-growing service franchise in India.</p>
                          
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300">
                            <FranchiseContactForm />
                        </div>
                    </div>
                </section>
            </main>

            {/* Optimized CSS - Critical styles inlined, non-critical deferred */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }

                /* Reduce animation complexity on mobile */
                @media (max-width: 768px) {
                    .animate-bounce,
                    .animate-pulse {
                        animation-duration: 2s;
                    }
                }

                /* Performance optimizations */
                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                /* Improve scroll performance */
                * {
                    scroll-behavior: smooth;
                }

                /* Reduce motion for users who prefer it */
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>
        </>
    );
};

// Set display names for better debugging
HeroSection.displayName = 'HeroSection';
AboutSection.displayName = 'AboutSection';
BusinessOpportunitySection.displayName = 'BusinessOpportunitySection';
FAQSection.displayName = 'FAQSection';

export default LandingContent;