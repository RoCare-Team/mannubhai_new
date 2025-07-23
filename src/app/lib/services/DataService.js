import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/firebaseConfig"; 
import AppCache from "./CacheService";
import { normalizeUrlSegment, generateCacheKey } from "../utils/urlUtils";
import { CACHE_TTL } from "../constants";

class DataService {
  static async fetchDocument(collectionName, field, value) {
    const normalizedValue = normalizeUrlSegment(value);
    const cacheKey = generateCacheKey(`${collectionName}-doc`, field, normalizedValue);
    const cached = AppCache.get(cacheKey);
    if (cached) return cached;

    const q = query(collection(db, collectionName));
    const snap = await getDocs(q);
    
    const doc = snap.docs.find(d => {
      const fieldValue = d.data()[field];
      return fieldValue && normalizeUrlSegment(fieldValue) === normalizedValue;
    });
    
    const result = doc ? { id: doc.id, ...doc.data() } : null;
    AppCache.set(cacheKey, result);
    return result;
  }

  static async fetchPageMaster(cityId, categoryId) {
    const cacheKey = generateCacheKey('page-master', cityId, categoryId);
    const cached = AppCache.get(cacheKey);
    if (cached) return cached;

    const q = query(
      collection(db, "page_master_tb"),
      where("city_id", "==", cityId),
      where("category_id", "==", categoryId)
    );
    const snap = await getDocs(q);
    const result = snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
    AppCache.set(cacheKey, result);
    return result;
  }

  static async fetchServices(leadTypeId) {
    const cacheKey = generateCacheKey('services', leadTypeId);
    const cached = AppCache.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch("https://waterpurifierservicecenter.in/customer/ro_customer/all_services.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_type: leadTypeId }),
        next: { revalidate: 3600 }
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const services = data.service_details?.map(service => ({
        service_id: service.id,
        service_name: service.service_name,
        description: service.description,
        price: service.price,
        image_icon: service.image,
        status: "1"
      })) || [];

      AppCache.set(cacheKey, services);
      return services;
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  }

  static async fetchCities() {
    const cacheKey = 'all-cities';
    const cached = AppCache.get(cacheKey);
    if (cached) return cached;

    const snap = await getDocs(collection(db, "city_tb"));
    const cities = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    AppCache.set(cacheKey, cities, CACHE_TTL.LONG);
    return cities;
  }
}

export default DataService;