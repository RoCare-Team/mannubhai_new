'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Head from 'next/head';
import { FaStar, FaHeart, FaThumbsUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Loading component with modern skeleton
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="animate-pulse">
        <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
      </div>
    </div>
  );
}

// Toast notification component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      } text-white font-medium`}
    >
      {message}
    </motion.div>
  );
}

// Main wrapper with Suspense
export default function ReviewPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ReviewContent />
    </Suspense>
  );
}

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const review_id = searchParams.get('review_id');
  
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cmpl_id, setCmplId] = useState('');
  const [appLink, setAppLink] = useState('https://www.mannubhai.com');
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  
  useEffect(() => {
    if (review_id) {
      const decoded = decodeString(review_id);
      setCmplId(`CMPL${decoded}`);
    }
  }, [review_id]);

  const decodeString = (encodedString) => {
    if (!encodedString) return '';
    
    try {
      const base64String = encodedString.replace(/-/g, '+').replace(/_/g, '/').replace(/,/g, '=');
      const allstring = atob(base64String);
      
      const removed_suffix_with_prefix = allstring.substring(0, allstring.indexOf('#'));
      const removed_prefix_decoded_string = removed_suffix_with_prefix.substring(
        removed_suffix_with_prefix.indexOf('~') + '~'.length
      );
      
      return removed_prefix_decoded_string;
    } catch (error) {
      console.error('Decoding error:', error);
      return '';
    }
  };

  const redirectToApp = (url) => {
    window.open(url || appLink, '_blank');
  };

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'error' });
  };

  const handleStarClick = (ratingValue) => {
    setRating(ratingValue);
  };

  const handleSubmit = async () => {
    if (!rating) {
      showToast('Please select a star rating!', 'error');
      return;
    }
    
    if (!cmpl_id) {
      showToast('CMPL ID missing.', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(
        `https://waterpurifierservicecenter.in/wizard/app/review.php?reating=${rating}&cmpl_id=${cmpl_id}&comment=${encodeURIComponent(comment)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (rating > 3) {
          showToast('Thank you for your excellent rating! Redirecting...', 'success');
          setTimeout(() => redirectToApp(data.status), 1500);
        } else {
          showToast('Thank you for your feedback!', 'success');
          setTimeout(() => redirectToApp(data.status), 1500);
        }
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Submission error:', error);
      showToast('Failed to submit feedback. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = () => {
    switch (rating) {
      case 1: return "We're sorry to hear that 😞";
      case 2: return "We can do better 🤔";
      case 3: return "Thanks for the feedback 😊";
      case 4: return "Great! We're glad you liked it 😄";
      case 5: return "Awesome! You made our day! 🌟";
      default: return "";
    }
  };

  return (
    <>
      <Head>
        <title>Share Your Experience | Review</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Share your valuable feedback with us" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      </Head>
      
      <AnimatePresence>
        {toast.show && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={hideToast}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="bg-white rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <img 
                src="logo.png" 
                alt="Logo" 
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full items-center justify-center text-white font-bold text-xl hidden">
                MN
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Share Your Experience
            </h1>
            <p className="text-gray-600 text-lg">
              Your feedback helps us serve you better
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-white/20"
          >
            {/* CMPL ID Display */}
            <div className="mb-8">
              <label className="block text-sm  text-center font-medium text-gray-700 mb-2">
                Compliant ID
              </label>
              <div className="relative flex items-center justify-center">
                <input 
                  name="feedbackMsg" 
                  className="w-50 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-center text-lg font-semibold text-gray-800 focus:outline-none"
                  id="cmpl_id" 
                  value={cmpl_id} 
                  readOnly 
                />
              </div>
            </div>
            
            {/* Star Rating Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                How would you rate our service?
              </h3>
              
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => {
                  const ratingValue = i + 1;
                  return (
                    <motion.label 
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer"
                    >
                      <input 
                        type="radio" 
                        name="rating" 
                        value={ratingValue} 
                        onClick={() => handleStarClick(ratingValue)}
                        className="hidden"
                      />
                      <FaStar 
                        className="transition-all duration-200 drop-shadow-sm hover:drop-shadow-md" 
                        color={ratingValue <= (hover || rating) ? "#fbbf24" : "#d1d5db"} 
                        size={40}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                      />
                    </motion.label>
                  );
                })}
              </div>

              {/* Rating Feedback Text */}
              <AnimatePresence>
                {rating > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center mb-6"
                  >
                    <p className="text-lg font-medium text-gray-700">
                      {getRatingText()}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Feedback Form for Low Ratings */}
            <AnimatePresence>
              {rating > 0 && rating <= 3 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                  We value your feedback – let us know how we can improve our services
                  </label>
                  <textarea 
                    name="feedbackMsg" 
                    id="feedbackMsg" 
                    placeholder="Please tell us what went wrong and how we can improve..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* High Rating Message */}
            <AnimatePresence>
              {rating > 3 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mb-6 text-center"
                >
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                    <div className="flex justify-center mb-3">
                      <div className="flex gap-2">
                        <FaHeart className="text-red-500 text-2xl animate-pulse" />
                        <FaThumbsUp className="text-green-500 text-2xl" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-green-600 mb-2">
                      Thank you for your excellent rating! 🌟
                    </h4>
                    <p className="text-gray-700">
                      Your positive feedback motivates our team to keep delivering great service!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Submit Button */}
            <AnimatePresence>
              {rating > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-8 py-4 rounded-xl font-semibold text-white text-lg transition-all duration-300 ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                    }`}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      rating > 3 ? 'Submit & Continue' : 'Submit Feedback'
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8 text-gray-500"
          >
            <p>Powered by Mannubhai Services</p>
          </motion.div>
        </div>
      </div>
    </>
  );
}