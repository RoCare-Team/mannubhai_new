// utils/locationMatcher.js
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../app/firebaseConfig";

export async function findMatchingCity(locationName) {
  try {
    // First try exact match
    const exactQuery = query(
      collection(db, "city_tb"),
      where("city_name", "==", locationName)
    );
    
    const exactSnapshot = await getDocs(exactQuery);
    if (!exactSnapshot.empty) {
      const doc = exactSnapshot.docs[0];
      return {
        id: doc.id,
        city_name: doc.data().city_name,
        city_url: doc.data().city_url || doc.data().city_name.toLowerCase().replace(/\s+/g, '-'),
        state: doc.data().state || ""
      };
    }

    // If no exact match, try partial match
    const partialQuery = query(
      collection(db, "city_tb"),
      where("city_name", ">=", locationName),
      where("city_name", "<=", locationName + "\uf8ff")
    );
    
    const partialSnapshot = await getDocs(partialQuery);
    if (!partialSnapshot.empty) {
      const doc = partialSnapshot.docs[0];
      return {
        id: doc.id,
        city_name: doc.data().city_name,
        city_url: doc.data().city_url || doc.data().city_name.toLowerCase().replace(/\s+/g, '-'),
        state: doc.data().state || ""
      };
    }

    return null;
  } catch (error) {
    console.error("Error matching city:", error);
    return null;
  }
}