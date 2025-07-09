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

const GOOGLE_API_KEY = "AIzaSyCFsdnyczEGJ1qOYxUvkS6blm5Fiph5u2o";

function fetchWithTimeout(url, options = {}, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error("Request timed out"));
    }, timeout);

    fetch(url, { ...options, signal: controller.signal })
      .then((response) => {
        clearTimeout(timeoutId);
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

// Enhanced function to search places with proper encoding and case handling
async function searchPlacesWithGoogle(query) {
  try {
    // Encode the query to handle special characters and case
    const encodedQuery = encodeURIComponent(query.trim());
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedQuery}&key=${GOOGLE_API_KEY}&language=en&region=IN&components=country:IN`;
    
    console.log('Google API - Searching for:', query);
    console.log('Google API - Encoded query:', encodedQuery);
    console.log('Google API - Request URL:', url);
    
    const response = await fetchWithTimeout(url);
    const data = await response.json();
    
    console.log('Google API - Response:', data);
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return data.results.map(result => {
        let city = "", state = "";
        
        // Extract city and state from address components
        for (const component of result.address_components) {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          // Fallback to administrative_area_level_2 if locality not found
          if (!city && component.types.includes("administrative_area_level_2")) {
            city = component.long_name;
          }
        }
        
        // If no city found, extract from formatted address
        if (!city && result.formatted_address) {
          city = result.formatted_address.split(",")[0].trim();
        }
        
        return {
          city_name: city || query,
          state: state || "",
          formatted_address: result.formatted_address,
          place_id: result.place_id,
          source: 'google'
        };
      });
    } else {
      console.error('Google API error:', data.status, data.error_message);
      return [];
    }
  } catch (error) {
    console.error('Error searching Google Places:', error);
    return [];
  }
}

// Enhanced Firestore search with case insensitive handling
async function searchFirestoreCities(term) {
  try {
    const results = [];
    
    // Convert term to different cases for better matching
    const searchTerms = [
      term.toLowerCase(),
      term.toUpperCase(), 
      term.charAt(0).toUpperCase() + term.slice(1).toLowerCase(), // Title case
      term // Original case
    ];
    
    console.log('Firestore - Searching for terms:', searchTerms);
    
    // Search for each variation
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
          // Avoid duplicates by checking if city already exists
          if (!results.some(r => r.city_name.toLowerCase() === data.city_name.toLowerCase())) {
            results.push({ 
              id: doc.id, 
              ...data,
              source: 'firestore'
            });
          }
        });
      } catch (queryError) {
        console.warn(`Firestore query failed for term "${searchTerm}":`, queryError);
      }
    }
    
    // Additional case-insensitive search using where clause
    try {
      // Search for cities that contain the term (case insensitive)
      const allCitiesQuery = query(
        collection(db, "city_tb"),
        limit(20)
      );
      
      const allSnapshot = await getDocs(allCitiesQuery);
      allSnapshot.forEach((doc) => {
        const data = doc.data();
        const cityName = data.city_name || "";
        
        // Case insensitive contains check
        if (cityName.toLowerCase().includes(term.toLowerCase()) && 
            !results.some(r => r.city_name.toLowerCase() === cityName.toLowerCase())) {
          results.push({ 
            id: doc.id, 
            ...data,
            source: 'firestore'
          });
        }
      });
    } catch (containsError) {
      console.warn('Firestore contains search failed:', containsError);
    }
    
    console.log('Firestore - Results found:', results.length);
    return results.slice(0, 10); // Limit to 10 results
  } catch (error) {
    console.error('Error searching Firestore cities:', error);
    return [];
  }
}

const LocationSearch = ({ onClose, onSelectCity }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fetchCities = async (term) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting search for:', term);
      
      // Search both Google API and Firestore simultaneously
      const [googleResults, firestoreResults] = await Promise.all([
        searchPlacesWithGoogle(term),
        searchFirestoreCities(term)
      ]);
      
      console.log('Google results:', googleResults.length);
      console.log('Firestore results:', firestoreResults.length);
      
      // Combine and deduplicate results
      const combinedResults = [];
      const seenCities = new Set();
      
      // Add Firestore results first (they're more likely to be exact matches)
      firestoreResults.forEach(city => {
        const key = city.city_name.toLowerCase();
        if (!seenCities.has(key)) {
          seenCities.add(key);
          combinedResults.push(city);
        }
      });
      
      // Add Google results
      googleResults.forEach(city => {
        const key = city.city_name.toLowerCase();
        if (!seenCities.has(key)) {
          seenCities.add(key);
          combinedResults.push(city);
        }
      });
      
      // Sort results by relevance (exact matches first, then contains)
      combinedResults.sort((a, b) => {
        const aName = a.city_name.toLowerCase();
        const bName = b.city_name.toLowerCase();
        const searchLower = term.toLowerCase();
        
        // Exact match first
        if (aName === searchLower) return -1;
        if (bName === searchLower) return 1;
        
        // Starts with search term
        if (aName.startsWith(searchLower) && !bName.startsWith(searchLower)) return -1;
        if (bName.startsWith(searchLower) && !aName.startsWith(searchLower)) return 1;
        
        // Alphabetical order
        return aName.localeCompare(bName);
      });
      
      console.log('Final combined results:', combinedResults.length);
      setResults(combinedResults.slice(0, 10)); // Limit to 10 results
      
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

  // Highlight matching text in city names
  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-medium">{part}</span>
      ) : part
    );
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
              placeholder="Search for your city (e.g., delhi, MUMBAI, Bangalore)…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleInputKey}
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
            />
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
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
            <div className="py-2">
              {searchResults.map((city, i) => (
                <div
                  key={city.id || `${city.city_name}-${i}`}
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
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <CiLocationOn className="mx-auto text-3xl text-gray-300 mb-2" />
              {searchTerm.trim() ? (
                <>
                  <p>No cities found matching <strong>{searchTerm}</strong></p>
                  <p className="text-xs mt-1">
                    Try different spellings or check your internet connection
                  </p>
                  <p className="text-xs mt-1 text-gray-400">
                    Searched in: uppercase, lowercase, and mixed case
                  </p>
                </>
              ) : (
                <>
                  <p>Start typing to search for your city</p>
                  <p className="text-xs mt-1 text-gray-400">
                    Works with both uppercase and lowercase letters
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 border-t border-gray-200 flex items-center justify-between">
            <span>Press <kbd>Enter</kbd> to select · Use <kbd>↑</kbd>/<kbd>↓</kbd> to navigate</span>
            <span className="text-gray-400">🌐 Google · 📍 Database</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSearch;