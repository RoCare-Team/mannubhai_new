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
    otp: ''
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
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

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validations).forEach(field => {
      if (field === 'otp' && !otpSent) return;
      
      const error = validations[field](formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
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
    const nameError = validations.name(formData.name);
    
    if (phoneError || nameError) {
      setErrors({
        phone: phoneError,
        name: nameError
      });
      return;
    }

    setIsSubmitting(true);
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOtp(otp);
    
    const message = `Dear ${formData.name}, ${otp} is OTP to verify your mobile number for confirm request. Regards RO Care India.`;
    
    const smsResult = await sendSms(formData.phone, message);
    
    if (smsResult) {
      setOtpSent(true);
      startOtpTimer();
    } else {
      setErrors({ general: 'Failed to send OTP. Please try again.' });
    }
    
    setIsSubmitting(false);
  };

  // Verify OTP and submit
  const verifyAndSubmit = async () => {
    if (formData.otp === generatedOtp.toString()) {
      await submitToAPI();
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        startLockout();
        setOtpSent(false);
        setFormData(prev => ({ ...prev, otp: '' }));
      } else {
        setErrors({ 
          otp: `Invalid OTP. ${3 - newAttempts} attempts remaining.` 
        });
      }
    }
  };

  // Submit to API
  const submitToAPI = async () => {
    setIsSubmitting(true);
    
    const params = new URLSearchParams({
      name: formData.name,
      pincode: formData.pincode,
      city: formData.city,
      invst_rang: formData.investment,
      email: formData.email,
      mobile: formData.phone,
      site_url: 'https://mannubhai.com'
    });

    try {
      const response = await fetch(
        `https://waterpurifierservicecenter.in/wizard/app/mannubhai_enquery.php?${params}`
      );
      
      const data = await response.json();
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
          otp: ''
        });
        setOtpSent(false);
        setFailedAttempts(0);
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Error processing request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setErrors({ general: 'Account is temporarily locked. Please wait for the lockout period to expire.' });
      return;
    }

    if (!validateForm()) return;

    if (otpSent) {
      await verifyAndSubmit();
    } else {
      await handleSendOtp();
    }
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

            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
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

              {/* OTP Section */}
              {otpSent && (
                <div className="space-y-2">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className={`flex-1 px-4 py-3 rounded-lg border ${
                        errors.otp ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpTimer > 0 || isSubmitting}
                      className={`px-4 py-3 rounded-lg font-medium transition ${
                        otpTimer > 0 || isSubmitting
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {otpTimer > 0 ? `Resend (${otpTimer})` : 'Resend OTP'}
                    </button>
                  </div>
                  {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                  <div className="text-sm text-gray-600">
                    Failed attempts: <span className="font-semibold">{failedAttempts}</span>/3
                  </div>
                </div>
              )}

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
                  placeholder="Tell us about your interest"
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLocked}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : otpSent ? (
                  <span>Verify & Submit</span>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}