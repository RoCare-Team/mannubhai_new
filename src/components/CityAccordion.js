"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../app/firebaseConfig";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import FooterLinks from "@/app/_components/Home/FooterLinks";
import { usePathname } from "next/navigation";
export default function CityAccordion({ cities, currentCity }) {
  const [nearbyCities, setNearbyCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const [stores, setStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [showAllStores, setShowAllStores] = useState(false);
 const pathname = usePathname();
  // Safeguard for undefined currentCity
  const safeCity = currentCity || { 
    city_name: "Unknown City", 
    id: "", 
    parent_city: "" 
  };

  // Fetch Nearby Cities
  useEffect(() => {
    const fetchNearbyCities = async () => {
      try {
        if (!safeCity) return;

        setLoading(true);

        const citiesRef = collection(db, "city_tb");

        let parentToMatch = "";
        if (safeCity.parent_city) {
          parentToMatch = safeCity.parent_city;
        } else {
          parentToMatch = safeCity.city_name;
        }

        const q = query(
          citiesRef,
          where("parent_city", "==", parentToMatch),
          orderBy("city_name", "asc")
        );

        const querySnapshot = await getDocs(q);

        const nearby = [];

        querySnapshot.forEach((doc) => {
          const cityData = { id: doc.id };
          Object.assign(cityData, doc.data());

          if (cityData.city_name !== safeCity.city_name) {
            nearby.push(cityData);
          }
        });

        setNearbyCities(nearby);
      } catch (error) {
        console.error("Error fetching nearby cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyCities();
  }, [safeCity]);

  useEffect(() => {
    const fetchStores = async () => {
      if (!safeCity) return;
      try {
        setLoadingStores(true);
        let targetCityId = safeCity.id;
        // If parent_city exists and different from city_name → fetch parent city
        if (
          safeCity.parent_city &&
          safeCity.parent_city !== safeCity.city_name
        ) {
          console.log("Parent city detected:", safeCity.parent_city);

          const citiesRef = collection(db, "city_tb");

          const q = query(
            citiesRef,
            where("city_name", "==", safeCity.parent_city)
          );

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const parentCityDoc = querySnapshot.docs[0];
            targetCityId = parentCityDoc.id;
            console.log("Using parent city_id for store fetch:", targetCityId);
          } else {
            console.warn("Parent city not found, fallback to current city.");
          }
        } else {
          console.log("Using current city_id for store fetch:", targetCityId);
        }

        // Now fetch stores by targetCityId
        const storesRef = collection(db, "franchise_loaction");

        const storesQuery = query(
          storesRef,
          where("city_id", "==", targetCityId)
        );

        const storesSnapshot = await getDocs(storesQuery);

        const fetchedStores = storesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched stores:", fetchedStores);

        setStores(fetchedStores);
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setLoadingStores(false);
      }
    };

    fetchStores();
  }, [safeCity]);

  const initialDisplayCount = 8;
  const citiesToShow = showAll
    ? nearbyCities
    : nearbyCities.slice(0, initialDisplayCount);
  const initialStoresDisplayCount = 3;
  const storesToShow = showAllStores
    ? stores
    : stores.slice(0, initialStoresDisplayCount);
  



     const getCategoryFromUrl = () => {
    if (!pathname) return '';
    const parts = pathname.split('/');
    if (parts.length >= 3) {
      return parts[2];
    }
    return '';
  };

  const currentCategory = getCategoryFromUrl();
  return (
    <div className="mt-16 w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
      {/* Nearby Service Areas Section */}
      <div className="text-center mb-10">
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{
            background: "linear-gradient(to right, #e7516c, #21679c)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
            fontSize: "2.5rem",
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
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-100 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-100 rounded-full opacity-50 blur-xl"></div>

        {loading ? (
          <div className="text-center py-10">
            <h2 className="text-3xl font-bold mb-6">
              Loading Nearby Cities...
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          </div>
        ) : nearbyCities.length > 0 ? (
          <>
           <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-1">
            {citiesToShow.map((city) => {
              const slug = city.slug
                ? city.slug
                : city.city_name
                    .toLowerCase()
                    .replace(/,/g, "")
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");

              // Construct the href - keep the category if it exists
              const href = currentCategory 
                ? `/${slug}/${currentCategory}`
                : `/${slug}`;

              return (
                <Link
                  key={city.id}
                  href={href}
                  className="group relative block overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-indigo-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-gray-800 font-medium group-hover:text-indigo-600 transition-colors">
                        {city.city_name}
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              );
            })}
          </div>

            {nearbyCities.length > initialDisplayCount && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAll(!showAll)}
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

      {/* Store Locator Section */}
      <div className="text-center mb-10">
        <h2
          className="text-3xl md:text-4xl font-bold mb-4 text-indigo-700"
          style={{
            fontSize: "2.5rem",
          }}
        >
          Nearby Store Locations
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Find our nearby franchise stores in your city
        </p>
      </div>

      {loadingStores ? (
        <div className="text-center py-10">
          <h2 className="text-3xl font-bold mb-6">Loading Stores...</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      ) : stores.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {storesToShow.map((store) => {
              return (
                <div
                  key={store.id}
                  className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white hover:shadow-lg transition flex flex-col"
                >
                  <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                    {store.branch ? store.branch : "Franchise Store"}
                  </h3>

                  <p className="text-gray-700 mb-2">
                    <strong>Address:</strong> {store.address}
                  </p>

                  {store.time && (
                    <p className="text-gray-700 mb-2">
                      <strong>Timings:</strong> {store.time}
                    </p>
                  )}

                  {store.map_link ? (
                    <a
                      href={store.map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 mb-4 px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700 transition self-start"
                    >
                      Open in Google Maps
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">
                      No Google Maps link available.
                    </p>
                  )}

                  {store.map ? (
                    <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow mt-2">
                      <iframe
                        src={store.map}
                        width="100%"
                        height="100%"
                        style={{
                          border: 0,
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">
                      No embedded map available.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {stores.length > initialStoresDisplayCount && (
            <div className="text-center mt-6 mb-16">
              <button
                onClick={() => setShowAllStores(!showAllStores)}
                className="inline-block px-6 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition duration-300"
              >
                {showAllStores ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10 px-6 border border-gray-300 rounded-xl shadow-sm bg-gray-50 mb-16">
          <p className="text-gray-700 text-lg font-medium">
            Showing store locations for{" "}
            <span className="text-indigo-600 font-semibold">
              {safeCity.parent_city &&
              safeCity.parent_city !== safeCity.city_name
                ? safeCity.parent_city
                : safeCity.city_name}
            </span>
          </p>
        </div>
      )}
       <FooterLinks />
    </div>
    
  );
}