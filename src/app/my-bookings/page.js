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

function Booking() {
  const [activeTab, setActiveTab] = useState("Active");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch data when tab changes or component mounts
  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

const fetchBookings = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Get phone number from localStorage
    const phone = localStorage.getItem("userPhone");
    if (!phone) {
      router.push("/");
      return;
    }

    // API Request
    const response = await fetch('/api/bookings/', {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_no: phone,
        status: activeTab
      }),
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    // Process response data
    const data = await response.json();
    
    // Check if we have the expected data structure
    if (!data || !data.complainDetails || !Array.isArray(data.complainDetails)) {
      throw new Error('Invalid data structure received from server');
    }

    // Transform data with fallbacks
    const transformedData = data.complainDetails.map(item => ({
      id: item.lead_id || item.complain_id || "N/A",
      status: item.status || "Unknown",
      serviceType: item.lead_type || "Unknown Service",
      bookingDate: formatDate(item.lead_add_date),
      amount: item.payment_with_wallet_discount || "0",
      name: "N/A", // Not present in API response
      address: "N/A", // Not present in API response
      mobile: "N/A", // Not present in API response
      email: "N/A", // Not present in API response
      appointmentDate: "N/A", // Not present in API response
      paymentStatus: item.payment_status || "Pending",
      paymentMode: item.payment_mode || "N/A",
      image: item.image || null,
      call_to_number: "+911234567890" // Default support number
    }));

    setBookings(transformedData);
  } catch (err) {
    console.error("Booking fetch error:", err);
    setError(
      err.message === "Failed to fetch" 
        ? "Network error. Please check your connection."
        : err.message || "Failed to load bookings. Please try again."
    );
  } finally {
    setLoading(false);
  }
};
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setViewModalOpen(true);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      "Complete": { bg: "bg-green-100", text: "text-green-800", icon: <FiCheckCircle /> },
      "Completed": { bg: "bg-green-100", text: "text-green-800", icon: <FiCheckCircle /> },
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

  const PaymentStatusBadge = ({ status }) => {
    const statusConfig = {
      "Paid": { bg: "bg-green-100", text: "text-green-800" },
      "Pending": { bg: "bg-yellow-100", text: "text-yellow-800" },
      "Failed": { bg: "bg-red-100", text: "text-red-800" },
      default: { bg: "bg-gray-100", text: "text-gray-800" }
    };

    const { bg, text } = statusConfig[status] || statusConfig.default;

    return (
      <span className={`${bg} ${text} px-2 py-1 rounded-full text-xs font-medium`}>
        {status}
      </span>
    );
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const response = await fetch('/api/bookings/cancel', {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complain_id: bookingId
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to cancel: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          fetchBookings();
          setViewModalOpen(false);
          alert("Booking cancelled successfully!");
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking. Please try again.");
      }
    }
  };

  const handleCallSupport = () => {
    const supportNumber = selectedBooking?.call_to_number || "+911234567890";
    window.open(`tel:${supportNumber}`, "_self");
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
            onClick={fetchBookings}
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
            onClick={fetchBookings}
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
          No {activeTab === "Active" ? "Active" : activeTab === "Completed" ? "Completed" : "Cancelled"} Bookings
        </h4>
        <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-md mx-auto px-4">
          {activeTab === "Active"
            ? "You don't have any active bookings at the moment."
            : activeTab === "Completed"
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
          content="View your active, completed, and cancelled service bookings."
        />
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
                    {activeTab === "Active"
                      ? "Active & upcoming services"
                      : activeTab === "Completed"
                      ? "Completed services"
                      : "Cancelled services"}
                  </p>
                </div>
                <div className="bg-white/20 p-2 rounded-lg self-end sm:self-auto">
                  <span className="text-white text-sm font-medium">
                    {bookings.length}{" "}
                    {bookings.length === 1 ? "booking" : "bookings"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-gray-50 p-3 sm:p-4 border-b border-gray-200">
              <div className="flex flex-row gap-2 sm:gap-4 overflow-x-auto">
                <button
                  className={`px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2 transition-all whitespace-nowrap ${
                    activeTab === "Active"
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-purple-100"
                  }`}
                  onClick={() => handleTabClick("Active")}
                >
                  <FiClock className="text-xs sm:text-sm" />
                  <span className="hidden xs:inline">Active</span>
                  <span className="xs:hidden">Act</span>
                  {activeTab === "Active" && (
                    <span className="bg-white text-purple-700 font-bold px-1.5 sm:px-2 py-0.5 text-xs rounded-full">
                      {bookings.length}
                    </span>
                  )}
                </button>

                <button
                  className={`px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2 transition-all whitespace-nowrap ${
                    activeTab === "Completed"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-green-100"
                  }`}
                  onClick={() => handleTabClick("Completed")}
                >
                  <FiCheckCircle className="text-xs sm:text-sm" />
                  <span className="hidden xs:inline">Completed</span>
                  <span className="xs:hidden">Done</span>
                  {activeTab === "Completed" && (
                    <span className="bg-white text-green-700 font-bold px-1.5 sm:px-2 py-0.5 text-xs rounded-full">
                      {bookings.length}
                    </span>
                  )}
                </button>

                <button
                  className={`px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2 transition-all whitespace-nowrap ${
                    activeTab === "Cancelled"
                      ? "bg-red-600 text-white shadow-lg"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-red-100"
                  }`}
                  onClick={() => handleTabClick("Cancelled")}
                >
                  <FiXCircle className="text-xs sm:text-sm" />
                  <span className="hidden xs:inline">Cancelled</span>
                  <span className="xs:hidden">Can</span>
                  {activeTab === "Cancelled" && (
                    <span className="bg-white text-red-700 font-bold px-1.5 sm:px-2 py-0.5 text-xs rounded-full">
                      {bookings.length}
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
              ) : bookings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  {bookings.map((service) => (
                    <div
                      key={service.id}
                      className="border border-gray-100 bg-white rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-shadow group relative overflow-hidden"
                    >
                      <div className="relative z-10 flex flex-col h-full">
                        {activeTab === "Active" && (
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <FiHash className="text-purple-600 text-xs sm:text-sm" />
                              <span className="text-xs sm:text-sm font-mono text-gray-600">
                                ID: {service.id}
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
                              {service.serviceType}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                              Booked on {service.bookingDate}
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
                    ID: #{selectedBooking.id}
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
                      <p className="text-sm text-gray-500">Appointment Date</p>
                      <p className="font-semibold text-sm break-words">
                        {selectedBooking.appointmentDate || "N/A"}
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
                        <PaymentStatusBadge status={selectedBooking.paymentStatus} />
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

              {selectedBooking.image && (
                <div className="mb-6 sm:mb-8">
                  <h4 className="text-lg font-semibold">Service Image</h4>
                  <img
                    src={selectedBooking.image}
                    alt="Service"
                    className="w-full h-48 object-cover rounded-lg border mt-2"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                <button
                  onClick={handleCallSupport}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                >
                  <FiPhone className="text-sm" />
                  Call Support
                </button>

                {selectedBooking.status === "Active" && (
                  <button
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                  >
                    <FiXCircle className="text-sm" />
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Booking;