"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PhoneIcon, 
  KeyIcon, 
  ArrowLeftIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import BasicDetails from "./BasicDetails";
import CongratsModal from "./CongratsModal";
import { useAuth } from "@/app/contexts/AuthContext";

const LoginPopup = ({ show, onClose, onLoginSuccess }) => {
  const { handleLoginSuccess: contextLoginSuccess } = useAuth();

  // Optimized state with useReducer pattern for complex state
  const [state, setState] = useState({
    mobileNumber: "",
    otpDigits: ["", "", "", ""],
    isSubmitting: false,
    error: "",
    successMessage: "",
    step: "mobile",
    resendTime: 0,
    userData: null,
    showCongrats: false,
    openBasic: false,
  });

  // Memoized refs for OTP inputs
  const otpInputRefs = useRef(
    Array(4).fill().map(() => React.createRef())
  );

  // Animation variants for better UX
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const contentVariants = {
    mobile: { x: 0, opacity: 1 },
    otp: { x: 0, opacity: 1 },
    enter: { x: 20, opacity: 0 },
    exit: { x: -20, opacity: 0 }
  };

  // Optimized form reset with useCallback
  const resetForm = useCallback(() => {
    setState({
      mobileNumber: "",
      otpDigits: ["", "", "", ""],
      error: "",
      successMessage: "",
      step: "mobile",
      isSubmitting: false,
      resendTime: 0,
      userData: null,
      openBasic: false,
      showCongrats: false,
    });
  }, []);

  // Enhanced overlay click handler
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget && !state.isSubmitting) {
      resetForm();
      onClose();
    }
  }, [onClose, resetForm, state.isSubmitting]);

  // Improved phone number validation
  const handlePhoneChange = useCallback((value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 10) {
      setState(prev => ({ 
        ...prev, 
        mobileNumber: cleanValue,
        error: cleanValue.length === 10 ? "" : prev.error
      }));
    }
  }, []);

  // Optimized OTP sending with better error handling
  const sendOTP = useCallback(async (resend = false) => {
    const { mobileNumber } = state;
    
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      setState(prev => ({ 
        ...prev, 
        error: "Please enter a valid 10-digit mobile number" 
      }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isSubmitting: true, 
      error: "", 
      successMessage: "" 
    }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/roservice_sendotp.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber: mobileNumber }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error === false) {
        setState(prev => ({
          ...prev,
          successMessage: "OTP sent successfully! Please check your messages.",
          step: resend ? prev.step : "otp",
          resendTime: 30,
          isSubmitting: false
        }));
      } else {
        throw new Error(data.msg || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Send OTP Error:", err);
      const errorMessage = err.name === 'AbortError' 
        ? "Request timeout. Please try again." 
        : err.message || "Failed to send OTP. Please try again.";
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isSubmitting: false
      }));
    }
  }, [state.mobileNumber]);

  // Enhanced OTP input handling
  const handleOtpChange = useCallback((index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    setState(prev => {
      const newOtpDigits = [...prev.otpDigits];
      newOtpDigits[index] = value;
      
      // Auto-focus next input
      if (value && index < 3) {
        setTimeout(() => {
          otpInputRefs.current[index + 1]?.current?.focus();
        }, 0);
      }
      
      return { ...prev, otpDigits: newOtpDigits, error: "" };
    });
  }, []);

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !state.otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.current?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      otpInputRefs.current[index + 1]?.current?.focus();
    }
  }, [state.otpDigits]);

  // Enhanced login completion handler
  const handleLoginComplete = useCallback((userData, skipCongrats = false) => {
    const user = {
      id: userData?.c_id || localStorage.getItem('customer_id'),
      mobile: state.mobileNumber,
      name: userData?.name || localStorage.getItem('userName') || "Customer",
      email: userData?.email || localStorage.getItem('userEmail') || "",
    };
    
    onLoginSuccess?.(user);
    contextLoginSuccess(user);
    
    resetForm();
    onClose();
    
    if (!skipCongrats && (!userData?.name || userData?.name.trim() === "")) {
      setState(prev => ({ ...prev, showCongrats: true }));
    }
  }, [state.mobileNumber, onClose, onLoginSuccess, resetForm, contextLoginSuccess]);

  // Optimized OTP verification
  const verifyOTP = useCallback(async () => {
    const otp = state.otpDigits.join('');
    if (!otp || !/^\d{4}$/.test(otp)) {
      setState(prev => ({ 
        ...prev, 
        error: "Please enter a valid 4-digit OTP" 
      }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isSubmitting: true, 
      error: "", 
      successMessage: "" 
    }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/service_otp_verify.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            phoneNumber: state.mobileNumber, 
            newOtp: otp 
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error === false) {
        // Store user data efficiently
        const userDataToStore = {
          userPhone: state.mobileNumber,
          userToken: 'verified',
          userName: data.name,
          userEmail: data.email,
          customer_id: data.c_id,
          RecentAddress: JSON.stringify(data.address),
          checkoutState: JSON.stringify(data.AllCartDetails || []),
          cart_total_price: data.total_price || 0
        };

        Object.entries(userDataToStore).forEach(([key, value]) => {
          if (value) localStorage.setItem(key, value);
        });
        
        setState(prev => ({
          ...prev,
          successMessage: `Welcome back ${data.name || ''}! You've been successfully logged in.`,
          userData: data,
          isSubmitting: false
        }));
        
        const needsProfileCompletion = !data.name || data.name.trim() === "";
        if (needsProfileCompletion) {
          setState(prev => ({ ...prev, openBasic: true }));
        } else {
          handleLoginComplete(data, true);
        }
      } else {
        throw new Error(data.msg || "OTP verification failed");
      }
    } catch (err) {
      console.error("Verify OTP Error:", err);
      const errorMessage = err.name === 'AbortError' 
        ? "Request timeout. Please try again." 
        : err.message || "OTP verification failed. Please try again.";
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isSubmitting: false
      }));
    }
  }, [state.mobileNumber, state.otpDigits, handleLoginComplete]);

  const handleBasicDetailsSubmit = useCallback(async (details) => {
    try {
      const response = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/update_user_dtls.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...details,
            phoneNumber: state.mobileNumber
          }),
        }
      );

      const data = await response.json();

      if (data.error === false) {
        localStorage.setItem('userName', details.name);
        if (details.email) localStorage.setItem('userEmail', details.email);
        
        setState(prev => ({
          ...prev,
          successMessage: "Your information has been updated successfully.",
          openBasic: false,
          showCongrats: true
        }));
        
        handleLoginComplete({ ...state.userData, ...details }, false);
      } else {
        setState(prev => ({ 
          ...prev, 
          error: data.msg || "Failed to save details" 
        }));
      }
    } catch (error) {
      console.error("Update Details Error:", error);
      setState(prev => ({ 
        ...prev, 
        error: "Error saving details. Please try again." 
      }));
    }
  }, [state.mobileNumber, state.userData, handleLoginComplete]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, error: "", successMessage: "" }));
    state.step === "mobile" ? sendOTP() : verifyOTP();
  }, [state.step, sendOTP, verifyOTP]);

  // Memoized current step icon
  const currentIcon = useMemo(() => {
    return state.step === "mobile" ? PhoneIcon : KeyIcon;
  }, [state.step]);

  // Resend timer effect
  useEffect(() => {
    let timer;
    if (state.resendTime > 0) {
      timer = setTimeout(() => {
        setState(prev => ({ ...prev, resendTime: prev.resendTime - 1 }));
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [state.resendTime]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !state.isSubmitting) {
        resetForm();
        onClose();
      }
    };

    if (show) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [show, onClose, resetForm, state.isSubmitting]);

  if (!show) return null;

  const CurrentIcon = currentIcon;

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleOverlayClick}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-md mx-auto transform transition-all duration-300"
            >
              <div className="relative bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border-0 sm:border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[60vh] sm:min-h-0">
                {/* Modern gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/20 dark:from-blue-900/20 dark:via-indigo-900/10 dark:to-purple-900/5 pointer-events-none" />
                
                {/* Header with improved mobile spacing */}
                <div className="relative px-6 pt-8 pb-6 sm:pt-6 sm:pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {state.step === "otp" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setState(prev => ({ ...prev, step: "mobile" }))}
                          className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                          aria-label="Go back"
                        >
                          <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </motion.button>
                      )}
                      <div className="flex items-center space-x-4">
                        <motion.div
                          key={state.step}
                          initial={{ scale: 0.8, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className={`flex items-center justify-center w-12 h-12 rounded-2xl text-white shadow-lg ${
                            state.step === "mobile" 
                              ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                              : "bg-gradient-to-br from-emerald-500 to-emerald-600"
                          }`}
                        >
                          <CurrentIcon className="w-5 h-5" />
                        </motion.div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {state.step === "mobile" ? "Welcome" : "Verify Code"}
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {state.step === "mobile" 
                              ? "Sign in to your account" 
                              : "Check your messages"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (!state.isSubmitting) {
                          resetForm();
                          onClose();
                        }
                      }}
                      disabled={state.isSubmitting}
                      className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 disabled:opacity-50"
                      aria-label="Close login"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Main Content with smooth transitions */}
                <div className="relative px-6 pb-8 sm:pb-6">
                  <AnimatePresence mode="wait">
                    <motion.form
                      key={state.step}
                      variants={contentVariants}
                      initial="enter"
                      animate={state.step}
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      {state.step === "mobile" ? (
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="space-y-6"
                        >
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                              Mobile Number
                            </label>
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 flex items-center">
                                <span className="flex items-center justify-center w-16 h-full text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-l-2xl border-r border-gray-300 dark:border-gray-600">
                                  +91
                                </span>
                              </div>
                              <input
                                type="tel"
                                value={state.mobileNumber}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                maxLength="10"
                                placeholder="Enter 10-digit number"
                                className="w-full pl-16 pr-4 py-4 text-base border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none group-hover:border-gray-300 dark:group-hover:border-gray-600"
                                required
                                autoFocus
                              />
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="space-y-6"
                        >
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                              Enter the 4-digit verification code sent to
                              <br />
                              <span className="font-bold text-gray-900 dark:text-white text-lg">
                                +91 {state.mobileNumber}
                              </span>
                            </p>
                            
                            <div className="flex justify-center space-x-4 mb-8">
                              {state.otpDigits.map((digit, index) => (
                                <motion.input
                                  key={index}
                                  initial={{ scale: 0.8, y: 20 }}
                                  animate={{ scale: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  ref={otpInputRefs.current[index]}
                                  type="text"
                                  inputMode="numeric"
                                  maxLength="1"
                                  className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none hover:border-gray-300 dark:hover:border-gray-600"
                                  value={digit}
                                  onChange={(e) => handleOtpChange(index, e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(index, e)}
                                />
                              ))}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => sendOTP(true)}
                                disabled={state.resendTime > 0 || state.isSubmitting}
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                              >
                                <ArrowPathIcon className="w-4 h-4" />
                                <span>
                                  {state.resendTime > 0 ? `Resend in ${state.resendTime}s` : 'Resend Code'}
                                </span>
                              </motion.button>
                              <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-xs">
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                                <span>Code expires in 5 minutes</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Enhanced Status Messages */}
                      <AnimatePresence>
                        {state.error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-start space-x-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                          >
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                              {state.error}
                            </p>
                          </motion.div>
                        )}

                        {state.successMessage && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-start space-x-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                          >
                            <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                              {state.successMessage}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Enhanced Submit Button */}
                      <motion.button
                        whileHover={{ scale: state.isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: state.isSubmitting ? 1 : 0.98 }}
                        type="submit"
                        disabled={state.isSubmitting}
                        className={`w-full py-4 px-6 rounded-2xl text-base font-bold text-white transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg ${
                          state.isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] shadow-blue-500/20'
                        }`}
                      >
                        {state.isSubmitting ? (
                          <div className="flex items-center justify-center space-x-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{state.step === "mobile" ? "Sending..." : "Verifying..."}</span>
                          </div>
                        ) : (
                          <span className="flex items-center justify-center space-x-2">
                            <CurrentIcon className="w-5 h-5" />
                            <span>{state.step === "mobile" ? "Send Verification Code" : "Verify & Sign In"}</span>
                          </span>
                        )}
                      </motion.button>
                    </motion.form>
                  </AnimatePresence>
                  
                  {/* Enhanced Security Notice */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                      <span className="font-medium">Your data is secured with end-to-end encryption</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Modals */}
      <BasicDetails
        open={state.openBasic}
        setOpen={(open) => setState(prev => ({ ...prev, openBasic: open }))}
        phoneNumber={state.mobileNumber}
        onSubmitDetails={handleBasicDetailsSubmit}
        onClose={() => setState(prev => ({ ...prev, openBasic: false }))}
      />

      <CongratsModal
        open={state.showCongrats}
        setOpen={(open) => setState(prev => ({ ...prev, showCongrats: open }))}
        onClose={() => {
          const user = {
            id: localStorage.getItem('customer_id'),
            mobile: localStorage.getItem('userPhone'),
            name: localStorage.getItem('userName') || "Customer",
            email: localStorage.getItem('userEmail') || "",
          };
          
          onLoginSuccess?.(user);
          contextLoginSuccess(user);
          
          setState(prev => ({ ...prev, showCongrats: false }));
        }}
      />
    </>
  );
};

export default LoginPopup;