"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPopup from "@/components/login";
import BookingSlots from "../BookingData/BookingSlots/page";
import Link from "next/link";
import Image from "next/image";
import { 
  FiUser, FiMail, FiPhone, FiMapPin, 
  FiClock, FiCheck, FiPlus, FiMinus, 
  FiShoppingCart, FiChevronRight, FiX 
} from "react-icons/fi";

const CheckOut = () => {
  // State management
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [cartDataArray, setCartDataArray] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentAddress, setRecentAddress] = useState(null);
  const [recentAddresses, setRecentAddresses] = useState([]);
  const [currentBookingItem, setCurrentBookingItem] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [bookingData, setBookingData] = useState({
    address: null,
    timeSlot: null,
    addressId: null,
  });
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Items to remove from localStorage after booking confirmation
  const itemsToRemove = [
    "bookingTimeSlot",
    "bookingAddress",
    "time_slot",
    "address_id",
  ];

  // Helper functions
  const handlePopup = () => setShowModal(true);

  const getLocalStorageItem = (key, defaultValue = null) => {
    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const setLocalStorageItem = (key, value) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting ${key} to localStorage:`, error);
      }
    }
  };

  const removeLocalStorageItems = () => {
    itemsToRemove.forEach(item => {
      localStorage.removeItem(item);
    });
  };

  const displayCartData = () => {
    const cartDataArray = getLocalStorageItem("checkoutState", []);
    setCartDataArray(cartDataArray);
  };

  const fetchRecentAddress = async (customerId) => {
    try {
      const storedAddresses = getLocalStorageItem("RecentAddress", []);
      if (Array.isArray(storedAddresses) && storedAddresses.length > 0) {
        setRecentAddresses(storedAddresses);
        setRecentAddress(storedAddresses[0]);
        if (storedAddresses[0].id) {
          localStorage.setItem("address_id", storedAddresses[0].id);
        }
        return;
      }

      const response = await fetch(
        `https://waterpurifierservicecenter.in/customer/ro_customer/get_recent_address.php?customer_id=${customerId}`
      );
      const data = await response.json();

      if (data.success && data.address) {
        const addresses = Array.isArray(data.address) ? data.address : [data.address];
        setRecentAddresses(addresses);
        setRecentAddress(addresses[0]);
        if (addresses[0]?.id) {
          localStorage.setItem("address_id", addresses[0].id);
        }
        setLocalStorageItem("RecentAddress", addresses);
      }
    } catch (error) {
      console.error("Error fetching recent address:", error);
      const fallback = getLocalStorageItem("RecentAddress", []);
      if (Array.isArray(fallback) && fallback.length > 0) {
        setRecentAddresses(fallback);
        setRecentAddress(fallback[0]);
      }
    }
  };

  const refreshBookingData = useCallback(() => {
    const address = localStorage.getItem("bookingAddress");
    const timeSlot = localStorage.getItem("bookingTimeSlot");
    const addressId = localStorage.getItem("address_id");

    setBookingData({
      address,
      timeSlot: timeSlot ? JSON.parse(timeSlot) : null,
      addressId,
    });
    setBookingCompleted(address && timeSlot && addressId);
  }, []);

  const checkLoginStatus = () => {
    if (typeof window !== "undefined") {
      try {
        const userToken = localStorage.getItem("userToken");
        const userPhone = localStorage.getItem("userPhone");
        const userName = localStorage.getItem("userName");
        const userEmail = localStorage.getItem("userEmail");
        const customerId = localStorage.getItem("customer_id");

        const loggedIn = !!userToken;
        setIsLoggedIn(loggedIn);
        if (userPhone) setPhoneNumber(userPhone);

        if (loggedIn && customerId) {
          setUserInfo({
            phone: userPhone,
            name: userName || "Customer",
            email: userEmail || "",
            id: customerId,
          });
          fetchRecentAddress(customerId);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    }
  };

  // Cart operations
  const onIncrement = async (service_id, type, qunt) => {
    const cid = localStorage.getItem("customer_id");
    const num = Number(qunt);
    const quantity = num + 1;

    if (quantity <= 5) {
      try {
        const res = await fetch(
          "https://waterpurifierservicecenter.in/customer/ro_customer/add_to_cart.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ service_id, type, cid, quantity }),
          }
        );
        const data = await res.json();
        localStorage.setItem("checkoutState", JSON.stringify(data.AllCartDetails));
        localStorage.setItem("cart_total_price", data.total_main);
        displayCartData();
      } catch (error) {
        toast.error("Error updating cart");
        console.error("Error:", error);
      }
    } else {
      toast.error("You can't add more than 5 items");
    }
  };

  const onDecrement = async (service_id, type, qunt) => {
    const cid = localStorage.getItem("customer_id");
    const num = Number(qunt);
    const quantity = num - 1;

    if (quantity >= 0) {
      try {
        const res = await fetch(
          "https://waterpurifierservicecenter.in/customer/ro_customer/add_to_cart.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ service_id, type, cid, quantity }),
          }
        );
        const data = await res.json();
        localStorage.setItem(
          "checkoutState",
          JSON.stringify(data.AllCartDetails == null ? [] : data.AllCartDetails)
        );
        localStorage.setItem(
          "cart_total_price",
          data.total_main == null ? 0 : data.total_main
        );

        if (quantity === 0) {
          const oldCartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
          const updatedCartItems = oldCartItems.filter((id) => id !== service_id);
          localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        }
        displayCartData();
      } catch (error) {
        toast.error("Error updating cart");
        console.error("Error:", error);
      }
    }
  };

  // Booking flow
  const handleBookNowClick = (service) => {
    if (!isLoggedIn) {
      handlePopup();
      return;
    }
    setCurrentBookingItem(service);
    setShowBookingModal(true);
    setTimeout(() => refreshBookingData(), 100);
  };

  const isBookingComplete = () => {
    return bookingData.address && bookingData.timeSlot && bookingData.addressId;
  };

  const handleProceedToPayment = () => {
    refreshBookingData();
    setTimeout(() => {
      const isComplete = isBookingComplete();
      if (isComplete && currentBookingItem) {
        setShowBookingModal(false);
        handlePaymentCompleted(currentBookingItem.category_cart_id);
      } else {
        const address = localStorage.getItem("bookingAddress");
        const timeSlot = localStorage.getItem("bookingTimeSlot");
        const addressId = localStorage.getItem("address_id");
        if (address && timeSlot && addressId && currentBookingItem) {
          setShowBookingModal(false);
          handlePaymentCompleted(currentBookingItem.category_cart_id);
        } else {
          toast.error("Please complete all booking details before proceeding");
        }
      }
    }, 200);
  };

  const handlePaymentCompleted = async (leadtype, redirect = true) => {
    const cust_id = localStorage.getItem("customer_id");
    const cust_mobile = localStorage.getItem("userPhone");
    const address_id = localStorage.getItem("address_id");
    const cust_email = localStorage.getItem("email") || localStorage.getItem("userEmail");
    const chkout = JSON.parse(localStorage.getItem("checkoutState") || "[]");
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const cart_id = leadtype;
    const timeSlotData = localStorage.getItem("bookingTimeSlot");
    const time = timeSlotData ? JSON.parse(timeSlotData) : {};
    const appointment_time = time.time;
    const appointment_date = time.date;
    const source = "mannubhai website";

    if (!cust_id || !cust_mobile || !address_id || !cust_email || !appointment_date || !appointment_time) {
      toast.error("Please complete all booking details before proceeding to payment", { autoClose: 3000 });
      return;
    }

    try {
      const res = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/add_lead_with_full_dtls.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cust_id,
            cust_mobile,
            address_id,
            cust_email,
            cart_id,
            appointment_time,
            appointment_date,
            source,
          }),
        }
      );
      const data = await res.json();

      if (data.error == false) {
        // Clean up cart
        const leftOverItems = chkout.filter((items) => items.category_cart_id !== cart_id);
        localStorage.setItem("checkoutState", JSON.stringify(leftOverItems.length > 0 ? leftOverItems : []));

        if (leftOverItems.length === 0) {
          localStorage.setItem("cartItems", JSON.stringify([]));
        }

        // Remove booking-related items from localStorage
        removeLocalStorageItems();

        // Set confirmation data
        setConfirmationData({
          name: localStorage.getItem("userName"),
          email: cust_email,
          phone: cust_mobile,
          address: localStorage.getItem("bookingAddress"),
          date: appointment_date,
          time: appointment_time,
          amount: currentBookingItem?.total_main || 0
        });

        // Show confirmation
        setShowConfirmationModal(true);
        setShowBookingModal(false);

        if (redirect) {
          // Directly redirect to payment URL from API response
          if (data.lead_id_for_payment) {
            window.location.href = data.lead_id_for_payment;
          } else {
            toast.error("Payment URL not provided");
            console.error("Payment URL missing in API response:", data);
          }
        } else {
          toast.success("Team Will Contact You Soon!......");
        }
      } else {
        toast.error(data.msg || "Payment processing failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Payment error:", error);
    }
  };

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUserInfo(user);
    setPhoneNumber(user.mobile || user.phone || "");
    displayCartData();
    // toast.success(`Welcome ${user.name}!`);
    if (user.id) fetchRecentAddress(user.id);
  };

  const handleCloseModal = () => setShowModal(false);
  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setCurrentBookingItem(null);
  };

  // Effects
  useEffect(() => {
    setIsLoading(true);
    displayCartData();
    checkLoginStatus();
    const storedAddresses = getLocalStorageItem("RecentAddress", []);
    if (Array.isArray(storedAddresses) && storedAddresses.length > 0) {
      setRecentAddresses(storedAddresses);
      setRecentAddress(storedAddresses[0]);
    }
    refreshBookingData();
    setIsLoading(false);
  }, [refreshBookingData]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (["bookingAddress", "bookingTimeSlot", "address_id"].includes(e.key)) {
        refreshBookingData();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshBookingData]);

  useEffect(() => {
    let intervalId;
    if (showBookingModal) {
      intervalId = setInterval(() => refreshBookingData(), 1000);
    }
    return () => intervalId && clearInterval(intervalId);
  }, [showBookingModal, refreshBookingData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto">
        {isLoggedIn ? (
          <>
            {cartDataArray.length > 0 ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Cart</h1>
                
                <div className="space-y-6">
                  {cartDataArray?.map((service) => {
                    const calculatedTotal = service.cart_dtls.reduce((sum, item) => {
                      const price = Number(item.total_price || item.price || 0);
                      const quantity = Number(item.quantity || 1);
                      return sum + (price * quantity);
                    }, 0);
                    const categoryTotal = Number(service.total_main) || calculatedTotal;

                    return (
                      <div key={service.cart_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                          <h2 className="text-xl font-semibold text-indigo-700 mb-4">
                            {service.leadtype_name}
                          </h2>

                          <div className="space-y-4">
                            {service.cart_dtls?.map((item) => (
                              <div key={item.service_id} className="flex flex-col sm:flex-row justify-between py-4 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-start gap-4">
                                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                    <Image
                                      src={item.image || "/placeholder-image.jpg"}
                                      alt={item.service_name || "Service"}
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                      onError={(e) => e.target.src = "/placeholder-image.jpg"}
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-gray-800">{item.service_name}</h3>
                                    {item.description && (
                                      <div className="text-sm text-gray-500 mt-1" dangerouslySetInnerHTML={{ __html: item.description }} />
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col items-end mt-3 sm:mt-0">
                                  <p className="font-bold text-gray-800">₹{item.total_price || item.price || 0}</p>
                                  <div className="flex items-center gap-2 mt-2 border border-gray-200 rounded-full px-3 py-1">
                                    <button
                                      onClick={() => onDecrement(item.service_id, "delete", item.quantity)}
                                      className="text-gray-600 hover:text-indigo-600"
                                    >
                                      <FiMinus size={16} />
                                    </button>
                                    <span className="text-sm font-medium">{item.quantity || 1}</span>
                                    <button
                                      onClick={() => onIncrement(item.service_id, "add", item.quantity)}
                                      className="text-gray-600 hover:text-indigo-600"
                                    >
                                      <FiPlus size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6">
                            <button
                              onClick={() => handleBookNowClick(service)}
                              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow transition-all flex items-center justify-center"
                            >
                              Book Now: ₹{categoryTotal}
                              <FiChevronRight className="ml-2" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center mt-12">
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-32 h-32 mx-auto flex items-center justify-center">
                  <FiShoppingCart className="text-gray-400 text-4xl" />
                </div>
                <p className="text-gray-500 mt-4">Your cart is currently empty.</p>
                <Link href="/">
                  <button className="mt-4 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow transition-all">
                    Browse Services
                  </button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center mt-12">
            <div className="bg-white rounded-xl p-8 max-w-md mx-auto shadow-sm border border-gray-200">
              <div className="text-indigo-600 text-5xl mb-4">
                <FiUser className="mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Access Your Cart
              </h2>
              <p className="text-gray-600 mb-6">
                Sign in to view your cart and complete your booking
              </p>
              <button
                onClick={handlePopup}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "#00000080" }}>
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Complete Booking</h3>
              <button
                onClick={handleCloseBookingModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <BookingSlots
                phoneNumber={phoneNumber}
                recentAddress={recentAddress}
                recentAddresses={recentAddresses}
                onAddressUpdate={setRecentAddress}
              />
              
              <div className="mt-6 flex gap-3">
                {bookingCompleted && (
                  <button
                    onClick={() => {
                      handleCloseBookingModal();
                      if (currentBookingItem) {
                        handlePaymentCompleted(currentBookingItem.category_cart_id, false);
                        toast.success("Your booking is confirmed! Our team will contact you soon.");
                      }
                    }}
                    className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center justify-center"
                  >
                    Pay Later
                  </button>
                )}
                <button
                  onClick={() => {
                    if (bookingCompleted && currentBookingItem) {
                      handlePaymentCompleted(currentBookingItem.category_cart_id, true);
                    }
                  }}
                  className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center ${
                    bookingCompleted
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!bookingCompleted}
                >
                  {bookingCompleted ? (
                    <>
                      Confirm Booking <FiChevronRight className="ml-2" />
                    </>
                  ) : (
                    "Complete Details"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <LoginPopup
        show={showModal}
        onClose={handleCloseModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default CheckOut;