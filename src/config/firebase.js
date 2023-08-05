// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHYASkjLO57w7jTbm3qORO3tKpQmUX7b8",
  authDomain: "user-form-app-50edd.firebaseapp.com",
  projectId: "user-form-app-50edd",
  storageBucket: "user-form-app-50edd.appspot.com",
  messagingSenderId: "528331302316",
  appId: "1:528331302316:web:d1cddac9d5a41b3cc3c609",
  measurementId: "G-C2B2QN7JE5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);