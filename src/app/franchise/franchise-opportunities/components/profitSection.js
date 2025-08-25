"use client";

import Image from "next/image";

export default function ProfitSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Mannubhai Quick Service Delivery Hub
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="flex justify-center">
            <Image
              src="/franchies/quick-service.webp"
              alt="Profit"
              width={500}
              height={500}
              className="object-contain"
            />
          </div>

          {/* Right Side - Features */}
          <div className="space-y-6">
            <Feature
              icon="💰"
              text="Start Earning: Immediate profits"
            />
            <Feature
              icon="🔄"
              text="Impressive ROI: 95% annual"
            />
            <Feature
              icon="📈"
              text="High Demand: Booming market"
            />
            <Feature
              icon="🎓"
              text="Comprehensive Training: Ongoing support"
            />
            <Feature
              icon="🏅"
              text="Proven Model: Successful track record"
            />
            <Feature
              icon="🛠️"
              text="Diverse Streams: Multiple services"
            />
            <Feature
              icon="🚀"
              text="Scalable Growth: Expand easily"
            />
            <Feature
              icon="💸"
              text="Low Overhead: Minimal expenses"
            />
            <Feature
              icon="💡"
              text="Innovative Technology: Enhanced efficiency"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="text-2xl">{icon}</div>
      <p className="text-lg text-gray-700">{text}</p>
    </div>
  );
}
