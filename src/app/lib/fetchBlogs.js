import { db } from "../firebaseConfig"; 
import { collection, query, where, getDocs } from "firebase/firestore";

export async function getActiveBlogs() {
  try {
    const q = query(
      collection(db, "blog"),
      where("status", "==", "active")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}