import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB31ZYP3DHewexkpwKW9zDv1-S4pygwEjU",
  authDomain: "menahem-56302.firebaseapp.com",
  projectId: "menahem-56302",
  storageBucket: "menahem-56302.appspot.com",
  messagingSenderId: "848304323777",
  appId: "1:848304323777:web:1c21e0422c29bcf6552840",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
