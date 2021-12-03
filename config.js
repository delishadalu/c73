// Import the functions you need from the SDKs you need
import firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYQjtYzIl2fE4t794NVUq0pPlosyURMzc",
  authDomain: "willy-app-d2fa3.firebaseapp.com",
  projectId: "willy-app-d2fa3",
  storageBucket: "willy-app-d2fa3.appspot.com",
  messagingSenderId: "180442164381",
  appId: "1:180442164381:web:6167bff409cd2db892b874"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase.firestore()