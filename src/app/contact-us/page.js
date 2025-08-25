"use client";
import React, { useState } from "react";
import Head from "next/head";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../app/firebaseConfig";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,11}$/;
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = "Name should only contain letters and spaces";
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-11 digit phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 11) return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    if (submitSuccess) {
      setSubmitSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "enquireOptions"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: "new",
        ipAddress: "",
        userAgent: navigator.userAgent
      });

      setSubmitSuccess(true);
      
      setFormData({
        name: "",
        email: "",
        countryCode: "+91",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form: ", error);
      setErrors({
        submit: "An error occurred. Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | Mannubhai Services</title>
        <meta name="description" content="Need help or have questions? Contact Mannubhai Services via email, phone, or chat support for quick resolution." />
        <meta name="robots" content="index, follow" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                Get in Touch
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We're here to help you with any questions or concerns. Choose your preferred way to reach us and experience exceptional support.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Contact Form Section */}
            <section className="lg:col-span-8" aria-labelledby="contact-heading">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8 lg:p-10 hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-3 h-10 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full shadow-lg"></div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Send us a Message</h2>
                </div>

                {submitSuccess && (
                  <div className="mb-8 p-4 sm:p-5 bg-green-50 border border-green-200 rounded-2xl animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-green-800 font-semibold">Your enquiry has been sent successfully! We'll get back to you soon.</p>
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <div className="mb-8 p-4 sm:p-5 bg-red-50 border border-red-200 rounded-2xl animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-red-800 font-semibold">{errors.submit}</p>
                    </div>
                  </div>
                )}

                <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-3">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        className={`w-full border-2 ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'} rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/60 backdrop-blur-sm group-hover:border-gray-300 text-gray-800 placeholder-gray-500`}
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      {errors.name && <p className="mt-2 text-sm text-red-600 font-medium">{errors.name}</p>}
                    </div>

                    <div className="group">
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        className={`w-full border-2 ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'} rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/60 backdrop-blur-sm group-hover:border-gray-300 text-gray-800 placeholder-gray-500`}
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      {errors.email && <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-3">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <select
                        name="countryCode"
                        id="countryCode"
                        className="border-2 border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/60 backdrop-blur-sm group-hover:border-gray-300 text-gray-800"
                        value={formData.countryCode}
                        onChange={handleChange}
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+86">🇨🇳 +86</option>
                      </select>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Phone Number (10-11 digits)"
                        className={`flex-1 border-2 ${errors.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'} rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/60 backdrop-blur-sm group-hover:border-gray-300 text-gray-800 placeholder-gray-500`}
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    {errors.phone && <p className="mt-2 text-sm text-red-600 font-medium">{errors.phone}</p>}
                  </div>

                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-3">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      placeholder="Tell us how we can help you..."
                      className={`w-full border-2 ${errors.message ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'} rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/60 backdrop-blur-sm group-hover:border-gray-300 resize-none text-gray-800 placeholder-gray-500`}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                    {errors.message && <p className="mt-2 text-sm text-red-600 font-medium">{errors.message}</p>}
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-10 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${isSubmitting ? 'opacity-70 cursor-not-allowed transform-none' : ''}`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Message...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Send Message
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* Contact Information Sidebar */}
            <aside className="lg:col-span-4 space-y-6" aria-label="Contact Information">
              {/* Office Address */}
              <article className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 mb-3 text-lg">Head Office</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      Unit No.831 8th Floor, JMD MEGAPOLIS, Sector 48, Gurugram, Haryana 122018
                    </p>
                    <a
                      href="https://maps.google.com/?q=Unit+No.831+8th+Floor,+JMD+MEGAPOLIS,+Sector+48,+Gurugram,+Haryana+122018"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-purple-600 transition-colors duration-200"
                    >
                      View on Map
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>

              {/* Phone Support */}
              <article className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 mb-3 text-lg">Phone Support</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      Call us directly for immediate assistance with your queries and concerns.
                    </p>
                    <a
                      href="tel:+917065012902"
                      className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-purple-600 transition-colors duration-200"
                    >
                      +91 7065012902
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>

              {/* Email Support */}
              <article className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 mb-3 text-lg">Email Support</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Not satisfied with chat support? Send us a detailed email and we'll respond within 24-48 hours.
                    </p>
                    <a
                      href="mailto:info@mannubhai.com"
                      className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-purple-600 transition-colors duration-200 break-all"
                    >info@mannubhai.com
                      <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>

              {/* Chat Support */}
              <article className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-3 text-lg">Need Instant Help?</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      Get immediate assistance through our AI-powered chat support. Available 24/7 for quick resolutions.
                    </p>
                    <a
                      href="/helpCenter"
                      className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-purple-600 transition-colors duration-200"
                    >
                      Open Help Center
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>

              {/* Why Choose Digital Support */}
              <article className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200/50 rounded-3xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-blue-800 mb-3 text-lg">Digital-First Support</h3>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      We've evolved to provide faster, more efficient help through digital channels. Get instant responses with full conversation history and seamless follow-ups.
                    </p>
                  </div>
                </div>
              </article>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}