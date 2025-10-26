// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgJcgQSI24aQCoCcgbb5Ws0wrU4U44sDk",
  authDomain: "login-pot-o-gold.firebaseapp.com",
  projectId: "login-pot-o-gold",
  storageBucket: "login-pot-o-gold.firebasestorage.app",
  messagingSenderId: "595435921886",
  appId: "1:595435921886:web:fef7bbd21d403db12bbd4f",
  measurementId: "G-MX3NWQ1BQM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and EXPORT Firebase Authentication
export const auth = getAuth(app);
export default app;