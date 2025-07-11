"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CiLocationOn } from "react-icons/ci";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
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

const GOOGLE_API_KEY = "AIzaSyCFsdnyczEGJ1qOYxUvkS6blm5Fiph5u2o";

const LocationSearch = ({ onClose, onSelectCity, currentCity, autoSelect = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSelected, setAutoSelected] = useState(false);
  const inputRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchWithTimeout = useCallback(async (url, options = {}, timeout = 5000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }, []);

  const searchPlacesWithGoogle = useCallback(async (query) => {
    try {
      const encodedQuery = encodeURIComponent(query.trim());
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedQuery}&key=${GOOGLE_API_KEY}&language=en&region=IN&components=country:IN`;
      
      const response = await fetchWithTimeout(url);
      const data = await response.json();
      
      if (data.status === 'OK' && data.results?.length > 0) {
        return data.results.map(result => {
          let city = "", state = "";
          
          for (const component of result.address_components) {
            if (component.types.includes("locality")) {
              city = component.long_name;
            } else if (component.types.includes("administrative_area_level_1")) {
              state = component.long_name;
            } else if (!city && component.types.includes("administrative_area_level_2")) {
              city = component.long_name;
            }
          }
          
          if (!city && result.formatted_address) {
            city = result.formatted_address.split(",")[0].trim();
          }
          
          return {
            city_name: city || query,
            city_url: (city || query).toLowerCase().replace(/\s+/g, '-'),
            state: state || "",
            formatted_address: result.formatted_address,
            place_id: result.place_id,
            source: 'google'
          };
        });
      }
      return [];
    } catch (error) {
      console.error('Google Places search error:', error);
      return [];
    }
  }, [fetchWithTimeout]);

  const searchFirestoreCities = useCallback(async (term) => {
    try {
      const results = [];
      const searchTerms = [
        term.toLowerCase(),
        term.toUpperCase(), 
        term.charAt(0).toUpperCase() + term.slice(1).toLowerCase(),
        term
      ];
      
      for (const searchTerm of searchTerms) {
        try {
          const q = query(
            collection(db, "city_tb"),
            orderBy("city_name"),
            startAt(searchTerm),
            endAt(searchTerm + "\uf8ff"),
            limit(5)
          );

          const snapshot = await getDocs(q);
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (!results.some(r => r.city_name.toLowerCase() === data.city_name.toLowerCase())) {
              results.push({ 
                id: doc.id, 
                city_name: data.city_name,
                city_url: data.city_url || data.city_name.toLowerCase().replace(/\s+/g, '-'),
                state: data.state || "",
                source: 'firestore'
              });
            }
          });
        } catch (queryError) {
          console.warn('Firestore query error:', queryError);
        }
      }
      
      return results.slice(0, 10);
    } catch (error) {
      console.error('Firestore search error:', error);
      return [];
    }
  }, []);

  const fetchCities = useCallback(async (term) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const [googleResults, firestoreResults] = await Promise.all([
        searchPlacesWithGoogle(term),
        searchFirestoreCities(term)
      ]);
      
      // Combine and deduplicate results
      const combinedResults = [...firestoreResults, ...googleResults].reduce((acc, city) => {
        const key = city.city_name.toLowerCase();
        if (!acc.some(c => c.city_name.toLowerCase() === key)) {
          acc.push(city);
        }
        return acc;
      }, []);
      
      // Sort results by relevance
      combinedResults.sort((a, b) => {
        const aName = a.city_name.toLowerCase();
        const bName = b.city_name.toLowerCase();
        const searchLower = term.toLowerCase();
        
        // Exact matches first
        if (aName === searchLower) return -1;
        if (bName === searchLower) return 1;
        
        // Then starts with matches
        const aStarts = aName.startsWith(searchLower);
        const bStarts = bName.startsWith(searchLower);
        if (aStarts && !bStarts) return -1;
        if (bStarts && !aStarts) return 1;
        
        // Then alphabetical
        return aName.localeCompare(bName);
      });
      
      setResults(combinedResults.slice(0, 10));
    } catch (err) {
      console.error("City search error:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchPlacesWithGoogle, searchFirestoreCities]);

  const handleCitySelection = useCallback((city) => {
    if (!city?.city_name) {
      router.push("/");
      onClose();
      return;
    }
    
    const cityUrl = city.city_url || city.city_name.toLowerCase().replace(/\s+/g, '-');
    const segments = pathname.split('/').filter(Boolean);
    
    // Preserve service route if exists
    const newPath = segments.length === 2 
      ? `/${cityUrl}/${segments[1]}`
      : `/${cityUrl}`;
    
    router.push(newPath);
    setSearchTerm(city.city_name);
    onClose();
  }, [onClose, pathname, router]);

  const handleAutoSelect = useCallback(async (cityName) => {
    if (!cityName || autoSelected) return;
    
    setIsLoading(true);
    try {
      const [googleResults, firestoreResults] = await Promise.all([
        searchPlacesWithGoogle(cityName),
        searchFirestoreCities(cityName)
      ]);
      
      // Try to find exact match first
      const exactMatch = [...firestoreResults, ...googleResults].find(
        city => city.city_name.toLowerCase() === cityName.toLowerCase()
      );
      
      if (exactMatch) {
        handleCitySelection(exactMatch);
        return;
      }
      
      // If no exact match, show suggestions
      setResults([...firestoreResults, ...googleResults].slice(0, 10));
      setAutoSelected(true);
    } catch (error) {
      console.error("Auto-select error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [autoSelected, handleCitySelection, searchFirestoreCities, searchPlacesWithGoogle]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle current city changes
  useEffect(() => {
    if (currentCity) {
      setSearchTerm(currentCity);
      if (autoSelect && !autoSelected) {
        handleAutoSelect(currentCity);
      }
    }
  }, [currentCity, autoSelect, autoSelected, handleAutoSelect]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => fetchCities(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchCities]);

  const handleInputKey = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown" && searchResults.length > 0) {
      e.preventDefault();
      document.getElementById("city-result-0")?.focus();
    }
  };

  const handleResultKey = (e, i, city) => {
    switch (e.key) {
      case "Enter":
        handleCitySelection(city);
        break;
      case "ArrowDown":
        e.preventDefault();
        document.getElementById(`city-result-${i + 1}`)?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        (i === 0 ? inputRef.current : document.getElementById(`city-result-${i - 1}`))?.focus();
        break;
    }
  };

  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? <span key={i} className="bg-yellow-200 font-medium">{part}</span> : part
    );
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Select Your City</h3>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close city search"
          >
            <IoCloseOutline className="text-xl" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            <IoSearchOutline className="text-gray-500 text-lg shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for your city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleInputKey}
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
              aria-label="City search input"
            />
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" aria-label="Loading" />
            )}
          </div>
          {searchTerm.trim() && (
            <p className="text-xs text-gray-500 mt-2">
              Searching in both uppercase and lowercase...
            </p>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <ul className="py-2">
              {searchResults.map((city, i) => (
                <li
                  key={city.id || `${city.city_name}-${i}`}
                  id={`city-result-${i}`}
                  tabIndex={0}
                  className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-blue-50 focus:bg-blue-50 outline-none transition-colors"
                  onClick={() => handleCitySelection(city)}
                  onKeyDown={(e) => handleResultKey(e, i, city)}
                  aria-label={`Select ${city.city_name}`}
                >
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <CiLocationOn className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800">
                      {highlightMatch(city.city_name, searchTerm)}
                    </p>
                    {city.state && (
                      <p className="text-xs text-gray-500">{city.state}</p>
                    )}
                    {city.formatted_address && city.formatted_address !== city.city_name && (
                      <p className="text-xs text-gray-400 truncate">
                        {city.formatted_address}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {city.source === 'google' ? '🌐' : '📍'}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <CiLocationOn className="mx-auto text-3xl text-gray-300 mb-2" />
              {searchTerm.trim() ? (
                <>
                  <p>No cities found matching <strong>{searchTerm}</strong></p>
                  <p className="text-xs mt-1">
                    Try different spellings or check your internet connection
                  </p>
                </>
              ) : (
                <p>Start typing to search for your city</p>
              )}
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
            <span>Press <kbd>Enter</kbd> to select · Use <kbd>↑</kbd>/<kbd>↓</kbd> to navigate</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSearch;