"use client";
import { useState, useEffect, useCallback, useMemo, memo, lazy, Suspense } from "react";
import { db } from "../app/firebaseConfig";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// Lazy load map component
const LazyMapEmbed = lazy(() => import('./LazyMapEmbed'));

// StoreCard component
const StoreCard = memo(({ store }) => {
  const [showMap, setShowMap] = useState(false);
  
  return (
    <div className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white hover:shadow-lg transition flex flex-col h-full">
      <h3 className="text-xl font-semibold text-indigo-700 mb-3">
        {store.branch || "Franchise Store"}
      </h3>

      <p className="text-gray-700 mb-2">
        <strong>Address:</strong> {store.address}
      </p>

      {store.time && (
        <p className="text-gray-700 mb-2">
          <strong>Timings:</strong> {store.time}
        </p>
      )}

      {store.map_link && (
        <a
          href={store.map_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 mb-4 px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700 transition self-start"
        >
          Open in Google Maps
        </a>
      )}

      {store.map && showMap ? (
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
          <LazyMapEmbed src={store.map} title={`Map for ${store.branch}`} />
        </Suspense>
      ) : store.map ? (
        <button
          onClick={() => setShowMap(true)}
          className="mt-2 p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <div className="text-center">
            <div className="text-indigo-600 text-lg mb-2">📍</div>
            <p className="text-sm text-gray-600">Click to load map</p>
          </div>
        </button>
      ) : null}
    </div>
  );
});
StoreCard.displayName = 'StoreCard';

export default function StoreLocator({ currentCity }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = useCallback(async () => {
    if (!currentCity?.id && !currentCity?.parent_city) return;

    try {
      setLoading(true);
      let targetCityId = currentCity.id;

      if (currentCity.parent_city && currentCity.parent_city !== currentCity.city_name) {
        const citiesRef = collection(db, "city_tb");
        const q = query(
          citiesRef, 
          where("city_name", "==", currentCity.parent_city),
          limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          targetCityId = querySnapshot.docs[0].id;
        }
      }

      if (!targetCityId) {
        setStores([]);
        return;
      }

      const storesRef = collection(db, "franchise_loaction");
      const storesQuery = query(
        storesRef, 
        where("city_id", "==", targetCityId),
        limit(10)
      );
      const storesSnapshot = await getDocs(storesQuery);

      setStores(storesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching stores:", error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, [currentCity]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStores();
    }, 150);
    return () => clearTimeout(timer);
  }, [fetchStores]);

  return (
    <section aria-labelledby="store-locations-title" className="px-4 sm:px-6">
      <div className="text-center mb-10">
        <h2 
          id="store-locations-title"
          className="text-3xl md:text-4xl font-bold mb-4 text-indigo-700" 
        >
          Nearby Store Locations
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Find our nearby franchise stores in your city
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      ) : stores.length > 0 ? (
        <div className="pb-10">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            loop={true}
            className="mySwiper"
          >
            {stores.map((store) => (
              <SwiperSlide key={store.id} className="pb-10">
                <StoreCard store={store} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="text-center py-10 px-6 border border-gray-300 rounded-xl shadow-sm bg-gray-50 mb-16">
          <p className="text-gray-700 text-lg font-medium">
            No store locations found for{" "}
            <span className="text-indigo-600 font-semibold">
              {currentCity.parent_city && currentCity.parent_city !== currentCity.city_name
                ? currentCity.parent_city
                : currentCity.city_name}
            </span>
          </p>
        </div>
      )}
    </section>
  );
}