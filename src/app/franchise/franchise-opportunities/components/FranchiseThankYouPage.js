'use client';
import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Download, Users, MapPin, Phone, Mail, MessageCircle, Calendar, Star, ArrowRight } from 'lucide-react';

const FranchiseThankYouPage = () => {
  const [submittedData, setSubmittedData] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Retrieve submitted form data from sessionStorage
    if (typeof window !== 'undefined') {
      const storedData = sessionStorage.getItem('franchiseFormData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setSubmittedData(parsedData);
          setShowConfetti(true);
          
          // Remove confetti after animation
          setTimeout(() => setShowConfetti(false), 3000);
          
          // Track page view
          if (window.fbq) {
            window.fbq('track', 'ViewContent', {
              content_name: 'Franchise Thank You Page',
              content_category: 'Franchise Application Completed'
            });
          }
        } catch (error) {
          console.error('Error parsing stored form data:', error);
        }
      }
    }
  }, []);

  const handleScheduleCall = () => {
    // Track call scheduling intent
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'ScheduleCallIntent', {
        content_name: 'Franchise Call Scheduling',
        applicant_city: submittedData?.city || 'unknown'
      });
    }
    
    // Here you could integrate with a calendar booking system
    // For now, we'll just redirect to WhatsApp or phone
    const phoneNumber = "+917827506245";
    const message = `Hi! I just submitted my franchise application for ${submittedData?.city || 'my city'} and would like to schedule a call to discuss the opportunity.`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadBrochure = () => {
    // Track brochure download
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'BrochureDownload', {
        content_name: 'Franchise Brochure Download',
        applicant_city: submittedData?.city || 'unknown'
      });
    }
    
    // Here you would link to your actual brochure PDF
    // For demo purposes, creating a placeholder
    alert('Brochure download would start here. Please contact us for the latest materials.');
  };

  const formatSubmissionTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
            
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message with Personalization */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center relative overflow-hidden">
          {/* Decorative background pattern */}
          <div className="relative z-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Thank You{submittedData?.name ? `, ${submittedData.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              We ve received your franchise application successfully.
            </p>
            
            {/* Display submission details if available */}
            {submittedData && (
              <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left max-w-md mx-auto">
                <h3 className="font-semibold text-blue-800 mb-2">Application Details:</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div><strong>Location:</strong> {submittedData.city}</div>
                  <div><strong>Investment Range:</strong> {submittedData.investment}</div>
                  <div><strong>Phone:</strong> {submittedData.phone}</div>
                  {submittedData.submissionTime && (
                    <div><strong>Submitted:</strong> {formatSubmissionTime(submittedData.submissionTime)}</div>
                  )}
                </div>
              </div>
            )}
            
            {/* Primary CTA */}
            <button 
              onClick={handleScheduleCall}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Your Franchise Call Now
            </button>
          </div>
        </div>

        {/* Next Steps with Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Clock className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">What Happens Next?</h2>
          </div>
          
          {/* Timeline */}
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">1</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Initial Contact</h3>
                <p className="text-gray-600">Our team will call you within <strong className="text-blue-600">24-48 hours</strong> to discuss your application.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">2</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Detailed Discussion</h3>
                <p className="text-gray-600">We ll guide you through investment details, training programs, and territory availability.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">3</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Documentation & Setup</h3>
                <p className="text-gray-600">Complete paperwork and begin your training journey to become a successful franchise partner.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Value Reinforcement with Animation */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center mb-6">
            <Users className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">Join Our Success Story</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold mb-2 flex items-center">
                <Star className="w-6 h-6 mr-2 text-yellow-300" />
                90+
              </div>
              <div className="text-green-100">Franchise Partners Already Earning</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold mb-2">6-8</div>
              <div className="text-green-100">Months Average ROI Achievement</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-green-100">Support & Training Available</div>
            </div>
          </div>
        </div>

        {/* Interactive Resources */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Download className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Resources While You Wait</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <button 
              onClick={handleDownloadBrochure}
              className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl p-6 text-left transition-all duration-200 transform hover:scale-105 hover:shadow-md group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-purple-800">Download Brochure</div>
                <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm text-purple-600">Complete franchise overview (PDF)</div>
            </button>
            
            <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl p-6 text-left transition-all duration-200 transform hover:scale-105 hover:shadow-md group">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-purple-800">ROI Case Study</div>
                <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm text-purple-600">Real partner success stories</div>
            </button>
            
            <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl p-6 text-left transition-all duration-200 transform hover:scale-105 hover:shadow-md group">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-purple-800">Franchise FAQs</div>
                <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm text-purple-600">Common questions answered</div>
            </button>
          </div>
        </div>

        {/* Urgency/Scarcity with Dynamic Content */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center mb-4">
            <MapPin className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">Limited Territories Available</h2>
          </div>
          <p className="text-lg text-red-100 mb-4">
            {submittedData?.city 
              ? `Great choice with ${submittedData.city}! Franchise territories in prime locations are limited.`
              : 'Franchise territories are limited. Secure your preferred location today.'
            }
          </p>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-sm text-red-100 flex items-center">
              <span className="mr-2">⚡</span>
              Act fast - prime locations are filling up quickly!
            </div>
          </div>
        </div>

        {/* Enhanced Social Proof */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">What Our Partners Say</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-700 italic mb-3">
                    Joining MannuBhai was the best business decision I ve made. The support team guided me every step of the way, and I achieved profitability faster than expected.
                  </p>
                  <div className="text-blue-600 font-semibold">Rajesh Kumar  Mumbai Partner</div>
                  <div className="text-sm text-gray-500">Franchise Partner since 2022</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-green-500">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-700 italic mb-3">
                    The training program was comprehensive and the ongoing support is exceptional. My ROI exceeded expectations within 8 months.
                  </p>
                  <div className="text-green-600 font-semibold">Priya Sharma  Delhi Partner</div>
                  <div className="text-sm text-gray-500">Franchise Partner since 2023</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community & Contact Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Community Links */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Join Our Community</h3>
            <div className="space-y-4">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-colors duration-200 flex items-center justify-center group">
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                WhatsApp Partner Group
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors duration-200 flex items-center justify-center">
                Facebook Community
              </button>
              <button className="w-full bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-xl transition-colors duration-200 flex items-center justify-center">
                LinkedIn Network
              </button>
            </div>
          </div>

          {/* Direct Contact */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold text-gray-800">Call Us</div>
                  <div className="text-gray-600">+91 7827506245</div>
                </div>
              </div>
              <div className="flex items-center group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <Mail className="w-5 h-5 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold text-gray-800">Email</div>
                  <div className="text-gray-600">franchise@mannubhai.com</div>
                </div>
              </div>
              <div className="flex items-start group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold text-gray-800">Head Office</div>
                  <div className="text-gray-600 text-sm">Unit No 831 8th Floor, JMD MEGAPOLIS, Sector 48, Gurugram, Haryana 122018</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action Footer */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
            <p className="mb-4">Dont wait Our team is ready to help you begin your franchise journey.</p>
            <button 
              onClick={handleScheduleCall}
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              <Phone className="w-4 h-4 mr-2" />
              Talk to Us Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchiseThankYouPage;