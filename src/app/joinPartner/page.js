"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ApplicationForm from '@/components/ApplicationForm';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const services = {
  appliances: {
    title: 'Appliance Repair Jobs',
    subtitle: 'Join as a skilled appliance technician and earn daily',
    icon: '🔧',
    gradient: 'from-blue-600 to-blue-700',
    color: 'blue',
    skills: [
      'Water purifier', 'Air purifier', 'Fridge', 'Washing Machine',
      'Microwave', 'Kitchen Chimney', 'LED TV', 'Vacuum Cleaner', 'Geyser'
    ],
    benefits: [
      'Daily service requests',
      'Weekly payments',
      'App-based job management',
      'Verified customers',
      'Flexible working hours'
    ]
  },
  beauty: {
    title: 'Beauty Services',
    subtitle: 'Build your beauty service career',
    icon: '💄',
    gradient: 'from-pink-600 to-pink-700',
    color: 'pink',
    skills: [
      'Women Salon', 'Men Salon', 'Makeup Service',
      'Spa Services', 'Men Massage', 'Hair Studio',
      'Manicure & Pedicure'
    ],
    benefits: [
      'Daily bookings',
      'Weekly payments',
      'Verified customers',
      'No shop rental needed',
      'Build your brand'
    ]
  },
  cleaning: {
    title: 'Cleaning Services',
    subtitle: 'Earn more with cleaning services',
    icon: '🧽',
    gradient: 'from-green-600 to-green-700',
    color: 'green',
    skills: [
      'Sofa cleaning', 'Bathroom cleaning', 'Home deep cleaning',
      'Kitchen cleaning', 'Pest control', 'Tank cleaning'
    ],
    benefits: [
      'Local area jobs',
      'Weekly payouts',
      'Safe customers',
      'Flexible schedule',
      'No commissions'
    ]
  },
  handyman: {
    title: 'Handyman Services',
    subtitle: 'Skilled construction work opportunities',
    icon: '🔨',
    gradient: 'from-orange-600 to-orange-700',
    color: 'orange',
    skills: [
      'Painter', 'Plumber', 'Carpenter', 'Electrician', 'Masons'
    ],
    benefits: [
      'Daily job leads',
      'Timely payments',
      'Verified customers',
      'Flexible timings',
      'Reputation building'
    ]
  }
};

const MannuBhaiServices = () => {
  const [activeTab, setActiveTab] = useState('appliances');
  const [showForm, setShowForm] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleWhatsappJoin = () => {
    const message = encodeURIComponent("I'm interested in joining Mannu Bhai Services as a professional. Please provide more details.");
    window.open(`https://wa.me/919461900848?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden min-h-screen flex items-center text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 w-full py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-8">
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
                    <span className="text-white drop-shadow-md">
                      Your Path to a {' '}
                      <span className="bg-gradient-to-r from-teal-300 to-lime-300 bg-clip-text text-transparent">
                        Brighter Future
                      </span>
                    </span>
                    <br />
                    <span className="text-xl sm:text-2xl text-gray-200 font-normal block mt-4">
                      Join Our Team of Skilled Professionals.
                    </span>
                  </h1>
                </div>

                <div className="bg-white rounded-3xl p-8 text-gray-900 shadow-2xl backdrop-blur-sm bg-opacity-90 transition-all duration-500 hover:shadow-4xl animate-fade-in-right">
                  <p className="text-lg sm:text-xl font-bold mb-6 text-center">
                    <span className="text-green-500">🟢</span> Join us on WhatsApp!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <button
                      onClick={handleWhatsappJoin}
                      className="bg-green-500 text-white hover:bg-green-600 px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 min-w-[120px]">
                      Join on WhatsApp
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="text-center text-white/80">
                  <p className="mb-4">Or apply through our detailed form</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className={`group bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 mx-auto animate-fade-in-up delay-300`}
                  >
                    <span>{services[activeTab].icon}</span>
                    Apply for {services[activeTab].title}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {isClient && (
                <div className="relative hidden lg:block animate-fade-in-left">
                  <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="/HomeBanner/partner.webp"
                      alt="Mannu Bhai Services - Your trusted partner"
                      className="w-full h-auto object-cover"
                      width={600}
                      height={400}
                      priority
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Service Tabs */}
      <section className="py-6 bg-white/70 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {Object.entries(services).map(([key, service]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`group px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeTab === key
                    ? `bg-gradient-to-r ${service.gradient} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                }`}
              >
                <span className="text-xl mr-2 group-hover:scale-110 transition-transform inline-block">
                  {service.icon}
                </span>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-6 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg mb-6">
              <span className="text-7xl">{services[activeTab].icon}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {services[activeTab].title}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              {services[activeTab].subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-gray-200">
              <div className="flex items-center mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${services[activeTab].gradient} text-white mr-4`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Choose Your Skill</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {services[activeTab].skills.map((skill, index) => (
                  <div key={index} className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm">
                    <div className={`w-3 h-3 bg-gradient-to-r ${services[activeTab].gradient} rounded-full mr-3 shadow-sm`}></div>
                    <span className="text-gray-700 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-gray-200">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Why Join Us?</h3>
              </div>
              <div className="space-y-4">
                {services[activeTab].benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center group/item">
                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-full p-2 mr-4 shadow-sm group-hover/item:scale-110 transition-transform">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium group-hover/item:text-gray-800 transition-colors">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className={`group bg-gradient-to-r ${services[activeTab].gradient} hover:shadow-lg text-white px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center gap-3 mx-auto`}
            >
              Apply for {services[activeTab].title}
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">
            How to Get Started?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Apply', desc: 'Fill the application form', icon: '📝', color: 'blue' },
              { step: 2, title: 'Verify', desc: 'We verify your documents', icon: '✅', color: 'green' },
              { step: 3, title: 'Download', desc: 'Get our partner app', icon: '📱', color: 'purple' },
              { step: 4, title: 'Earn', desc: 'Start accepting jobs', icon: '💰', color: 'orange' }
            ].map((item, index) => (
              <div key={index} className="group relative text-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200">
                  <div className={`inline-block p-4 rounded-xl bg-gradient-to-r from-${item.color}-100 to-${item.color}-200 mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-4xl">{item.icon}</span>
                  </div>
                  <div className={`inline-block w-8 h-8 bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white rounded-full font-bold mb-4 flex items-center justify-center text-sm`}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-gray-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '3000+', label: 'Active Professionals', icon: '👥' },
              { number: '50,000+', label: 'Services Completed', icon: '✅' },
              { number: '25+', label: 'Cities Covered', icon: '🏙️' },
              { number: '4.8★', label: 'Average Rating', icon: '⭐' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Ready to Start Earning?
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of professionals already earning with Mannu Bhai Services
          </p>
          <button
            onClick={() => setShowForm(true)}
            className={`group bg-gradient-to-r ${services[activeTab].gradient} hover:shadow-lg text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 inline-flex items-center gap-3`}
          >
            Get Started Today
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </button>

          <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500">
            <p>&copy; 2024 Mannu Bhai Services. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Application Form */}
      {showForm && (
        <ApplicationForm 
          activeTab={activeTab} 
          service={services[activeTab]} 
          onClose={() => setShowForm(false)} 
          db={db}
        />
      )}
    </div>
  );
};

export default MannuBhaiServices;
