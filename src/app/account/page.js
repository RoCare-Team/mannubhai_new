"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { 
  MdPerson, 
  MdEmail, 
  MdPhone, 
  MdEdit, 
  MdSave, 
  MdClose, 
  MdSecurity, 
  MdCheck,
  MdCameraAlt,
  MdDelete,
  MdImage,
  MdLogout
} from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AccountDetails = () => {
  const router = useRouter();
  const [user, setUser] = useState({ name: "", email: "", mobile: "", profileImage: "" });
  const [formData, setFormData] = useState({ name: "", email: "", profileImage: "" });
  const [errors, setErrors] = useState({ name: "", email: "", image: "" });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = () => {
      try {
        const localData = {
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
          mobile: localStorage.getItem("userPhone") || "",
          profileImage: localStorage.getItem("userProfileImage") || "",
        };
        
        // Check if user is logged in (has customer_id)
        const customerId = localStorage.getItem("customer_id");
        if (!customerId) {
          router.push("/");
          toast.info("Please login to access your account");
          return;
        }
        
        // Check for OTP verification message in URL params
        const urlParams = new URLSearchParams(window.location.search);
        const otpVerified = urlParams.get('otp_verified');
        
        if (otpVerified === 'true') {
          toast.success("✅ Mobile number verified successfully");
          // Remove the query param without reloading
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        setUser(localData);
        setFormData({ 
          name: localData.name, 
          email: localData.email, 
          profileImage: localData.profileImage 
        });
        setImagePreview(localData.profileImage);
      } catch (error) {
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: "Please select a valid image file (JPEG, PNG, WebP, or GIF)" }));
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
      return;
    }

    setUploadingImage(true);
    setErrors(prev => ({ ...prev, image: "" }));

    try {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, profileImage: base64String }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setErrors(prev => ({ ...prev, image: "Failed to process image" }));
      toast.error("Failed to process image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData(prev => ({ ...prev, profileImage: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", email: "", image: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const hasChanges = () =>
    formData.name.trim() !== user.name.trim() ||
    formData.email.trim() !== user.email.trim() ||
    formData.profileImage !== user.profileImage;

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!hasChanges()) {
      toast.info("No changes to update");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer_id: localStorage.getItem("customer_id") || "",
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: localStorage.getItem("userPhone") || user.mobile || "",
        profileImage: formData.profileImage,
      };

      const res = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/update_user_dtls.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!data.error) {
        // Update localStorage with new values
        localStorage.setItem("userName", payload.name);
        localStorage.setItem("userEmail", payload.email);
        localStorage.setItem("userProfileImage", payload.profileImage);
        
        setUser({ 
          ...user, 
          name: payload.name, 
          email: payload.email,
          profileImage: payload.profileImage
        });
        toast.success("✅ Profile updated successfully");
        setIsEditing(false);
      } else {
        toast.error(data.msg || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Update failed: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      profileImage: user.profileImage 
    });
    setImagePreview(user.profileImage);
    setErrors({ name: "", email: "", image: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (

    <>
    <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 relative">
          {/* Logout Button */}
          {/* <button
            onClick={handleLogout}
            className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors duration-200"
          >
            <MdLogout className="w-5 h-5" />
            Logout
          </button> */}
          
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <MdPerson className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Account Details
          </h1>
          <p className="text-slate-600 mt-2">Manage your personal information</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Profile Picture Section */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg ring-4 ring-white">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                  )}
                  
                  {/* Upload overlay */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <MdCameraAlt className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Status indicator */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <MdCheck className="w-4 h-4 text-white" />
                </div>

                {/* Edit button for image */}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="absolute -bottom-2 -left-2 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <MdEdit className="w-3 h-3 text-white" />
                    )}
                  </button>
                )}

                {/* Remove image button */}
                {isEditing && imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-colors duration-200"
                  >
                    <MdClose className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Image upload button for mobile/easier access */}
            {isEditing && (
              <div className="flex justify-center mb-6">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors duration-200 disabled:opacity-50"
                  >
                    <MdImage className="w-4 h-4" />
                    {uploadingImage ? "Uploading..." : "Change Photo"}
                  </button>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors duration-200"
                    >
                      <MdDelete className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Image error display */}
            {errors.image && (
              <div className="flex items-center justify-center gap-2 mb-4 text-red-600 text-sm bg-red-50 rounded-lg p-3">
                <MdClose className="w-4 h-4" />
                {errors.image}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Full Name Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <MdPerson className="w-4 h-4" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-4 bg-white/80 border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                      errors.name 
                        ? "border-red-300 bg-red-50/50" 
                        : isEditing 
                        ? "border-blue-300 hover:border-blue-400" 
                        : "border-slate-200"
                    } ${!isEditing ? "cursor-not-allowed opacity-60" : ""}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <MdClose className="w-4 h-4" />
                      {errors.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <MdEmail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-4 bg-white/80 border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                      errors.email 
                        ? "border-red-300 bg-red-50/50" 
                        : isEditing 
                        ? "border-blue-300 hover:border-blue-400" 
                        : "border-slate-200"
                    } ${!isEditing ? "cursor-not-allowed opacity-60" : ""}`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <MdClose className="w-4 h-4" />
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <MdPhone className="w-4 h-4" />
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={user.mobile || "-"}
                    disabled
                    className="w-full px-4 py-4 bg-slate-100/80 border-2 border-slate-200 rounded-2xl cursor-not-allowed opacity-60"
                  />
                  <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                    <MdSecurity className="w-4 h-4" />
                    To change phone number, please contact support
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-200/50">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MdEdit className="w-5 h-5" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="flex-1 bg-white/80 text-slate-700 font-semibold py-4 px-6 rounded-2xl border-2 border-slate-200 hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <MdClose className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    onClick={() => setConfirmOpen(true)}
                    disabled={isSubmitting || !hasChanges() || uploadingImage}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none"
                  >
                    <MdSave className="w-5 h-5" />
                    {isSubmitting ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform scale-100 animate-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <MdSecurity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Confirm Update
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Are you sure you want to update your profile details? This action will save your changes permanently.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-700 font-semibold py-3 px-4 rounded-xl hover:bg-slate-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setConfirmOpen(false);
                    handleSubmit();
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                >
                  Yes, Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer 
        position="top-center" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-2xl"
      />
    </div>

    <Footer />
    </>
  
  );
};

export default AccountDetails;