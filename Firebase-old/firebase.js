import { initializeApp } from "firebase/app";
import {getDatabase, ref, push, set, onValue, update, remove} from "firebase/database";
import {getStorage} from "firebase/storage";
import {getAuth, createUserWithEmailAndPassword, initializeAuth, getReactNativePersistence, signInWithEmailAndPassword} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyChSwAag3hmCan3d45XogA0jFL6yIh0PGQ",
    authDomain: "campus-guide-771a4.firebaseapp.com",
    databaseURL: "https://campus-guide-771a4-default-rtdb.firebaseio.com",
    projectId: "campus-guide-771a4",
    storageBucket: "campus-guide-771a4.appspot.com",
    messagingSenderId: "3080185189",
    appId: "1:3080185189:web:164bb0afc18f0a47196d8c"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export {database, set, update, ref, push, remove, onValue, auth, storage, createUserWithEmailAndPassword, signInWithEmailAndPassword};