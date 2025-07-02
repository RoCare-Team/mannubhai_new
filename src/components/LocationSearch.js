"use client";

import { useState, useEffect, useRef } from "react";
import { CiLocationOn } from "react-icons/ci";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import {
  collection,
  getDocs,
  query,
  limit,
  where,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import { db } from "../app/firebaseConfig";

const GOOGLE_API_KEY = "AIzaSyCFsdnyczEGJ1qOYxUvkS6blm5Fiph5u2o"; // <-- Replace with your actual key

const LocationSearch = ({ onClose, onSelectCity }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fetchCities = async (term) => {
    if (!term.trim()) return setResults([]);

    setIsLoading(true);
    try {
      // Google Geocoding API: Get accurate city name
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          term
        )}&key=${GOOGLE_API_KEY}`
      );
      const geoData = await geoRes.json();

      let cityName = "";
      if (
        geoData.status === "OK" &&
        geoData.results &&
        geoData.results.length > 0
      ) {
        const components = geoData.results[0].address_components;
        for (const comp of components) {
          if (comp.types.includes("locality")) {
            cityName = comp.long_name;
            break;
          }
        }

        // fallback to formatted address first part
        if (!cityName) {
          cityName = geoData.results[0].formatted_address.split(",")[0];
        }
      } else {
        cityName = term;
      }

      // Firestore prefix search
      const q = query(
        collection(db, "city_tb"),
        orderBy("city_name"),
        startAt(cityName),
        endAt(cityName + "\uf8ff"),
        limit(10)
      );

      const snapshot = await getDocs(q);
      const matches = [];
      snapshot.forEach((doc) =>
        matches.push({ id: doc.id, ...doc.data() })
      );

      setResults(matches);
    } catch (err) {
      console.error("Error fetching cities:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => fetchCities(searchTerm), 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const handleInputKey = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown" && searchResults.length) {
      e.preventDefault();
      document.getElementById("city-result-0")?.focus();
    }
  };

  const handleResultKey = (e, i, city) => {
    if (e.key === "Enter") onSelectCity(city);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      document.getElementById(`city-result-${i + 1}`)?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      (i === 0
        ? inputRef.current
        : document.getElementById(`city-result-${i - 1}`))?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Select Your City</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <IoCloseOutline className="text-xl" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <IoSearchOutline className="text-gray-500 text-lg shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for your city…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleInputKey}
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
            />
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((city, i) => (
                <div
                  key={city.id}
                  id={`city-result-${i}`}
                  tabIndex={0}
                  className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-blue-50 focus:bg-blue-50 outline-none"
                  onClick={() => onSelectCity(city)}
                  onKeyDown={(e) => handleResultKey(e, i, city)}
                >
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
                    <CiLocationOn className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 capitalize">
                      {city.city_name}
                    </p>
                    {city.state && (
                      <p className="text-xs text-gray-500">{city.state}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <CiLocationOn className="mx-auto text-3xl text-gray-300 mb-2" />
              {searchTerm.trim() ? (
                <>
                  <p>No cities found matching <strong>{searchTerm}</strong></p>
                  <p className="text-xs mt-1">Try a different name</p>
                </>
              ) : (
                <p>Start typing to search for your city</p>
              )}
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
            Press <kbd>Enter</kbd> to select · Use <kbd>↑</kbd>/<kbd>↓</kbd> to navigate
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSearch;
