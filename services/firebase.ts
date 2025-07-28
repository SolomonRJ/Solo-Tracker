// services/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, serverTimestamp } from 'firebase/firestore';

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBPbpbSo7XVRqXXdn6LChrJcrrQKqL5-PU",
  authDomain: "studentpunchapp.firebaseapp.com",
  projectId: "studentpunchapp",
  storageBucket: "studentpunchapp.appspot.com",
  messagingSenderId: "1097095993421",
  appId: "1:1097095993421:android:e9b9b4bf38330e5e5ee404"
};

// ✅ Initialize Firebase app only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Persistent login for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// ✅ Firestore instance
const firestore = getFirestore(app);

// ✅ Export serverTimestamp for use in Firestore writes
const FieldValue = { serverTimestamp };

export { auth, firestore, FieldValue };
