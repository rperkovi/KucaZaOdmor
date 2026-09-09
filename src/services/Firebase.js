import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export default function getFirebaseDB() {
    if (!firebaseConfig.projectId) {
        throw new Error('Firebase nije konfiguriran. Postavite VITE_FIREBASE_PROJECT_ID i ostale varijable u .env datoteci.');
    }

    const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    return getFirestore(app);
}
