import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDzat4XkcjRSmOnhj4pdehXPCazt4pxBKg",
  authDomain: "instagram-clone-eb316.firebaseapp.com",
  databaseURL: "https://instagram-clone-eb316.firebaseio.com",
  projectId: "instagram-clone-eb316",
  storageBucket: "instagram-clone-eb316.appspot.com",
  messagingSenderId: "652361017645",
  appId: "1:652361017645:web:8fac6aa1a5444493550ba4",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
