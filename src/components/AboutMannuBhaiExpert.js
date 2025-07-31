"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { 
  FaHome, 
  FaRegSmile, 
  FaBroom, 
  FaTools, 
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaTint,
  FaSnowflake,
  FaTshirt,
  FaIceCream,
  FaCut,
  FaMale,
  FaPalette,
  FaBath,
  FaBug,
  FaWater,
  FaPaintRoller,
  FaWrench,
  FaPlug,
  FaHammer
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function AboutMannuBhaiExpert() {
    const urlPath = usePathname();
    const city = urlPath.split("/")[1] || "Gurgaon";
    const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [showFullDescription, setShowFullDescription] = useState({});

    const toggleCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    const toggleDescription = (categoryId) => {
        setShowFullDescription(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const serviceCategories = [
        {
            id: "appliances",
            title: "Home Appliances Care",
            icon: <FaHome className="text-blue-500" />,
            description: `Home appliances are now a basic need in every ${formattedCity} home. They make life easy and smooth. But with the fast lifestyle and traffic in ${formattedCity}, it's tough to take time out for service. That's why Mannu Bhai brings appliance care directly to your home in ${formattedCity}.`,
            services: [
                {
                    name: "Water Purifier",
                    icon: <FaTint className="text-blue-400" />,
                    description: `We offer water purifier installation, repair, and regular servicing for all brands in ${formattedCity}. Our trained technicians come to your home and ensure clean and safe drinking water at a fair price.`
                },
                {
                    name: "Air Conditioner",
                    icon: <FaSnowflake className="text-blue-400" />,
                    description: `Need AC service in ${formattedCity}? Mannu Bhai provides trusted and affordable AC repair and maintenance for both window and split ACs. Our experts come to your home with proper tools and experience.`
                },
                {
                    name: "Washing Machine",
                    icon: <FaTshirt className="text-blue-400" />,
                    description: `We offer washing machine service in ${formattedCity} for all brands and models. Whether it's a front load or top load, our expert technician will fix the problem and check everything before leaving.`
                },
                {
                    name: "Refrigerator",
                    icon: <FaIceCream className="text-blue-400" />,
                    description: `From gas refilling to regular checkups, Mannu Bhai offers fridge service at home in ${formattedCity}. Just book with us and get quick, reliable service without stepping out.`
                }
            ]
        },
        {
            id: "beauty",
            title: "Beauty Care Services",
            icon: <FaRegSmile className="text-pink-500" />,
            description: `We believe beauty and self-care should be simple. That's why Mannu Bhai offers beauty and grooming services at home in ${formattedCity}. Whether you want to relax, look good, or get ready for an event—we come to you.`,
            services: [
                {
                    name: "Women Salon",
                    icon: <FaCut className="text-pink-400" />,
                    description: `No need to visit the salon. Get haircuts, facials, waxing, threading, and more at home in ${formattedCity}. Our beauticians are trained, friendly, and follow proper hygiene.`
                },
                {
                    name: "Men Salon",
                    icon: <FaMale className="text-pink-400" />,
                    description: `Men in ${formattedCity} can now enjoy haircuts, beard grooming, facials, and head massages at home. Our team brings everything needed and gives you a clean and stylish look.`
                },
                {
                    name: "Makeup Service",
                    icon: <FaPalette className="text-pink-400" />,
                    description: `Have a wedding or party? Book our makeup artists at home in ${formattedCity}. We do bridal, party, or simple makeup using top-quality products to give you the perfect look.`
                },
                {
                    name: "Spa Services",
                    icon: <FaBath className="text-pink-400" />,
                    description: `Relax at home with our spa service in ${formattedCity}. We offer body massage, aromatherapy, scrubs, and more—done by trained professionals to help you feel fresh and relaxed.`
                }
            ]
        },
        {
            id: "homecare",
            title: "Home Care Services",
            icon: <FaBroom className="text-green-500" />,
            description: `Mannu Bhai is a trusted name for home cleaning and repair services in ${formattedCity}. Since 2018, we've been helping homes stay clean, safe, and well-maintained—right at your doorstep.`,
            services: [
                {
                    name: "Sofa Cleaning",
                    icon: <FaBroom className="text-green-400" />,
                    description: `Book expert sofa cleaning in ${formattedCity}. We remove dirt and stains to make your sofa look and feel fresh.`
                },
                {
                    name: "Bathroom Cleaning",
                    icon: <FaBath className="text-green-400" />,
                    description: `Our team offers deep bathroom cleaning in ${formattedCity} using high-grade equipment and safe products. Get a sparkling bathroom in just one visit.`
                },
                {
                    name: "Pest Control",
                    icon: <FaBug className="text-green-400" />,
                    description: `Say goodbye to pests with our safe and effective pest control in ${formattedCity}. Our experts use modern sprays that give better and longer-lasting results.`
                },
                {
                    name: "Tank Cleaning",
                    icon: <FaWater className="text-green-400" />,
                    description: `Book water tank cleaning in ${formattedCity} with us. We use modern tools and safe methods to keep your tank clean and healthy.`
                }
            ]
        },
        {
            id: "handyman",
            title: "Handyman Services",
            icon: <FaTools className="text-orange-500" />,
            description: `Got something broken or loose at home? No worries. Mannu Bhai's handyman in ${formattedCity} is just a call away. Whether it's a small repair or a quick fix, we'll send the right person to take care of it—no delays, no hassle. Just honest help, right when you need it.`,
            services: [
                {
                    name: "Painter Service",
                    icon: <FaPaintRoller className="text-orange-400" />,
                    description: `Give your home a new look with our painting service in ${formattedCity}. We offer both interior and exterior painting with smooth finish and neat work.`
                },
                {
                    name: "Plumber Service",
                    icon: <FaWrench className="text-orange-400" />,
                    description: `Got a leaking tap or a blocked drain? Don't worry. Mannu Bhai's plumbers in ${formattedCity} are ready to help. They'll come to your home on time, fix the issue properly, and leave everything clean.`
                },
                {
                    name: "Electrician Service",
                    icon: <FaPlug className="text-orange-400" />,
                    description: `From light fittings to wiring problems—our electricians in ${formattedCity} are trained to solve it safely and quickly.`
                },
                {
                    name: "Mason Service",
                    icon: <FaHammer className="text-orange-400" />,
                    description: `Planning to build something new? Or need a solid repair? Our mason team in ${formattedCity} is experienced in all types of construction work. From walls to flooring, we use the latest tools and strong materials to build it right.`
                }
            ]
        }
    ];

    return (
        <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 sm:py-12 lg:py-20 w-full">
            <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 sm:mb-12 lg:mb-16"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 leading-tight">
                       About MannuBhai Expert Services in {formattedCity}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Premium services delivered to your doorstep with professionalism and care
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12 lg:mb-16 w-full">
                    {serviceCategories.map((category) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden border border-gray-200 w-full"
                        >
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full flex justify-between items-center p-4 sm:p-6 text-left focus:outline-none group"
                            >
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="p-2 sm:p-3 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors">
                                        {React.cloneElement(category.icon, { className: `${category.icon.props.className} text-lg sm:text-xl` })}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                            {category.title}
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-500 mt-1">
                                            {showFullDescription[category.id] 
                                                ? category.description 
                                                : `${category.description.substring(0, 100)}...`}
                                        </p>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleDescription(category.id);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium mt-1 sm:mt-2"
                                        >
                                            {showFullDescription[category.id] ? "Read Less" : "Read More"}
                                        </button>
                                    </div>
                                </div>
                                {expandedCategory === category.id ? (
                                    <FaChevronUp className="text-blue-600 text-base sm:text-lg" />
                                ) : (
                                    <FaChevronDown className="text-gray-500 text-base sm:text-lg group-hover:text-blue-600 transition-colors" />
                                )}
                            </button>
                            
                            <AnimatePresence>
                                {expandedCategory === category.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden w-full"
                                    >
                                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 grid gap-2 sm:gap-4 w-full">
                                            {category.services.map((service, index) => (
                                                <div key={index} className="flex gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg w-full">
                                                    <div className="p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                                                        {React.cloneElement(service.icon, { className: `${service.icon.props.className} text-base sm:text-lg` })}
                                                    </div>
                                                    <div className="w-full">
                                                        <h4 className="font-semibold text-sm sm:text-base text-gray-800">{service.name}</h4>
                                                        <p className="text-gray-600 text-xs sm:text-sm">{service.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md sm:shadow-lg border border-gray-200 w-full"
                >
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900">
                        Why Choose Mannu Bhai in {formattedCity}?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="text-center p-3 sm:p-4">
                            <div className="mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                                <FaCheckCircle className="text-blue-600 text-lg sm:text-xl" />
                            </div>
                            <h4 className="font-bold text-sm sm:text-base lg:text-lg text-gray-800 mb-1 sm:mb-2">All-in-One Solution</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">From appliance repair to beauty services, we cover all home needs</p>
                        </div>
                        <div className="text-center p-3 sm:p-4">
                            <div className="mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                                <FaTools className="text-blue-600 text-lg sm:text-xl" />
                            </div>
                            <h4 className="font-bold text-sm sm:text-base lg:text-lg text-gray-800 mb-1 sm:mb-2">Verified Experts</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">Trained, background-checked professionals for quality service</p>
                        </div>
                        <div className="text-center p-3 sm:p-4">
                            <div className="mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                                <FaHome className="text-blue-600 text-lg sm:text-xl" />
                            </div>
                            <h4 className="font-bold text-sm sm:text-base lg:text-lg text-gray-800 mb-1 sm:mb-2">Doorstep Convenience</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">Get services at home without the hassle of traveling</p>
                        </div>
                        <div className="text-center p-3 sm:p-4">
                            <div className="mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                                <FaCheckCircle className="text-blue-600 text-lg sm:text-xl" />
                            </div>
                            <h4 className="font-bold text-sm sm:text-base lg:text-lg text-gray-800 mb-1 sm:mb-2">Fair Pricing</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">Transparent costs with no hidden charges</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default AboutMannuBhaiExpert;