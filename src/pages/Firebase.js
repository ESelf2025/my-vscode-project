// src/pages/Firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFbhZfdBEXkZdwOrJROjUiU95loodj7s4",
  authDomain: "diary-cbf5d.firebaseapp.com",
  databaseURL: "https://diary-cbf5d-default-rtdb.firebaseio.com",
  projectId: "diary-cbf5d",
  storageBucket: "diary-cbf5d.appspot.com",
  messagingSenderId: "1058185407583",
  appId: "1:1058185407583:web:912f4690f953b77d233fea",
  measurementId: "G-TMDXVN0N9E"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export all Firebase services
export { auth, db, storage };
