"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaPhoneAlt, FaKey, FaArrowLeft, FaTimes } from "react-icons/fa";
import BasicDetails from "./BasicDetails";
import CongratsModal from "./CongratsModal";
import { toast } from "react-toastify";


const LoginPopup = ({ show, onClose, onLoginSuccess }) => {
  // State management
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("mobile");
  const [resendTime, setResendTime] = useState(0);
  const [userData, setUserData] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [openBasic, setOpenBasic] = useState(false);
  
  // Refs for OTP inputs
  const otpInputRefs = useRef([]);
  if (otpInputRefs.current.length !== 4) {
    otpInputRefs.current = Array(4).fill().map((_, i) => otpInputRefs.current[i] || React.createRef());
  }

  // Reset form completely
  const resetForm = useCallback(() => {
    setMobileNumber("");
    setOtpDigits(["", "", "", ""]);
    setError("");
    setStep("mobile");
    setIsSubmitting(false);
    setResendTime(0);
    setUserData(null);
    setOpenBasic(false);
    setShowCongrats(false);
  }, []);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      resetForm();
      onClose();
    }
  }, [onClose, resetForm]);

  const handlePhoneChange = useCallback((value) => {
    if (value === '' || /^\d+$/.test(value)) {
      setMobileNumber(value);
      setError("");
    } else {
      setError('Please enter numbers only');
    }
  }, []);

  const sendOTP = useCallback(async (resend = false) => {
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("https://waterpurifierservicecenter.in/customer/ro_customer/roservice_sendotp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: mobileNumber }),
      });

      const data = await response.json();

      if (data.error === false) {
        toast.success(data.msg);
        if (!resend) setStep("otp");
        setResendTime(30);
      } else {
        setError(data.msg || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Send OTP Error:", err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [mobileNumber]);

  const handleOtpChange = useCallback((index, value) => {
    if (value.match(/^[0-9]?$/)) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value;
      setOtpDigits(newOtpDigits);

      if (value && index < 3) {
        otpInputRefs.current[index + 1].focus();
      }
    }
  }, [otpDigits]);

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  }, [otpDigits]);
  const handleLoginComplete = useCallback((userData, skipCongrats = false) => {
    const user = {
      id: userData?.c_id || localStorage.getItem('customer_id'),
      mobile: mobileNumber,
      name: userData?.name || localStorage.getItem('userName') || "Customer",
      email: userData?.email || localStorage.getItem('userEmail') || "",
    };
    
    // Call parent's login success handler
    onLoginSuccess?.(user);
    
    // Reset and close
    resetForm();
    onClose();
    
    // Only show congrats for new users or profile completions
    if (!skipCongrats && (!userData?.name || userData?.name.trim() === "")) {
      setShowCongrats(true);
    }
  }, [mobileNumber, onClose, onLoginSuccess, resetForm]);
  const verifyOTP = useCallback(async () => {
    const otp = otpDigits.join('');
    if (!otp || !/^\d{4}$/.test(otp)) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("https://waterpurifierservicecenter.in/customer/ro_customer/service_otp_verify.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: mobileNumber, newOtp: otp }),
      });

      const data = await response.json();

      if (data.error === false) {
        // Store user data
        localStorage.setItem('userPhone', mobileNumber);
        localStorage.setItem('userToken', 'verified');
        if (data.name) localStorage.setItem('userName', data.name);
        if (data.email) localStorage.setItem('userEmail', data.email);
        if (data.c_id) localStorage.setItem('customer_id', data.c_id);
        if (data.address) localStorage.setItem('RecentAddress', JSON.stringify(data.address));
          localStorage.setItem('checkoutState', JSON.stringify(data.AllCartDetails || []));
          localStorage.setItem('cart_total_price', data.total_price || 0);

        console.log("User Data:", data);
        
        
        toast.success(data.msg);
        setUserData(data);
        
        // Determine if user needs to complete profile
        const needsProfileCompletion = !data.name || data.name.trim() === "";
        if (needsProfileCompletion) {
          setOpenBasic(true);
        } else {
          handleLoginComplete(data,true);
        }
      } else {
        setError(data.msg || "OTP verification failed");
      }
    } catch (err) {
      console.error("Verify OTP Error:", err);
      setError("OTP verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [mobileNumber, otpDigits, handleLoginComplete]);



  const handleBasicDetailsSubmit = useCallback(async (details) => {
    try {
      const fullUserData = {
        ...details,
        phoneNumber: mobileNumber
      };

      const response = await fetch("https://waterpurifierservicecenter.in/customer/ro_customer/update_user_dtls.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullUserData),
      });

      const data = await response.json();

      if (data.error === false) {
        localStorage.setItem('userName', details.name);
        if (details.email) localStorage.setItem('userEmail', details.email);
        
        toast.success("Details saved successfully!");
        setOpenBasic(false);
        handleLoginComplete({ ...userData, ...details },false);
        
        // Show congrats after profile completion
        setShowCongrats(true);
      } else {
        setError(data.msg || "Failed to save details");
      }
    } catch (error) {
      console.error("Update Details Error:", error);
      setError("Error saving details. Please try again.");
    }
  }, [mobileNumber, userData, handleLoginComplete]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setError("");
    step === "mobile" ? sendOTP() : verifyOTP();
  }, [step, sendOTP, verifyOTP]);

  // Resend OTP timer effect
  useEffect(() => {
    let timer;
    if (resendTime > 0) {
      timer = setTimeout(() => setResendTime(resendTime - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTime]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        resetForm();
        onClose();
      }
    };

    if (show) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, onClose, resetForm]);

  if (!show) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={handleOverlayClick}
      >
        <div className="relative w-full max-w-md mx-auto transform transition-all duration-300 scale-100 opacity-100">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/20 dark:from-blue-900/10 dark:to-indigo-900/5 pointer-events-none"></div>
            
            <div className="relative px-6 pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {step === "otp" && (
                    <button
                      onClick={() => setStep("mobile")}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      aria-label="Go back"
                    >
                      <FaArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  )}
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                      step === "mobile" ? "bg-blue-500" : "bg-green-500"
                    } text-white`}>
                      {step === "mobile" ? <FaPhoneAlt className="w-4 h-4" /> : <FaKey className="w-4 h-4" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {step === "mobile" ? "Login" : "Verify OTP"}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {step === "mobile" ? "Enter your mobile number" : "Check your messages"}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  aria-label="Close login"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {step === "mobile" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center">
                          <span className="flex items-center justify-center w-14 h-full text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-l-xl border-r border-gray-300 dark:border-gray-600">
                            +91
                          </span>
                        </div>
                        <input
                          type="tel"
                          value={mobileNumber}
                          onChange={(e) => handlePhoneChange(e.target.value.replace(/\D/g, ''))}
                          maxLength="10"
                          placeholder="Enter your 10-digit number"
                          className="w-full pl-14 pr-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                        Enter the 4-digit code sent to <br />
                        <span className="font-semibold text-gray-900 dark:text-white">+91 {mobileNumber}</span>
                      </p>
                      
                      <div className="flex justify-center space-x-3 mb-5">
                        {otpDigits.map((digit, index) => (
                          <input
                            key={index}
                            ref={el => otpInputRefs.current[index] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                          />
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <button
                          type="button"
                          onClick={() => sendOTP(true)}
                          disabled={resendTime > 0 || isSubmitting}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          {resendTime > 0 ? `Resend OTP in ${resendTime}s` : 'Resend OTP'}
                        </button>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          OTP expires in 5 minutes
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-xl text-base font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{step === "mobile" ? "Sending OTP..." : "Verifying..."}</span>
                    </div>
                  ) : (
                    step === "mobile" ? "Send OTP" : "Verify OTP"
                  )}
                </button>
              </form>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  🔒 Your information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BasicDetails
        open={openBasic}
        setOpen={setOpenBasic}
        phoneNumber={mobileNumber}
        onSubmitDetails={handleBasicDetailsSubmit}
        onClose={() => setOpenBasic(false)}
      />

     <CongratsModal
  open={showCongrats}
  setOpen={setShowCongrats}
  onClose={() => {
    const user = {
      id: localStorage.getItem('customer_id'),
      mobile: localStorage.getItem('userPhone'),
      name: localStorage.getItem('userName') || "Customer",
      email: localStorage.getItem('userEmail') || "",
    };
    onLoginSuccess?.(user);

    setShowCongrats(false);
  }}
/>
    </>
  );
};

export default LoginPopup;