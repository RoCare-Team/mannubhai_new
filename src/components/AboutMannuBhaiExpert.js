"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";

function AboutMannuBhaiExpert() {
    const urlPath = usePathname();
    const city = urlPath.split("/")[1] || ""; // Gets the city from the URL path
    const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);

    return (
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-28 py-12 bg-gradient-to-br from-purple-50 via-white to-indigo-50 border border-gray-200 rounded-2xl shadow-lg my-10">

            {/* Heading */}
            <h2
                className="text-3xl md:text-4xl font-extrabold mb-6 text-center tracking-tight"
                style={{
                    background: "linear-gradient(to right, #e7516c, #21679c)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                }}
            >
                ABOUT Mannubhai SERVICE EXPERT {formattedCity}
            </h2>

            {/* Main Content */}
            <div className="space-y-6 text-gray-800 text-base md:text-lg leading-relaxed">
                <p className="text-center text-xl font-semibold text-indigo-700">
                    Best Home Appliance Repair Services in {formattedCity} – Mannu Bhai SERVICE EXPERT
                </p>

                <p>
                    Are you tired of your home appliances working erratically or suddenly malfunctioning in {formattedCity}? No worries!{" "}
                    <span className="font-medium text-purple-700">Mannu Bhai SERVICE EXPERT</span>{" "}
                    offers the most trusted home appliance repair services in {formattedCity}. Whether it&apos;s an RO water purifier, air conditioner, washing machine, refrigerator, geyser, microwave oven, dishwasher, or LED TV, our skilled and trained technicians will handle your repair needs with care and efficiency across {formattedCity}.
                </p>

                <p>
                    We specialize in delivering on-time service with unmatched transparency and trust.{" "}
                    <span className="font-medium text-purple-700">100% service satisfaction</span>{" "}
                    is our goal. Experience the difference why many happy customers in {formattedCity} rely on us for thousands of repair jobs.
                </p>

                {/* Services Section */}
                <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-md border border-gray-100">
                    <h3 className="text-2xl font-semibold mb-4 text-indigo-700">
                        Our Home Appliance Repair Services in {formattedCity}
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>RO Water Purifier Repair & Service</li>
                        <li>AC Repair & Maintenance</li>
                        <li>Washing Machine Repair</li>
                        <li>Geyser Repair & Installation</li>
                        <li>Microwave Oven Repair</li>
                        <li>Refrigerator Repair</li>
                        <li>LED TV Repair</li>
                        <li>Vacuum Cleaner Repair</li>
                    </ul>
                </div>

                {/* Why Choose Section */}
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6 shadow-md border border-purple-200 transition hover:scale-[1.02] hover:shadow-lg duration-300 ease-in-out">
                    <h3 className="text-2xl font-semibold mb-4 text-purple-800">
                        Why Choose Mannu Bhai SERVICE EXPERT in {formattedCity}?
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                            <p>
                                <strong>High Demand for Services:</strong> {formattedCity} is experiencing a surge in demand for home appliance repair, deep cleaning, and handyman services.
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                            <p>
                                <strong>Rapid Urban Growth:</strong> With ongoing urbanization and high-rise development, the need for reliable home services continues to grow.
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                            <p>
                                <strong>Tech-Savvy Consumer Base:</strong> {formattedCity}&apos;s digitally active population prefers trusted, app-based service providers like Mannu Bhai SERVICE EXPERT.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Conclusion */}
                <p className="text-center text-lg font-medium text-indigo-800 mt-6">
                    So, if you are looking for reliable, expert, and affordable home appliance repair services in {formattedCity}, look no further than{" "}
                    <span className="font-bold text-purple-700">Mannu Bhai SERVICE EXPERT</span>. Book your service today and experience the difference!
                </p>
            </div>
        </div>
    );
}

export default AboutMannuBhaiExpert;
