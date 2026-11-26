import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// Firebase のウェブ用設定値は公開前提(守るのはルールと承認済みドメイン)。環境変数があればそちらを優先
const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCMLf1tCpfTFMVmEd90qmqkBg0W6nOpBiI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "menu-webapps.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "menu-webapps",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:320332688991:web:0c3bf99feb57c287d075ea",
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// オフラインでも入力でき、オンライン復帰時に自動同期される
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
