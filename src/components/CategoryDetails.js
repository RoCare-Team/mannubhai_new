'use client';
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import dynamic from 'next/dynamic';

// Dynamic imports for better code splitting
const LoginPopup = dynamic(() => import('./login'));
const Cart = dynamic(() => import('./cart/CartLogic'));
const AwardCertifications = dynamic(() => import('./AwardCertifications'));

// Icons - consider importing only what you need
import { 
  FiShoppingCart, FiX, FiCheck, FiClock, 
  FiShield, FiTruck, FiUserCheck, 
  FiChevronDown, FiChevronUp 
} from "react-icons/fi";

// Constants
const DEFAULT_BANNER = "/ApplianceBanner/appliancs.jpg";
const SERVICE_PRIORITY = {
  service: 1, repair: 2, install: 3, 
  uninstallation: 4, amc: 5, foamjet: 6, gasfilling: 7
};

// Utility functions
const normalizeString = (str) => str?.toLowerCase().trim().replace(/\s+/g, '-') || '';
const extractFirstWords = (str) => {
  const match = str.replace(/^\d+\s*/, "").trim().match(/^([\w'-]+(?:\s+[\w'-]+)*)/i);
  return match ? match[0] : "other";
};

  export default function CategoryDetails  ({
  meta_title,
  meta_description,
  meta_keywords,
  category,
  city = {}
}) {
  // State
  const [selectedService, setSelectedService] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  // Refs
  const contentRef = useRef(null);
  const groupRefs = useRef({});

  // Memoized data transformations
  const serviceGroups = useMemo(() => {
    if (!category?.services) return {};

    const groups = {};
    const displayNameMap = new Map();

    category.services.forEach((service) => {
      let cleanedName = service.service_name;
      let firstWords = extractFirstWords(cleanedName);

      // Special case handling
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
      }

      const groupKey = firstWords.toLowerCase().replace(/\s+/g, '_');
      const priority = SERVICE_PRIORITY[groupKey.split('_')[0]] || 99;

      if (!groups[groupKey]) {
        groups[groupKey] = {
          displayName: firstWords,
          services: [],
          priority,
          image: service.image_icon?.startsWith("http") 
            ? service.image_icon 
            : `https://www.waterpurifierservicecenter.in/inet/img/service_img/${service.image_icon}`,
          id: `service-group-${groupKey}`
        };
      }

      groups[groupKey].services.push(service);
    });

    return groups;
  }, [category]);

  const orderedServiceNames = useMemo(() => 
    Object.keys(serviceGroups).sort((a, b) => {
      const pA = serviceGroups[a].priority || 99;
      const pB = serviceGroups[b].priority || 99;
      return pA !== pB ? pA - pB : serviceGroups[a].displayName.localeCompare(serviceGroups[b].displayName);
    }), 
    [serviceGroups]
  );

  const uniqueServiceGroups = useMemo(() => {
    const seen = new Set();
    return Object.values(serviceGroups)
      .filter(group => !seen.has(group.displayName) && seen.add(group.displayName))
      .sort((a, b) => a.priority - b.priority || a.displayName.localeCompare(b.displayName));
  }, [serviceGroups]);

  // Effects
  useEffect(() => {
    if (!contentRef.current || !category?.category_content) return;

    const checkHeight = () => {
      const element = contentRef.current;
      if (!element) return;

      element.style.maxHeight = '';
      const fullHeight = element.scrollHeight;
      setShowReadMore(fullHeight > 384);
      
      if (!isExpanded && showReadMore) {
        element.style.maxHeight = '24rem';
      }
    };

    const timer = setTimeout(checkHeight, 100);
    return () => clearTimeout(timer);
  }, [category?.category_content, isExpanded]);

  // Handlers
  const scrollToServiceGroup = useCallback((displayName) => {
    setSelectedService(displayName);
    const matchingGroup = Object.entries(serviceGroups)
      .find(([_, group]) => group.displayName === displayName);

    if (matchingGroup) {
      setTimeout(() => {
        const element = groupRefs.current[matchingGroup[0]];
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 116;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [serviceGroups]);

  const handleLoginSuccess = useCallback(() => {
    setShowLoginPopup(false);
    if (pendingCartAction) {
      setTimeout(() => {
        handleCartAction(pendingCartAction);
        setPendingCartAction(null);
      }, 300);
    }
  }, [pendingCartAction]);

  const handleCartAction = useCallback(async ({ serviceId, operation, currentQuantity = 0 }) => {
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
        quantity: operation === "add" ? currentQuantity + 1 
               : operation === "decrement" ? currentQuantity - 1 : 0,
        source: 'mannubhai'
      };

      const res = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/add_to_cart.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.AllCartDetails) {
          localStorage.setItem("checkoutState", JSON.stringify(data.AllCartDetails));
          localStorage.setItem("cart_total_price", data.total_main || 0);
          setCartLoaded(prev => !prev);
        }
      }
    } catch (error) {
      console.error("Cart update failed:", error);
    }
  }, []);
  const isServiceInCart = useCallback((serviceId) => {
    try {
      const cartData = localStorage.getItem("checkoutState");
      if (!cartData) return false;
      
      const parsedData = JSON.parse(cartData);
      return Array.isArray(parsedData) && 
        parsedData.some(item => item?.cart_dtls?.some(dtl => dtl.service_id === serviceId));
    } catch {
      return false;
    }
  }, []);

  const getCartQuantity = useCallback((serviceId) => {
    try {
      const cartData = localStorage.getItem("checkoutState");
      if (!cartData) return 0;
      
      const cartItems = JSON.parse(cartData);
      return cartItems.reduce((total, item) => 
        total + (item?.cart_dtls?.find(dtl => dtl.service_id === serviceId)?.quantity || 0), 0);
    } catch {
      return 0;
    }
  }, []);

  if (!category?.services) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>{meta_title || `${category.category_name} Services`}</title>
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
                  <h1 className="text-lg md:text-xl font-semibold text-[12px] bg-gradient-to-r from-[#e7516c] to-[#21679c] bg-clip-text text-transparent">
                    {city.city_name
                      ? `${category.category_name} Service ${city.city_name} @7065012902`
                      : `${category.category_name} Service @7065012902`}
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-3">
                {uniqueServiceGroups.map((group) => (
                  <button
                    key={group.displayName}
                    onClick={() => scrollToServiceGroup(group.displayName)}
                    className={`flex flex-col items-center p-5 rounded-lg transition-all ${
                      selectedService === group.displayName
                        ? "bg-blue-100 border-2 border-blue-500 text-blue-700 font-semibold"
                        : "hover:bg-gray-50 text-gray-700 border border-gray-200"
                    }`}
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2">
                      <Image
                        src={group.image || "/placeholder-service.png"}
                        alt={group.displayName}
                        width={32}
                        height={32}
                        className="object-cover w-14 h-14"
                      />
                    </div>
                    <span className="font-bold text-[8px] sm:text-[10px] text-center">
                      {group.displayName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
          {/* Main Content */}
          <main className="w-full flex flex-col lg:flex-row gap-8">
            <div className="w-full md:w-[52%]">
              <div className="hidden sm:block relative rounded-xl overflow-hidden w-full aspect-[16/9] mb-8">
                <Image
                  src={category.banner?.trim() || DEFAULT_BANNER}
                  alt={`${category.category_name} banner`}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => { e.currentTarget.src = DEFAULT_BANNER }}
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
                    className={`relative space-y-6 mb-8 transition-all duration-300 ${
                      isHighlighted ? 'ring-2 ring-blue-500 rounded-lg p-4 bg-blue-50' : ''
                    }`}
                    style={{ scrollMarginTop: '120px' }}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 px-2">
                      {group.displayName}
                    </h3>

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
                                    src={service.image_icon?.startsWith("http") 
                                      ? service.image_icon 
                                      : `https://www.waterpurifierservicecenter.in/inet/img/service_img/${service.image_icon}`}
                                    alt={service.service_name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>

                                <button
                                  onClick={() => handleCartAction({
                                    serviceId: service.service_id,
                                    operation: "add",
                                    currentQuantity: quantity
                                  })}
                                  className={`w-full text-xs px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 ${
                                    isAdded
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
              <Cart cartLoaded={cartLoaded} cartLoadedToggle={() => setCartLoaded(prev => !prev)} />

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-4 p-6">
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiShield className="text-blue-600" />
                    Why Choose Us
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: <FiUserCheck />, title: "Expert Professionals", desc: "Certified technicians with years of experience" },
                      { icon: <FiTruck />, title: "Doorstep Service", desc: "We come to you at your convenience" },
                      { icon: <FiClock />, title: "Quick Service", desc: "Same day or next day service available" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        {item.icon}
                        <div>
                          <h4 className="font-medium text-gray-800">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Our Service Process</h3>
                  <div className="space-y-4">
                    {[
                      "Choose Your Service",
                      "Expert Consultation",
                      "Schedule Appointment",
                      "Professional Service",
                      "Quality Check",
                      "Secure Payment"
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="bg-blue-100 text-blue-600 p-1 rounded-full">
                          <FiCheck className="h-4 w-4" />
                        </div>
                        <span className="text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </main>
        </div>
        <section className="mt-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <AwardCertifications />
        </section>
        {category.category_content && (
          <section className="mt-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              About Our {category.category_name} Services {city.city_name}
            </h2>
            <div className="relative">
              <div
                ref={contentRef}
                className={`prose max-w-none transition-all duration-500 ease-in-out ${
                  !isExpanded && showReadMore ? "max-h-96 overflow-hidden" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: category.category_content }}
              />
              {showReadMore && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  {isExpanded ? "Show Less" : "Read More"}
                  {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              )}
            </div>
          </section>
        )}
      </div>
      {/* Mobile Cart Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl"
            >
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FiShoppingCart className="h-6 w-6 text-blue-600" />
                    Your Order
                  </h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <Cart cartLoaded={cartLoaded} cartLoadedToggle={() => setCartLoaded(prev => !prev)} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Login Popup */}
      <AnimatePresence>
        {showLoginPopup && (
          <LoginPopup
            show={showLoginPopup}
            onClose={() => setShowLoginPopup(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </AnimatePresence>
    </>
  );
};
export const fetchCache = 'force-cache';