import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAab0Abfg37oxVigii_VtnOGNFvYCymWds",
  authDomain: "omgtu-connect.firebaseapp.com",
  projectId: "omgtu-connect",
  storageBucket: "omgtu-connect.firebasestorage.app",
  messagingSenderId: "24413663739",
  appId: "1:24413663739:web:7825c8443c3d188c399b5e",
  measurementId: "G-6QLE4Y5M66"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;