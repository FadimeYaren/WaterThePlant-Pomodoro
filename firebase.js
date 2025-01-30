// Firebase modüllerini import et
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyCp6isUuq_PAFoGx4y0nhoLA3Kmo8UhMVs",
    authDomain: "watertheplantcommunity.firebaseapp.com",
    projectId: "watertheplantcommunity",
    storageBucket: "watertheplantcommunity.firebasestorage.app",
    messagingSenderId: "476690364986",
    appId: "1:476690364986:web:a01d2bd34ad1895f61d303",
    measurementId: "G-24WR3R4VYD"
};

// Firebase başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Firestore'u dışa aktar
export { db };
