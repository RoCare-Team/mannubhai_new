"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import LoginPopup from "./login";
import Cart from "./cart/CartLogic";
import {
  FiShoppingCart,
  FiX,
  FiCheck,
  FiClock,
  FiShield,
  FiTruck,
  FiUserCheck,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import AwardCertifications from "./AwardCertifications";

// Utility function to extract images from HTML content
const extractImagesAndContent = (html) => {
  if (!html) return { content: "", images: [] };
  const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/g;
  const images = [];
  let content = html;
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    images.push(match[1]);
  }

  content = html.replace(imgRegex, "");
  return { content, images };
};

// Service priority mapping
const SERVICE_PRIORITY = {
  service: 1,
  repair: 2,
  install: 3,
  uninstallation: 4,
  amc: 5,
  foamjet: 6,
  gasfilling: 7,
};

const CategoryDetails = ({
  meta_title,
  meta_description,
  meta_keywords,
  category,
  city = {},
}) => {
  // State management
  const [selectedService, setSelectedService] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState(null);
  const [serviceDetailsMap, setServiceDetailsMap] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  // Refs
  const serviceRefs = useRef({});
  const groupRefs = useRef({});
  const contentRef = useRef(null);

  // Constants
  const DEFAULT_BANNER = "/ApplianceBanner/appliancs.jpg";

  // Effects
  useEffect(() => {
    if (!contentRef.current || !category?.category_content) return;

    const checkHeight = () => {
      const element = contentRef.current;
      if (!element) return;

      element.style.maxHeight = 'none';
      const fullHeight = element.scrollHeight;
      const needsTruncation = fullHeight > 384;
      setShowReadMore(needsTruncation);

      if (!isExpanded && needsTruncation) {
        element.style.maxHeight = '24rem';
      }
    };

    const timer = setTimeout(checkHeight, 100);
    return () => clearTimeout(timer);
  }, [category?.category_content, isExpanded]);

  useEffect(() => {
    setIsExpanded(false);
    setShowReadMore(false);
  }, [category?.category_name]);

  useEffect(() => {
    if (category?.services) {
      const map = {};
      category.services.forEach((service) => {
        map[service.service_id] = {
          image: service.image_icon
            ? service.image_icon.startsWith("http")
              ? service.image_icon
              : `https://www.waterpurifierservicecenter.in/inet/img/service_img/${service.image_icon}`
            : "/placeholder-service.png",
          name: service.service_name,
          price: service.price,
        };
      });
      setServiceDetailsMap(map);
    }
  }, [category]);

  // Service grouping logic
  const serviceGroups = useMemo(() => {
    if (!category?.services) return {};

    const groups = {};
    const displayNameMap = new Map();

    category.services.forEach((service) => {
      let cleanedName = service.service_name.replace(/^\d+\s*/, "").trim();
      const firstWordsMatch = cleanedName.match(/^([\w'-]+(?:\s+[\w'-]+)*)/i);
      let firstWords = firstWordsMatch ? firstWordsMatch[0] : "other";

      // Handle special cases
      if (cleanedName.toLowerCase().startsWith("installation")) {
        firstWords = "Installation";
      } else if (cleanedName.toLowerCase().startsWith("un-installation")) {
        firstWords = "Un-installation";
      } else if (cleanedName.toLowerCase().includes("amc")) {
        firstWords = "AMC";
      } else if (cleanedName.toLowerCase().startsWith("gas filling")) {
        firstWords = "Gas Filling";
      } else if (cleanedName.toLowerCase().startsWith("foam jet")) {
        firstWords = "Foam Jet";
      } else if (cleanedName.toLowerCase().startsWith("l'oréal")) {
        firstWords = "L'Oréal";
      }

      let groupKey = firstWords.toLowerCase().replace(/\s+/g, '_');
      let displayName = firstWords;

      if (displayNameMap.has(displayName)) {
        const count = displayNameMap.get(displayName) + 1;
        displayNameMap.set(displayName, count);
        groupKey = `${groupKey}_${count}`;
      } else {
        displayNameMap.set(displayName, 1);
      }

      const priority = SERVICE_PRIORITY[groupKey.split('_')[0]] || 99;

      if (!groups[groupKey]) {
        groups[groupKey] = {
          displayName,
          services: [],
          priority,
          image: service.image_icon
            ? service.image_icon.startsWith("http")
              ? service.image_icon
              : `https://www.waterpurifierservicecenter.in/inet/img/service_img/${service.image_icon}`
            : "/placeholder-service.png",
          id: `service-group-${groupKey}`
        };
      }

      groups[groupKey].services.push(service);
    });

    return groups;
  }, [category]);

  const orderedServiceNames = useMemo(() => {
    return Object.keys(serviceGroups).sort((a, b) => {
      const pA = serviceGroups[a].priority || 99;
      const pB = serviceGroups[b].priority || 99;
      return pA !== pB ? pA - pB : serviceGroups[a].displayName.localeCompare(serviceGroups[b].displayName);
    });
  }, [serviceGroups]);

  // Scroll to all matching service groups
const scrollToServiceGroup = useCallback((displayName) => {
  setSelectedService(displayName);

  const matchingGroups = Object.entries(serviceGroups)
    .filter(([_, group]) => group.displayName === displayName)
    .map(([key]) => key);

  if (matchingGroups.length > 0) {
    setTimeout(() => {
      const firstGroupKey = matchingGroups[0];
      if (groupRefs.current[firstGroupKey]) {
        const element = groupRefs.current[firstGroupKey];
        const headerHeight = 100; // Adjust based on your actual header height
        const yOffset = -headerHeight - 16; // Additional 16px padding
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  }
}, [serviceGroups]);

  // Get unique groups for filter display
  const uniqueServiceGroups = useMemo(() => {
    const seen = new Set();
    return Object.values(serviceGroups)
      .filter(group => {
        if (seen.has(group.displayName)) return false;
        seen.add(group.displayName);
        return true;
      })
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.displayName.localeCompare(b.displayName);
      });
  }, [serviceGroups]);
  const isServiceInCart = (serviceId) => {
    try {
      const cartData = localStorage.getItem("checkoutState");
      if (!cartData) return false;

      if (typeof cartData !== 'string' || !cartData.trim().startsWith('[')) {
        return false;
      }

      const parsedData = JSON.parse(cartData);
      if (!Array.isArray(parsedData)) return false;

      return parsedData.some((item) =>
        item.cart_dtls?.some((dtl) => dtl.service_id === serviceId)
      );
    } catch (error) {
      console.error("Error reading cart data:", error);
      return false;
    }
  };

  const getCartQuantity = (serviceId) => {
    try {
      const cartData = localStorage.getItem("checkoutState");
      if (!cartData) return 0;

      if (typeof cartData !== 'string' || !cartData.trim().startsWith('[')) {
        return 0;
      }

      const cartItems = JSON.parse(cartData);
      if (!Array.isArray(cartItems)) return 0;

      for (const item of cartItems) {
        if (!item || typeof item !== 'object') continue;
        const found = item.cart_dtls?.find((dtl) => dtl.service_id === serviceId);
        if (found) return found.quantity || 1;
      }
      return 0;
    } catch (error) {
      console.error("Error reading cart quantity:", error);
      return 0;
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginPopup(false);
    if (pendingCartAction) {
      setTimeout(() => {
        handleCartAction(
          pendingCartAction.serviceId,
          pendingCartAction.operation,
          pendingCartAction.currentQuantity
        );
        setPendingCartAction(null);
      }, 300);
    }
  };

  const handleCartAction = async (serviceId, operation, currentQuantity = 0) => {
    const customerId = localStorage.getItem("customer_id");
    if (!customerId) {
      setPendingCartAction({ serviceId, operation, currentQuantity });
      setShowLoginPopup(true);
      return;
    }

    try {
      const payload = {
        service_id: serviceId,
        type: operation === "remove" ? "delete" : operation,
        cid: customerId,
        quantity:
          operation === "add"
            ? currentQuantity + 1
            : operation === "decrement"
              ? currentQuantity - 1
              : 0,
      };

      const res = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/add_to_cart.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.AllCartDetails) {
        localStorage.setItem(
          "checkoutState",
          JSON.stringify(data.AllCartDetails)
        );
        localStorage.setItem("cart_total_price", data.total_main || 0);
        setCartLoaded((prev) => !prev);
      }
    } catch (error) {
      console.error("Cart update error:", error);
    }
  };

  const calculateTotalItems = () => {
    const cartData = localStorage.getItem("checkoutState");
    if (!cartData) return 0;

    const cartItems = JSON.parse(cartData);
    return cartItems.reduce((total, item) => {
      const itemTotal = item.cart_dtls?.reduce((sum, dtl) => sum + (dtl.quantity || 1), 0) || 0;
      return total + itemTotal;
    }, 0);
  };

  if (!category || !category.services) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{meta_title || `${category?.category_name} Services`}</title>
        <meta name="description" content={meta_description || ""} />
        <meta name="keywords" content={meta_keywords || ""} />
      </Head>

      <div className="mx-auto px-4 sm:px-6 py-8">
        <div className="w-full flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="w-full md:w-[34%] lg:sticky lg:top-4 lg:h-fit">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
             <div className="flex items-center gap-4 mb-6">
  <div className="bg-blue-100 p-2 rounded-lg">
    <FiCheck className="h-6 w-6 text-blue-600" />
  </div>
  <div>
   <h1 className="text-lg md:text-xl font-semibold text-gray-800 text-[12px] bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent">
      {city?.city_name 
        ? `${category.category_name} Services in ${city.city_name}  @7065012902`
        : `${category.category_name} Services @7065012902`}
    </h1>
   
  </div>
</div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
                {uniqueServiceGroups.map((group) => (
                  <button
                    key={group.displayName}
                    onClick={() => scrollToServiceGroup(group.displayName)}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${selectedService === group.displayName
                        ? "bg-blue-100 border-2 border-blue-500 text-blue-700 font-semibold"
                        : "hover:bg-gray-50 text-gray-700 border border-gray-200"
                      }`}
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2">
                      <Image
                        src={group.image}
                        alt={group.displayName}
                        width={32}
                        height={32}
                        className="object-contain w-8 h-8"
                      />
                    </div>
                    <span className="font-bold text-center  text-[10px]">
                      {group.displayName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="w-full flex flex-col lg:flex-row gap-8 pt-[120px]">
            <div className="w-full md:w-[52%]">
              <div className="hidden sm:block relative rounded-xl overflow-hidden w-full aspect-[16/9] mb-8">
                <Image
                  src={category.banner?.trim() ? category.banner : DEFAULT_BANNER}
                  alt={`${category.category_name || "Category"} banner`}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_BANNER;
                  }}
                />
              </div>

              {orderedServiceNames.map((serviceName) => {
                const group = serviceGroups[serviceName];
                const isHighlighted = selectedService === group.displayName;

                return (
                <section
  key={serviceName}
  ref={(el) => (groupRefs.current[serviceName] = el)}
  id={`service-group-${serviceName}`}
  className={`relative space-y-6 mb-8 transition-all duration-300 ${isHighlighted
    ? 'ring-2 ring-blue-500 rounded-lg p-4 bg-blue-50'
    : ''
  }`}
  style={{
    scrollMarginTop: '120px' // This should match your header height + some padding
  }}
>
                    <h2 className="text-xl font-semibold text-gray-800 px-2">
                      {group.displayName}
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                      {group.services.map((service) => {
                        const quantity = getCartQuantity(service.service_id);
                        const isAdded = isServiceInCart(service.service_id);

                        return (
                          <div
                            key={service.service_id}
                            className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-row justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-base md:text-lg font-medium text-gray-800 mb-2">
                                  {service.service_name}
                                </h3>
                                <div
                                  className="text-gray-600 text-sm mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>li]:mb-1"
                                  dangerouslySetInnerHTML={{
                                    __html: service.description || "<ul><li>Professional service with expert technicians</li></ul>",
                                  }}
                                />
                              </div>

                              <div className="w-28 flex-shrink-0 flex flex-col items-center justify-start space-y-2">
                                <div className="relative w-24 h-24 rounded-md overflow-hidden">
                                  <Image
                                    src={
                                      service.image_icon
                                        ? service.image_icon.startsWith("http")
                                          ? service.image_icon
                                          : `https://www.waterpurifierservicecenter.in/inet/img/service_img/${service.image_icon}`
                                        : "/placeholder-service.png"
                                    }
                                    alt={service.service_name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>

                                <button
                                  onClick={() => handleCartAction(service.service_id, "add", quantity)}
                                  className={`w-full text-xs px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 ${isAdded
                                      ? "bg-green-100 text-green-800 cursor-not-allowed"
                                      : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                                  disabled={isAdded}
                                >
                                  {isAdded ? (
                                    <>
                                      <FiCheck className="h-4 w-4" />
                                      Added
                                    </>
                                  ) : (
                                    <>
                                      <FiShoppingCart className="h-4 w-4" />
                                      Add
                                    </>
                                  )}
                                </button>

                                <div className="text-center">
                                  <span className="text-sm font-semibold text-gray-900">
                                    ₹{service.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>

                      {/* Cart Sidebar */}
                      <aside className="w-full lg:w-[420px] lg:sticky lg:top-4 lg:self-start">
                        <Cart
                          cartLoaded={cartLoaded}
                          cartLoadedToggle={() => setCartLoaded((prev) => !prev)}
                        />
          
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-4 p-6">
                          <div className="bg-blue-50 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <FiShield className="text-blue-600" />
                              Why Choose Us
                            </h3>
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <FiUserCheck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h4 className="font-medium text-gray-800">Expert Professionals</h4>
                                  <p className="text-sm text-gray-600">Certified technicians with years of experience</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <FiTruck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h4 className="font-medium text-gray-800">Doorstep Service</h4>
                                  <p className="text-sm text-gray-600">We come to you at your convenience</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <FiClock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h4 className="font-medium text-gray-800">Quick Service</h4>
                                  <p className="text-sm text-gray-600">Same day or next day service available</p>
                                </div>
                              </div>
                            </div>
                          </div>
          
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Our Service Process</h3>
                            <div className="space-y-4">
                              {[
                                { icon: <FiCheck />, text: "Choose Your Service" },
                                { icon: <FiCheck />, text: "Expert Consultation" },
                                { icon: <FiCheck />, text: "Schedule Appointment" },
                                { icon: <FiCheck />, text: "Professional Service" },
                                { icon: <FiCheck />, text: "Quality Check" },
                                { icon: <FiCheck />, text: "Secure Payment" },
                              ].map((step, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <div className="bg-blue-100 text-blue-600 p-1 rounded-full">
                                    {step.icon}
                                  </div>
                                  <span className="text-gray-700">{step.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </aside>
          </main>
        </div>
      </div>
    </>
  );
};

export default CategoryDetails;