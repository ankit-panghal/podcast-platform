import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBD-o9E-OQSbAO4_yBoPhalr6Cu9XbHwPM",
  authDomain: "podcast-77136.firebaseapp.com",
  projectId: "podcast-77136",
  storageBucket: "podcast-77136.appspot.com",
  messagingSenderId: "134102259309",
  appId: "1:134102259309:web:20a78700e47e26bd9cd164"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);