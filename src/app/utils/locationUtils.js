import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../firebaseConfig";

function formatCityDoc(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    city_name: data.city_name,
    city_url: data.city_url || generateSlug(data.city_name),
    state: data.state || ""
  };
}

function generateSlug(cityName) {
  return cityName.toLowerCase().replace(/\s+/g, '-');
}

async function tryExactMatch(cityName) {
  try {
    const q = query(
      collection(db, "city_tb"),
      where("city_name", "==", cityName),
      limit(1)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : formatCityDoc(snapshot.docs[0]);
  } catch (error) {
    console.error("Error in exact match query:", error);
    return null;
  }
}

async function getAllCities() {
  try {
    const snapshot = await getDocs(collection(db, "city_tb"));
    return snapshot.docs.map(formatCityDoc);
  } catch (error) {
    console.error("Error fetching all cities:", error);
    return [];
  }
}

export async function findExactMatch(locationName) {
  if (!locationName) return null;

  // First normalize the input for Gurgaon/Gurugram cases
  const normalizedInput = locationName.trim().toLowerCase();
  const isGurgaonVariant = ['gurgaon', 'gurugram'].includes(normalizedInput);

  try {
    // Try exact match first (with Gurgaon normalization)
    let city = await tryExactMatch(isGurgaonVariant ? 'Gurgaon' : locationName);
    if (city) return city;

    // Handle comma-separated values (like "Gurugram, Haryana")
    if (locationName.includes(",")) {
      const cityOnly = locationName.split(",")[0].trim();
      const normalizedCityOnly = cityOnly.toLowerCase();
      const isCityGurgaonVariant = ['gurgaon', 'gurugram'].includes(normalizedCityOnly);
      
      city = await tryExactMatch(isCityGurgaonVariant ? 'Gurgaon' : cityOnly);
      if (city) return city;
    }

    // Try case-insensitive match with Gurgaon/Gurugram handling
    const allCities = await getAllCities();
    return allCities.find(c => {
      const dbCity = c.city_name.toLowerCase();
      return isGurgaonVariant 
        ? dbCity === 'gurgaon' // Only match Gurgaon for variants
        : dbCity === normalizedInput;
    });

  } catch (error) {
    console.error("Error finding city match:", error);
    return null;
  }
}