"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPopup from "@/components/login";
import BookingSlots from "../BookingData/BookingSlots/page";
import Link from "next/link";
import Image from "next/image";

const CheckOut = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [cartDataArray, setCartDataArray] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentAddress, setRecentAddress] = useState(null);
  const [recentAddresses, setRecentAddresses] = useState([]);
  const [currentBookingItem, setCurrentBookingItem] = useState(null);

  // Booking data state
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [bookingData, setBookingData] = useState({
    address: null,
    timeSlot: null,
    addressId: null,
  });
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handlePopup = () => {
    setShowModal(true);
  };

  // Safe localStorage getter
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

  // Safe localStorage setter
  const setLocalStorageItem = (key, value) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting ${key} to localStorage:`, error);
      }
    }
  };

  const displayCartData = () => {
    const cartDataArray = getLocalStorageItem("checkoutState", []);
    setCartDataArray(cartDataArray);
  };

  const fetchRecentAddress = async (customerId) => {
    try {
      const storedAddresses = getLocalStorageItem("RecentAddress", []);
      console.log("Stored addresses from localStorage:", storedAddresses);

      if (Array.isArray(storedAddresses) && storedAddresses.length > 0) {
        setRecentAddresses(storedAddresses);
        const mostRecentAddress = storedAddresses[0];
        setRecentAddress(mostRecentAddress);

        if (mostRecentAddress.id) {
          localStorage.setItem("address_id", mostRecentAddress.id);
        }
        return;
      }

      // Optional: fallback API
      const response = await fetch(
        `https://waterpurifierservicecenter.in/customer/ro_customer/get_recent_address.php?customer_id=${customerId}`
      );
      const data = await response.json();

      if (data.success && data.address) {
        const addresses = Array.isArray(data.address)
          ? data.address
          : [data.address];
        setRecentAddresses(addresses);
        setRecentAddress(addresses[0]);

        if (addresses[0]?.id) {
          localStorage.setItem("address_id", addresses[0].id);
        }

        // Save to localStorage for next time
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

  // Function to refresh booking data from localStorage
  const refreshBookingData = useCallback(() => {
    const address = localStorage.getItem("bookingAddress");
    const timeSlot = localStorage.getItem("bookingTimeSlot");
    const addressId = localStorage.getItem("address_id");

    setBookingData({
      address,
      timeSlot: timeSlot ? JSON.parse(timeSlot) : null,
      addressId,
    });

    // Update booking completed status
    const isComplete = address && timeSlot && addressId;
    setBookingCompleted(isComplete);
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
          const userInfoData = {
            phone: userPhone,
            name: userName || "Customer",
            email: userEmail || "",
            id: customerId,
          };
          setUserInfo(userInfoData);

          // Fetch recent address for logged-in user
          fetchRecentAddress(customerId);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    displayCartData();
    checkLoginStatus();

    const storedAddresses = getLocalStorageItem("RecentAddress", []);
    if (Array.isArray(storedAddresses) && storedAddresses.length > 0) {
      setRecentAddresses(storedAddresses);
      setRecentAddress(storedAddresses[0]);
      console.log("Found recent addresses on mount:", storedAddresses);
    }

    // Initial booking data load
    refreshBookingData();

    setIsLoading(false);
  }, [refreshBookingData]);

  // Listen for storage changes (when BookingSlots component updates localStorage)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (
        e.key === "bookingAddress" ||
        e.key === "bookingTimeSlot" ||
        e.key === "address_id"
      ) {
        refreshBookingData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshBookingData]);

  // Polling mechanism to check for localStorage changes
  useEffect(() => {
    let intervalId;

    if (showBookingModal) {
      intervalId = setInterval(() => {
        refreshBookingData();
      }, 1000); // Check every second while modal is open
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showBookingModal, refreshBookingData]);

  // Increment and Decrement handlers
  const onIncrement = async (service_id, type, qunt) => {
    const cid = localStorage.getItem("customer_id");
    const num = Number(qunt);
    const quantity = num + 1;

    if (quantity <= 5) {
      const payload = { service_id, type, cid, quantity };

      try {
        const res = await fetch(
          "https://waterpurifierservicecenter.in/customer/ro_customer/add_to_cart.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();
        localStorage.setItem(
          "checkoutState",
          JSON.stringify(data.AllCartDetails)
        );
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
      const payload = { service_id, type, cid, quantity };

      try {
        const res = await fetch(
          "https://waterpurifierservicecenter.in/customer/ro_customer/add_to_cart.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
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
          const oldCartItems = JSON.parse(
            localStorage.getItem("cartItems") || "[]"
          );
          const updatedCartItems = oldCartItems.filter(
            (id) => id !== service_id
          );
          localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        }
        displayCartData();
      } catch (error) {
        toast.error("Error updating cart");
        console.error("Error:", error);
      }
    }
  };

  // Handle Book Now click - open booking modal
  const handleBookNowClick = (service) => {
    if (!isLoggedIn) {
      handlePopup();
      return;
    }

    setCurrentBookingItem(service);
    setShowBookingModal(true);
    // Refresh booking data when modal opens
    setTimeout(() => refreshBookingData(), 100);
  };

  // Check if booking is complete (pure function without side effects)
  const isBookingComplete = () => {
    return bookingData.address && bookingData.timeSlot && bookingData.addressId;
  };

  const handleProceedToPayment = () => {
    // Force refresh booking data before checking
    refreshBookingData();

    // Small delay to ensure state is updated
    setTimeout(() => {
      const isComplete = isBookingComplete();

      if (isComplete && currentBookingItem) {
        setShowBookingModal(false);
        handlePaymentCompleted(currentBookingItem.category_cart_id);
      } else {
        // Double check with localStorage directly
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
    const cust_email =
      localStorage.getItem("email") || localStorage.getItem("userEmail");
    const chkout = JSON.parse(localStorage.getItem("checkoutState") || "[]");
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const cart_id = leadtype;

    const timeSlotData = localStorage.getItem("bookingTimeSlot");
    const time = timeSlotData ? JSON.parse(timeSlotData) : {};
    const appointment_time = time.time;
    const appointment_date = time.date;

    const source = "mannubhai website";

    // Validate all required fields
    if (
      !cust_id ||
      !cust_mobile ||
      !address_id ||
      !cust_email ||
      !appointment_date ||
      !appointment_time
    ) {
      toast.error(
        "Please complete all booking details before proceeding to payment",
        {
          autoClose: 3000,
        }
      );
      return;
    }

    const payload = {
      cust_id,
      cust_mobile,
      address_id,
      cust_email,
      cart_id,
      appointment_time,
      appointment_date,
      source,
    };

    try {
      const res = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/add_lead_with_full_dtls.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.error == false) {
        const leftOverItems = chkout.filter(
          (items) => items.category_cart_id !== cart_id
        );

        if (leftOverItems.length > 0) {
          localStorage.setItem("checkoutState", JSON.stringify(leftOverItems));
        } else {
          localStorage.setItem("checkoutState", JSON.stringify([]));
        }

        const currentCategoryItem = chkout.find(
          (item) => item.category_cart_id === cart_id
        );

        if (currentCategoryItem && cartItems.length > 0) {
          const checkedOutServiceIds = currentCategoryItem.cart_dtls.map(
            (service) => String(service.service_id)
          );

          const remainingItems = cartItems.filter((item) => {
            const isIncluded = checkedOutServiceIds.includes(String(item));
            return !isIncluded;
          });

          localStorage.setItem("cartItems", JSON.stringify(remainingItems));
        } else if (leftOverItems.length === 0) {
          localStorage.setItem("cartItems", JSON.stringify([]));
        }

        // Clear booking data
        const itemsToRemove = [
          "bookingTimeSlot",
          "bookingAddress",
          "time_slot",
          "address_id",
        ];

        itemsToRemove.forEach((item) => {
          localStorage.removeItem(item);
        });

        // Reset booking state
        setBookingData({
          address: null,
          timeSlot: null,
          addressId: null,
        });
        setBookingCompleted(false);

        displayCartData();

        if (redirect) {
          setTimeout(() => {
            window.location.href = data.lead_id_for_payment;
          }, 100);
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
    toast.success(`Welcome ${user.name}!`);

    // Fetch recent address for newly logged-in user
    if (user.id) {
      fetchRecentAddress(user.id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setCurrentBookingItem(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-4 sm:p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {cartDataArray.length > 0 && (
          <div className="lg:w-2/5">
            <div className="sticky top-4 space-y-6">
              <h4 className="text-xl sm:text-2xl font-bold text-purple-700">
                Account
              </h4>
              {!isLoggedIn ? (
                <div className="rounded-xl bg-white p-6 text-center space-y-4 shadow-md border border-purple-100 transition-all hover:shadow-lg">
                  <div className="text-red-500 text-4xl mb-1">
                    <i className="fas fa-user-lock"></i>
                  </div>
                  <p className="text-gray-600 text-sm">
                    To proceed with your booking, please login or create an
                    account.
                  </p>
                  <button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow"
                    onClick={handlePopup}
                  >
                    Login to Continue
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 transition-all hover:shadow-lg">
                  {/* User Info */}
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-3xl">🙋‍♂️</div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        Welcome, {userInfo?.name || "Customer"}!
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        📞 {userInfo?.phone || phoneNumber}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Address Section */}
                  <div className="mt-4 text-left">
                    <BookingSlots
                      phoneNumber={phoneNumber}
                      recentAddress={recentAddress}
                      recentAddresses={recentAddresses}
                      onAddressUpdate={setRecentAddress}
                    />
                  </div>

                  {/* Cancellation Policy */}
                  <div className="text-xs text-gray-600 border-t pt-4 mt-4 hidden lg:block">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                      Cancellation Policy
                    </h3>
                    <p className="text-[10px]">
                      Free cancellations if done more than 12 hrs before the
                      service or if a professional isn t assigned.
                    </p>
                    <Link href="/privacy-policy" target="_blank">
                      <span className="block mt-1 text-purple-600 underline hover:text-purple-800 text-[10px]">
                        Read Full Privacy
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`${cartDataArray.length > 0 ? "lg:w-3/5" : "w-full"}`}>
{cartDataArray.length > 0 ? (
  <>
    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-indigo-700">
      Order Summary
    </h3>

    <div className="space-y-4">
      {cartDataArray?.map((service) => {
        const calculatedTotal = service.cart_dtls.reduce((sum, item) => {
          const price = Number(item.total_price || item.price || 0);
          const quantity = Number(item.quantity || 1);
          return sum + (price * quantity);
        }, 0);

        const serverTotal = Number(service.total_main) || 0;
        const categoryTotal = serverTotal || calculatedTotal;

        return (
          <div
            key={service.cart_id}
            className="bg-white border border-gray-200 rounded-xl shadow-md p-4 sm:p-5 transition-all hover:shadow-lg"
          >
            <p className="text-base sm:text-lg font-semibold text-indigo-700 mb-3">
              {service.leadtype_name}
            </p>

            {service.cart_dtls?.map((item) => (
              <div
                key={item.service_id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 py-3 gap-3 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shadow">
                    <Image
                      src={item.image || "/placeholder-image.jpg"}
                      alt={item.service_name || "Service"}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-800">
                      {item.service_name}
                    </p>
                    {item.description && (
                      <div
                        className="text-xs text-gray-500 mt-1"
                        dangerouslySetInnerHTML={{
                          __html: item.description,
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <p className="text-base font-bold text-gray-700">
                    ₹{item.total_price || item.price || 0}
                  </p>
                  <div className="flex items-center gap-2 border border-indigo-300 rounded-full px-3 py-1 bg-indigo-50">
                    <button
                      className="text-indigo-600 hover:text-indigo-800 font-bold focus:outline-none text-sm"
                      onClick={() =>
                        onDecrement(
                          item.service_id,
                          "delete",
                          item.quantity
                        )
                      }
                    >
                      −
                    </button>
                    <span className="text-sm font-medium text-gray-800 mx-1">
                      {item.quantity || 1}
                    </span>
                    <button
                      className="text-indigo-600 hover:text-indigo-800 font-bold focus:outline-none text-sm"
                      onClick={() =>
                        onIncrement(
                          item.service_id,
                          "add",
                          item.quantity
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between gap-3 mt-4">
              <button
                onClick={() => handlePaymentCompleted(service.category_cart_id, false)}
                className="flex-1 px-4 py-2.5 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all shadow"
              >
                Pay Later
              </button>
              <button
                className="flex-1 px-4 py-2.5 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow"
                onClick={() => {
                  if (window.innerWidth < 768) {
                    handleBookNowClick(service);
                  } else {
                    handlePaymentCompleted(service.category_cart_id);
                  }
                }}
              >
                Book Now: ₹{categoryTotal}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </>
) : (
  <div className="text-center mt-8 sm:mt-12">
    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto flex items-center justify-center">
      <i className="fas fa-shopping-cart text-gray-400 text-4xl"></i>
    </div>
    <p className="text-gray-500 text-sm mt-4">
      Your cart is currently empty.
    </p>
    <Link href="/">
      <button className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-5 py-2 rounded-full text-white font-medium text-sm transition-all shadow">
        Browse Services
      </button>
    </Link>
  </div>
)}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-purple-100 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Complete Your Booking</h3>
              <button
                onClick={handleCloseBookingModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <BookingSlots
                phoneNumber={phoneNumber}
                recentAddress={recentAddress}
                recentAddresses={recentAddresses}
                onAddressUpdate={setRecentAddress}
              />

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    handleCloseBookingModal();
                    if (currentBookingItem) {
                      handlePaymentCompleted(
                        currentBookingItem.category_cart_id,
                        false
                      );
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Pay Later
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    bookingCompleted
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!bookingCompleted}
                >
                  {bookingCompleted ? "Next" : "Book Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <LoginPopup
        show={showModal}
        onClose={handleCloseModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default CheckOut;
 