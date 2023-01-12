// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0m0SEZdKXvjdW_2ZI_l0rtR-k_2D3PVg",
  authDomain: "workplace-jan-47bf9.firebaseapp.com",
  projectId: "workplace-jan-47bf9",
  storageBucket: "workplace-jan-47bf9.appspot.com",
  messagingSenderId: "226849236419",
  appId: "1:226849236419:web:81755cacd0f314ae170976"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth= getAuth(app);