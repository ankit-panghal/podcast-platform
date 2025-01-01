import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCRC2zZ5UMIABDCz7Vfy8gkB-wN3vW_Pmw",
  authDomain: "podcast-d86dc.firebaseapp.com",
  projectId: "podcast-d86dc",
  storageBucket: "podcast-d86dc.firebasestorage.app",
  messagingSenderId: "879651728838",
  appId: "1:879651728838:web:44593eb952a42c718856c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
