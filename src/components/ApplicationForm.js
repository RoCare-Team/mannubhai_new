"use client";
import { useState, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';

const ApplicationForm = ({ activeTab, service, onClose, db }) => {
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    gender: '',
    experience: '',
    qualifications: '',
    address: '',
    expertise: [],
    addressProof: null,
    serviceType: activeTab,
    timestamp: ''
  });

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;

    // Clear error if exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Handle checkbox inputs differently
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        expertise: checked
          ? [...prev.expertise, value]
          : prev.expertise.filter(item => item !== value)
      }));

      // Clear expertise error when user selects/deselects
      if (errors.expertise) {
        setErrors(prev => ({ ...prev, expertise: '' }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    // Limit to 10 digits
    if (value.length > 10) return;

    setFormData(prev => ({
      ...prev,
      mobile: value
    }));

    // Clear mobile error when user starts typing
    if (errors.mobile) {
      setErrors(prev => ({ ...prev, mobile: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setFormData(prev => ({ ...prev, addressProof: null }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, addressProof: 'File size should be less than 5MB' }));
      return;
    }

    setErrors(prev => ({ ...prev, addressProof: '' }));
    setFormData(prev => ({
      ...prev,
      addressProof: file
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    // Step 1 validation
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';

      const cleanMobile = formData.mobile.replace(/\D/g, '');
      if (!cleanMobile) newErrors.mobile = 'Mobile number is required';
      else if (cleanMobile.length !== 10) newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    // Step 2 validation
    if (step === 2) {
      if (!formData.gender) newErrors.gender = 'Please select your gender';
      if (!formData.experience) newErrors.experience = 'Please select your experience';
      if (formData.expertise.length === 0) newErrors.expertise = 'Please select at least one skill';
    }

    // Step 3 validation
    if (step === 3) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.addressProof) newErrors.addressProof = 'Please upload address proof';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    
    const isValid = validateStep(formStep);
    
    if (isValid) {
      setFormStep(prev => Math.min(prev + 1, 3));
      
      // Scroll to top of form
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handlePrevious = () => {
    setFormStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        timestamp: new Date().toISOString(),
        addressProof: formData.addressProof ? formData.addressProof.name : 'No file uploaded'
      };

      await addDoc(collection(db, "applications"), submissionData);
      alert('Application submitted successfully!');
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className={`bg-gradient-to-r ${service.gradient} text-white p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Apply for {service.title}
              </h2>
              <p className="opacity-90">Step {formStep} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step <= formStep ? 'bg-white text-gray-800' : 'bg-white/30 text-white'
                }`}>
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div 
                className={`bg-white h-2 rounded-full transition-all duration-300`} 
                style={{ width: `${(formStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <form onSubmit={formStep === 3 ? handleSubmit : handleNext}>
          <div ref={formRef} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Step 1: Personal Information */}
            {formStep === 1 && (
              <div className="space-y-6" key="step1">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h3>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="Enter your full name"
                      disabled={loading}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="your.email@example.com"
                      disabled={loading}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleMobileChange}
                      className={`w-full px-4 py-3 border ${
                        errors.mobile ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="9876543210"
                      disabled={loading}
                    />
                    {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification (Optional)
                    </label>
                    <input
                      type="text"
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., 12th Pass, ITI, Diploma"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Experience & Skills */}
            {formStep === 2 && (
              <div className="space-y-6" key="step2">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Experience & Skills</h3>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.gender ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      disabled={loading}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience *
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.experience ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      disabled={loading}
                    >
                      <option value="">Select Experience</option>
                      <option value="0-1 years">0-1 years</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5-10 years">5-10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                    {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Your Skills * (Choose all that apply)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.skills && service.skills.map((skill, index) => (
                        <label 
                          key={index} 
                          className={`group flex items-center p-4 border-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                            formData.expertise.includes(skill)
                              ? 'border-blue-500 bg-blue-50'
                              : errors.expertise
                                ? 'border-red-500'
                                : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="expertise"
                            value={skill}
                            checked={formData.expertise.includes(skill)}
                            onChange={handleInputChange}
                            className="sr-only"
                            disabled={loading}
                          />
                          <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                            formData.expertise.includes(skill)
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 group-hover:border-gray-400'
                          }`}>
                            {formData.expertise.includes(skill) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-gray-700">{skill}</span>
                        </label>
                      ))}
                    </div>
                    {errors.expertise && <p className="text-red-500 text-sm mt-2">{errors.expertise}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Address & Documents */}
            {formStep === 3 && (
              <div className="space-y-6" key="step3">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Address & Documents</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-4 py-3 border ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Enter your complete address with landmark"
                    disabled={loading}
                  ></textarea>
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Address Proof *
                    <span className="text-xs text-gray-500 ml-1">(Aadhar, Voter ID, Driving License, etc.)</span>
                  </label>
                  <div className={`border-2 border-dashed ${
                    errors.addressProof ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  } rounded-xl p-6 text-center transition-all duration-200`}>
                    <input
                      type="file"
                      name="addressProof"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="addressProof"
                      disabled={loading}
                    />
                    <label
                      htmlFor="addressProof"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="text-sm text-gray-600 mb-1">
                        {formData.addressProof
                          ? `Selected: ${formData.addressProof.name}`
                          : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, JPG, or PNG (Max 5MB)
                      </p>
                    </label>
                  </div>
                  {errors.addressProof && <p className="text-red-500 text-sm mt-1">{errors.addressProof}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Form Footer with Navigation Buttons */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-between">
              {formStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={loading}
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {formStep < 3 ? (
                <button
                  type="submit"
                  className={`px-8 py-3 bg-gradient-to-r ${service.gradient} text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2`}
                  disabled={loading}
                >
                  Next Step
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  className={`px-8 py-3 bg-gradient-to-r ${service.gradient} text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;