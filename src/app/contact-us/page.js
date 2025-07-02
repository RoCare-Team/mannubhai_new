"use client";
import React from "react";
import Head from "next/head";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Us | Mannubhai Services</title>
        <meta name="description" content="Need help or have questions? Contact Mannubhai Services via email or chat support for quick resolution." />
        <meta name="robots" content="index, follow" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're here to help you with any questions or concerns. Choose your preferred way to reach us.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form Section */}
            <section className="lg:col-span-2" aria-labelledby="contact-heading">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">Send us a Message</h2>
                </div>

                <form className="space-y-6" method="post">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="full-name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        id="full-name"
                        name="full-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white/50 backdrop-blur-sm group-hover:border-gray-300"
                        required
                      />
                    </div>

                    <div className="group">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white/50 backdrop-blur-sm group-hover:border-gray-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex gap-3">
                      <select
                        name="country-code"
                        id="country-code"
                        className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white/50 backdrop-blur-sm group-hover:border-gray-300"
                        defaultValue="+91"
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
                        placeholder="Phone Number"
                        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white/50 backdrop-blur-sm group-hover:border-gray-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      placeholder="Tell us how we can help you..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 bg-white/50 backdrop-blur-sm group-hover:border-gray-300 resize-none"
                      required
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/25"
                    >
                      Send Message
                      <span className="ml-2">→</span>
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* Help & Info Cards Section */}
            <aside className="space-y-6" aria-label="Contact Information">
              <article className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">Need Instant Help?</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      Get immediate assistance through our AI-powered chat support. Available 24/7 for quick resolutions.
                    </p>
                    <a
                      href="/helpCenter"
                      className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-purple-600 transition-colors duration-200"
                    >
                      Open Help Center
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>

              <article className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">Email Support</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      Not satisfied with chat support? Send us a detailed email and we'll respond within 24-48 hours.
                    </p>
                    <a
                      href="mailto:info@mannubhai.com"
                      className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-purple-600 transition-colors duration-200"
                    >
                      info@mannubhai.com
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
              <article className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-blue-800 mb-2">Why No Phone Support?</h3>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      We've evolved to chat-based support for faster, more efficient help. Our smart chat system resolves issues instantly with full conversation history.
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