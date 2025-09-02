"use client";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// --- Constants ---
const DEFAULT_SERVICE_IMAGE = "/default-images/deafult.jpeg";
const SUBSERVICE_IMAGES = {
  Painter: "/HandyMan/PAINTER.webp",
  Plumber: "/HandyMan/PLUMBER.webp",
  Carpenter: "/HandyMan/CARPENTER.webp",
  Electrician: "/HandyMan/ELECTRICIAN.webp",
  Masons: "/HandyMan/OTHER.webp",
  Manson: "/HandyMan/OTHER.webp",
};
const DESIRED_ORDER = ["Painter", "Plumber", "Carpenter", "Electrician", "Manson"];

// --- Modern Card Component ---
const HandymanServiceCard = memo(({ service, onClick, index }) => (
  <div className="group">
    <button
      onClick={() => onClick(service)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(service);
        }
      }}
      title={`View ${service.ServiceName} services`}
      className="
        w-full aspect-square rounded-2xl p-2 sm:p-3 lg:p-4
        flex flex-col items-center justify-center
        bg-gradient-to-br from-white to-gray-50/50
        border border-gray-100/50
        shadow-md hover:shadow-xl lg:hover:shadow-2xl
        transition-all duration-500 ease-out
        focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2
        lg:hover:scale-105 lg:hover:-translate-y-2
        relative overflow-hidden
        before:absolute before:inset-0 before:bg-gradient-to-br 
        before:from-blue-500/5 before:via-purple-500/5 before:to-indigo-500/5
        before:opacity-0 before:transition-opacity before:duration-300
        lg:hover:before:opacity-100
      "
      style={{
        animationDelay: `${index * 50}ms`,
      }}
      tabIndex={0}
      disabled={false}
    >
      {/* Modern glow effect - desktop only */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/0 via-indigo-400/0 to-purple-400/0 lg:group-hover:from-blue-400/20 lg:group-hover:via-indigo-400/20 lg:group-hover:to-purple-400/20 rounded-2xl blur opacity-0 lg:group-hover:opacity-100 transition-all duration-500"></div>
      
      {/* Content container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {/* Image Container */}
        <div className="flex-1 w-full flex items-center justify-center relative">
          <div className="
            relative 
            lg:group-hover:scale-110 
            transition-transform duration-500 ease-out
          ">
            {/* Subtle background glow for image - desktop only */}
            <div className="absolute -inset-2 bg-gradient-to-br from-blue-400/0 to-indigo-400/0 lg:group-hover:from-blue-400/10 lg:group-hover:to-indigo-400/10 rounded-xl blur-sm opacity-0 lg:group-hover:opacity-100 transition-all duration-300"></div>
            
            <Image
              src={service.ServiceIcon}
              alt={`${service.ServiceName} service`}
              width={100}
              height={100}
              className="
                relative z-10 object-contain 
                w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20
                filter drop-shadow-sm lg:group-hover:drop-shadow-lg
                transition-all duration-500
              "
              priority={service.ServiceName === "Painter"}
              loading={service.ServiceName === "Painter" ? "eager" : "lazy"}
              sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 80px"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgAHAAAAAAAAAAAAAAAAAQIAAxEhkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli21llHDjORrFUjNEWuNfFmNhEfcE05/V2d0NQ3DyY3AgegqKSNgbIUhZq5Q/QBdaDRZNLLrFYD7E/NuBbBVPj7K8b7QSZSGTl2M+yRN7e9A0KUQn8MnI05/vvIj+i9E/qGrwLiuCfDl+7Ej/RmDJGfb/vQoG9WJCaWAmjkUcE5lJk9sVsG3IQBfCLi4M/X9G5QIoNe9ZJPSFYOjmOHHhkY7FGz92B8v1OhJjJYfbBBwG2tFrZTgr45VhKc9HqyTZe2MPEBGa5VzgGsH3GAp6MfXKx2sBWJImfUe3l6OJhXYNSCUoS/x6b/VpNO1iLqxvyPtYY6DzCcTd27e+uVF9QSu1mAp/J1kvgUzYSQ0mgWJlw6Z2TrQkVTjYwQXBLJP8JFhDFJlz5CZEHEFvK1SXGT11zHgZEFEINF2H1GGnGUQiXhNwU8I2G1KMw8YOXGvNuQ8NQjKFyY2J3eIa/yQN6FGxsLx5ZIj+JT5GnJ8YCiEUQTq7T1mjDpQyFCIhYxdMTJMHf7/8BvQ=="
            />
          </div>
        </div>
        
        {/* Service Name */}
        <div className="h-8 sm:h-10 lg:h-12 flex items-center justify-center px-1">
          <span className="
            text-xs sm:text-sm lg:text-base font-semibold text-center 
            leading-tight line-clamp-2
            bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent
            lg:group-hover:from-blue-600 lg:group-hover:to-indigo-600
            transition-all duration-300
          ">
            {service.ServiceName}
          </span>
        </div>
      </div>
    </button>
  </div>
), (prevProps, nextProps) => prevProps.service.id === nextProps.service.id);

HandymanServiceCard.displayName = 'HandymanServiceCard';

// --- Modern Skeleton Loader ---
const SkeletonCard = memo(({ index }) => (
  <div 
    className="
      bg-gradient-to-br from-white to-gray-50/50
      border border-gray-100/50
      rounded-2xl p-2 sm:p-3 lg:p-4 
      flex flex-col items-center justify-center 
      shadow-md animate-pulse aspect-square
      relative overflow-hidden
    "
    style={{
      animationDelay: `${index * 50}ms`,
    }}
  >
    {/* Shimmer effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
    
    <div className="flex-1 w-full flex items-center justify-center">
      <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl" />
    </div>
    <div className="h-8 sm:h-10 lg:h-12 flex items-center justify-center">
      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16" />
    </div>
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';

export default function HandymanServices({ hideBanner = false, onServiceClick, cityUrl }) {
  const router = useRouter();
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  // Preload important images
  useEffect(() => {
    Object.values(SUBSERVICE_IMAGES).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const orderMap = useMemo(
    () =>
      DESIRED_ORDER.reduce((acc, name, idx) => {
        acc[name] = idx;
        return acc;
      }, {}),
    []
  );

  const getSubServiceImage = useCallback(
    (type) => SUBSERVICE_IMAGES[type] || DEFAULT_SERVICE_IMAGE,
    []
  );

  const fetchSubServices = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "lead_type"), where("mannubhai_cat_id", "==", "4"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => {
        const type = doc.data().type;
        return {
          id: doc.id,
          ServiceName: type,
          ServiceIcon: getSubServiceImage(type),
          ...doc.data(),
        };
      });

      data.sort(
        (a, b) =>
          (orderMap[a.ServiceName] ?? Number.MAX_SAFE_INTEGER) -
          (orderMap[b.ServiceName] ?? Number.MAX_SAFE_INTEGER)
      );

      setSubServices(data);
    } catch (error) {
      console.error("Error fetching handyman services:", error);
      setSubServices([]);
    } finally {
      setLoading(false);
    }
  }, [getSubServiceImage, orderMap]);

  const getCategoryUrlByLeadTypeId = useCallback(async (lead_type_id) => {
    try {
      const cacheKey = `handyman-cat-url-${lead_type_id}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return cached;

      const q = query(collection(db, "category_manage"), where("lead_type_id", "==", lead_type_id));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      const url = snapshot.docs[0].data().category_url;
      sessionStorage.setItem(cacheKey, url);
      return url;
    } catch (error) {
      console.error("Error fetching category URL:", error);
      return null;
    }
  }, []);

  const handleSubServiceClick = useCallback(
    async (service) => {
      if (routeLoading) return;
      
      setRouteLoading(true);
      try {
        const category_url = await getCategoryUrlByLeadTypeId(service.id);
        if (!category_url) {
          alert("Category URL not found!");
          return;
        }
        const targetUrl = cityUrl ? `/${cityUrl}/${category_url}` : `/${category_url}`;
        if (onServiceClick) {
          onServiceClick(category_url);
        } else {
          await router.prefetch(targetUrl);
          router.push(targetUrl);
        }
      } catch (error) {
        console.error("Navigation error:", error);
      } finally {
        setRouteLoading(false);
      }
    },
    [getCategoryUrlByLeadTypeId, onServiceClick, cityUrl, router, routeLoading]
  );

  useEffect(() => {
    fetchSubServices();
  }, [fetchSubServices]);

  // Memoized skeleton loader
  const SkeletonLoader = useMemo(() => (
    <div className="grid grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: Math.min(8, DESIRED_ORDER.length) }).map((_, i) => (
        <SkeletonCard key={`skeleton-${i}`} index={i} />
      ))}
    </div>
  ), []);

  return (
    <main className="pb-5 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decorative elements - desktop only */}
      <div className="hidden lg:block absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 rounded-full blur-3xl"></div>
      <div className="hidden lg:block absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-indigo-400/5 to-purple-400/5 rounded-full blur-2xl"></div>

      <section 
        id="handyman-services"
        className="max-w-7xl mx-auto relative z-10"
        role="region"
        aria-labelledby="handyman-services-heading"
      >
        {/* Modern Header */}
        <header className="mb-8 sm:mb-10 lg:mb-12">
          <h2 
            id="handyman-services-heading"
            className="
              text-xl sm:text-2xl lg:text-4xl font-black 
              bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 
              bg-clip-text text-transparent
              mt-3 lg:text-left
            "
          >
            Handyman Services
          </h2>
        </header>

        {/* Services Grid */}
        {loading ? (
          <div className="space-y-8">
            {/* Modern loading indicator */}
            <div className="flex items-center justify-center py-8">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent absolute inset-0"></div>
              </div>
              <span className="ml-4 text-gray-600 font-medium">Loading handyman services...</span>
            </div>
            {SkeletonLoader}
          </div>
        ) : subServices.length === 0 ? (
          <div className="text-center py-20">
            <div className="
              w-32 h-32 mx-auto mb-8 
              bg-gradient-to-br from-gray-100 to-gray-200 
              rounded-2xl flex items-center justify-center
              shadow-lg
            ">
              <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Services Available</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">We re working hard to bring you the best handyman services. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {subServices.map((service, index) => (
              <HandymanServiceCard 
                key={service.id}
                service={service}
                onClick={handleSubServiceClick}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Modern Loading State Overlay */}
        {routeLoading && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="
              bg-gradient-to-br from-white to-gray-50 
              border border-white/50
              rounded-3xl p-8 shadow-2xl 
              flex items-center space-x-6
              backdrop-blur-xl
            ">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200"></div>
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent absolute inset-0"></div>
              </div>
              <span className="text-gray-700 font-semibold text-lg">Loading service...</span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}