"use client";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../firebaseConfig";

const GOOGLE_API_KEY = "AIzaSyCFsdnyczEGJ1qOYxUvkS6blm5Fiph5u2o";

// Main city matching function with multiple fallback strategies
export async function findExactMatch(locationName) {
  if (!locationName?.trim()) return null;

  try {
    // Clean the input location name
    const cleanedName = cleanLocationName(locationName);
    
    // Define matching strategies in order of priority
    const strategies = [
      () => tryExactMatch(cleanedName),
      () => tryCommonNameVariations(cleanedName),
      () => tryCityOnlyMatch(cleanedName),
      () => tryCaseInsensitiveMatch(cleanedName),
      () => tryPartialMatch(cleanedName)
    ];

    // Execute strategies in sequence until a match is found
    for (const strategy of strategies) {
      try {
        const result = await strategy();
        if (result) {
          console.log(`Matched using ${strategy.name}:`, result);
          return result;
        }
      } catch (error) {
        console.warn(`Strategy ${strategy.name} failed:`, error);
      }
    }

    console.warn("No matching city found for:", cleanedName);
    return null;
  } catch (error) {
    console.error("Error in findExactMatch:", error);
    return null;
  }
}

// Helper function to clean location names
function cleanLocationName(name) {
  return name
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''); // Remove special chars
}

// 1. First try exact match
async function tryExactMatch(cityName) {
  const exactQuery = query(
    collection(db, "city_tb"),
    where("city_name", "==", cityName),
    limit(1)
  );
  const snapshot = await getDocs(exactQuery);
  return snapshot.empty ? null : formatCityDoc(snapshot.docs[0]);
}

// 2. Try common name variations (Gurugram/Gurgaon, Mumbai/Bombay etc.)
async function tryCommonNameVariations(locationName) {
  const variations = {
    "gurugram": "gurgaon",
    "gurgaon": "gurugram",
    "bombay": "mumbai",
    "mumbai": "bombay",
    "bangalore": "bengaluru",
    "bengaluru": "bangalore"
    // Add more common variations as needed
  };

  const lowerName = locationName.toLowerCase();
  for (const [key, value] of Object.entries(variations)) {
    if (lowerName.includes(key)) {
      const result = await tryExactMatch(value);
      if (result) return result;
    }
  }
  return null;
}

// 3. Try matching just the city name (before comma)
async function tryCityOnlyMatch(locationName) {
  if (!locationName.includes(",")) return null;
  const cityOnly = locationName.split(",")[0].trim();
  return tryExactMatch(cityOnly);
}

// 4. Try case-insensitive match
async function tryCaseInsensitiveMatch(cityName) {
  const allCities = await getAllCities();
  return allCities.find(c => 
    c.city_name.toLowerCase() === cityName.toLowerCase()
  );
}

// 5. Try partial match (contains)
async function tryPartialMatch(cityName) {
  const allCities = await getAllCities();
  return allCities.find(c => 
    c.city_name.toLowerCase().includes(cityName.toLowerCase()) ||
    cityName.toLowerCase().includes(c.city_name.toLowerCase())
  );
}

// Get all cities from Firestore
async function getAllCities() {
  try {
    const snapshot = await getDocs(collection(db, "city_tb"));
    return snapshot.docs.map(formatCityDoc);
  } catch (error) {
    console.error("Error getting all cities:", error);
    return [];
  }
}

// Format Firestore document
function formatCityDoc(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    city_name: data.city_name,
    city_url: data.city_url || generateCityUrl(data.city_name),
    state: data.state || "",
    coordinates: data.coordinates || null,
    source: 'firestore'
  };
}

// Generate URL slug from city name
function generateCityUrl(cityName) {
  return cityName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, ''); // Remove special chars
}

// Google Places API search
export async function searchPlacesWithGoogle(query) {
  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedQuery}&key=${GOOGLE_API_KEY}&language=en&region=IN&components=country:IN`;
    
    const response = await fetchWithTimeout(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results?.length > 0) {
      return data.results.map(extractCityFromResult);
    }
    
    console.warn("Google Places API returned no results:", data.status);
    return [];
  } catch (error) {
    console.error('Error searching Google Places:', error);
    return [];
  }
}

// Extract city data from Google Places result
function extractCityFromResult(result) {
  let city = "";
  let state = "";
  let coordinates = null;
  
  // Extract address components
  for (const component of result.address_components) {
    if (component.types.includes("locality")) {
      city = component.long_name;
    } else if (component.types.includes("administrative_area_level_1")) {
      state = component.long_name;
    } else if (!city && component.types.includes("administrative_area_level_2")) {
      city = component.long_name;
    }
  }
  
  // Fallback to first part of formatted address
  if (!city && result.formatted_address) {
    city = result.formatted_address.split(",")[0].trim();
  }
  
  // Get coordinates if available
  if (result.geometry?.location) {
    coordinates = {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng
    };
  }
  
  return {
    city_name: city || query,
    city_url: generateCityUrl(city || query),
    state: state || "",
    formatted_address: result.formatted_address,
    place_id: result.place_id,
    coordinates,
    source: 'google'
  };
}

// Fetch with timeout
export function fetchWithTimeout(url, options = {}, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error("Request timed out"));
    }, timeout);

    fetch(url, { ...options, signal: controller.signal })
      .then(response => {
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

// Debug and development utilities
export const locationUtils = {
  async debugMatch(locationName) {
    console.groupCollapsed(`Debugging match for: "${locationName}"`);
    try {
      const result = await findExactMatch(locationName);
      console.log("Match result:", result);
      if (!result) {
        const allCities = await getAllCities();
        console.log("Available cities:", allCities);
      }
      return result;
    } catch (error) {
      console.error("Debug error:", error);
      return null;
    } finally {
      console.groupEnd();
    }
  },

  async listAllCities() {
    try {
      const cities = await getAllCities();
      console.log("All available cities:", cities);
      return cities;
    } catch (error) {
      console.error("Error listing cities:", error);
      return [];
    }
  },

  async testMatching() {
    const testCases = [
      "Delhi",
      "New Delhi",
      "Gurugram",
      "Gurgaon",
      "Mumbai",
      "Bombay",
      "Bangalore",
      "Bengaluru",
      "Noida, Uttar Pradesh",
      "Pune, Maharashtra"
    ];

    console.group("Running location matching tests");
    for (const testCase of testCases) {
      await this.debugMatch(testCase);
    }
    console.groupEnd();
  }
};