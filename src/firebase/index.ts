
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

export function initializeFirebase() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  let firestore;
  try {
    // Memperbaiki masalah offline pada Next.js Turbopack
    firestore = initializeFirestore(app, { experimentalForceLongPolling: true });
  } catch (error) {
    // Jika sudah diinisialisasi sebelumnya, fallback ke getFirestore
    firestore = getFirestore(app);
  }
  
  return { app, auth, firestore };
}

export const { app, auth, firestore } = initializeFirebase();

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
