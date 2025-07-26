'use client';
import React, { useState, useEffect, useRef } from 'react';
export default function FranchiseContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    pincode: '',
    investment: '',
    message: '',
    otp: ''
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1); // 1: Phone, 2: OTP, 3: Form Details
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(600);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Refs for timers
  const otpIntervalRef = useRef(null);
  const lockoutIntervalRef = useRef(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (otpIntervalRef.current) clearInterval(otpIntervalRef.current);
      if (lockoutIntervalRef.current) clearInterval(lockoutIntervalRef.current);
    };
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    
    // Apply input filters
    let filteredValue = value;
    if (id === 'phone' || id === 'pincode') {
      filteredValue = value.replace(/\D/g, '').slice(0, id === 'phone' ? 10 : 6);
    }
    
    setFormData(prev => ({
      ...prev,
      [id]: filteredValue
    }));
    
    // Clear error when typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  // Validation functions
  const validations = {
    name: (value) => {
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      if (!/^[a-zA-Z\s]+$/.test(value)) return "Name can only contain letters and spaces";
      return null;
    },
    email: (value) => {
      if (!value.trim()) return "Email is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Please enter a valid email address";
      return null;
    },
    phone: (value) => {
      if (!value.trim()) return "Phone number is required";
      if (!/^\d{10}$/.test(value)) return "Please enter a valid 10-digit phone number";
      return null;
    },
    city: (value) => {
      if (!value.trim()) return "City is required";
      if (value.trim().length < 2) return "City name is too short";
      if (!/^[a-zA-Z\s]+$/.test(value)) return "City can only contain letters and spaces";
      return null;
    },
    pincode: (value) => {
      if (!value.trim()) return "Pincode is required";
      if (!/^\d{6}$/.test(value)) return "Please enter a valid 6-digit pincode";
      return null;
    },
    investment: (value) => {
      if (!value) return "Please select an investment range";
      return null;
    },
    otp: (value) => {
      if (!value.trim()) return "OTP is required";
      if (!/^\d{6}$/.test(value)) return "Please enter a valid 6-digit OTP";
      return null;
    }
  };

  // Send SMS
  const sendSms = async (phone, message) => {
    try {
      const params = new URLSearchParams({
        to: phone,
        body: message
      });

      const response = await fetch(`/api/sendSms?${params}`);
      const result = await response.text();
      console.log('SMS Sent:', result);
      return true;
    } catch (error) {
      console.error('SMS Error:', error);
      return false;
    }
  };

  // Start OTP timer
  const startOtpTimer = () => {
    setOtpTimer(30);
    
    otpIntervalRef.current = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(otpIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start lockout timer
  const startLockout = () => {
    setIsLocked(true);
    setLockoutTimer(600);
    
    lockoutIntervalRef.current = setInterval(() => {
      setLockoutTimer(prev => {
        if (prev <= 1) {
          clearInterval(lockoutIntervalRef.current);
          setIsLocked(false);
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Send OTP
  const handleSendOtp = async () => {
    const phoneError = validations.phone(formData.phone);
    
    if (phoneError) {
      setErrors({ phone: phoneError });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      setGeneratedOtp(otp);
      
      const message = `Dear ${formData.name}, ${otp} is OTP to verify your mobile number for confirm request. Regards RO Care India.`;
      
      const smsResult = await sendSms(formData.phone, message);
      
      if (smsResult) {
        setOtpSent(true);
        setCurrentStep(2);
        startOtpTimer();
        setSuccessMessage('OTP sent successfully! Please check your messages.');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setErrors({ 
          general: 'Failed to send OTP. Please ensure your number is correct and try again.' 
        });
      }
    } catch (error) {
      console.error('OTP sending failed:', error);
      setErrors({ 
        general: 'Service temporarily unavailable. Please try again shortly.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpError = validations.otp(formData.otp);
    if (otpError) {
      setErrors({ otp: otpError });
      return;
    }

    setIsSubmitting(true);

    if (formData.otp === generatedOtp.toString()) {
      setOtpVerified(true);
      setCurrentStep(3);
      setErrors({});
      setSuccessMessage('Phone number verified successfully! Please fill in your details.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        startLockout();
        setOtpSent(false);
        setOtpVerified(false);
        setCurrentStep(1);
        setFormData(prev => ({ ...prev, otp: '' }));
      } else {
        setErrors({ 
          otp: `Invalid OTP. ${3 - newAttempts} attempts remaining.` 
        });
      }
    }
    
    setIsSubmitting(false);
  };

  // Validate final form
  const validateFinalForm = () => {
    const fieldsToValidate = ['name', 'email', 'city', 'pincode', 'investment'];
    const newErrors = {};
    let isValid = true;

    fieldsToValidate.forEach(field => {
      const error = validations[field](formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFinalSubmit = async () => {
    if (!validateFinalForm()) return;

    setIsSubmitting(true);
    
    const params = new URLSearchParams({
      name: formData.name,
      pincode: formData.pincode,
      city: formData.city,
      invst_rang: formData.investment,
      email: formData.email,
      mobile: formData.phone,
      message: formData.message,
      site_url: 'https://mannubhai.com'
    });

    try {
      const response = await fetch(
        `https://waterpurifierservicecenter.in/wizard/app/mannubhai_enquery.php?${params}`
      );
      
      const responseText = await response.text();
      
      try {
        const data = JSON.parse(responseText);
        
        if (data.status === 1) {
          setSuccessMessage('Thank you! We have received your request and will get back to you soon.');
          
          // Reset form
          setFormData({
            name: '',
            email: '',
            phone: '',
            city: '',
            pincode: '',
            investment: '',
            message: '',
            otp: ''
          });
          
          setCurrentStep(1);
          setOtpSent(false);
          setOtpVerified(false);
          setFailedAttempts(0);
          setErrors({});
          setGeneratedOtp(null);
          
          // Clear timers
          if (otpIntervalRef.current) clearInterval(otpIntervalRef.current);
          if (lockoutIntervalRef.current) clearInterval(lockoutIntervalRef.current);
        } else {
          setErrors({ general: data.message || 'Something went wrong. Please try again.' });
        }
      } catch (e) {
        setErrors({ general: 'Unexpected response format from server' });
      }
    } catch (error) {
      setErrors({ general: error.message || 'Error processing request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go back to phone step
  const handleBackToPhone = () => {
    setCurrentStep(1);
    setOtpSent(false);
    setOtpVerified(false);
    setFormData(prev => ({ ...prev, otp: '' }));
    setErrors({});
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Banner */}
        <div className="bg-indigo-700 text-white rounded-lg p-6 mb-8 md:mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <p className="text-2xl md:text-3xl font-bold">50+</p>
              <p className="text-sm md:text-base">Service Outlets</p>
            </div>
            <div className="p-4">
              <p className="text-2xl md:text-3xl font-bold">10,000</p>
              <p className="text-sm md:text-base">Verified Experts</p>
            </div>
            <div className="p-4">
              <p className="text-2xl md:text-3xl font-bold">50+</p>
              <p className="text-sm md:text-base">Live Services</p>
            </div>
            <div className="p-4">
              <p className="text-2xl md:text-3xl font-bold">30 Lac+</p>
              <p className="text-sm md:text-base">Customers Served</p>
            </div>
            
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Contact Info */}
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-700 mb-4">
              Franchise Opportunity
            </h2>
            <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
              Join our growing network of franchise partners and be part of India's leading service provider.
            </p>

            <div className="space-y-3 md:space-y-4">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  ),
                  title: "Phone",
                  content: "+91 7827506245"
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  ),
                  title: "Email",
                  content: "franchise@mannubhai.com"
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  ),
                  title: "Head Office",
                  content: "Unit No 831 8th Floor, JMD MEGAPOLIS, Sector 48, Gurugram, Haryana 122018"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3 md:mr-4 text-indigo-600">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">{item.title}</h3>
                    <p className={`text-gray-600 ${index === 2 ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`}>
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="order-1 lg:order-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg mb-5">
            {/* Status Messages */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 md:px-4 md:py-3 rounded mb-3 md:mb-4 text-sm md:text-base">
                {successMessage}
              </div>
            )}
            
            {isLocked && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-3 md:p-4 rounded mb-3 md:mb-4 text-sm md:text-base">
                <strong>Account Temporarily Locked</strong><br />
                Too many failed OTP attempts. Please wait {formatTime(lockoutTimer)} before trying again.
              </div>
            )}
            
            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded mb-3 md:mb-4 text-sm md:text-base">
                {errors.general}
              </div>
            )}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-700 text-center mt-2 mb-4 md:mb-6">
  Apply Now
</h2>
            {/* Progress Steps */}
            <div className="mb-4 md:mb-6">
              <div className="flex items-center justify-between space-x-1 md:space-x-2">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className={`flex flex-col items-center ${
                      currentStep === step ? 'text-indigo-600' : 
                      currentStep > step ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold ${
                        currentStep === step ? 'bg-indigo-600 text-white' : 
                        currentStep > step ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {currentStep > step ? '✓' : step}
                      </div>
                      <span className="mt-1 text-xs md:text-sm font-medium hidden sm:inline">
                        {step === 1 ? 'Phone' : step === 2 ? 'OTP' : 'Details'}
                      </span>
                    </div>
                    {step < 3 && (
                      <div className="flex-1 h-0.5 mx-1 bg-gray-300 relative">
                        <div className={`absolute top-0 left-0 h-full ${
                          currentStep > step ? 'bg-green-600' : 'bg-gray-300'
                        }`}></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step 1: Phone Number */}
            {currentStep === 1 && (
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-4">Enter Your Phone Number</h3>
                  <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">We'll send you an OTP to verify your phone number.</p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your 10-digit phone number"
                    maxLength={10}
                    className={`w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.phone}</p>}
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={isSubmitting || isLocked}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 md:py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 2 && (
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-4">Verify Your Phone Number</h3>
                  <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">Enter the 6-digit OTP sent to {formData.phone}</p>
                </div>
                
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Enter OTP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className={`w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border ${
                      errors.otp ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base`}
                  />
                  {errors.otp && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.otp}</p>}
                </div>

                <div className="flex justify-between items-center text-xs md:text-sm text-gray-600">
                  <span>Failed attempts: {failedAttempts}/3</span>
                  <button
                    onClick={handleSendOtp}
                    disabled={otpTimer > 0 || isSubmitting}
                    className={`font-medium ${
                      otpTimer > 0 || isSubmitting
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-indigo-600 hover:text-indigo-700'
                    }`}
                  >
                    {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}
                  </button>
                </div>

                <div className="flex space-x-2 md:space-x-3">
                  <button
                    onClick={handleBackToPhone}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 md:py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm md:text-base"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 md:py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Complete Form - Two Column Layout */}
            {currentStep === 3 && (
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-4">Complete Your Application</h3>
                  <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                    Phone verified: {formData.phone} ✓
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base`}
                    />
                    {errors.name && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base`}
                    />
                    {errors.email && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      className={`w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base`}
                    />
                    {errors.city && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.city}</p>}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter your 6-digit pincode"
                      maxLength={6}
                      className={`w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border ${
                        errors.pincode ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base`}
                    />
                    {errors.pincode && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.pincode}</p>}
                  </div>
                </div>

                {/* Investment Range (full width) */}
                <div>
                  <label htmlFor="investment" className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Range <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="investment"
                    value={formData.investment}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border ${
                      errors.investment ? 'border-red-500' : 'border-gray-300'
                    } bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base`}
                  >
                    <option value="">Select Investment Range</option>
                    <option value="Rs. 4lac - 5lac">Rs. 4lac - 5lac</option>
                    <option value="Rs. 5lac - 10lac">Rs. 5lac - 10lac</option>
                    <option value="Rs. 10lac - 20lac">Rs. 10lac - 20lac</option>
                    <option value="Rs. 20lac - 30lac">Rs. 20lac - 30lac</option>
                    <option value="Rs. 30lac - 50lac">Rs. 30lac - 50lac</option>
                    <option value="Rs. 50lac - 1 Cr.">Rs. 50lac - 1 Cr.</option>
                    <option value="Rs. 1 Cr. - 2 Cr">Rs. 1 Cr. - 2 Cr</option>
                    <option value="Rs. 2 Cr. - 5 Cr">Rs. 2 Cr. - 5 Cr</option>
                    <option value="Rs. 5 Cr. above">Rs. 5 Cr. above</option>
                  </select>
                  {errors.investment && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.investment}</p>}
                </div>

                {/* Message (full width) */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your interest"
                    rows="3"
                    className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                  ></textarea>
                </div>

                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 md:py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}