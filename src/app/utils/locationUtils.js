import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function findExactMatch(locationName) {
  if (!locationName) return null;

  try {

    let city = await tryExactMatch(locationName);
    if (city) return city;

    // Try removing state/country if present (e.g., "Delhi, India" -> "Delhi")
    if (locationName.includes(",")) {
      const cityOnly = locationName.split(",")[0].trim();
      city = await tryExactMatch(cityOnly);
      if (city) return city;
    }

    // Try case-insensitive match
    const allCities = await getAllCities();
    return allCities.find(c => 
      c.city_name.toLowerCase() === locationName.toLowerCase()
    );
  } catch (error) {
    console.error("Error finding city match:", error);
    return null;
  }
}

async function tryExactMatch(cityName) {
  const q = query(
    collection(db, "city_tb"),
    where("city_name", "==", cityName),
    limit(1)
  );
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : formatCityDoc(snapshot.docs[0]);
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
    city_url: data.city_url || generateSlug(data.city_name),
    state: data.state || ""
  };
}

function generateSlug(cityName) {
  return cityName.toLowerCase().replace(/\s+/g, '-');
}