
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

export function initializeFirebase() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  let firestore;
  try {
    // Menggunakan inisialisasi standar untuk koneksi yang lebih cepat dan stabil
    firestore = getFirestore(app);
  } catch (error) {
    firestore = getFirestore(app);
  }
  
  return { app, auth, firestore };
}

export const { app, auth, firestore } = initializeFirebase();

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
