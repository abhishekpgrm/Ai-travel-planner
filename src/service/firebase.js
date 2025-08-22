import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAn9C4TPGc9Rauaq8HrYE1V8n8KCWmT0MM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-travel-d7908.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-travel-d7908",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-travel-d7908.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "368271853276",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:368271853276:web:ea66b5bcbe9fa5656d1619"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
