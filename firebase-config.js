// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Asegúrate de importar AsyncStorage
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDy2SmU7WYocQL0P6KHO0jUB67c_mTiddQ",
  authDomain: "cmic-movil.firebaseapp.com",
  projectId: "cmic-movil",
  storageBucket: "cmic-movil.appspot.com",
  messagingSenderId: "993941641614",
  appId: "1:993941641614:web:0220b744112a46c1a0ecdf",
  measurementId: "G-HN2XDKXF5G"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) // Configuración correcta para persistencia
});
const db = getFirestore(app);
const storage = getStorage(app);
export { app, auth,db, storage };