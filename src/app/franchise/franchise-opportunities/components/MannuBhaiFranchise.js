import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Star, Users, TrendingUp, Shield, Phone, Mail, MapPin, Wrench, Home, Scissors, Sparkles, Target, Award, BookOpen, Headphones, Smartphone, Globe, DollarSign, Calendar, BarChart3 } from 'lucide-react';

const MannuBhaiFranchise = () => {
  const [activeTab, setActiveTab] = useState('opportunities');

  const services = [
    { 
      icon: Wrench, 
      title: "Home Appliance Repair", 
      desc: "AC, RO water purifiers, refrigerators, and washing machines need to be serviced regularly. This market alone is worth billions and increasing year on year.",
      market: "Billions Worth Market"
    },
    { 
      icon: Scissors, 
      title: "Beauty & Salon Services", 
      desc: "Women now want professional salon services at home due to safety, comfort, and convenience.",
      market: "Growing Demand"
    },
    { 
      icon: Home, 
      title: "Handyman Services", 
      desc: "From plumbing to electric and carpentry work, handyman services are always sought after in metros as well as small towns.",
      market: "Universal Need"
    },
    { 
      icon: Sparkles, 
      title: "Home Care & Personal Services", 
      desc: "House cleaning, care of elderly, and general home maintenance are emerging service requirements.",
      market: "Emerging Sector"
    },
    { 
      icon: Target, 
      title: "Doorstep Service Delivery", 
      desc: "Customers are no longer stepping out to meet every need, with lifestyle changes. Doorstep service is the way ahead, and MannuBhai is already driving this change.",
      market: "Future Ready"
    }
  ];

  const highlights = [
    { label: "Investment", value: "₹10–15 Lakhs", color: "text-green-600", icon: DollarSign },
    { label: "Break-Even", value: "3–8 Months", color: "text-blue-600", icon: Calendar },
    { label: "Monthly Profit", value: "₹1–2 Lakhs", color: "text-purple-600", icon: TrendingUp },
    { label: "Annual ROI", value: "90–95%", color: "text-orange-600", icon: BarChart3 }
  ];

  const features = [
    { title: "Technology-Driven Platform", desc: "Intelligent booking platform managing orders, payments, customer reviews, and scheduling", icon: Smartphone },
    { title: "Exclusive Area Rights", desc: "Safeguard your investment through exclusive area-based business opportunities", icon: Shield },
    { title: "Full Business Support", desc: "From training to promotion, we have every area of your business covered", icon: Headphones },
    { title: "Hybrid Service Model", desc: "Harmonious blend of experienced professionals + intelligent technology", icon: Globe },
    { title: "360° Marketing Support", desc: "Digital marketing, local promotions, and customer procurement handled for you", icon: Target },
    { title: "Dedicated Manager", desc: "Personal manager looks after your business for continuous growth", icon: Users }
  ];

  const supportServices = [
    { title: "Extensive Training & Certification", desc: "Even if you're a novice in the service sector, we'll certify and train you to handle operations efficiently", icon: BookOpen },
    { title: "360° Marketing Assistance", desc: "We take care of digital marketing, local promotions, and customer procurement", icon: Target },
    { title: "Operational Manuals", desc: "Detailed guidelines make it easy to handle everything from customer care to employee performance", icon: Award },
    { title: "Technology Platform", desc: "Web platform and mobile app connect you with customers instantly", icon: Smartphone }
  ];

  const locations = [
    { city: "Delhi NCR", desc: "The epicenter of urban demand", type: "Metro" },
    { city: "Gurgaon", desc: "High-spending, fast-growing market", type: "Metro" },
    { city: "Noida", desc: "High-spending, fast-growing market", type: "Metro" },
    { city: "Bangalore", desc: "High-spending, fast-growing market", type: "Metro" },
    { city: "Tier 2 Cities", desc: "Increasing demand in semi-urban markets", type: "Emerging" },
    { city: "Tier 3 Cities", desc: "Low investment, high demand opportunities", type: "Emerging" },
    { city: "Small Towns", desc: "Little competition with high local demand", type: "Opportunity" },
    { city: "Pan-India", desc: "Scalable model with limitless expansion", type: "All India" }
  ];

  const whoCanJoin = [
    "First-time entrepreneurs looking for proven business model",
    "Small investors seeking high ROI opportunities", 
    "Business owners looking to diversify their portfolio",
    "Anyone searching for low-cost franchise options",
    "Entrepreneurs wanting guaranteed returns in India",
    "Small capital entrepreneurs seeking best franchises"
  ];

  const industries = ["Home Services", "Appliance Repair", "Beauty Care", "Handyman", "Home Care"];
  const supportOffered = ["Training", "Marketing", "Operations", "Technology", "Territory Rights"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
  

      {/* Growing Opportunity Section */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The Growing Opportunity in Service Sector
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            The service industry in India is witnessing huge change. Consumers want convenient, reliable, and doorstep services—be it for getting their AC fixed, calling a plumber, or availing beauty salon facility at home.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-3 h-full">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-10 h-10 text-white" />
                </div>
                <div className="mb-4">
                  <span className="inline-block bg-gradient-to-r from-green-100 to-blue-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {service.market}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What Sets Us Apart */}
      <div className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Sets MannuBhai Apart?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              MannuBhai is not a typical franchise. It is a full business ecosystem that puts us at the top of India's most valued service franchise options.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white text-center">
              <Users className="w-8 h-8 mb-4 mx-auto" />
              <div className="text-3xl font-bold">3M+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white text-center">
              <Shield className="w-8 h-8 mb-4 mx-auto" />
              <div className="text-3xl font-bold">100%</div>
              <div className="text-purple-100">Success Rate</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white text-center">
              <TrendingUp className="w-8 h-8 mb-4 mx-auto" />
              <div className="text-3xl font-bold">3000+</div>
              <div className="text-green-100">Active Partners</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-2xl text-white text-center">
              <MapPin className="w-8 h-8 mb-4 mx-auto" />
              <div className="text-3xl font-bold">100+</div>
              <div className="text-orange-100">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Support & Training Section */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Support & Training – Ensuring Your Success
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            At MannuBhai, we are convinced that our franchise partner's success is our success. That is why we provide comprehensive support at every step.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {supportServices.map((service, index) => (
            <div key={index} className="flex items-start space-x-6 p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Details */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Franchise Highlights
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Transparent investment details with guaranteed returns and comprehensive support system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {highlights.map((item, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 text-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className={`text-3xl font-bold ${item.color} mb-2`}>{item.value}</div>
                <div className="text-gray-600 font-medium">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Industries Catered</h3>
                <div className="flex flex-wrap gap-3">
                  {industries.map((industry, index) => (
                    <span key={index} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full font-medium">
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Support Offered</h3>
                <div className="flex flex-wrap gap-3">
                  {supportOffered.map((support, index) => (
                    <span key={index} className="px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full font-medium">
                      {support}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expansion Opportunities */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Opportunities to Expand Throughout India
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            MannuBhai is expanding its service franchise business quickly all over India. Be it a metro or small town, there is a lucrative opportunity for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((location, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{location.city}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  location.type === 'Metro' ? 'bg-blue-100 text-blue-800' :
                  location.type === 'Emerging' ? 'bg-green-100 text-green-800' :
                  location.type === 'Opportunity' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {location.type}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{location.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Who Can Join Section */}
      <div className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Who Can Join MannuBhai Franchise?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                You don't need prior experience to become a MannuBhai franchise partner. Whether you're a first-time entrepreneur, small investor, or business owner looking to diversify, this model is designed for you.
              </p>
              
              <div className="space-y-4">
                {whoCanJoin.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Are you asking these questions?</h3>
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-blue-800 font-medium">"How to start a home service franchise in India?"</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-green-800 font-medium">"Which is the best low-cost franchise in India?"</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-purple-800 font-medium">"Is there a franchise business that guarantees returns?"</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl">
                  <p className="text-orange-800 font-medium">"Best franchises for small capital entrepreneurs?"</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 mb-4">Then MannuBhai is your solution!</p>
                <button  onClick={() => document.getElementById('franchise-form')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
    
    </div>
  );
};

export default MannuBhaiFranchise;