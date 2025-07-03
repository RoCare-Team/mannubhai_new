"use client";
import React, { useEffect, useState, useCallback } from "react";
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
} from "react-icons/fi";

function Booking() {
  const [activeTab, setActiveTab] = useState("active");
  const [allLeadData, setAllLeadData] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingImages, setBookingImages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  // Memoized fetch function
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const phone = JSON.parse(localStorage.getItem("userPhone"));
      if (!phone) {
        setIsLoggedIn(false);
        router.push("/");
        return;
      }

      setIsLoggedIn(true);
      const payload = { phone };
      
      const res = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/all_lead.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      
      const data = await res.json();
      if (data.service_details) {
        setAllLeadData(data.service_details);
        localStorage.setItem("all_cmpl", JSON.stringify(data.service_details));
      } else {
        // Fallback to localStorage if API returns no data
        const localData = JSON.parse(localStorage.getItem("all_cmpl") || "[]");
        setAllLeadData(localData);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      // Fallback to localStorage if API fails
      const localData = JSON.parse(localStorage.getItem("all_cmpl") || "[]");
      setAllLeadData(localData);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

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
    } else {
      setLeadStatus([]);
    }
  }, [activeTab, allLeadData]);

  const handleViewBooking = async (booking) => {
    setSelectedBooking(booking);
    setViewModalOpen(true);
    
    try {
      const payload = { lead_id: booking.lead_id };
      const res = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/lead_details.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      
      const data = await res.json();
      if (data.service_details?.[0]) {
        const serviceDetail = data.service_details[0];
        setSelectedBooking(prev => ({ ...prev, ...serviceDetail }));
        
        setBookingImages(
          serviceDetail.product_image 
            ? [{ id: 1, url: serviceDetail.product_image, name: "Service Image" }]
            : []
        );
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setBookingImages([]);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const response = await fetch(
          "https://waterpurifierservicecenter.in/customer/ro_customer/cancel_lead.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lead_id: bookingId }),
          }
        );
        
        const result = await response.json();
        if (result.success) {
          setAllLeadData(prev => 
            prev.map(booking => 
              booking.lead_id === bookingId 
                ? { ...booking, status: "Cancelled" }
                : booking
            )
          );
          setViewModalOpen(false);
          alert("Booking cancelled successfully!");
        } else {
          throw new Error(result.message || "Failed to cancel booking");
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert(error.message || "Failed to cancel booking. Please try again.");
      }
    }
  };

  const handleCallSupport = () => {
    const supportNumber = selectedBooking?.call_to_number || "+911234567890";
    window.open(`tel:${supportNumber}`, "_self");
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      "Complete": { bg: "bg-green-100", text: "text-green-800", icon: <FiCheckCircle /> },
      "Active": { bg: "bg-blue-100", text: "text-blue-800", icon: <FiClock /> },
      "Follow-up": { bg: "bg-yellow-100", text: "text-yellow-800", icon: <FiClock /> },
      "Cancelled": { bg: "bg-red-100", text: "text-red-800", icon: <FiXCircle /> },
      "Inactive": { bg: "bg-red-100", text: "text-red-800", icon: <FiXCircle /> },
    };

    const config = statusConfig[status] || { bg: "bg-gray-100", text: "text-gray-800", icon: null };

    return (
      <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
        {config.icon}
        {status}
      </span>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-md mx-4">
          <h2 className="text-xl font-bold mb-4">Please Login</h2>
          <p className="mb-6">You need to be logged in to view your bookings</p>
          <Link href="/login">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Booking History | Your Service Bookings</title>
        <meta name="description" content="View your service bookings" />
      </Head>

      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center mb-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-purple-600">
              <FiHome className="mr-2" />
              <span>Home</span>
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-purple-600 font-medium">Booking History</span>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">Your Service Bookings</h1>
                  <p className="text-purple-200 mt-1">
                    {activeTab === "active" ? "Active & upcoming services" :
                     activeTab === "delivered" ? "Completed services" : "Cancelled services"}
                  </p>
                </div>
                <button 
                  onClick={fetchServices}
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiRefreshCw className={`text-white ${loading ? 'animate-spin' : ''}`} />
                  <span className="text-white text-sm">Refresh</span>
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              {["active", "delivered", "cancelled"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-4 font-medium text-center ${
                    activeTab === tab
                      ? `text-${
                          tab === "active" ? "purple" : 
                          tab === "delivered" ? "green" : "red"
                        }-600 border-b-2 border-${
                          tab === "active" ? "purple" : 
                          tab === "delivered" ? "green" : "red"
                        }-600`
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "active" ? "Active" : 
                   tab === "delivered" ? "Completed" : "Cancelled"}
                </button>
              ))}
            </div>

            {/* Booking List */}
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="w-12 h-12 border-4 border-purple-400 border-dashed rounded-full animate-spin"></div>
                </div>
              ) : leadStatus.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leadStatus.map((service) => (
                    <div key={service.lead_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm text-gray-500">#{service.lead_id}</span>
                        <StatusBadge status={service.status} />
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2">{service.lead_type}</h3>
                      
                      <div className="flex items-center text-gray-500 mb-3">
                        <FiCalendar className="mr-2" />
                        <span className="text-sm">{service.lead_add_date}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-purple-600">₹{service.amount}</span>
                      </div>
                      
                      <button
                        onClick={() => handleViewBooking(service)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                      >
                        <FiEye />
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <FiClock className="text-gray-400 text-2xl" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    No {activeTab === "active" ? "Active" : 
                        activeTab === "delivered" ? "Completed" : "Cancelled"} Bookings
                  </h4>
                  <p className="text-gray-500 mb-6">
                    {activeTab === "active" ? "You don't have any active bookings right now." :
                     activeTab === "delivered" ? "Your completed services will appear here." :
                     "Cancelled services will appear here."}
                  </p>
                  <Link href="/service">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
                      Book a Service
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Details Modal */}
        {viewModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 rounded-t-xl sticky top-0 z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">Booking Details</h2>
                    <p className="text-purple-200 text-sm">ID: #{selectedBooking.lead_id}</p>
                  </div>
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="text-white hover:bg-white/20 p-1 rounded-full"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <FiUser className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-semibold">{selectedBooking.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <FiMapPin className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-semibold text-sm">{selectedBooking.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <FiCalendar className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Appointment</p>
                        <p className="font-semibold text-sm">
                          {selectedBooking.appointment_date || selectedBooking.lead_add_date}
                          {selectedBooking.appointment_time && ` • ${selectedBooking.appointment_time}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <FiCreditCard className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment</p>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={selectedBooking.payment_status || "Pending"} />
                          <span className="font-semibold">₹{selectedBooking.amount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Service Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {bookingImages.length > 0 ? (
                      bookingImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-4 text-gray-500">
                        No images available
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCallSupport}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FiPhone />
                    Call Support
                  </button>

                  {selectedBooking.status === "Active" && (
                    <button
                      onClick={() => handleCancelBooking(selectedBooking.lead_id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FiXCircle />
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Booking;