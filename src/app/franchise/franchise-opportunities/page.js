"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { memo } from "react";
import ServicesWeProvide from "./franchiesServices/page";
import FranchiseeDetails from "./franchiseeDetails/page";
import ProfitSection from "./profitSection/page";
import FranchiseContactForm from "./franchiseContactForm/page";
import Head from "./head";
import FranchiseFeedback from "./franchiesfeedback/page";

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
                                    30M+
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
                            <span className="relative z-10">Start Your Journey</span>
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

// Memoized About Section
const AboutSection = memo(() => {
    const features = useMemo(() => [
        {
            icon: "/franchies/time.webp",
            title: "On time Service",
            desc: "Guaranteed punctuality",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: "/franchies/rupees.webp",
            title: "Transparent Price",
            desc: "No hidden fees",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: "/franchies/professional.webp",
            title: "Trained Professionals",
            desc: "Certified experts",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: "/franchies/award.webp",
            title: "Assured Quality",
            desc: "Performance guaranteed",
            color: "from-orange-500 to-red-500"
        },
    ], []);

    const stats = useMemo(() => [
        { value: "2.5M+", label: "Orders Completed", color: "from-green-400 to-emerald-400" },
        { value: "30M+", label: "Happy Customers", color: "from-blue-400 to-cyan-400" },
        { value: "3000+", label: "Verified Partners", color: "from-purple-400 to-pink-400" },
        { value: "PAN India", label: "Service Coverage", color: "from-yellow-400 to-orange-400" },
    ], []);

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>
            
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 relative z-10">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 md:gap-16">
                    
                    <article className="lg:w-1/2 text-center md:text-left space-y-6 md:space-y-8">
                        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300">
                            <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                            Who We Are
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                            Redefining 
                            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Service Excellence
                            </span>
                        </h2>

                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p className="text-lg">
                                MannuBhai Service Expert is a technology-driven company,
                                redefining service excellence through its innovative hybrid
                                model. Leveraging advanced technology, we provide swift and
                                seamless solutions in home appliance care, home care, and beauty
                                care.
                            </p>

                            <p className="text-lg">
                                Our platform integrates intelligent systems to ensure precision,
                                reliability, and exceptional customer experiences. Supported by
                                a team of highly skilled professionals, we combine cutting-edge
                                tools with human expertise to deliver unmatched service quality.
                            </p>
                        </div>
                    </article>

                    <aside className="lg:w-1/2 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-black text-white mb-8 text-center">
                                <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                                    Our Impact Across India
                                </span>
                            </h3>

                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                                {stats.map((stat, idx) => (
                                    <div
                                        key={stat.label}
                                        className="group bg-white/10 backdrop-blur-sm p-6 rounded-2xl text-center border border-white/20 hover:bg-white/20 transition-all duration-300"
                                    >
                                        <div className={`text-2xl md:text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                            {stat.value}
                                        </div>
                                        <div className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 text-center">
                                <div className="inline-flex items-center text-white/90 text-lg mb-4">
                                    <svg className="h-6 w-6 mr-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-semibold">Trusted by clients nationwide</span>
                                </div>
                                <p className="text-white/90 text-xl italic font-medium">
                                    "Setting new standards in convenience and efficiency"
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-6 md:p-8 border border-gray-200 rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl mt-12 hover:shadow-2xl transition-all duration-300">
                    {features.map((item, idx) => (
                        <div
                            key={item.title}
                            className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`bg-gradient-to-br ${item.color} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <Image
                                        src={item.icon}
                                        alt={`${item.title} icon`}
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                        loading="lazy"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-xs md:text-sm">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});

// Memoized Business Opportunity Section
const BusinessOpportunitySection = memo(() => {
    const benefits = useMemo(() => [
        { icon: "💰", text: "Low Investment with High ROI", color: "from-green-500 to-emerald-500" },
        { icon: "📈", text: "Quick Break-Even (6–8 months)", color: "from-blue-500 to-cyan-500" },
        { icon: "📊", text: "Monthly Profit: ₹1–2 Lakhs", color: "from-purple-500 to-pink-500" },
        { icon: "🎯", text: "360° Marketing Support", color: "from-orange-500 to-red-500" },
        { icon: "🚀", text: "Massive Growth Opportunity", color: "from-indigo-500 to-purple-500" },
    ], []);

    const franchiseeBenefits = useMemo(() => [
        "Exclusive Territory",
        "Training & Certification", 
        "Marketing Support",
        "Technology Platform",
        "Operational Manuals",
        "Dedicated Manager",
    ], []);

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
            
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 relative z-10">
                {/* Heading */}
                <div className="text-center max-w-4xl mx-auto mb-16 md:mb-20">
                    <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-bold shadow-xl mb-6">
                        <span className="mr-2">🚀</span>
                        Investment Opportunity
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                        Invest in 
                        <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Quick Service Delivery
                        </span>
                        <span className="block text-gray-900">Business</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 font-medium">
                        India's fastest-growing industry with high returns and low risk.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Image */}
                    <div className="relative order-2 lg:order-1">
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
                        <div className="relative h-80 md:h-96 lg:h-[28rem] rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="/franchies/industries-chart.webp"
                                alt="Service industry growth chart"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-8 order-1 lg:order-2">
                        <article className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300">
                            <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                                Why Choose Our Franchise?
                            </h3>
                            <ul className="space-y-4">
                                {benefits.map((item, index) => (
                                    <li key={item.text} className="group flex items-center text-gray-700 text-lg">
                                        <div className={`mr-4 p-2 bg-gradient-to-r ${item.color} rounded-xl text-white font-bold group-hover:scale-110 transition-transform duration-300`}>
                                            {item.icon}
                                        </div>
                                        <span className="group-hover:text-gray-900 transition-colors font-medium">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </div>
                </div>

                {/* Franchisee Benefits */}
                <article className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/10 text-white mt-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.05)_0deg,rgba(255,255,255,0.1)_120deg,rgba(255,255,255,0.05)_240deg,rgba(255,255,255,0.1)_360deg)]"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-black mb-8 text-center">
                            <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                                🎁 Franchisee Benefits
                            </span>
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-lg">
                            {franchiseeBenefits.map((benefit, index) => (
                                <div key={benefit} className="group flex items-center">
                                    <div className="bg-white/20 p-2 rounded-full mr-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-white"
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
                                    <span className="font-medium group-hover:text-yellow-300 transition-colors duration-300">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
});

// Memoized FAQ Section
const FAQSection = memo(({ activeFaq, toggleFaq }) => {
    const faqs = useMemo(() => [
        {
            question: "What is Mannubhai track record?",
            answer: "Mannubhai has a proven track record of success with years of experience and a solid reputation in the service industry. We've successfully completed over 2.5 million orders and serve 30+ million satisfied customers across India."
        },
        {
            question: "Will I receive training?",
            answer: "Yes! We provide comprehensive training programs covering all aspects of the business - from technical skills to customer service, operations management, and business development. Our training ensures you're fully prepared to succeed."
        },
        {
            question: "Is Mannubhai a recognized brand?",
            answer: "Absolutely! We are a trusted and recognized brand known for reliability, quality service, and customer satisfaction across India. Our brand recognition helps franchisees attract customers from day one."
        },
        {
            question: "What financial returns can I expect?",
            answer: "Our franchisees typically see monthly profits of ₹1-2 lakhs with a quick break-even period of 6-8 months. With our proven business model and support system, you can expect strong and consistent returns on your investment."
        },
        {
            question: "Can I offer different services?",
            answer: "Yes! Our franchise model allows you to diversify your service portfolio across home appliance care, home care, and beauty care services. This diversification creates multiple revenue streams and reduces business risk."
        },
        {
            question: "How soon can I start earning?",
            answer: "You can start earning from day one! With our established systems, proven processes, technology platform, and immediate marketing support, franchisees typically start generating revenue within the first week of operations."
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
                                className={`group bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                                    activeFaq === index ? 'border-indigo-300 shadow-xl scale-[1.02]' : 'hover:scale-[1.01]'
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
                                        <span className={`font-bold text-base md:text-lg ${
                                            activeFaq === index 
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent' 
                                                : 'text-gray-900 group-hover:text-indigo-600'
                                        } transition-colors duration-300`}>
                                            {faq.question}
                                        </span>
                                        <div className={`ml-4 p-2 rounded-full transition-all duration-300 ${
                                            activeFaq === index 
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 rotate-180' 
                                                : 'bg-gray-100 group-hover:bg-indigo-100'
                                        }`}>
                                            <svg
                                                className={`w-5 h-5 transition-colors duration-300 ${
                                                    activeFaq === index ? 'text-white' : 'text-gray-600 group-hover:text-indigo-600'
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
                
                {/* Franchise Feedback */}
                <FranchiseFeedback />

                {/* Industry Comparison - Optimized */}
                <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                                Industry 
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Comparison
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600">See how we stack up against the competition</p>
                        </div>
                        
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-300">
                            <Image
                                src="/franchies/profitable_franchise_chart.webp"
                                alt="Most Profitable Franchise Business Comparison"
                                width={1200}
                                height={600}
                                className="w-full h-auto rounded-2xl hover:scale-[1.02] transition-transform duration-300"
                                loading="lazy"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                            />
                        </div>
                    </div>
                </section>

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
                                Our team is ready to guide you through every step of the journey.
                            </p>
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