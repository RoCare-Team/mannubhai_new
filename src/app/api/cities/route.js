import { NextResponse } from 'next/server';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Make sure this path to your firebaseConfig.js is correct

/**
 * Sanitizes Firestore data, converting Timestamps to ISO strings.
 * This is crucial for ensuring the data can be serialized into JSON format without errors.
 * @param {*} data The data to sanitize.
 * @returns Sanitized data.
 */
const sanitizeData = (data) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }
  if (typeof data === 'object' && data !== null) {
    // Check for Firestore Timestamp
    if (data.seconds !== undefined && data.nanoseconds !== undefined && typeof data.toDate === 'function') {
      return data.toDate().toISOString();
    }
    // Recursively sanitize object properties
    const sanitizedObject = {};
    for (const key in data) {
      sanitizedObject[key] = sanitizeData(data[key]);
    }
    return sanitizedObject;
  }
  return data;
};

/**
 * API route handler for GET requests to fetch all cities.
 * It retrieves city data from the "city_tb" collection in Firestore.
 */
export async function GET() {
  try {
    const snap = await getDocs(collection(db, "city_tb"));
    const cities = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const sanitizedCities = sanitizeData(cities);

    // Return the city data with caching headers
    return NextResponse.json(sanitizedCities, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}
