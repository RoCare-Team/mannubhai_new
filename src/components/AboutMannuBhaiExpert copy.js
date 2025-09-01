"use client";
import React, { useState } from "react";
import { FaCheckCircle, FaChevronDown, FaChevronRight, FaStar, FaShieldAlt, FaClock, FaTools, FaGem, FaHome, FaWrench, FaCut } from "react-icons/fa";

function AboutMannuBhaiExpert() {
    const [openAccordion, setOpenAccordion] = useState(null);
    const [activeTab, setActiveTab] = useState('appliance');
    
    // Mock city data - in real app this would come from usePathname
    const formattedCity = "Delhi";

    const toggleAccordion = (index) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };

    const serviceData = {
        appliance: {
            title: "Appliance Repair Services",
            icon: <FaTools className="text-blue-500 text-xl" />,
            description: "Professional doorstep appliance repair services for all major brands",
            services: [
                { name: "RO Water Purifier", brands: ["Kent", "Aquaguard", "Livpure"], price: "₹299" },
                { name: "Air Conditioner", brands: ["Daikin", "Voltas", "LG"], price: "₹499" },
                { name: "Washing Machine", brands: ["Samsung", "LG", "IFB"], price: "₹399" },
                { name: "Refrigerator", brands: ["Whirlpool", "Godrej", "Haier"], price: "₹449" },
                { name: "Geyser", brands: ["Bajaj", "AO Smith", "Havells"], price: "₹349" },
                { name: "Microwave Oven", brands: ["LG", "Samsung", "IFB"], price: "₹299" },
                { name: "LED TV", brands: ["Sony", "Samsung", "LG"], price: "₹599" },
                { name: "Vacuum Cleaner", brands: ["Eureka Forbes", "Dyson"], price: "₹249" }
            ]
        },
        beauty: {
            title: "Beauty Services",
            icon: <FaGem className="text-pink-500 text-xl" />,
            description: "Premium salon-quality beauty services at your doorstep",
            services: [
                { name: "Salon At Home", category: "Women", price: "₹799", duration: "90 min" },
                { name: "Professional Makeup", category: "Women", price: "₹1,299", duration: "60 min" },
                { name: "Hair Styling", category: "Women", price: "₹599", duration: "45 min" },
                { name: "Pedicure & Manicure", category: "Women", price: "₹499", duration: "75 min" },
                { name: "Men's Salon", category: "Men", price: "₹499", duration: "60 min" },
                { name: "Beard Grooming", category: "Men", price: "₹299", duration: "30 min" },
                { name: "Massage Therapy", category: "Men", price: "₹899", duration: "90 min" },
                { name: "Bridal Package", category: "Special", price: "₹4,999", duration: "4 hours" }
            ]
        },
        cleaning: {
            title: "Home Care Services",
            icon: <FaHome className="text-green-500 text-xl" />,
            description: "Professional cleaning services using eco-friendly products",
            services: [
                { name: "Sofa Cleaning", area: "3-seater", price: "₹999", time: "2 hours" },
                { name: "Bathroom Deep Clean", area: "Per bathroom", price: "₹599", time: "1.5 hours" },
                { name: "Kitchen Deep Clean", area: "Standard", price: "₹1,299", time: "3 hours" },
                { name: "Full Home Cleaning", area: "2BHK", price: "₹2,499", time: "4-6 hours" },
                { name: "Carpet Cleaning", area: "Per sqft", price: "₹15", time: "Variable" },
                { name: "Pest Control", area: "2BHK", price: "₹1,899", time: "2 hours" },
                { name: "Window Cleaning", area: "Per window", price: "₹99", time: "15 min" },
                { name: "Disinfection", area: "2BHK", price: "₹1,299", time: "1 hour" }
            ]
        },
        handyman: {
            title: "Handyman Services",
            icon: <FaWrench className="text-orange-500 text-xl" />,
            description: "Expert home repair and maintenance services",
            services: [
                { name: "Electrical Repair", type: "Wiring & Fixtures", price: "₹299", warranty: "30 days" },
                { name: "Plumbing Work", type: "Leak & Pipe Repair", price: "₹399", warranty: "60 days" },
                { name: "Wall Painting", type: "Per sqft", price: "₹18", warranty: "90 days" },
                { name: "Carpentry", type: "Furniture Repair", price: "₹499", warranty: "45 days" },
                { name: "Masonry Work", type: "Wall & Floor", price: "₹599", warranty: "60 days" },
                { name: "Door Installation", type: "Complete setup", price: "₹1,299", warranty: "1 year" },
                { name: "Tile Work", type: "Per sqft", price: "₹35", warranty: "6 months" },
                { name: "General Repairs", type: "Minor fixes", price: "₹249", warranty: "15 days" }
            ]
        }
    };

    const whyChooseData = [
        {
            title: "Certified Professionals",
            icon: <FaShieldAlt className="text-blue-500" />,
            description: "Brand-certified technicians with rigorous training",
            features: ["Background verified", "Skill certified", "Regular training", "Expert knowledge"]
        },
        {
            title: "Quality Guarantee",
            icon: <FaStar className="text-yellow-500" />,
            description: "Premium products and 100% satisfaction guarantee",
            features: ["Genuine parts", "Premium products", "Service warranty", "Quality assurance"]
        },
        {
            title: "Ultimate Convenience",
            icon: <FaClock className="text-green-500" />,
            description: "Doorstep service with flexible scheduling",
            features: ["7am-10pm availability", "Same-day service", "Online booking", "Real-time tracking"]
        }
    ];

    const tabButtons = [
        { id: 'appliance', label: 'Appliance Repair', icon: <FaTools /> },
        { id: 'beauty', label: 'Beauty Services', icon: <FaGem /> },
        { id: 'cleaning', label: 'Home Care', icon: <FaHome /> },
        { id: 'handyman', label: 'Handyman', icon: <FaWrench /> }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                        <FaShieldAlt className="text-white text-2xl mr-2" />
                        <span className="text-white font-semibold text-lg">Trusted Service Provider</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Mannu Bhai SERVICE EXPERT
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Your trusted partner for all home services in {formattedCity}. Professional, reliable, and affordable services at your doorstep.
                    </p>
                    <div className="flex justify-center items-center mt-6 space-x-8">
                        <div className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="font-semibold">4.8/5 Rating</span>
                        </div>
                        <div className="flex items-center">
                            <FaCheckCircle className="text-green-500 mr-1" />
                            <span className="font-semibold">50,000+ Happy Customers</span>
                        </div>
                    </div>
                </div>

                {/* Services Section with Tabs */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Services</h2>
                    
                    {/* Tab Navigation */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {tabButtons.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
                                }`}
                            >
                                {tab.icon}
                                <span className="ml-2">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Service Content */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <div className="flex items-center mb-6">
                            {serviceData[activeTab].icon}
                            <h3 className="text-2xl font-bold ml-3 text-gray-800">{serviceData[activeTab].title}</h3>
                        </div>
                        <p className="text-gray-600 mb-6">{serviceData[activeTab].description}</p>

                        {/* Services Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700 border-b">Service</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700 border-b">
                                            {activeTab === 'appliance' ? 'Brands' : 
                                             activeTab === 'beauty' ? 'Category' : 
                                             activeTab === 'cleaning' ? 'Coverage' : 'Type'}
                                        </th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700 border-b">Price</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700 border-b">
                                            {activeTab === 'appliance' ? 'Warranty' : 
                                             activeTab === 'beauty' ? 'Duration' : 
                                             activeTab === 'cleaning' ? 'Time' : 'Warranty'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceData[activeTab].services.map((service, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 border-b">
                                                <div className="font-medium text-gray-800">{service.name}</div>
                                            </td>
                                            <td className="py-4 px-6 border-b">
                                                <div className="flex flex-wrap gap-1">
                                                    {activeTab === 'appliance' && service.brands?.map((brand, i) => (
                                                        <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                            {brand}
                                                        </span>
                                                    ))}
                                                    {activeTab === 'beauty' && (
                                                        <span className="bg-pink-100 text-pink-800 text-sm px-2 py-1 rounded-full">
                                                            {service.category}
                                                        </span>
                                                    )}
                                                    {activeTab === 'cleaning' && (
                                                        <span className="text-gray-600">{service.area}</span>
                                                    )}
                                                    {activeTab === 'handyman' && (
                                                        <span className="text-gray-600">{service.type}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 border-b">
                                                <span className="font-bold text-green-600">{service.price}</span>
                                            </td>
                                            <td className="py-4 px-6 border-b">
                                                <span className="text-gray-600">
                                                    {service.duration || service.time || service.warranty || '30 days'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {whyChooseData.map((item, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    {item.icon}
                                    <h3 className="text-xl font-semibold ml-3 text-gray-800">{item.title}</h3>
                                </div>
                                <p className="text-gray-600 mb-4">{item.description}</p>
                                <ul className="space-y-2">
                                    {item.features.map((feature, i) => (
                                        <li key={i} className="flex items-center text-sm text-gray-700">
                                            <FaCheckCircle className="text-green-500 mr-2 text-xs" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Service Areas & Guarantees */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Service Areas */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 border border-blue-200">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Service Coverage in {formattedCity}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {["All Residential Areas", "Apartments & Societies", "Gated Communities", "Commercial Spaces", "Suburban Areas", "Outskirts"].map((area, index) => (
                                <div key={index} className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                                    <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                                    <span className="text-sm font-medium text-gray-700">{area}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Guarantees */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-8 border border-green-200">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Service Guarantees</h3>
                        <div className="space-y-4">
                            {[
                                { title: "90-Day Warranty", desc: "On all appliance repairs" },
                                { title: "Re-service Guarantee", desc: "If you're not satisfied" },
                                { title: "Professional Conduct", desc: "Trained and verified staff" },
                                { title: "Safety Assurance", desc: "Hygiene and safety protocols" }
                            ].map((guarantee, index) => (
                                <div key={index} className="flex items-start bg-white rounded-lg p-4 shadow-sm">
                                    <FaShieldAlt className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{guarantee.title}</h4>
                                        <p className="text-sm text-gray-600">{guarantee.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutMannuBhaiExpert;