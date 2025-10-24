import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBl0s1peComXFpb5WRy-mqYN-0LwdI9kSc",
  authDomain: "lessonai-sow0w.firebaseapp.com",
  projectId: "lessonai-sow0w",
  storageBucket: "lessonai-sow0w.firebasestorage.app",
  messagingSenderId: "716428820620",
  appId: "1:716428820620:web:f90851f215a7b12a297ba9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;