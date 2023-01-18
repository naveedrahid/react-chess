import { initializeApp } from "firebase/app";
// import {firebase} from 'firebase/compat/app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBBHcaVe2YnuirrwX0UvORvnERYnuq3HLg",
  authDomain: "react-chess-game-f0eee.firebaseapp.com",
  projectId: "react-chess-game-f0eee",
  storageBucket: "react-chess-game-f0eee.appspot.com",
  messagingSenderId: "624693749064",
  appId: "1:624693749064:web:bfb76d289eed33fcdb3f7d",
  measurementId: "G-YRKP375WFS"
};
const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = firebase.firestore();
export const auth = firebase.auth();
export default firebase;