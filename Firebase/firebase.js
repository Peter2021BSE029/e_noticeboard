import { initializeApp } from "firebase/app";
import {getDatabase, ref, push, set, get, onValue, update, remove} from "firebase/database";
import {getStorage, ref as storageRef, uploadBytes, getDownloadURL} from "firebase/storage";
import {getAuth, createUserWithEmailAndPassword, initializeAuth, getReactNativePersistence, signInWithEmailAndPassword} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "campus-map-3ecef.firebaseapp.com",
  databaseURL: "https://campus-map-3ecef-default-rtdb.firebaseio.com",
  projectId: "campus-map-3ecef",
  storageBucket: "campus-map-3ecef.firebasestorage.app",
  messagingSenderId: "400714085619",
  appId: "1:400714085619:web:c3a7ddde7c223f0d5df386"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export {database, set, get, update, ref, push, remove, onValue, auth, storage, storageRef, uploadBytes, getDownloadURL, createUserWithEmailAndPassword, signInWithEmailAndPassword};
