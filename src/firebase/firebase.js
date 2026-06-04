// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// === YE DO LINES ZAROORI HAIN (Inhein mat hatana) ===
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9a0hN0oH-lLRebHBCautHFs8tmivb7Wk",
  authDomain: "gecemithi-a9f02.firebaseapp.com",
  projectId: "gecemithi-a9f02",
  storageBucket: "gecemithi-a9f02.appspot.com",
  messagingSenderId: "431640633767",
  appId: "1:431640633767:web:a3ad5ff964b9e820189682",
  measurementId: "G-D5FQ4ZY87C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if supported
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch((error) => {
  console.log('Analytics not supported:', error);
});

// === AUTH AUR DATABASE INITIALIZE KAREIN ===
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// === EXPORT KAREIN (Taake baaki files use kar sakein) ===
export { auth, db, app, analytics, storage };