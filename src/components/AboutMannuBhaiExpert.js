"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FaCheckCircle, FaChevronDown, FaChevronUp, FaStar, FaTools, FaShieldAlt, FaClock, FaPhone, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

function AboutMannuBhaiExpert() {
    const urlPath = usePathname();
    const city = urlPath.split("/")[1] || ""; 
    const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);
    
    const [activeAccordion, setActiveAccordion] = useState(null);

    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };
    const serviceCategories = [
        {
            name: "Appliance Services",
            services: [
                { name: "RO Water Purifier Repair & Service", icon: "💧", slug: "water-purifier-service" },
                { name: "AC Repair & Maintenance", icon: "❄️", slug: "ac-service" },
                { name: "Washing Machine Repair", icon: "🧺", slug: "washing-machine-repair" },
                { name: "Geyser Repair & Installation", icon: "🔥", slug: "geyser-repair" },
                { name: "Microwave Oven Repair", icon: "🍽️", slug: "microwave-oven-repair-service" },
                { name: "Refrigerator Repair", icon: "🧊", slug: "refrigerator-repair-service" },
                { name: "LED TV Repair", icon: "📺", slug: "led-tv-repair-service" },
                { name: "Vacuum Cleaner Repair", icon: "🧹", slug: "vacuum-cleaner-repair-service" },
                { name: "Air Purifier Service", icon: "🌬️", slug: "air-purifier-repair-service" },
                { name: "Akitchen chimney", icon: "🌬️", slug: "kitchen-chimney-repair-service" }
            ]
        },
        {
            name: "Beauty Services",
            services: [
                { name: "Women Salon At Home", icon: "💇‍♀️", slug: "women-salon-at-home" },
                { name: "Makeup Services", icon: "💄", slug: "makeup" },
                { name: "Spa For Women", icon: "🧖‍♀️", slug: "spa-for-women" },
                { name: "Men Salon At Home", icon: "💇‍♂️", slug: "men-salon-at-home" },
                { name: "Massage For Men", icon: "💆‍♂️", slug: "men-massage-at-home" },
                { name: "Manicure & pedicure", icon: "💇‍♂️", slug: "manicure-and-pedicure" },
                { name: "Hair studio", icon: "💆‍♂️", slug: "hair-studio" }
            ]
        },
        {
            name: "Home Care Services",
            services: [
                { name: "Sofa Cleaning", icon: "🛋️", slug: "sofa-cleaning" },
                { name: "Bathroom Cleaning", icon: "🚿", slug: "bathroom-cleaning" },
                { name: "Home Deep Cleaning", icon: "🧽", slug: "home-deep-cleaning" },
                { name: "Kitchen Cleaning", icon: "🍳", slug: "kitchen-cleaning" },
                { name: "Pest Control", icon: "🐜", slug: "pest-control-service" },
                { name: "Tile Cleaning", icon: "🧼", slug: "tank-cleaning-service" }
            ]
        },
        {
            name: "Handyman Services",
            services: [
                { name: "Painter Services", icon: "🎨", slug: "painting-services" },
                { name: "Plumber Services", icon: "🔧", slug: "plumber" },
                { name: "Carpenter Services", icon: "🪚", slug: "carpenter" },
                { name: "Electrician Services", icon: "⚡", slug: "ectrician" },
                { name: "Masonry Work", icon: "🧱", slug: "mason-service" }
            ]
        }
    ];

    const features = [
        {
            icon: <FaShieldAlt className="text-green-500 text-2xl" />,
            title: "100% Service Guarantee",
            description: "We stand behind our work with a complete satisfaction guarantee on all repairs and services."
        },
        {
            icon: <FaClock className="text-blue-500 text-2xl" />,
            title: "Same Day Service",
            description: "Quick response times with most services completed within 24 hours of booking."
        },
        {
            icon: <FaTools className="text-purple-500 text-2xl" />,
            title: "Expert Professionals",
            description: "Certified technicians and skilled professionals with years of experience."
        }
    ];

    const accordionData = [
        {
            title: "Our Comprehensive Services",
            content: (
                <div className="space-y-6">
                    {serviceCategories.map((category, catIndex) => (
                        <div key={catIndex} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-purple-700 mb-4">{category.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {category.services.map((service, serviceIndex) => (
                                    <Link 
                                        key={serviceIndex} 
                                        href={`/${city}/${service.slug}`}
                                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all hover:shadow-sm group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{service.icon}</span>
                                            <span className="font-medium text-gray-800 text-lg">{service.name}</span>
                                        </div>
                                        <FaArrowRight className="text-gray-400 group-hover:text-purple-600 transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: "Why Choose Us?",
            content: (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl">
                        <div className="flex items-start space-x-4">
                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 text-xl" />
                            <div>
                                <h4 className="text-purple-700 text-lg font-semibold">High Demand for Services</h4>
                                <p className="text-gray-600 mt-1 text-lg">{formattedCity} is experiencing a surge in demand for home appliance repair, deep cleaning, beauty services, and handyman solutions.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl">
                        <div className="flex items-start space-x-4">
                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 text-xl" />
                            <div>
                                <h4 className="text-purple-700 text-lg font-semibold">Rapid Urban Growth</h4>
                                <p className="text-gray-600 mt-1 text-lg">With ongoing urbanization and high-rise development, the need for reliable home services continues to grow exponentially.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl">
                        <div className="flex items-start space-x-4">
                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 text-xl" />
                            <div>
                                <h4 className="text-purple-700 text-lg font-semibold">Tech-Savvy Consumer Base</h4>
                                <p className="text-gray-600 mt-1 text-lg">{formattedCity}'s digitally active population prefers trusted, app-based service providers like Mannu Bhai SERVICE EXPERT for all their home service needs.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },

    ];
    return (
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-28 py-12 bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-2xl my-10">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 
  className="text-4xl md:text-3xl font-bold mb-4" 
  style={{
    background: "linear-gradient(to right, #e7516c, #21679c)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent"
  }}
>
  About MannuBhai Service Expert {formattedCity}
</h1>
            </div>
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {features.map((feature, index) => (
                    <div 
                        key={index} 
                        className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-purple-200"
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-white rounded-full shadow-sm">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                        </div>
                        <p className="text-gray-600 text-lg font-medium">{feature.description}</p>
                    </div>
                ))}
            </div>

            {/* Introduction Text */}
            <div className="bg-white/60 backdrop-blur rounded-xl p-6 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-100 rounded-full opacity-20"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-100 rounded-full opacity-20"></div>
                <div className="relative z-10">
                    <p className="text-gray-700 text-lg leading-relaxed font-medium">
                        Looking for reliable home services in {formattedCity}?{" "}
                        <span className="font-bold text-purple-700">Mannu Bhai SERVICE EXPERT</span>{" "}
                        is your one-stop solution for all appliance repairs, beauty services, home cleaning, and handyman needs. Our certified professionals provide top-quality service with guaranteed satisfaction across {formattedCity}. From malfunctioning appliances to deep home cleaning, from salon at home to electrical repairs - we've got you covered with prompt, efficient, and affordable solutions tailored to your requirements.
                    </p>
                    <div className="mt-4">
                        <Link 
                            href={`about`} 
                            className="text-purple-600 font-semibold hover:underline flex items-center space-x-1"
                        >
                            <span>Learn more about our company</span>
                            <FaArrowRight className="text-sm" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Accordion Section */}
            <div className="space-y-4 mb-8">
                {accordionData.map((item, index) => (
                    <div 
                        key={index} 
                        className="bg-white/80 backdrop-blur rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
                    >
                        <button
                            onClick={() => toggleAccordion(index)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                            <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                            {activeAccordion === index ? (
                                <FaChevronUp className="text-purple-600 text-lg" />
                            ) : (
                                <FaChevronDown className="text-purple-600 text-lg" />
                            )}
                        </button>
                        {activeAccordion === index && (
                            <div className="px-6 pb-6 border-t border-gray-100">
                                <div className="pt-4">
                                    {item.content}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* CTA Section */}
        </div>
    );
}

export default AboutMannuBhaiExpert;