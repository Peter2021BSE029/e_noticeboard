import { initializeApp } from "firebase/app";
import {getDatabase, ref, push, set, get, onValue, update, remove} from "firebase/database";
import {getStorage, ref as storageRef, uploadBytes, getDownloadURL} from "firebase/storage";
import {getAuth, createUserWithEmailAndPassword, initializeAuth, getReactNativePersistence, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export {database, set, get, update, ref, push, remove, onValue, auth, storage, storageRef, uploadBytes, getDownloadURL, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged};
