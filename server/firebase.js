// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABBXBSHAZlaSHzto5IlzNuhB3lm0KIffc",
  authDomain: "easywatch-49f4e.firebaseapp.com",
  projectId: "easywatch-49f4e",
  storageBucket: "easywatch-49f4e.appspot.com",
  messagingSenderId: "72902707700",
  appId: "1:72902707700:web:c94f594cef174a4eff91a1",
  measurementId: "G-J1GWMXSNRK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);