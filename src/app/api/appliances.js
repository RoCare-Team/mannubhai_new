// pages/api/appliances.js
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig"; 

const SERVICE_ORDER = [
  "Water Purifier",
  "Air Conditioner",
  "Fridge",
  "Washing Machine",
  "Microwave",
  "Kitchen Chimney",
  "LED TV",
  "Vacuum Cleaner",
  "Air Purifier",
  "Air Cooler",
  "Small Appliances",
  "Geyser",
];

export default async function handler(req, res) {
  try {
    // Fetch services from Firestore
    const q = query(
      collection(db, "lead_type"),
      where("mannubhai_cat_id", "==", "1")
    );
    
    const snapshot = await getDocs(q);
    const services = snapshot.docs.map((doc) => ({
      id: doc.id,
      ServiceName: doc.data().type,
      ...doc.data()
    }));

    // Sort services according to predefined order
    const serviceOrderMap = SERVICE_ORDER.reduce((acc, service, index) => {
      acc[service] = index;
      return acc;
    }, {});
    
    services.sort((a, b) => 
      (serviceOrderMap[a.ServiceName] ?? Infinity) - 
      (serviceOrderMap[b.ServiceName] ?? Infinity)
    );

    // Set caching headers
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching appliances:", error);
    res.status(500).json({ error: "Failed to fetch appliances" });
  }
}