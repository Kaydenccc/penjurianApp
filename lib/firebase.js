import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBmFSKPH1PefEX4zMs-5DA5eixcPHTUeTU",
  authDomain: "penjurian-773e7.firebaseapp.com",
  projectId: "penjurian-773e7",
  storageBucket: "penjurian-773e7.firebasestorage.app",
  messagingSenderId: "382892056105",
  appId: "1:382892056105:web:f18a21d30057c8b8f64638",
  measurementId: "G-RWVK1K6QM2",
  databaseURL: "https://penjurian-773e7-default-rtdb.asia-southeast1.firebasedatabase.app" // ✅ WAJIB!
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
