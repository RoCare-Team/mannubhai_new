
import { NextResponse } from 'next/server';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Make sure this path to your firebaseConfig.js is correct
const sanitizeData = (data) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }
  if (typeof data === 'object' && data !== null) {
    if (data.seconds !== undefined && data.nanoseconds !== undefined && typeof data.toDate === 'function') {
      return data.toDate().toISOString();
    }
    const sanitizedObject = {};
    for (const key in data) {
      sanitizedObject[key] = sanitizeData(data[key]);
    }
    return sanitizedObject;
  }
  return data;
};

export async function GET() {
  try {
    const snap = await getDocs(collection(db, "city_tb"));
    const cities = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sanitize the data to ensure it can be sent as JSON
    const sanitizedCities = sanitizeData(cities);

    return NextResponse.json(sanitizedCities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}