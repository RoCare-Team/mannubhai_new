"use client";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo, memo, lazy, Suspense } from "react";
import { db } from "../app/firebaseConfig";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import StoreLocator from "./StoreLocator";

// Lazy load FooterLinks
const FooterLinks = dynamic(() => import("@/app/_components/Home/FooterLinks"), {
  loading: () => <div className="h-20 bg-gray-50 animate-pulse rounded"></div>,
  ssr: false
});

// Memoized LocationIcon
const LocationIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-indigo-500 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
));
LocationIcon.displayName = 'LocationIcon';

// LoadingSpinner component
const LoadingSpinner = memo(() => (
  <div className="text-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
  </div>
));
LoadingSpinner.displayName = 'LoadingSpinner';

// CityCard component
const CityCard = memo(({ city, currentCategory }) => {
  const slug = useMemo(() => 
    city.slug || city.city_name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    [city]
  );

  const href = useMemo(() => 
    currentCategory ? `/${slug}/${currentCategory}` : `/${slug}`,
    [slug, currentCategory]
  );

  return (
    <Link
      href={href}
      className="group block rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition p-5"
      prefetch={false}
    >
      <div className="flex items-center">
        <LocationIcon />
        <span className="text-gray-800 font-medium group-hover:text-indigo-600">
          {city.city_name}
        </span>
      </div>
    </Link>
  );
});
CityCard.displayName = 'CityCard';

export default function CityAccordion({ currentCity }) {
  const [nearbyCities, setNearbyCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const pathname = usePathname();

  const safeCity = useMemo(() => 
    currentCity || { city_name: "Unknown City", id: "", parent_city: "" },
    [currentCity]
  );

  const currentCategory = useMemo(() => 
    pathname?.split('/')[2] || '',
    [pathname]
  );

  const fetchNearbyCities = useCallback(async () => {
    if (!safeCity?.id && !safeCity?.parent_city) return;

    try {
      setLoading(true);
      const citiesRef = collection(db, "city_tb");
      const parentToMatch = safeCity.parent_city || safeCity.city_name;

      const q = query(
        citiesRef,
        where("parent_city", "==", parentToMatch),
        orderBy("city_name", "asc"),
        limit(20)
      );

      const querySnapshot = await getDocs(q);
      const nearby = [];

      querySnapshot.forEach((doc) => {
        const cityData = { id: doc.id, ...doc.data() };
        if (cityData.city_name !== safeCity.city_name) {
          nearby.push(cityData);
        }
      });

      setNearbyCities(nearby);
    } catch (error) {
      setNearbyCities([]);
    } finally {
      setLoading(false);
    }
  }, [safeCity]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNearbyCities();
    }, 100);
    return () => clearTimeout(timer);
  }, [fetchNearbyCities]);

  const citiesToShow = useMemo(() => 
    showAll ? nearbyCities : nearbyCities.slice(0, 8),
    [nearbyCities, showAll]
  );

  const toggleShowAll = useCallback(() => 
    setShowAll(prev => !prev),
    []
  );

  return (
    <div className="mt-16 w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
      {/* Nearby Service Areas Section */}
      <section aria-labelledby="nearby-areas-title">
        <div className="text-center mb-10">
          <h2
            id="nearby-areas-title"
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              background: "linear-gradient(to right, #e7516c, #21679c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Nearby Service Areas
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We also provide premium home services in these nearby areas
          </p>
        </div>

        <div className="relative mb-16">
          {loading ? (
            <LoadingSpinner />
          ) : nearbyCities.length > 0 ? (
            <>
              <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-1">
                {citiesToShow.map((city) => (
                  <CityCard 
                    key={city.id} 
                    city={city} 
                    currentCategory={currentCategory} 
                  />
                ))}
              </div>

              {nearbyCities.length > 8 && (
                <div className="text-center mt-6">
                  <button
                    onClick={toggleShowAll}
                    className="inline-block px-6 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition duration-300"
                  >
                    {showAll ? "Show Less" : "Show More"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 px-6 border border-gray-300 rounded-xl shadow-sm bg-gray-50">
              <p className="text-gray-700 text-lg font-medium">
                No nearby service areas found for{" "}
                <span className="text-indigo-600 font-semibold">
                  {safeCity.city_name}
                </span>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Store Locator Section - Now using the separate component */}
      <StoreLocator currentCity={safeCity} />

      <Suspense fallback={<div className="h-20 bg-gray-50 animate-pulse rounded"></div>}>
        <FooterLinks />
      </Suspense>
    </div>
  );
}