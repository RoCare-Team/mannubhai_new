import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

const GOOGLE_API_KEY = "AIzaSyCFsdnyczEGJ1qOYxUvkS6blm5Fiph5u2o";

// Enhanced city matching with multiple fallbacks
export async function findExactMatch(locationName) {
  if (!locationName) return null;

  try {
    // Try different matching strategies
    const strategies = [
      () => tryExactMatch(locationName), // Full location string
      () => tryCityOnlyMatch(locationName), // Just city name
      () => tryCommonNameVariations(locationName), // Gurugram/Gurgaon etc.
      () => tryCaseInsensitiveMatch(locationName) // Case-insensitive
    ];

    for (const strategy of strategies) {
      const result = await strategy();
      if (result) return result;
    }

    return null;
  } catch (error) {
    console.error("Error in findExactMatch:", error);
    return null;
  }
}

async function tryExactMatch(cityName) {
  const exactQuery = query(
    collection(db, "city_tb"),
    where("city_name", "==", cityName)
  );
  const snapshot = await getDocs(exactQuery);
  return snapshot.empty ? null : formatCityDoc(snapshot.docs[0]);
}

async function tryCityOnlyMatch(locationName) {
  if (!locationName.includes(",")) return null;
  const cityOnly = locationName.split(",")[0].trim();
  return tryExactMatch(cityOnly);
}

async function tryCommonNameVariations(locationName) {
  const lowerName = locationName.toLowerCase();
  
  // Handle Gurugram/Gurgaon
  if (lowerName.includes("gurugram")) {
    return tryExactMatch("Gurgaon");
  }
  if (lowerName.includes("gurgaon")) {
    return tryExactMatch("Gurugram");
  }
  
  // Add other common city name variations here
  return null;
}

async function tryCaseInsensitiveMatch(cityName) {
  const allCities = await getAllCities();
  return allCities.find(c => 
    c.city_name.toLowerCase() === cityName.toLowerCase()
  );
}

async function getAllCities() {
  const snapshot = await getDocs(collection(db, "city_tb"));
  return snapshot.docs.map(formatCityDoc);
}

function formatCityDoc(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    city_name: data.city_name,
    city_url: data.city_url || generateCityUrl(data.city_name),
    state: data.state || "",
    source: 'firestore'
  };
}

function generateCityUrl(cityName) {
  return cityName.toLowerCase().replace(/\s+/g, '-');
}

export async function searchPlacesWithGoogle(query) {
  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedQuery}&key=${GOOGLE_API_KEY}&language=en&region=IN&components=country:IN`;
    
    const response = await fetchWithTimeout(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results?.length > 0) {
      return data.results.map(extractCityFromResult);
    }
    return [];
  } catch (error) {
    console.error('Error searching Google Places:', error);
    return [];
  }
}

function extractCityFromResult(result) {
  let city = "";
  let state = "";
  
  for (const component of result.address_components) {
    if (component.types.includes("locality")) {
      city = component.long_name;
    }
    if (component.types.includes("administrative_area_level_1")) {
      state = component.long_name;
    }
    if (!city && component.types.includes("administrative_area_level_2")) {
      city = component.long_name;
    }
  }
  
  if (!city && result.formatted_address) {
    city = result.formatted_address.split(",")[0].trim();
  }
  
  return {
    city_name: city || query,
    city_url: generateCityUrl(city || query),
    state: state || "",
    formatted_address: result.formatted_address,
    place_id: result.place_id,
    source: 'google'
  };
}

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
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

// Debug function to log all cities
export async function debugFirestoreCities() {
  try {
    const cities = await getAllCities();
    console.log("Available cities:", cities);
    return cities;
  } catch (error) {
    console.error("Error debugging cities:", error);
    return [];
  }
}