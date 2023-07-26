import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from "@firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


import { getAnalytics } from "firebase/analytics";
import { Injectable } from "@angular/core";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWWvxUCJR0tVHp8KouOco_auRaQGjUj3c",
  authDomain: "calorie-calculator-e02cf.firebaseapp.com",
  projectId: "calorie-calculator-e02cf",
  storageBucket: "calorie-calculator-e02cf.appspot.com",
  messagingSenderId: "573864750919",
  appId: "1:573864750919:web:6bc2a86f31f5f0d41ea662",
  measurementId: "G-JSCBFGNP34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);  


const db = getFirestore();

export const getFoods = async () => {
  const docRef = doc(db, "foods");
  const docSnap = await getDoc(docRef);
  let fetchedFoods: any = [];
  if (docSnap.exists()) {
    fetchedFoods = docSnap.data();
    console.log("Foods: ", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
  return fetchedFoods;
}


