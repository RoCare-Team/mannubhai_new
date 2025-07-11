// utils/locationUtils.js
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

const GOOGLE_API_KEY = "AIzaSyCFsdnyczEGJ1qOYxUvkS6blm5Fiph5u2o";

export async function findExactMatch(cityName) {
  try {
    // First try exact match in Firestore
    const exactQuery = query(
      collection(db, "city_tb"),
      where("city_name", "==", cityName)
    );
    const snapshot = await getDocs(exactQuery);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        city_name: doc.data().city_name,
        city_url: doc.data().city_url || doc.data().city_name.toLowerCase().replace(/\s+/g, '-'),
        state: doc.data().state || "",
        source: 'firestore'
      };
    }

    // If no exact match in Firestore, try Google results
    const googleResults = await searchPlacesWithGoogle(cityName);
    const exactGoogleMatch = googleResults.find(
      city => city.city_name.toLowerCase() === cityName.toLowerCase()
    );
    
    return exactGoogleMatch || null;
  } catch (error) {
    console.error("Error finding exact match:", error);
    return null;
  }
}

async function searchPlacesWithGoogle(query) {
  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedQuery}&key=${GOOGLE_API_KEY}&language=en&region=IN&components=country:IN`;
    
    const response = await fetchWithTimeout(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return data.results.map(result => {
        let city = "", state = "";
        
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
    console.error('Error searching Google Places:', error);
    return [];
  }
}

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