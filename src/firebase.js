// src/firebase.js
// ─────────────────────────────────────────────────────────
// ÉTAPE 1 : Créer un projet sur https://console.firebase.google.com
// ÉTAPE 2 : Ajouter une app Web → Copier la config ci-dessous
// ÉTAPE 3 : Activer Realtime Database en mode "test"
// ─────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyCax9xoJ0cJzgBR6YkkcwD-NelLGOS-uok",
  authDomain: "qcm-pcep-tp1.firebaseapp.com",
  databaseURL: "https://qcm-pcep-tp1-default-rtdb.firebaseio.com",
  projectId: "qcm-pcep-tp1",
  storageBucket: "qcm-pcep-tp1.firebasestorage.app",
  messagingSenderId: "604749634191",
  appId: "1:604749634191:web:1d7dd326b0862e53ce6efa",
  measurementId: "G-3FMB57YXR6"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
