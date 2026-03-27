import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA8n9sXo2l3v5e6f7g8h9i0j1k2l3m4n5",
    authDomain: "resconi-geomap.firebaseapp.com",
    projectId: "resconi-geomap",
    storageBucket: "resconi-geomap.appspot.com",
    messagingSenderId: "1053466259132",
    appId: "1:1053466259132:android:137edcc19ef296f674aab9",
    measurementId: "G-1A2B3C4D5E"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);