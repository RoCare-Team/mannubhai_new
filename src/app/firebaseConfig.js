import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAr8_-XgFHCuqAovbp5NvKnbvBuUdutwJA",
  authDomain: "mannubhai-5f407.firebaseapp.com",
  projectId: "mannubhai-5f407",
  storageBucket: "mannubhai-5f407.appspot.com", 
  messagingSenderId: "1055374831802",
  appId: "1:1055374831802:web:9dc796b3db069c0c0d1283",
  measurementId: "G-29XPJ7LQHL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
