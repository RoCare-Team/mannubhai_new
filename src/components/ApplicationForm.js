"use client";
import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Modern Alert Component
const ModernAlert = ({ type, message, onClose, autoClose = true }) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto close after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [onClose, autoClose]);

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 border-emerald-200',
          icon: 'text-emerald-600',
          text: 'text-emerald-800',
          iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          text: 'text-red-800',
          iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          text: 'text-blue-800',
          iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-md w-full animate-in slide-in-from-right duration-300">
      <div className={`border rounded-xl p-4 shadow-lg backdrop-blur-sm ${styles.bg}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className={`h-6 w-6 ${styles.icon}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={styles.iconPath}
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${styles.text}`}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md ${styles.text} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Progress bar for auto-close */}
        {autoClose && (
          <div className="mt-2">
            <div className="w-full bg-white/30 rounded-full h-1">
              <div 
                className={`h-1 rounded-full ${type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}
                style={{
                  animation: 'shrink 5s linear forwards'
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

const ApplicationForm = ({ activeTab, service, onClose, db }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    alternateNumber: '',
    address: '',
    state: '',
    city: '',
    selectedService: activeTab,
    skills: [],
    aadhaarNumber: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [statesAndCities, setStatesAndCities] = useState({});
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [alert, setAlert] = useState(null);

  // Mock data for demo - replace with your actual fetch functions
  const mockStatesAndCities = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot']
  };

  // All services with their skills
  const servicesData = {
    appliances: {
      title: 'Appliance Repair Jobs',
      skills: [
        'Water purifier', 'Air purifier', 'Fridge', 'Washing Machine',
        'Microwave', 'Kitchen Chimney', 'LED TV', 'Vacuum Cleaner', 'Geyser'
      ]
    },
    beauty: {
      title: 'Beauty Services',
      skills: [
        'Women Salon', 'Men Salon', 'Makeup Service',
        'Spa Services', 'Men Massage', 'Hair Studio',
        'Manicure & Pedicure'
      ]
    },
    cleaning: {
      title: 'Cleaning Services',
      skills: [
        'Sofa cleaning', 'Bathroom cleaning', 'Home deep cleaning',
        'Kitchen cleaning', 'Pest control', 'Tank cleaning'
      ]
    },
    handyman: {
      title: 'Handyman Services',
      skills: [
        'Painter', 'Plumber', 'Carpenter', 'Electrician', 'Masons'
      ]
    }
  };

  // Show alert function
  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  // Mock fetch functions - replace with your actual implementations
  // const fetchStatesAndCitiesObject = async () => {
  //   return mockStatesAndCities;
  // };

  // const fetchCitiesByState = async (db, state) => {
  //   return (mockStatesAndCities[state] || []).map(city => ({ cityName: city }));
  // };

  // Fetch all states
const fetchStatesAndCitiesObject = async () => {
  const res = await fetch("https://www.waterpurifierservicecenter.in/wizard/app/getState.php");
  const data = await res.json();
  if (data?.AvailableState) {
    // return object { state: [] } format for compatibility
    const states = {};
    data.AvailableState.forEach(item => {
      states[item.state] = []; // cities will be fetched separately
    });
    return states;
  }
  return {};
};

// Fetch cities by state
const fetchCitiesByState = async (db, state) => {
  const res = await fetch(
    `https://www.waterpurifierservicecenter.in/wizard/app/getCity.php?state=${encodeURIComponent(state)}`
  );
  const data = await res.json();
  if (data?.AvailableCities) {
    return data.AvailableCities.map(c => ({ cityName: c.city_name }));
  }
  return [];
};


  // Fetch states and cities on component mount
  useEffect(() => {
    const loadStatesAndCities = async () => {
      setIsLoadingStates(true);
      try {
        const data = await fetchStatesAndCitiesObject();
        setStatesAndCities(data);
      } catch (error) {
        console.error('Failed to load states and cities:', error);
        showAlert('error', 'Failed to load location data. Please refresh the page.');
      } finally {
        setIsLoadingStates(false);
      }
    };

    loadStatesAndCities();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    const loadCitiesForState = async () => {
      if (formData.state) {
        setIsLoadingCities(true);
        try {
          const cities = await fetchCitiesByState(db, formData.state);
          setAvailableCities(cities.map(city => city.cityName));
        } catch (error) {
          console.error('Failed to load cities for state:', error);
          // Fallback to cached data
          setAvailableCities(statesAndCities[formData.state] || []);
          showAlert('error', 'Failed to load cities. Using cached data.');
        } finally {
          setIsLoadingCities(false);
        }
      } else {
        setAvailableCities([]);
      }
    };

    loadCitiesForState();
  }, [formData.state, statesAndCities]);

    // Sanitize and trim inputs
const sanitizeNumber = (value, maxLength = 10) => {
  return value.replace(/\D/g, "").slice(0, maxLength); // keep only digits
};



  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value,
  //     // Reset city when state changes
  //     ...(name === 'state' && { city: '' })
  //   }));
    
  //   // Clear error when user starts typing
  //   if (errors[name]) {
  //     setErrors(prev => ({ ...prev, [name]: '' }));
  //   }
  // };
const handleInputChange = (e) => {
  const { name, value } = e.target;

  let newValue = value.trimStart(); // remove leading spaces

  // Apply sanitization for specific fields
  if (name === "phoneNumber" || name === "alternateNumber") {
    newValue = sanitizeNumber(value, 10);
  }
  if (name === "aadhaarNumber") {
    newValue = sanitizeNumber(value, 12);
  }

  setFormData(prev => ({
    ...prev,
    [name]: newValue,
    ...(name === "state" && { city: "" }) // reset city if state changes
  }));

  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: "" }));
  }
};

  const handleServiceChange = (e) => {
    const newService = e.target.value;
    setFormData(prev => ({
      ...prev,
      selectedService: newService,
      skills: [] // Reset skills when service changes
    }));
  };

  const handleSkillChange = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };




  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (formData.phoneNumber && !/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'City is required';
    // if (!formData.aadhaarNumber.trim()) newErrors.aadhaarNumber = 'Aadhaar number is required';
    // if (formData.aadhaarNumber && !/^\d{12}$/.test(formData.aadhaarNumber.replace(/\s/g, ''))) {
    //   newErrors.aadhaarNumber = 'Please enter a valid 12-digit Aadhaar number';
    // }
    if (formData.aadhaarNumber && !/^\d{12}$/.test(formData.aadhaarNumber)) {
  newErrors.aadhaarNumber = "Please enter a valid 12-digit Aadhaar number";
}
    if (formData.skills.length === 0) newErrors.skills = 'Please select at least one skill';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    
    if (!validateForm()) {
      showAlert('error', 'Please fix the errors in the form before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock submission - replace with your actual Firebase code
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const applicationData = {
        ...formData,
        serviceTitle: servicesData[formData.selectedService].title,
        // submittedAt: new Date().toISOString(), // Replace with serverTimestamp()
        submittedAt: serverTimestamp(),
        status: 'pending'
      };

      await addDoc(collection(db, 'applications'), applicationData);
      console.log('Application submitted:', applicationData);
      
      showAlert('success', '🎉 Application submitted successfully! We will contact you within 24 hours.');
      
      // Close form after a delay to show the success message
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      showAlert('error', 'Failed to submit application. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentService = servicesData[formData.selectedService] || servicesData[activeTab];

  return (
    <>
      {/* Modern Alert */}
      {alert && (
        <ModernAlert
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
        />
      )}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${service?.gradient || 'from-blue-600 to-purple-600'} p-6 text-white relative`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Join as Partner</h2>
            <p className="text-white/90">Fill in your details to join our partner network</p>
          </div>

          {/* Form */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Work Category *
                </label>
                <select
                  name="selectedService"
                  value={formData.selectedService}
                  onChange={handleServiceChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {Object.entries(servicesData).map(([key, service]) => (
                    <option key={key} value={key}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                     length="10"
                    maxLength="10"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 10-digit phone number"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>

              {/* Alternate Number and Aadhaar */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Alternate Number
                  </label>
                  <input
                    type="tel"
                    name="alternateNumber"
                    value={formData.alternateNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter alternate number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    length="12"
                    maxLength="12"
                    value={formData.aadhaarNumber}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.aadhaarNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 12-digit Aadhaar number"
                  />
                  {errors.aadhaarNumber && <p className="text-red-500 text-sm mt-1">{errors.aadhaarNumber}</p>}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your complete address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              {/* State and City */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={isLoadingStates}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    } ${isLoadingStates ? 'bg-gray-100' : ''}`}
                  >
                    <option value="">
                      {isLoadingStates ? 'Loading states...' : 'Select State'}
                    </option>
                    {Object.keys(statesAndCities).sort().map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!formData.state || isLoadingCities}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    } ${!formData.state || isLoadingCities ? 'bg-gray-100' : ''}`}
                  >
                    <option value="">
                      {isLoadingCities ? 'Loading cities...' : 'Select City'}
                    </option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
              </div>

              {/* Skills Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Select Your Skills * (Choose all that apply)
                </label>
                {errors.skills && <p className="text-red-500 text-sm mb-3">{errors.skills}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentService.skills.map((skill, index) => (
                    <label
                      key={index}
                      className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill)}
                        onChange={() => handleSkillChange(skill)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700 font-medium">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r ${service?.gradient || 'from-blue-600 to-purple-600'} text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationForm;
