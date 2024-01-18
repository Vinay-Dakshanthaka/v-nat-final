import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdzBpfbe15Zge8uxMz7_iwU6l_a3_RSmA",
  authDomain: "v-natural.firebaseapp.com",
  projectId: "v-natural",
  storageBucket: "v-natural.appspot.com",
  messagingSenderId: "702912405443",
  appId: "1:702912405443:web:7e1cc4f5babe9496bae776",
  measurementId: "G-233394ELQ9"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { app, firestore, storage };
