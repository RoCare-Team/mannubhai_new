'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function FranchiseContactForm() {
  const router = useRouter();
  
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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // OTP verification states
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(600);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  
  // Loading and submission states
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  
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

  // Progress simulation for better UX
  const simulateProgress = () => {
    setSubmissionProgress(0);
    const interval = setInterval(() => {
      setSubmissionProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 20;
      });
    }, 200);
    return interval;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    
    // Apply input filters
    let filteredValue = value;
    if (id === 'phone') {
      filteredValue = value.replace(/\D/g, '').slice(0, 10);
      // Reset phone verification if phone number changes
      if (filteredValue !== formData.phone) {
        setPhoneVerified(false);
        setOtpSent(false);
        setShowOtpField(false);
        setFormData(prev => ({ ...prev, otp: '' }));
      }
    }
    if (id === 'pincode') {
      filteredValue = value.replace(/\D/g, '').slice(0, 6);
    }
    if (id === 'otp') {
      filteredValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData(prev => ({
      ...prev,
      [id]: filteredValue
    }));
    
    // Show OTP field when investment is selected and phone is entered
    if (id === 'investment' && value && formData.phone && !phoneVerified) {
      setShowOtpField(true);
    }
    
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
      if (!/^\d{4}$/.test(value)) return "Please enter a valid 4-digit OTP";
      return null;
    }
  };

  // Send SMS function
  const sendSms = async (phone, message) => {
    try {
      const params = new URLSearchParams({
        to: phone,
        body: message
      });

      const response = await fetch(`/api/sendSms?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    
      const result = await response.text();
      
      if (response.ok) {
        return true;
      } else {
        console.error('SMS API Error:', result);
        return false;
      }
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
    setErrors({});
    
    try {
      // Generate 4-digit OTP
      const otp = Math.floor(1000 + Math.random() * 9000);
      setGeneratedOtp(otp);
      const message = `Dear Customer, Your OTP for Mannu Bhai profile verification is ${otp}. Regards, Mannubhai Service Expert`;

      const smsResult = await sendSms(formData.phone, message);
      
      if (smsResult) {
        setOtpSent(true);
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
    
    if (formData.otp === generatedOtp?.toString()) {
      setPhoneVerified(true);
      setErrors({});
      setSuccessMessage('Phone number verified successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        startLockout();
        setOtpSent(false);
        setPhoneVerified(false);
        setShowOtpField(false);
        setFormData(prev => ({ ...prev, otp: '' }));
      } else {
        setErrors({ 
          otp: `Invalid OTP. ${3 - newAttempts} attempts remaining.` 
        });
      }
    }
    
    setIsSubmitting(false);
  };

  // Validate form
  const validateForm = () => {
    const fieldsToValidate = ['name', 'email', 'phone', 'city', 'pincode', 'investment'];
    const newErrors = {};
    let isValid = true;

    fieldsToValidate.forEach(field => {
      const error = validations[field](formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Check if phone verification is required and completed
    if (formData.investment && !phoneVerified) {
      newErrors.phone = "Please verify your phone number before submitting";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Helper function to extract investment value
  const getInvestmentValue = (investmentText) => {
    if (!investmentText) return 0;
    const match = investmentText.match(/Rs\.?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ''));
    }
    return 0;
  };

  // Helper function to parse response
  const parseResponse = (responseText) => {
    try {
      return JSON.parse(responseText);
    } catch (e) {
      return { status: 0, message: 'Invalid response format' };
    }
  };

  // Helper function to reset form
  const resetForm = () => {
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
    setErrors({});
    setShowOtpField(false);
    setOtpSent(false);
    setPhoneVerified(false);
    setFailedAttempts(0);
    setGeneratedOtp(null);
    setIsFormSubmitted(false);
    setSubmissionProgress(0);
    
    // Clear timers
    if (otpIntervalRef.current) clearInterval(otpIntervalRef.current);
    if (lockoutIntervalRef.current) clearInterval(lockoutIntervalRef.current);
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setIsFormSubmitted(true);
    
    // Start progress simulation
    const progressInterval = simulateProgress();
    
    // Track form submission attempt
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Franchise Application Submit',
        content_category: 'Form Submission',
        value: getInvestmentValue(formData.investment),
        currency: 'INR',
        city: formData.city,
        pincode: formData.pincode
      });
    }

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
        `https://waterpurifierservicecenter.in/wizard/app/mannubhai_enquery.php?${params}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );
      
      const responseText = await response.text();
      const data = parseResponse(responseText);
      
      // Complete progress
      clearInterval(progressInterval);
      setSubmissionProgress(100);
      
      if (data.status === 1) {
        // Track successful submission
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'CompleteRegistration', {
            value: getInvestmentValue(formData.investment),
            currency: 'INR',
            content_name: 'Franchise Application Success'
          });
        }
        
        // Store form data in sessionStorage for the thank you page
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('franchiseFormData', JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            investment: formData.investment,
            submissionTime: new Date().toISOString()
          }));
        }
        
        // Show success message briefly before redirect
        setSuccessMessage('Application submitted successfully! Redirecting...');
        
        // Redirect to thank you page after a short delay
        setTimeout(() => {
          router.push('/franchise/thank-you');
        }, 2000);
        
      } else {
        // Track failed submission
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('trackCustom', 'FormSubmissionFailed', {
            error: data.message || 'unknown_error',
            content_name: 'Franchise Application Failed'
          });
        }
        
        setErrors({ general: data.message || 'Something went wrong. Please try again.' });
        setIsFormSubmitted(false);
      }
    } catch (error) {
      // Track error
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('trackCustom', 'FormSubmissionError', {
          error: error.message || 'network_error',
          content_name: 'Franchise Application Error'
        });
      }
      
      clearInterval(progressInterval);
      setErrors({ general: error.message || 'Error processing request. Please try again.' });
      setIsFormSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If form is submitted successfully, show submission feedback
  if (isFormSubmitted && !errors.general) {
    return (
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Success!</h2>
              <p className="text-green-700 mb-4">Your franchise application has been submitted successfully.</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-green-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${submissionProgress}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-green-600">Redirecting to thank you page...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Contact Info */}
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-700 mb-4">
              Franchise Opportunity
            </h2>
            <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
              Join our growing network of franchise partners and be part of India s leading service provider.
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

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
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

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                    {phoneVerified && <span className="text-green-600 ml-2">✓ Verified</span>}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your 10-digit phone number"
                    maxLength={10}
                    className={`w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border ${
                      errors.phone ? 'border-red-500' : phoneVerified ? 'border-green-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs md:text-sm mt-1">{errors.phone}</p>}
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

                {/* Investment Range */}
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
              </div>

              {/* OTP Section - Shows when investment is selected and phone is entered */}
              {showOtpField && formData.phone && formData.investment && !phoneVerified && !isLocked && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Mobile Verification Required</h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Please verify your mobile number to proceed with your franchise application.
                  </p>
                  
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-blue-800 mb-1">
                          Enter 4-digit OTP sent to {formData.phone}
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            id="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            placeholder="Enter OTP"
                            maxLength={4}
                            className={`flex-1 px-3 py-2 rounded-lg border ${
                              errors.otp ? 'border-red-500' : 'border-blue-300'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={isSubmitting || formData.otp.length !== 4}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            {isSubmitting ? 'Verifying...' : 'Verify'}
                          </button>
                        </div>
                        {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-blue-700">
                        <span>Failed attempts: {failedAttempts}/3</span>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpTimer > 0 || isSubmitting}
                          className={`font-medium ${
                            otpTimer > 0 || isSubmitting
                              ? 'text-blue-400 cursor-not-allowed'
                              : 'text-blue-600 hover:text-blue-800'
                          }`}
                        >
                          {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                type="submit"
                disabled={isSubmitting || (formData.investment && !phoneVerified) || isFormSubmitted}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 md:py-4 rounded-lg font-bold shadow-md hover:shadow-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base relative overflow-hidden"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Application...
                  </div>
                ) : (formData.investment && !phoneVerified) ? 
                  'Please Verify Mobile Number First' :
                  'Submit Application'
                }
              </button>
              
              {/* Additional reassurance text */}
              <p className="text-xs text-gray-500 text-center mt-2">
                By submitting this form  you agree to our terms and conditions. We ll contact you within 24-48 hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}