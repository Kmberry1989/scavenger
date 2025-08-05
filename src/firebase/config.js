import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth'; // Keep auth specific imports for App.js
import { doc, onSnapshot, setDoc, updateDoc, collection, query, orderBy, limit } from 'firebase/firestore'; // Keep firestore specific imports for App.js

// --- File: src/firebase/config.js ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';