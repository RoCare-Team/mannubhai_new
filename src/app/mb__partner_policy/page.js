
"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Shield, Eye, Users, Lock, RefreshCw, Mail, Check, MapPin, Smartphone, BarChart3, Globe, ArrowUp } from 'lucide-react';

export default function ModernPrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
      
      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.scrollY + 100;
      
      sections.forEach((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        
        if (scrollPos >= top && scrollPos <= bottom) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    { id: 'collection', title: 'Information We Collect', icon: Eye },
    { id: 'usage', title: 'How We Use Your Info', icon: BarChart3 },
    { id: 'sharing', title: 'Data Sharing', icon: Users },
    { id: 'control', title: 'Your Control', icon: Shield },
    { id: 'security', title: 'Data Security', icon: Lock },
    { id: 'updates', title: 'Policy Updates', icon: RefreshCw },
    { id: 'contact', title: 'Contact Us', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 shadow-lg shadow-black/5">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </button>
          <div className="w-px h-4 bg-slate-200"></div>
          <div className="flex items-center space-x-1">
            {sections.slice(0, 3).map((section) => (
              <div
                key={section.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeSection === section.id ? 'bg-blue-500 w-6' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-6 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              At Mannu Bhai, we highly value and respect the privacy of all our users, partners, and visitors. 
              Your data security is our top priority.
            </p>
            <div className="flex items-center justify-center space-x-6 mt-8">
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="w-5 h-5" />
                <span className="font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <Check className="w-5 h-5" />
                <span className="font-medium">Play Store Approved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl shadow-black/5 border border-white/20 overflow-hidden">
          
          {/* Section 1: Information Collection */}
          <section id="collection" className="p-8 lg:p-12">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Information We Collect</h2>
            </div>
            
            <div className="grid md:grid-cols-1 gap-6">
              <div className="group p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Personal Information</h3>
                    <p className="text-slate-600">Name, contact details, and other information you provide while using our services.</p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Location Data</h3>
                    <div className="space-y-2 text-slate-600">
                      <p>We collect real-time location data from our service partners (including background location when the app is running in the background) to provide essential features such as live tracking and accurate service delivery for customers.</p>
                      <p>Customers may also share their location to enable precise service matching and delivery.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Usage Data</h3>
                    <p className="text-slate-600">App usage, device information, and interactions within the app to improve performance and user experience.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

          {/* Section 2: How We Use Information */}
          <section id="usage" className="p-8 lg:p-12">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">How We Use Your Information</h2>
            </div>
            
            <div className="space-y-4">
              {[
                'To enable and improve the core functionality of our services.',
                'To provide real-time partner location updates to customers for service delivery and tracking.',
                'To personalize your experience and share relevant updates, offers, and new services.',
                'To comply with legal obligations when required.'
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  </div>
                  <p className="text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

          {/* Section 3: Data Sharing */}
          <section id="sharing" className="p-8 lg:p-12">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Data Sharing and Disclosure</h2>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-green-50 border border-green-200 rounded-2xl">
                <div className="flex items-center space-x-3 mb-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">We protect your privacy</span>
                </div>
                <p className="text-green-800">We do not sell, rent, or trade any personally identifiable information to third parties.</p>
              </div>
              
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="flex items-center space-x-3 mb-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Anonymous Analytics</span>
                </div>
                <p className="text-blue-800">We may share anonymized or aggregated data (non-personal) with marketing partners or advertisers for analytics and research.</p>
              </div>
              
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-900">Legal Compliance</span>
                </div>
                <p className="text-amber-800">Personal data may be disclosed only if required by law or authorized legal processes.</p>
              </div>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

          {/* Section 4: User Control */}
          <section id="control" className="p-8 lg:p-12">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">User Control and Choices</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg text-slate-600">Users can manage permissions at any time through their device settings, including disabling location sharing.</p>
              
              <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-r-2xl">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-900 mb-1">Important Note</p>
                    <p className="text-yellow-800">Disabling location access may affect the functionality of the app, including real-time tracking and service delivery.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-slate-600">
                <span>Users may request modification or deletion of their data by contacting us at</span>
                <a href="mailto:info@mannubhai.com" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                  <Mail className="w-4 h-4" />
                  <span>info@mannubhai.com</span>
                </a>
              </div>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

          {/* Section 5: Security */}
          <section id="security" className="p-8 lg:p-12">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Data Security</h2>
            </div>
            <p className="text-lg text-slate-600">We implement strict measures to safeguard all personal and location data against unauthorized access, alteration, or misuse.</p>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

          {/* Section 6: Updates */}
          <section id="updates" className="p-8 lg:p-12">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Policy Updates</h2>
            </div>
            <p className="text-lg text-slate-600">We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. Any changes will be effective immediately upon posting, and continued use of the app signifies your acceptance of those changes.</p>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

          {/* Section 7: Contact */}
          <section id="contact" className="p-8 lg:p-12">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Contact Us</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-6">If you have any concerns about your privacy or data usage, please contact us:</p>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-slate-600 mb-2">Email us at:</p>
                  <a 
                    href="mailto:info@mannubhai.com" 
                    className="text-2xl font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    info@mannubhai.com
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="p-8 lg:p-12 bg-gradient-to-r from-slate-50 to-blue-50">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <p className="text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="font-medium">Play Store Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Secure & Private</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}