"use client";
import React, { useEffect, useState } from "react";
import AddressModal from "@/app/models/AddressModal/page";
import TimeSlotModal from "@/app/models/TimeSlotModal/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaMapMarkerAlt } from "react-icons/fa"; // or another icon library

import {
  faBook,
  faCalendarDays,
  faEnvelope,
  faPhone,
  faUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function BookingSlots({ phoneNumber }) {
  const [addressOpen, setAddressOpen] = useState(false);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [steps, setSteps] = useState({
    address: { completed: false, data: null },
    timeSlot: { completed: false, data: null },
    payment: { completed: false, data: null },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isClient) return;

    const email = localStorage.getItem("userEmail") || localStorage.getItem("email");
    const name = localStorage.getItem("userName") || localStorage.getItem("name");
    setUserEmail(email || "");
    setUserName(name || "");
  }, [isClient]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isClient) return;

    const savedAddress = localStorage.getItem("bookingAddress");
    if (savedAddress) {
      try {
        const parsed = JSON.parse(savedAddress);
        setSteps((prev) => ({ ...prev, address: { completed: true, data: parsed } }));
      } catch {
        setSteps((prev) => ({ ...prev, address: { completed: true, data: savedAddress } }));
      }
    }

    const savedTimeSlot = localStorage.getItem("bookingTimeSlot");
    if (savedTimeSlot) {
      try {
        const parsed = JSON.parse(savedTimeSlot);
        setSteps((prev) => ({ ...prev, timeSlot: { completed: true, data: parsed } }));
      } catch {
        localStorage.removeItem("bookingTimeSlot");
      }
    }
  }, [isClient]);

  const handleAddressOpen = () => setAddressOpen(true);

  const handleAddressSelected = (selectedAddress) => {
    setSteps((prev) => ({ ...prev, address: { completed: true, data: selectedAddress } }));
    if (typeof window !== 'undefined' && isClient) {
      localStorage.setItem("bookingAddress", JSON.stringify(selectedAddress));
    }
  };

  const handleTimeSlotSelected = (selectedTimeSlot) => {
    setSteps((prev) => ({ ...prev, timeSlot: { completed: true, data: selectedTimeSlot } }));
    localStorage.setItem("bookingTimeSlot", JSON.stringify(selectedTimeSlot));
    setShowTimeSlotModal(false);
    toast.success("Time slot selected successfully");
  };

  const handleCloseTimeSlotModal = () => setShowTimeSlotModal(false);

  const getAddressDisplay = () => {
    const data = steps.address.data;
    if (!data) return "";
    if (typeof data === "object") {
      return `${data.houseNo || ""}, ${data.city || ""}, ${data.state || ""}, ${data.pincode || ""}`;
    }
    return data;
  };

  if (!isClient) {
    return (
      <div className="p-4 bg-gray-100 rounded-xl shadow-sm animate-pulse">
        <div className="flex items-center gap-3 text-blue-600">
          <FontAwesomeIcon icon={faBook} className="text-xl" />
          <span className="text-lg font-medium">Loading Booking Confirmation...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-xl space-y-6">
      {/* Heading */}
    <div className="text-center bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-3 rounded-2xl shadow-md">
  <h2 className="text-lg sm:text-xl font-medium flex items-center justify-center gap-2">
    <FontAwesomeIcon icon={faBook} />
    Booking Confirmation
  </h2>
</div>


      {/* User Details */}
      {/* <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p className="text-blue-700 font-semibold mb-2">Your Details</p>
        <div className="space-y-1 text-sm text-gray-700">
          <p className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="text-blue-500" /> {userName || "Not Provided"}
          </p>
          <p className="flex items-center gap-2">
            <FontAwesomeIcon icon={faEnvelope} className="text-blue-500" /> {userEmail || "Not Provided"}
          </p>
          <p className="flex items-center gap-2">
            <FontAwesomeIcon icon={faPhone} className="text-blue-500" /> {phoneNumber || "Not Provided"}
          </p>
        </div>
      </div> */}

      {/* Address Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-3 text-blue-700 font-semibold">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Delivery Address
        </div>


<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
  <button
    onClick={handleAddressOpen}
    className="flex items-center gap-2  bg-indigo-600 hover:bg-[#a698f2] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition-all"
    title={steps.address.completed ? "Change Address" : "Choose Address"}
  >
    <FaMapMarkerAlt className="text-white text-base" />
    {steps.address.completed ? "Change Address" : "Choose Address"}
  </button>

  {steps.address.completed && (
    <p className="text-sm text-gray-700 break-words max-w-md sm:text-right">
      {getAddressDisplay()}
    </p>
  )}
</div>



        <AddressModal
          setAddressOpen={setAddressOpen}
          addressOpen={addressOpen}
          onAddressSelected={handleAddressSelected}
        />
      </div>

      {/* Time Slot Section */}
  <div
  className={`bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 transition-opacity duration-300 ${
    !steps.address.completed ? "opacity-50 pointer-events-none" : ""
  }`}
>
  {/* Section Header */}
  <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm sm:text-base">
    <FontAwesomeIcon icon={faCalendarDays} className="w-4 h-4 sm:w-5 sm:h-5" />
    <span>Appointment Slot</span>
  </div>

  {/* Controls */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <div
      onClick={() => setShowTimeSlotModal(true)}
      className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 w-full sm:w-auto"
    >
      <FontAwesomeIcon icon={faCalendarDays} className="w-4 h-4" />
      {steps.timeSlot.completed ? "Change Slot" : "Select Time Slot"}
    </div>

    {steps.timeSlot.completed && (
      <p className="text-sm text-gray-700 sm:text-right">
        <span className="font-medium text-gray-900">Booked:</span>{" "}
        {steps.timeSlot.data?.date} @ {steps.timeSlot.data?.time}
      </p>
    )}
  </div>

  {/* Modal */}
  {showTimeSlotModal && (
    <TimeSlotModal
      open={showTimeSlotModal}
      onTimeSlotSelected={handleTimeSlotSelected}
      onClose={handleCloseTimeSlotModal}
    />
  )}
</div>

    </div>
  );
}

export default BookingSlots;
