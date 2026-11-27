import Constants from 'expo-constants';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

type FirebasePublicConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

function readConfig(): FirebasePublicConfig | null {
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;

  const apiKey =
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? extra.firebaseApiKey ?? '';
  const authDomain =
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    extra.firebaseAuthDomain ??
    '';
  const projectId =
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ??
    extra.firebaseProjectId ??
    '';
  const storageBucket =
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    extra.firebaseStorageBucket ??
    '';
  const messagingSenderId =
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    extra.firebaseMessagingSenderId ??
    '';
  const appId =
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? extra.firebaseAppId ?? '';

  if (!apiKey || !projectId || !appId) {
    return null;
  }

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
  return readConfig() != null;
}

export function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  const config = readConfig();
  if (!config) {
    throw new Error(
      'Firebase is not configured. Copy apps/mobile/.env.example to .env and fill EXPO_PUBLIC_FIREBASE_* values.',
    );
  }
  app = getApps().length ? getApp() : initializeApp(config);
  return app;
}

export function getFirebaseAuth(): Auth {
  if (auth) return auth;
  auth = getAuth(getFirebaseApp());
  return auth;
}

export function getFirestoreDb(): Firestore {
  if (db) return db;
  db = getFirestore(getFirebaseApp());
  return db;
}
