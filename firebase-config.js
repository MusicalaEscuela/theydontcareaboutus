// ============================================================
// firebase-config.js
// Configuración central de Firebase para GitHub Pages.
// Si tu Realtime Database muestra otra URL, cambia solo databaseURL.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getDatabase
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export const firebaseConfig = {
  apiKey: "AIzaSyAfhIfFHuYF_n7vsWrnRp-8idWTnrHf1W4",
  authDomain: "they-don-t-care-about-us.firebaseapp.com",
  databaseURL: "https://they-don-t-care-about-us-default-rtdb.firebaseio.com",
  projectId: "they-don-t-care-about-us",
  storageBucket: "they-don-t-care-about-us.firebasestorage.app",
  messagingSenderId: "386965308484",
  appId: "1:386965308484:web:062d0164d68528dd762811",
  measurementId: "G-SVG6C7DPZF"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getDatabase(firebaseApp);

let authPromise = null;

export function ensureAuth() {
  if (!firebaseConfig.databaseURL || firebaseConfig.databaseURL.includes("REEMPLAZA") || firebaseConfig.databaseURL.includes("TU_DATABASE")) {
    return Promise.reject(new Error("Falta databaseURL en firebase-config.js. Crea Realtime Database y copia la URL exacta."));
  }

  if (auth.currentUser) return Promise.resolve(auth.currentUser);

  if (!authPromise) {
    authPromise = new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          unsubscribe();
          resolve(user);
        }
      }, reject);

      signInAnonymously(auth).catch((error) => {
        unsubscribe();
        authPromise = null;
        reject(error);
      });
    });
  }

  return authPromise;
}
