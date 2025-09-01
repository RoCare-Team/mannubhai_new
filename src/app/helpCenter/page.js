"use client";
import React from "react";
import Link from "next/link";
import { FaHeadphones, FaShoppingCart, FaBookOpen } from "react-icons/fa";
import { LuChevronRight } from "react-icons/lu";

const topics = [
  {
    icon: <FaHeadphones className="text-white" />,
    title: "Customer Care",
    description: "24/7 Customer Service: +91 7065012902",
    link: "/help/Support",
    color: "bg-purple-500",
  },
  {
    icon: <FaShoppingCart className="text-white" />,
    title: "Purchasing",
    description: "Resolve issues with promo codes, gift cards or booking services",
    link: "/help/Purchasing",
    color: "bg-blue-500",
  },
  {
    icon: <FaBookOpen className="text-white" />,
    title: "User Guides",
    description: "Find complete instructions and manuals for it",
    link: "/help/Guides",
    color: "bg-green-500",
  },
];

const HelpCenter = () => {

  return (
    <>

       <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-xl p-6 bg-white rounded-3xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">All Topics</h2>
        <div className="divide-y">
          {topics.map((item, index) => (
            <Link href="javascript:void(0)" key={index}>
              <div className="flex items-center justify-between px-4 py-5 hover:bg-gray-100 transition duration-200 cursor-pointer rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${item.color}`}>
                    {item.icon}
                  </div> 
                  <div>
                    <h3 className="text-gray-800 text-base font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <LuChevronRight className="text-gray-400 text-xl" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
 
    </>
 
  );
};

export default HelpCenter;
