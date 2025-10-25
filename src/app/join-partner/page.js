"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { db } from '../../app/firebaseConfig';
import ApplicationForm from '../../components/ApplicationForm';

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

// Loading component for ApplicationForm
const ApplicationFormLoader = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
  </div>
);

const MannuBhaiServices = () => {
  const [activeTab, setActiveTab] = useState('appliances');
  const [showForm, setShowForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  

  // Simulate loading completion
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Preload critical resources with proper error handling
  useEffect(() => {
    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = '/HomeBanner/partner.webp';
      link.as = 'image';
      link.type = 'image/webp';
      document.head.appendChild(link);

      return () => {
        try {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        } catch (e) {
          console.warn('Could not remove preload link:', e);
        }
      };
    } catch (error) {
      console.warn('Could not preload image:', error);
    }
  }, []);

  const handleWhatsappJoin = () => {
    const message = encodeURIComponent("I'm interested in joining Mannu Bhai Services as a professional. Please provide more details.");
    window.open(`https://wa.me/919319408430?text=${message}`, '_blank');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden min-h-screen flex items-center text-white">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="relative z-10 w-full py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-8">
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
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

                <div className="bg-white rounded-3xl p-8 text-gray-900 shadow-2xl backdrop-blur-sm bg-opacity-90">
                  <p className="text-lg sm:text-xl font-bold mb-6 text-center">
                    <span className="text-green-500">🟢</span> Join us on WhatsApp!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <button
                      onClick={handleWhatsappJoin}
                      className="bg-green-500 text-white hover:bg-green-600 px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 min-w-[120px] will-change-transform">
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
                    className="group bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 mx-auto will-change-transform"
                  >
                    <span>{services[activeTab].icon}</span>
                    Become a Service Partner
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
                  {!imageLoaded && (
                    <div className="bg-gray-200 animate-pulse h-96 w-full rounded-2xl"></div>
                  )}
                  <div className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}>
                    <Image
                      src="/HomeBanner/partner.webp"
                      alt="Mannu Bhai Services - Your trusted partner"
                      className="w-full h-auto object-cover"
                      width={600}
                      height={400}
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onLoad={() => setImageLoaded(true)}
                      onError={() => {
                        console.warn('Failed to load partner image');
                        setImageLoaded(true);
                      }}
                    />
                  </div>
                </div>
              </div>
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
                className={`group px-6 py-3 rounded-xl font-medium transition-all duration-300 will-change-transform ${
                  activeTab === key
                    ? `bg-gradient-to-r ${service.gradient} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                }`}
              >
                <span className="text-xl mr-2 group-hover:scale-110 transition-transform inline-block will-change-transform">
                  {service.icon}
                </span>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Details */}
      <ServiceDetails 
        activeTab={activeTab} 
        service={services[activeTab]} 
        onApplyClick={() => setShowForm(true)} 
      />

      {/* How it Works */}
      <HowItWorksSection />

      {/* Stats Section */}
      <StatsSection />

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
            className={`group bg-gradient-to-r ${services[activeTab].gradient} hover:shadow-lg text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 inline-flex items-center gap-3 will-change-transform`}
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

      {/* Universal Application Form */}
      {showForm && (
        <Suspense fallback={<ApplicationFormLoader />}>
          <ApplicationForm 
            activeTab={activeTab} 
            service={services[activeTab]} 
            onClose={() => setShowForm(false)} 
            db={db}
          />
        </Suspense>
      )}
    </div>
  );
};

// Memoized service details component
const ServiceDetails = React.memo(({ activeTab, service, onApplyClick }) => (
  <section className="py-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-block p-6 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg mb-6">
          <span className="text-7xl">{service.icon}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          {service.title}
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          {service.subtitle}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-gray-200">
          <div className="flex items-center mb-6">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${service.gradient} text-white mr-4`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Choose Your Skill</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {service.skills.map((skill, index) => (
              <div key={index} className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm">
                <div className={`w-3 h-3 bg-gradient-to-r ${service.gradient} rounded-full mr-3 shadow-sm`}></div>
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
            {service.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center group/item">
                <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-full p-2 mr-4 shadow-sm group-hover/item:scale-110 transition-transform will-change-transform">
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
          onClick={onApplyClick}
          className={`group bg-gradient-to-r ${service.gradient} hover:shadow-lg text-white px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center gap-3 mx-auto will-change-transform`}
        >
          Apply for {service.title}
          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </button>
      </div>
    </div>
  </section>
));

ServiceDetails.displayName = 'ServiceDetails';

// How it Works section
const HowItWorksSection = React.memo(() => (
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
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200 will-change-transform">
              <div className={`inline-block p-4 rounded-xl bg-gradient-to-r from-${item.color}-100 to-${item.color}-200 mb-4 group-hover:scale-110 transition-transform will-change-transform`}>
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
));

HowItWorksSection.displayName = 'HowItWorksSection';

// Stats section
const StatsSection = React.memo(() => (
  <section className="py-16 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { number: '3000+', label: 'Active Professionals', icon: '👥' },
          { number: '50,000+', label: 'Services Completed', icon: '✅' },
          { number: '25+', label: 'Cities Covered', icon: '🏙️' },
          { number: '4.8⭐', label: 'Average Rating', icon: '⭐' }
        ].map((stat, index) => (
          <div key={index} className="text-center group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300 will-change-transform">
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
));

StatsSection.displayName = 'StatsSection';

export default React.memo(MannuBhaiServices);
