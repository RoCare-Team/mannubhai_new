"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import {
  FiHome,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiCalendar,
  FiEye,
  FiPhone,
  FiUpload,
  FiX,
  FiRefreshCw,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiImage,
  FiHash,
  FiAlertCircle,
  FiWifiOff
} from "react-icons/fi";

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [currentServices, setCurrentServices] = useState([]);
  const [allLeadData, setAllLeadData] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingImages, setBookingImages] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  // Network status detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Pull-to-refresh functionality
  useEffect(() => {
    const container = document.querySelector('.min-h-screen');
    let startY = 0;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const y = e.touches[0].clientY;
      if (y > startY + 50 && window.scrollY === 0 && !refreshing) {
        setRefreshing(true);
        fetchServices().finally(() => setRefreshing(false));
      }
    };

    container?.addEventListener('touchstart', handleTouchStart);
    container?.addEventListener('touchmove', handleTouchMove);

    return () => {
      container?.removeEventListener('touchstart', handleTouchStart);
      container?.removeEventListener('touchmove', handleTouchMove);
    };
  }, [refreshing]);

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const userVerified = JSON.parse(localStorage.getItem("userPhone"));
        if (!userVerified) {
          router.push("/");
          return;
        }

        await fetchServices();
        
        if (allLeadData.length === 0) {
          const allServices = JSON.parse(localStorage.getItem("all_cmpl") || "[]");
          if (allServices.length > 0) {
            setCurrentServices(allServices);
            setAllLeadData(allServices);
          }
        }
      } catch (err) {
        console.error("Initial data loading error:", err);
        setError("Failed to load booking data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [router]);

  // Filter leads based on active tab
  useEffect(() => {
    if (allLeadData.length > 0) {
      let filtered = [];
      switch (activeTab) {
        case "active":
          filtered = allLeadData.filter(
            lead => lead.status === "Active" || lead.status === "Follow-up"
          );
          break;
        case "delivered":
          filtered = allLeadData.filter(lead => lead.status === "Complete");
          break;
        case "cancelled":
          filtered = allLeadData.filter(
            lead => lead.status === "Cancelled" || lead.status === "Inactive"
          );
          break;
        default:
          filtered = allLeadData;
      }
      setLeadStatus(filtered);
    }
  }, [activeTab, allLeadData]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const phone = JSON.parse(localStorage.getItem("userPhone"));
      if (!phone) {
        router.push("/");
        return;
      }

      const payload = { phone };
      const res = await fetch('/api/fetchLeads', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.service_details) {
        const transformedData = transformLeadData(data.service_details);
        setCurrentServices(transformedData);
        setAllLeadData(transformedData);
        localStorage.setItem("all_cmpl", JSON.stringify(transformedData));
      } else {
        throw new Error("Invalid data format from API");
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to fetch bookings. Please try again.");
      if (err.message.includes('Failed to fetch')) {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const transformLeadData = (rawData) => {
    if (!Array.isArray(rawData)) return [];
    
    return rawData.map(item => ({
      lead_id: item.lead_id || "N/A",
      status: item.status || "Unknown",
      lead_type: item.lead_type || "Unknown Service",
      lead_add_date: item.lead_add_date || new Date().toLocaleDateString(),
      amount: item.amount || "0",
      name: item.name || "N/A",
      address: item.address || "N/A",
      mobile: item.mobile || "N/A",
      email: item.email || "N/A",
      appointment_date: item.appointment_date || item.lead_add_date || "N/A",
      appointment_time: item.appointment_time || "N/A",
      payment_status: item.payment_status || "Unknown",
      call_to_number: item.call_to_number || "+911234567890",
      product_image: item.product_image || null,
      ...item
    }));
  };

  const handleViewBooking = async (booking) => {
    try {
      setSelectedBooking(booking);
      setViewModalOpen(true);
      
      const payload = { lead_id: booking.lead_id };
      const res = await fetch('/api/fetchLeadDetails', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (data.service_details?.[0]) {
        const serviceDetail = data.service_details[0];
        setSelectedBooking(prev => ({ ...prev, ...serviceDetail }));
        
        setBookingImages(
          serviceDetail.product_image 
            ? [{ id: 1, url: serviceDetail.product_image, name: "Service Image", isProductImage: true }]
            : []
        );
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          url: e.target.result,
          name: file.name,
          file: file
        };
        setBookingImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        setAllLeadData(prev => 
          prev.map(booking => 
            booking.lead_id === bookingId 
              ? { ...booking, status: "Cancelled" }
              : booking
          )
        );
        setViewModalOpen(false);
        alert("Booking cancelled successfully!");
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking. Please try again.");
      }
    }
  };

  const handleRescheduleBooking = (bookingId) => {
    console.log("Rescheduling booking:", bookingId);
    alert("Reschedule feature will be implemented soon!");
  };

  const handleCallSupport = () => {
    const supportNumber = selectedBooking?.call_to_number || "+911234567890";
    window.open(`tel:${supportNumber}`, "_self");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      "Complete": { bg: "bg-green-100", text: "text-green-800", icon: <FiCheckCircle /> },
      "Active": { bg: "bg-blue-100", text: "text-blue-800", icon: <FiClock /> },
      "Follow-up": { bg: "bg-yellow-100", text: "text-yellow-800", icon: <FiClock /> },
      "Cancelled": { bg: "bg-red-100", text: "text-red-800", icon: <FiXCircle /> },
      "Inactive": { bg: "bg-red-100", text: "text-red-800", icon: <FiXCircle /> },
      default: { bg: "bg-gray-100", text: "text-gray-800", icon: null }
    };

    const { bg, text, icon } = statusConfig[status] || statusConfig.default;

    return (
      <span className={`${bg} ${text} px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
        {icon && React.cloneElement(icon, { className: "mr-1" })}
        {status}
      </span>
    );
  };

  const renderEmptyState = () => {
    if (!isOnline) {
      return (
        <div className="text-center py-8 sm:py-10">
          <div className="mx-auto bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <FiWifiOff className="text-red-500 text-2xl" />
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            No Internet Connection
          </h4>
          <p className="text-gray-500 mb-6">
            Please check your network and try again.
          </p>
          <button 
            onClick={fetchServices}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-6 rounded-full transition-all shadow-lg hover:shadow-2xl text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 sm:py-10">
          <div className="mx-auto bg-red-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <FiAlertCircle className="text-red-500 text-2xl" />
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Error Loading Data
          </h4>
          <p className="text-gray-500 mb-6">
            {error}
          </p>
          <button 
            onClick={fetchServices}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-6 rounded-full transition-all shadow-lg hover:shadow-2xl text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="text-center py-8 sm:py-10">
        <div className="mx-auto bg-gray-100 p-3 sm:p-4 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4">
          <FiClock className="text-gray-400 text-2xl sm:text-3xl" />
        </div>
        <h4 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
          No {activeTab === "active" ? "Active" : activeTab === "delivered" ? "Completed" : "Cancelled"} Bookings
        </h4>
        <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-md mx-auto px-4">
          {activeTab === "active"
            ? "You don't have any active bookings at the moment."
            : activeTab === "delivered"
            ? "Your completed services will appear here."
            : "Cancelled services will appear here."}
        </p>
        <Link href={"/service"}>
          <button className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-medium py-2.5 px-6 rounded-full transition-all shadow-lg hover:shadow-2xl text-sm sm:text-base">
            Explore Our Services
          </button>
        </Link>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Booking History | Your Service Bookings</title>
        <meta
          name="description"
          content="View your active, completed, and cancelled service bookings. Track your service history easily on Mannubhai Service."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourdomain.com/booking" />
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-2 sm:p-4">
        <div className="w-full max-w-7xl">
          <div className="flex items-center text-left mb-4 sm:mb-6 px-2 sm:px-0">
            <Link
              href={"/"}
              className="flex items-center text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
            >
              <FiHome className="mr-1 sm:mr-2 text-sm sm:text-base" />
              <span>Home</span>
            </Link>
            <span className="mx-1 sm:mx-2 text-gray-400">/</span>
            <span className="text-purple-600 font-medium text-sm sm:text-base">Booking History</span>
          </div>

          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Your Service Bookings
                  </h3>
                  <p className="text-purple-200 mt-1 text-sm sm:text-base">
                    {activeTab === "active"
                      ? "Active & upcoming services"
                      : activeTab === "delivered"
                      ? "Completed services"
                      : "Cancelled services"}
                  </p>
                </div>
                <div className="bg-white/20 p-2 rounded-lg self-end sm:self-auto">
                  <span className="text-white text-sm font-medium">
                    {leadStatus.length}{" "}
                    {leadStatus.length === 1 ? "booking" : "bookings"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-gray-50 p-3 sm:p-4 border-b border-gray-200">
              <div className="flex flex-row gap-2 sm:gap-4 overflow-x-auto">
                <button
                  className={`px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2 transition-all whitespace-nowrap ${
                    activeTab === "active"
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-purple-100"
                  }`}
                  onClick={() => handleTabClick("active")}
                >
                  <FiClock className="text-xs sm:text-sm" />
                  <span className="hidden xs:inline">Active</span>
                  <span className="xs:hidden">Act</span>
                  {activeTab === "active" && (
                    <span className="bg-white text-purple-700 font-bold px-1.5 sm:px-2 py-0.5 text-xs rounded-full">
                      {leadStatus.length}
                    </span>
                  )}
                </button>

                <button
                  className={`px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2 transition-all whitespace-nowrap ${
                    activeTab === "delivered"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-green-100"
                  }`}
                  onClick={() => handleTabClick("delivered")}
                >
                  <FiCheckCircle className="text-xs sm:text-sm" />
                  <span className="hidden xs:inline">Completed</span>
                  <span className="xs:hidden">Done</span>
                  {activeTab === "delivered" && (
                    <span className="bg-white text-green-700 font-bold px-1.5 sm:px-2 py-0.5 text-xs rounded-full">
                      {leadStatus.length}
                    </span>
                  )}
                </button>

                <button
                  className={`px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2 transition-all whitespace-nowrap ${
                    activeTab === "cancelled"
                      ? "bg-red-600 text-white shadow-lg"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-red-100"
                  }`}
                  onClick={() => handleTabClick("cancelled")}
                >
                  <FiXCircle className="text-xs sm:text-sm" />
                  <span className="hidden xs:inline">Cancelled</span>
                  <span className="xs:hidden">Can</span>
                  {activeTab === "cancelled" && (
                    <span className="bg-white text-red-700 font-bold px-1.5 sm:px-2 py-0.5 text-xs rounded-full">
                      {leadStatus.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-6">
              {loading ? (
                <div className="flex justify-center py-10 opacity-70">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-400 border-dashed rounded-full animate-spin"></div>
                </div>
              ) : leadStatus.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  {leadStatus.map((service) => (
                    <div
                      key={service.lead_id}
                      className="border border-gray-100 bg-white rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-shadow group relative overflow-hidden"
                    >
                      <div className="relative z-10 flex flex-col h-full">
                        {activeTab === "active" && (
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <FiHash className="text-purple-600 text-xs sm:text-sm" />
                              <span className="text-xs sm:text-sm font-mono text-gray-600">
                                ID: {service.lead_id}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="flex-shrink-0 bg-purple-100 p-2 sm:p-3 rounded-xl">
                            <FiCalendar className="text-purple-600 text-base sm:text-xl" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-lg leading-tight truncate">
                              {service.lead_type}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                              Booked on {service.lead_add_date}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-4 gap-2 xs:gap-0">
                          <StatusBadge status={service.status} />
                          <p className="text-base sm:text-lg font-bold text-purple-600 flex items-center">
                            <span className="mr-1">₹</span>
                            {service.amount}
                          </p>
                        </div>

                        <button
                          onClick={() => handleViewBooking(service)}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-medium py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          <FiEye className="text-xs sm:text-sm" />
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                renderEmptyState()
              )}
            </div>
          </div>
        </div>
      </div>

      {viewModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4 sm:p-6 rounded-t-2xl sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Booking Details
                  </h3>
                  <p className="text-purple-200 text-sm sm:text-base">
                    ID: #{selectedBooking.lead_id}
                  </p>
                </div>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <FiX className="text-lg sm:text-xl" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                      <FiUser className="text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Customer Name</p>
                      <p className="font-semibold truncate">
                        {selectedBooking.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                      <FiMapPin className="text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-semibold text-sm leading-relaxed break-words">
                        {selectedBooking.address || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                      <FiCalendar className="text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Appointment Date & Time</p>
                      <p className="font-semibold text-sm break-words">
                        {selectedBooking.appointment_date || selectedBooking.lead_add_date || "N/A"}
                        {selectedBooking.appointment_time && selectedBooking.appointment_time !== "0-0" && 
                          ` • ${selectedBooking.appointment_time}`
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                      <FiPhone className="text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-semibold break-all">
                        {selectedBooking.mobile || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500 break-all">
                        {selectedBooking.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                      <FiCreditCard className="text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <div className="flex flex-col xs:flex-row xs:items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                          selectedBooking.payment_status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : selectedBooking.payment_status === 'Pending'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedBooking.payment_status || "N/A"}
                        </span>
                        <span className="font-semibold">₹{selectedBooking.amount || "0"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                      <FiCheckCircle className="text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Service Status</p>
                      <StatusBadge status={selectedBooking.status} />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                      <FiPhone className="text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Support Number</p>
                      <p className="font-semibold text-blue-600 break-all">
                        {selectedBooking.call_to_number || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-4 gap-3">
                  <h4 className="text-lg font-semibold">Service Images</h4>
                  <label className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-colors text-sm">
                    <FiUpload className="text-sm" />
                    Upload Images
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {bookingImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-24 sm:h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center p-2">
                        <span className="text-white text-xs sm:text-sm font-medium text-center">
                          {image.name}
                        </span>
                      </div>
                    </div>
                  ))}
                  {bookingImages.length === 0 && (
                    <div className="col-span-full text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                      No images uploaded yet
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                <button
                  onClick={handleCallSupport}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                >
                  <FiPhone className="text-sm" />
                  Call Support
                </button>

                {selectedBooking.status === "Active" && (
                  <>
                    <button
                      onClick={() => handleRescheduleBooking(selectedBooking.lead_id)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                    >
                      <FiRefreshCw className="text-sm" />
                      Reschedule
                    </button>

                    <button
                      onClick={() => handleCancelBooking(selectedBooking.lead_id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                    >
                      <FiXCircle className="text-sm" />
                      Cancel Booking
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}