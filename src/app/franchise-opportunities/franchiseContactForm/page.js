'use client';
import { useState, useEffect, useRef } from 'react';

export default function FranchiseContactForm() {
  // Form state
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
  // Validate phone number only (name will be validated later)
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
    
    // Using your approved message template
    const message = `Dear ${formData.name}, ${otp} is OTP to verify your mobile number for confirm request. Regards RO Care India.`;
    
    // Send SMS with proper error handling
    const smsResult = await sendSms(formData.phone, message);
    
    if (smsResult) {
      setOtpSent(true);
      setCurrentStep(2); // Move to OTP verification
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
    console.log('Submitting form with params:', params.toString());
    
    const response = await fetch(
      `https://waterpurifierservicecenter.in/wizard/app/mannubhai_enquery.php?${params}`
    );
    
    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    try {
      const data = JSON.parse(responseText);
      console.log('Parsed response:', data);
      
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
      } else {
        console.error('API returned error status:', data);
        setErrors({ general: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (e) {
      console.error('Failed to parse response:', e);
      setErrors({ general: 'Unexpected response format from server' });
    }
  } catch (error) {
    console.error('Submission error:', error);
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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-8 max-w-lg">
              Ready to join our franchise network? Contact us today for more
              information and to schedule a consultation with our franchise
              team.
            </p>

            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+91 7827506245</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Email</h3>
                  <p className="text-gray-600">franchise@mannubhai.com</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Head Office</h3>
                  <p className="text-gray-600">Unit No 831 8th Floor, Head Office, JMD MEGAPOLIS, Sector 48, Gurugram, Haryana 122018</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-lg">
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {successMessage}
              </div>
            )}
            
            {/* Lockout Message */}
            {isLocked && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded mb-4">
                <strong>Account Temporarily Locked</strong><br />
                Too many failed OTP attempts. Please wait {formatTime(lockoutTimer)} before trying again.
              </div>
            )}
            
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errors.general}
              </div>
            )}

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${currentStep === 1 ? 'text-indigo-600' : currentStep > 1 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 1 ? 'bg-indigo-600 text-white' : currentStep > 1 ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}`}>
                    {currentStep > 1 ? '✓' : '1'}
                  </div>
                  <span className="ml-2 text-sm font-medium">Phone Verification</span>
                </div>
                <div className={`flex items-center ${currentStep === 2 ? 'text-indigo-600' : currentStep > 2 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 2 ? 'bg-indigo-600 text-white' : currentStep > 2 ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}`}>
                    {currentStep > 2 ? '✓' : '2'}
                  </div>
                  <span className="ml-2 text-sm font-medium">OTP Verification</span>
                </div>
                <div className={`flex items-center ${currentStep === 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 3 ? 'bg-indigo-600 text-white' : 'bg-gray-400 text-white'}`}>
                    3
                  </div>
                  <span className="ml-2 text-sm font-medium">Complete Application</span>
                </div>
              </div>
            </div>

            {/* Step 1: Phone Number */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Enter Your Phone Number</h3>
                  <p className="text-gray-600 mb-4">We'll send you an OTP to verify your phone number.</p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your 10-digit phone number"
                    maxLength={10}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={isSubmitting || isLocked}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Verify Your Phone Number</h3>
                  <p className="text-gray-600 mb-4">Enter the 6-digit OTP sent to {formData.phone}</p>
                </div>
                
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.otp ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600">
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
                    {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Resend OTP'}
                  </button>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleBackToPhone}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Complete Form */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Your Application</h3>
                  <p className="text-gray-600 mb-4">Phone verified: {formData.phone} ✓</p>
                </div>

                {/* Name */}
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
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
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
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
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
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.pincode ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
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
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.investment ? 'border-red-500' : 'border-gray-300'
                    } bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
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
                  {errors.investment && <p className="text-red-500 text-sm mt-1">{errors.investment}</p>}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your interest"
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  ></textarea>
                </div>

                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}