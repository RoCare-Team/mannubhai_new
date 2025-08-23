"use client";
import Image from "next/image";
import { FaStore, FaMoneyBillWave, FaRupeeSign, FaChartLine, FaMoneyCheckAlt, FaUserTie } from "react-icons/fa";

export default function FranchiseeDetails() {
  return (
    <section className="py-8 bg-pink-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Franchisee Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <Image
              src="/franchies/Franchisee-details.webp"
              alt="Franchisee Details"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center text-center">
              <FaStore className="text-5xl text-gray-700 mb-2" />
              <p className="text-lg font-semibold text-gray-800">Store size</p>
              <p className="text-blue-600 text-lg">300 sq ft</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaMoneyBillWave className="text-5xl text-gray-700 mb-2" />
              <p className="text-lg font-semibold text-gray-800">Break Even Period</p>
              <p className="text-pink-600 text-lg">3 Months</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaRupeeSign className="text-5xl text-gray-700 mb-2" />
              <p className="text-lg font-semibold text-gray-800">Monthly Profit</p>
              <p className="text-pink-600 text-lg">2 Lacs</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaChartLine className="text-5xl text-gray-700 mb-2" />
              <p className="text-lg font-semibold text-gray-800">Annual ROI</p>
              <p className="text-blue-600 text-lg">90 %</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaMoneyCheckAlt className="text-5xl text-gray-700 mb-2" />
              <p className="text-lg font-semibold text-gray-800">Investment Recovery</p>
              <p className="text-pink-600 text-lg">9 Months</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaUserTie className="text-5xl text-gray-700 mb-2" />
              <p className="text-lg font-semibold text-gray-800">Total Investment</p>
              <p className="text-pink-600 text-lg">15 Lacs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
