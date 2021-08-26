import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDlPE3qUTrCokMnX9fzVvoJn521-KUr62Y",
  authDomain: "booking-demo-b5a96.firebaseapp.com",
  databaseURL: "https://booking-demo-b5a96-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "booking-demo-b5a96",
  storageBucket: "booking-demo-b5a96.appspot.com",
  messagingSenderId: "1047790931636",
  appId: "1:1047790931636:web:dddd79fb74189eecbc91e1"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firestore = firebaseApp.firestore();
export const auth = firebaseApp.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const storage = firebase.storage();

export default firebaseApp;