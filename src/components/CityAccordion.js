"use client";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo, memo, startTransition } from "react";
import { db } from "../app/firebaseConfig";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// Lazy load components with better loading states
const StoreLocator = dynamic(() => import("./StoreLocator"), {
  loading: () => (
    <div className="h-32 bg-gray-100 animate-pulse rounded-lg mb-8" 
         style={{ contentVisibility: 'auto' }} />
  ),
  ssr: false
});

const FooterLinks = dynamic(() => import("@/app/_components/Home/FooterLinks"), {
  loading: () => (
    <div className="h-16 bg-gray-100 animate-pulse rounded" 
         style={{ contentVisibility: 'auto' }} />
  ),
  ssr: false
});

// Pre-optimized SVG icon with minimal DOM
const LocationIcon = memo(() => (
  <svg
    className="h-5 w-5 text-indigo-500 mr-2"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
));
LocationIcon.displayName = 'LocationIcon';

// Minimal loading component
const LoadingSpinner = memo(() => (
  <div className="flex justify-center py-8" style={{ contentVisibility: 'auto' }}>
    <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
  </div>
));
LoadingSpinner.displayName = 'LoadingSpinner';

// Optimized CityCard with minimal re-renders
const CityCard = memo(({ city, currentCategory }) => {
  const slug = city.slug || city.city_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const href = currentCategory ? `/${slug}/${currentCategory}` : `/${slug}`;

  return (
    <Link
      href={href}
      className="group flex items-center p-3 rounded-lg bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 will-change-transform"
      prefetch={false}
      style={{ contentVisibility: 'auto' }}
    >
      <LocationIcon />
      <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 truncate">
        {city.city_name}
      </span>
    </Link>
  );
});
CityCard.displayName = 'CityCard';

// Virtualized city grid for better performance
const CityGrid = memo(({ cities, currentCategory, showAll }) => {
  const citiesToShow = showAll ? cities : cities.slice(0, 8);
  
  return (
    <div 
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '300px' }}
    >
      {citiesToShow.map((city) => (
        <CityCard 
          key={city.id} 
          city={city} 
          currentCategory={currentCategory} 
        />
      ))}
    </div>
  );
});
CityGrid.displayName = 'CityGrid';

export default function CityAccordion({ currentCity }) {
  const [nearbyCities, setNearbyCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const pathname = usePathname();

  // Memoize computed values
  const safeCity = useMemo(() => 
    currentCity || { city_name: "Unknown City", id: "", parent_city: "" },
    [currentCity]
  );

  const currentCategory = useMemo(() => 
    pathname?.split('/')[2] || '',
    [pathname]
  );

  // Optimized fetch with error handling and caching
  const fetchNearbyCities = useCallback(async () => {
    if (!safeCity?.id && !safeCity?.parent_city) {
      setLoading(false);
      return;
    }

    try {
      const citiesRef = collection(db, "city_tb");
      const parentToMatch = safeCity.parent_city || safeCity.city_name;

      const q = query(
        citiesRef,
        where("parent_city", "==", parentToMatch),
        orderBy("city_name", "asc"),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const nearby = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(cityData => cityData.city_name !== safeCity.city_name);

      // Use startTransition for non-urgent updates
      startTransition(() => {
        setNearbyCities(nearby);
        setLoading(false);
      });
    } catch (error) {
      console.warn('Error fetching nearby cities:', error);
      startTransition(() => {
        setNearbyCities([]);
        setLoading(false);
      });
    }
  }, [safeCity]);

  // Optimized effect with cleanup
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      if (mounted) {
        await fetchNearbyCities();
      }
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    const scheduleTask = window.requestIdleCallback || 
      ((cb) => setTimeout(cb, 0));
    
    const taskId = scheduleTask(fetchData);
    
    return () => {
      mounted = false;
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(taskId);
      } else {
        clearTimeout(taskId);
      }
    };
  }, [fetchNearbyCities]);

  const toggleShowAll = useCallback(() => {
    startTransition(() => {
      setShowAll(prev => !prev);
    });
  }, []);

  const hasNearbyCities = nearbyCities.length > 0;
  const shouldShowToggle = nearbyCities.length > 8;

  return (
    <div className="mt-12 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Nearby Service Areas Section */}
      <section aria-labelledby="nearby-areas-title">
        {/* Optimized header with reduced layout shift */}
        <header className="text-center mb-8">
          <h2
            id="nearby-areas-title"
            className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Nearby Service Areas
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-3"></div>
          <p className="text-gray-600 max-w-xl mx-auto text-sm">
            We also provide premium home services in these nearby areas
          </p>
        </header>

        {/* Content area with consistent height */}
        <div 
          className="mb-12"
          style={{ minHeight: '200px', contentVisibility: 'auto' }}
        >
          {loading ? (
            <LoadingSpinner />
          ) : hasNearbyCities ? (
            <>
              <CityGrid 
                cities={nearbyCities}
                currentCategory={currentCategory}
                showAll={showAll}
              />

              {shouldShowToggle && (
                <div className="text-center mt-6">
                  <button
                    onClick={toggleShowAll}
                    className="px-5 py-2 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-expanded={showAll}
                    aria-controls="city-grid"
                  >
                    {showAll ? "Show Less" : `Show More (${nearbyCities.length - 8} more)`}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 px-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-600 text-sm">
                No nearby service areas found for{" "}
                <span className="text-indigo-600 font-semibold">
                  {safeCity.city_name}
                </span>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lazy loaded components */}
      <StoreLocator currentCity={safeCity} />
      <FooterLinks />
    </div>
  );
}