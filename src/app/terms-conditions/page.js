"use client";
import React from "react";
import Dropdown from "@/components/Dropdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const Terms = () => {
 const countries = [
    { code: "IND", name: "India", flag: "/flags/In-flag.jpeg" },
    { code: "UAE", name: "United Arab Emirates", flag: "/flags/UAE-flag.jpeg" },
    { code: "SGP", name: "Singapore", flag: "/flags/Singapore-flag.jpeg" },
    { code: "KSA", name: "Saudi Arabia", flag: "/flags/KSA-flag.jpeg" },
  ];

  return (
    <>
   
      <section className="bg-white px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          TERMS AND CONDITIONS
        </h1>
        <div className="mb-8">
          <Dropdown countries={countries} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto text-gray-700 space-y-8 leading-relaxed">
        <div>
          <h3 className="text-2xl font-semibold mb-2">Terms and Conditions</h3>
          <p>
            These terms and conditions (“Terms”) govern the use of services made
            available on or through https://mannubhai.com and/or the Urban
            Company mobile app (collectively, the “Platform”...) {/* trimmed for brevity */}
          </p>
        </div>

        {/* 1. SERVICES */}
        <div>
          <h3 className="text-xl font-bold mb-2">1. SERVICES</h3>
          <ol className="list-[lower-alpha] list-inside space-y-2">
            <li>
              The Services include the provision of the Platform that enables
              you to arrange and schedule different home-based services...
            </li>
            <li>
              The services rendered by Service Professionals are referred to as
              “Pro Services”...
            </li>
            <li>
              The Platform is for your personal and non-commercial use only...
            </li>
            <li>
              The Services are made available under various brands...
            </li>
            <li>
              In certain instances, you may be required to furnish ID proof...
            </li>
          </ol>
        </div>

        {/* 2. ACCOUNT CREATION */}
        <div>
          <h3 className="text-xl font-bold mb-2">2. ACCOUNT CREATION</h3>
          <ol className="list-[lower-alpha] list-inside space-y-2">
            <li>
              To avail the Services, you will be required to create an account...
            </li>
            <li>
              You warrant that all information furnished...
            </li>
            <li>
              You are solely responsible for maintaining the security...
            </li>
            <li>
              You are liable and accountable for all activities...
            </li>
            <li>
              You agree to receive communications from us regarding...
            </li>
          </ol>
        </div>

        {/* 3. USER CONTENT */}
        <div>
          <h3 className="text-xl font-bold mb-2">3. USER CONTENT</h3>
          <ol className="list-[lower-alpha] list-inside space-y-2">
            <li>
              Our Platform may contain interactive features...
            </li>
            <li>
              As part of the effective provision of the Services...
            </li>
            <li>
              You grant us a non-exclusive, worldwide, perpetual...
            </li>
            <li>
              In connection with these Terms and the licences granted...
            </li>
            <li>
              You agree and acknowledge that UC may, without notice...
            </li>
          </ol>
        </div>

        {/* 4. CONSENT TO USE DATA */}
        <div>
          <h3 className="text-xl font-bold mb-2">4. CONSENT TO USE DATA</h3>
          <ol className="list-[lower-alpha] list-inside space-y-2">
            <li>
              You agree that we may, in accordance with our Privacy Policy...
            </li>
            <li>
              In addition to any consent you may provide...
            </li>
            <li>
              Subject to applicable laws, we may be directed...
            </li>
          </ol>
        </div>

        {/* 5. BOOKINGS */}
        <div>
          <h3 className="text-xl font-bold mb-2">5. BOOKINGS</h3>
          <ol className="list-[lower-alpha] list-inside space-y-2">
            <li>
              Orders: The Platform permits you to request various Pro Services...
            </li>
            <li>
              Confirmation: Once you place a request we will provide...
            </li>
            <li>
              Cancellations: Bookings that are cancelled before...
            </li>
            <li>
              Substitution: In case of the unavailability of...
            </li>
          </ol>
        </div>
      </div>
    </section>
 
    </>
  
  );
};

export default Terms;
