"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import LoginPopup from "./login";
import Cart from "./cart/CartLogic";
import {
  FiShoppingCart,
  FiX,
  FiCheck,
  FiStar,
  FiClock,
  FiShield,
  FiTruck,
  FiUserCheck,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import AwardCertifications from "./AwardCertifications";

// Utility function to extract images from HTML content
function extractImagesAndContent(html) {
  if (!html) return { content: "", images: [] };
  const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/g;
  const images = [];
  let match;
  let content = html;

  while ((match = imgRegex.exec(html)) !== null) {
    images.push(match[1]);
  }

  content = html.replace(imgRegex, "");
  return { content, images };
}

// Service priority mapping
const servicePriority = {
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
  city,
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
  const contentRef = useRef(null);

  // Constants
  const defaultBanner = "/ApplianceBanner/appliancs.jpg";

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

    category.services.forEach((service) => {
      let cleanedName = service.service_name
        .replace(/^\d+\s*/, "")
        .trim();

      let groupKey = cleanedName.toLowerCase().match(/^([a-zA-Z-]+)/)?.[0] || "other";
      
      if (cleanedName.toLowerCase().startsWith("installation")) {
        groupKey = "install";
      } 
      else if (cleanedName.toLowerCase().startsWith("un-installation")) {
        groupKey = "uninstallation";
      }
      else if (cleanedName.toLowerCase().startsWith("gas filling")) {
        groupKey = "gasfilling";
      }
      else if (cleanedName.toLowerCase().startsWith("foam jet")) {
        groupKey = "foamjet";
      }

      let priority = servicePriority[groupKey] || 99;

      if (!groups[groupKey]) {
        let displayName;
        switch (groupKey) {
          case "uninstallation":
            displayName = "Un-installation";
            break;
          case "gasfilling":
            displayName = "Gas Filling";
            break;
          case "foamjet":
            displayName = "Foam Jet";
            break;
          default:
            displayName = cleanedName.match(/^([a-zA-Z-]+)/)?.[0] || "Other Services";
        }

        groups[groupKey] = {
          displayName,
          services: [],
          priority,
          image: service.image_icon
            ? service.image_icon.startsWith("http")
              ? service.image_icon
              : `https://www.waterpurifierservicecenter.in/inet/img/service_img/${service.image_icon}`
            : "/placeholder-service.png",
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
      if (pA !== pB) return pA - pB;
      return serviceGroups[a].displayName.localeCompare(
        serviceGroups[b].displayName
      );
    });
  }, [serviceGroups]);

  // Helper functions
  const scrollToService = (serviceName) => {
    setSelectedService((prev) => (prev === serviceName ? null : serviceName));
    setTimeout(() => {
      const ref = serviceRefs.current[serviceName];
      ref?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const { content: contentWithoutImages } = useMemo(
    () => extractImagesAndContent(category?.category_content || ""),
    [category]
  );

const isServiceInCart = (serviceId) => {
  try {
    const cartData = localStorage.getItem("checkoutState");
    if (!cartData) return false;
    
    // Check if the data is valid JSON
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
    
    // Check if the data is valid JSON
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

const validateCartData = () => {
  try {
    const cartData = localStorage.getItem("checkoutState");
    if (!cartData) return [];
    
    // If data exists but isn't valid JSON, reset it
    if (typeof cartData !== 'string' || !cartData.trim().startsWith('[')) {
      localStorage.setItem("checkoutState", JSON.stringify([]));
      return [];
    }
    
    const parsed = JSON.parse(cartData);
    if (!Array.isArray(parsed)) {
      localStorage.setItem("checkoutState", JSON.stringify([]));
      return [];
    }
    
    return parsed;
  } catch (error) {
    console.error("Error validating cart data:", error);
    localStorage.setItem("checkoutState", JSON.stringify([]));
    return [];
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
          {/* Services Navigation Sidebar */}
          <aside className="w-full md:w-[34%] lg:sticky lg:top-4 lg:h-fit">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FiCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">Services</h2>
                  <p className="text-sm text-gray-500">{category.category_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {orderedServiceNames.map((serviceName) => {
                  const group = serviceGroups[serviceName];
                  return (
                    <button
                      key={serviceName}
                      onClick={() => scrollToService(serviceName)}
                      className={`flex flex-col items-center rounded-lg transition-all border p-1 ${
                        selectedService === serviceName
                          ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold"
                          : "hover:bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <div className="w-full flex items-center justify-center mb-1 bg-white rounded-lg h-16 md:h-20">
                        <Image
                          src={group.image}
                          alt={serviceName}
                          width={56}
                          height={56}
                          className="object-contain w-12 h-12 md:w-14 md:h-14"
                        />
                      </div>
                      <span className="text-[10px] xs:text-[10px] sm:text-[10px] md:text-[10px] font-semibold text-center leading-tight px-1">
                        {group.displayName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="w-full flex flex-col lg:flex-row gap-8">
            <div className="w-full md:w-[52%]">
              <div className="hidden sm:block relative rounded-xl overflow-hidden w-full aspect-[16/9] mb-8">
                <Image
                  src={category.banner?.trim() ? category.banner : defaultBanner}
                  alt={`${category.category_name || "Category"} banner`}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    e.currentTarget.src = defaultBanner;
                  }}
                />
              </div>

              {orderedServiceNames.map((serviceName) => {
                const { services, displayName } = serviceGroups[serviceName];
                return (
                  <section
                    key={serviceName}
                    ref={(el) => (serviceRefs.current[serviceName] = el)}
                    className="space-y-6 mb-8"
                  >
                    <h2 className="text-xl font-semibold text-gray-800 px-2">
                      {displayName}
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                      {services.map((service) => {
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
                                    __html:
                                      service.description ||
                                      "<ul><li>Professional service with expert technicians</li></ul>",
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
                                  onClick={() =>
                                    handleCartAction(
                                      service.service_id,
                                      "add",
                                      quantity
                                    )
                                  }
                                  className={`w-full text-xs px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 ${
                                    isAdded
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-600 text-white hover:bg-blue-700"
                                  }`}
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
                        <h4 className="font-medium text-gray-800">
                          Expert Professionals
                        </h4>
                        <p className="text-sm text-gray-600">
                          Certified technicians with years of experience
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiTruck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Doorstep Service
                        </h4>
                        <p className="text-sm text-gray-600">
                          We come to you at your convenience
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiClock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Quick Service
                        </h4>
                        <p className="text-sm text-gray-600">
                          Same day or next day service available
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Our Service Process
                  </h3>
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
        
        <section className="mt-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <AwardCertifications />
        </section>
        
        {category.category_content && (
          <section className="mt-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              About Our {category.category_name}  Services  in    {city.city_name}
            </h2>
            <div className="relative">
              <div
                ref={contentRef}
                className={`prose max-w-none transition-all duration-500 ease-in-out ${
                  !isExpanded && showReadMore ? "max-h-96 overflow-hidden" : "overflow-visible"
                }`}
                dangerouslySetInnerHTML={{ __html: category.category_content }}
              />
              {showReadMore && !isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
              {showReadMore && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
                >
                  {isExpanded ? "Show Less" : "Read More"}
                  {isExpanded ? (
                    <FiChevronUp className="h-5 w-5 transition-transform duration-200" />
                  ) : (
                    <FiChevronDown className="h-5 w-5 transition-transform duration-200" />
                  )}
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
                  <Cart
                    cartLoaded={cartLoaded}
                    cartLoadedToggle={() => setCartLoaded((prev) => !prev)}
                  />
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

export default CategoryDetails;