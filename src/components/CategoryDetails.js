"use client";
import { useState, useRef, useEffect, useMemo, useCallback, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Image from "next/image";

// Lazy load all components with proper loading states
const LoginPopup = lazy(() => import('./login'));
const Cart = lazy(() => import('./cart/CartLogic'));
const AwardCertifications = lazy(() => import('./AwardCertifications'));

// Icons - only import what we need
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

// Skeleton Components
const ServiceCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 animate-pulse">
    <div className="flex flex-row justify-between gap-4">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
      <div className="w-28 flex-shrink-0 flex flex-col items-center space-y-2">
        <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
        <div className="w-full h-8 bg-gray-200 rounded-lg"></div>
        <div className="h-5 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  </div>
);

const ServiceGroupSkeleton = () => (
  <section className="space-y-6 mb-8">
    <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
    <div className="grid grid-cols-1 gap-4">
      {Array(3).fill(0).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  </section>
);

const SidebarSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-3">
      {Array(6).fill(0).map((_, i) => (
        <div key={i} className="flex flex-col items-center p-5 border border-gray-200 rounded-lg">
          <div className="w-12 h-12 bg-gray-200 rounded-lg mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  </div>
);

const CartSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
    <div className="space-y-4">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="flex justify-between items-center p-3 border border-gray-200 rounded">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
      ))}
    </div>
    <div className="mt-4 pt-4 border-t">
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

// Utility functions
const normalizeString = (str) => str?.toLowerCase().trim().replace(/\s+/g, '-') || '';

// Function to extract the first word from a service name
const extractFirstWord = (str) => {
  if (!str) return "other";
  // Remove numbers and leading/trailing whitespace, then get the first word
  const firstWord = str.replace(/^\d+\s*/, "").trim().split(' ')[0];
  return firstWord ? firstWord : "other";
};

// Debounce function to limit how often a function can fire
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Memoized cart functions outside component to prevent re-renders
const isServiceInCart = (serviceId) => {
  try {
    const cartData = localStorage.getItem("checkoutState");
    if (!cartData) return false;
    
    const parsedData = JSON.parse(cartData);
    return Array.isArray(parsedData) && 
      parsedData.some(item => item?.cart_dtls?.some(dtl => dtl.service_id === serviceId));
  } catch {
    return false;
  }
};

const getCartQuantity = (serviceId) => {
  try {
    const cartData = localStorage.getItem("checkoutState");
    if (!cartData) return 0;
    
    const cartItems = JSON.parse(cartData);
    return cartItems.reduce((total, item) => 
      total + (item?.cart_dtls?.find(dtl => dtl.service_id === serviceId)?.quantity || 0), 0);
  } catch {
    return 0;
  }
};

export default function CategoryDetails({
  meta_title,
  meta_description,
  meta_keywords,
  category,
  city = {},
  isLoading = false
}) {
  // State with initial loading states
  const [selectedService, setSelectedService] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [servicesReady, setServicesReady] = useState(!isLoading);

  // Refs
  const contentRef = useRef(null);
  const groupRefs = useRef({});

  // Cart action handler - defined early to avoid reference issues
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

  // Login success handler
  const handleLoginSuccess = useCallback(() => {
    setShowLoginPopup(false);
    if (pendingCartAction) {
      setTimeout(() => {
        handleCartAction(pendingCartAction);
        setPendingCartAction(null);
      }, 300);
    }
  }, [pendingCartAction, handleCartAction]);

  // Memoized data transformations with loading fallback
  const serviceGroups = useMemo(() => {
    if (isLoading || !category?.services) return {};

    const groups = {};
    const displayNameMap = new Map();

    category.services.forEach((service) => {
      let cleanedName = service.service_name;
      let firstWord = extractFirstWord(cleanedName);

      // Special case handling to ensure consistent grouping for common terms
      let groupKey;
      let displayName;
      if (cleanedName.toLowerCase().includes("un-installation")) {
        groupKey = "un-installation";
        displayName = "Un-installation";
      } else if (cleanedName.toLowerCase().includes("amc")) {
        groupKey = "amc";
        displayName = "AMC";
      } else if (cleanedName.toLowerCase().includes("gas filling")) {
        groupKey = "gas_filling";
        displayName = "Gas Filling";
      } else if (cleanedName.toLowerCase().includes("foam jet")) {
        groupKey = "foam_jet";
        displayName = "Foam Jet";
      } else {
        // Default grouping based on the first word
        groupKey = normalizeString(firstWord);
        displayName = firstWord;
      }

      const priority = SERVICE_PRIORITY[groupKey.split('_')[0]] || 99;

      if (!groups[groupKey]) {
        groups[groupKey] = {
          displayName: displayName,
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
  }, [category, isLoading]);

  const orderedServiceNames = useMemo(() => 
    Object.keys(serviceGroups).sort((a, b) => {
      const pA = serviceGroups[a]?.priority || 99;
      const pB = serviceGroups[b]?.priority || 99;
      return pA !== pB ? pA - pB : (serviceGroups[a]?.displayName || '').localeCompare(serviceGroups[b]?.displayName || '');
    }), 
    [serviceGroups]
  );

  const uniqueServiceGroups = useMemo(() => {
    if (isLoading) return [];
    const seen = new Set();
    return Object.values(serviceGroups)
      .filter(group => group && !seen.has(group.displayName) && seen.add(group.displayName))
      .sort((a, b) => a.priority - b.priority || a.displayName.localeCompare(b.displayName));
  }, [serviceGroups, isLoading]);

  // Effects
  useEffect(() => {
    if (isLoading) return;
    
    // Simulate content ready after data loads
    const timer = setTimeout(() => {
      setServicesReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isLoading, category]);

  useEffect(() => {
    if (!contentRef.current || !category?.category_content || isLoading) return;

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
  }, [category?.category_content, isExpanded, isLoading]);

  // Handlers with optimization
  const scrollToServiceGroup = useCallback(debounce((displayName) => {
    if (isLoading) return;
    
    setSelectedService(displayName);
    // Find the group key from the display name to get the correct ref
    const matchingGroup = Object.entries(serviceGroups)
      .find(([_, group]) => group.displayName === displayName);

    if (matchingGroup) {
      requestAnimationFrame(() => {
        const element = groupRefs.current[matchingGroup[0]];
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 116;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    }
  }, 100), [serviceGroups, isLoading]);

  // Loading state
  if (isLoading || !servicesReady) {
    return (
      <>
        <Head>
          <title>{meta_title || 'Loading Services...'}</title>
          <meta name="description" content={meta_description || ""} />
          <meta name="keywords" content={meta_keywords || ""} />
        </Head>
        <div className="mx-auto px-4 sm:px-6 py-8">
          <div className="w-full flex flex-col lg:flex-row gap-8">
            {/* Sidebar Skeleton */}
            <aside className="w-full md:w-[34%] lg:sticky lg:top-4 lg:h-fit">
              <SidebarSkeleton />
            </aside>
            
            {/* Main Content Skeleton */}
            <main className="w-full flex flex-col lg:flex-row gap-8">
              <div className="w-full md:w-[52%]">
                {/* Banner Skeleton */}
                <div className="hidden sm:block h-[300px] bg-gray-200 rounded-xl mb-8 animate-pulse"></div>
                
                {/* Service Groups Skeleton */}
                {Array(3).fill(0).map((_, i) => (
                  <ServiceGroupSkeleton key={i} />
                ))}
              </div>
              
              {/* Cart Sidebar Skeleton */}
              <aside className="w-full lg:w-[420px] lg:sticky lg:top-4 lg:self-start">
                <CartSkeleton />
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-4 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </main>
          </div>
        </div>
      </>
    );
  }

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
                        width={48}
                        height={48}
                        className="object-cover w-12 h-12"
                        loading="lazy"
                        onLoad={() => setImageLoading(false)}
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
              {/* Banner with fixed dimensions */}
              <div className="hidden sm:block relative rounded-xl overflow-hidden w-full h-[300px] mb-8">
                <Image
                  src={category.banner?.trim() || DEFAULT_BANNER}
                  alt={`${category.category_name} banner`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 52vw"
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
                                    loading="lazy"
                                    sizes="96px"
                                  />
                                </div>

                                <button
                                  onClick={() => handleCartAction({
                                    serviceId: service.service_id,
                                    operation: "add",
                                    currentQuantity: quantity
                                  })}
                                  className={`w-full text-xs px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors ${
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
              <Suspense fallback={<CartSkeleton />}>
                <Cart 
                  cartLoaded={cartLoaded} 
                  cartLoadedToggle={() => setCartLoaded(prev => !prev)} 
                />
              </Suspense>

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

        {/* Awards Section */}
        <section className="mt-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <Suspense fallback={<div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>}>
            <AwardCertifications />
          </Suspense>
        </section>

        {/* Content Section */}
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
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
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
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <Suspense fallback={<CartSkeleton />}>
                    <Cart 
                      cartLoaded={cartLoaded} 
                      cartLoadedToggle={() => setCartLoaded(prev => !prev)} 
                    />
                  </Suspense>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Popup */}
      <AnimatePresence>
        {showLoginPopup && (
          <Suspense fallback={null}>
            <LoginPopup
              show={showLoginPopup}
              onClose={() => setShowLoginPopup(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
};

export const fetchCache = 'force-cache';