import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  initializeAuth,
  // @ts-expect-error — RN persistence export exists at runtime in firebase/auth
  getReactNativePersistence,
} from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

type FirebasePublicConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

/** Same public web config already shipped in root index.html (not a secret). */
const PUBLIC_FALLBACK: FirebasePublicConfig = {
  apiKey: 'AIzaSyADgu7agIhlfTu3c0IAgK_k8uf55xCXl2s',
  authDomain: 'dont-text-your-ex.firebaseapp.com',
  projectId: 'dont-text-your-ex',
  storageBucket: 'dont-text-your-ex.firebasestorage.app',
  messagingSenderId: '513866182205',
  appId: '1:513866182205:web:865bee33b150ee27a08454',
};

function readConfig(): FirebasePublicConfig {
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<
    string,
    string | undefined
  >;

  const apiKey =
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
    extra.firebaseApiKey ||
    PUBLIC_FALLBACK.apiKey;
  const authDomain =
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    extra.firebaseAuthDomain ||
    PUBLIC_FALLBACK.authDomain;
  const projectId =
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
    extra.firebaseProjectId ||
    PUBLIC_FALLBACK.projectId;
  const storageBucket =
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    extra.firebaseStorageBucket ||
    PUBLIC_FALLBACK.storageBucket;
  const messagingSenderId =
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    extra.firebaseMessagingSenderId ||
    PUBLIC_FALLBACK.messagingSenderId;
  const appId =
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
    extra.firebaseAppId ||
    PUBLIC_FALLBACK.appId;

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function isFirebaseConfigured(): boolean {
  return Boolean(readConfig().apiKey && readConfig().projectId && readConfig().appId);
}

export function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  const config = readConfig();
  app = getApps().length ? getApp() : initializeApp(config);
  return app;
}

export function getFirebaseAuth(): Auth {
  if (auth) return auth;
  const firebaseApp = getFirebaseApp();
  if (Platform.OS === 'web') {
    auth = getAuth(firebaseApp);
  } else {
    try {
      auth = initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch {
      // Already initialized (Fast Refresh)
      auth = getAuth(firebaseApp);
    }
  }
  return auth;
}

export function getFirestoreDb(): Firestore {
  if (db) return db;
  db = getFirestore(getFirebaseApp());
  return db;
}
