"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Users, Award, MapPin, Zap } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: "Mukesh Singh",
    location: "New Delhi",
    review: "Very fast service.. Work has been done on time.. I call them again for their tremendous services .. Thank you Mannu Bhai",
    rating: 5
  },
  {
    id: 2,
    name: "Ruchi Malik",
    location: "Delhi",
    review: "Good and fast service from the team. One stop shop for all the household repairing needs. The guys coming for repairs also talks nicely and get the work done quickly.",
    rating: 5
  },
  {
    id: 3,
    name: "Tofik Khan",
    location: "Faridabad",
    review: "The service of them is great as firstly they provide every facility you want and secondly the customer will directly connect you guys with the dedicated person who is working on that facility. Prices are also reasonable.",
    rating: 5
  },
  {
    id: 4,
    name: "Deepak Tomar",
    location: "Gurgaon",
    review: "Really want to have some more services after a timely service this time as per commitment. Thank You - Mannu Bhai",
    rating: 5
  }
];

const STATS = [
  { value: "25+", label: "Live Services", icon: Zap },
  { value: "30 Lac+", label: "Customers Served", icon: Users },
  { value: "3000", label: "Verified Experts", icon: Award },
  { value: "50+", label: "Service Outlets", icon: MapPin },
  { value: "4.5", label: "Average Rating", icon: Star }
];

export default function ClientReviews() {
  const [currentReview, setCurrentReview] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Memoize the stars rendering function
  const renderStars = useCallback((rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  }, []);

  // Memoize the current review to prevent unnecessary re-renders
  const currentReviewData = useMemo(() => REVIEWS[currentReview], [currentReview]);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentReview(prev => (prev + 1) % REVIEWS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Reviews Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-block">
            <span className="bg-gradient-to-r text-[20px] from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-semibold tracking-wider uppercase mb-2 block">
              Client Reviews
            </span>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center mb-6 sm:mb-20">
          {/* Left Content */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <h2 className="font-semibold sm:text-4xl lg:text-5xl sm:font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
              Trusted by Clients and
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Industry Experts
              </span> Alike
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
              We have a team of young and expert professionals who work tirelessly to deliver the best and most satisfactory services at your doorstep. It is Mannu Bhai&apos;s entire team effort, which makes us one of the trusted &amp; fastest growing home appliances service providers in PAN India.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(5)}
              </div>
              <span className="text-sm text-gray-600">Rated 4.5/5 by 30L+ customers</span>
            </div>
          </div>

          {/* Right Reviews Carousel */}
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4 sm:mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                      {currentReviewData.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{currentReviewData.name}</h3>
                      <p className="text-gray-600 flex items-center gap-1 text-sm">
                        <MapPin className="w-4 h-4" />
                        {currentReviewData.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3 sm:mb-4">
                    {renderStars(currentReviewData.rating)}
                  </div>
                  
                  <p className="text-gray-700 italic text-base sm:text-lg leading-relaxed">
                    &quot;{currentReviewData.review}&quot;
                  </p>
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
                {REVIEWS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReview(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentReview 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 w-6' 
                        : 'bg-gray-300 hover:bg-gray-400 w-2'
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {STATS.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`text-center group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                    isVisible 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="mb-3">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:shadow-lg transition-all duration-300">
                      <IconComponent className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-medium text-xs sm:text-sm lg:text-base">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div> 
        </div>
      </div>
    </div>
  );
}