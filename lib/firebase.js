import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, query, orderBy } from "firebase/firestore";
import admin from "firebase-admin";

let db = null;
let isAdmin = false;
const backupLeads = [];

export function initializeFirebase() {
  if (db) return db;

  // Prefer Firebase Admin when credentials are provided (server-side privileged access)
  if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
    try {
      const creds = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
      if (!admin.apps.length) {
        admin.initializeApp({ credential: admin.credential.cert(creds) });
      }
      db = admin.firestore();
      isAdmin = true;
      console.log("Firebase Admin initialized from FIREBASE_ADMIN_CREDENTIALS");
      return db;
    } catch (e) {
      console.warn("Failed to initialize Firebase Admin:", e);
    }
  }

  // Fallback to client SDK when client config is available
  try {
    if (process.env.FIREBASE_CONFIG) {
      try {
        const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
        const firebaseApp = initializeApp(firebaseConfig);
        db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || undefined);
        isAdmin = false;
        console.log("Firebase initialized from FIREBASE_CONFIG");
        return db;
      } catch (e) {
        console.warn("Failed to parse FIREBASE_CONFIG:", e);
      }
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }

  return null;
}

export async function getLeads() {
  const firebaseDb = initializeFirebase();
  // If admin client available, use server SDK
  if (firebaseDb && isAdmin) {
    try {
      const snapshot = await firebaseDb.collection("leads").orderBy("timestamp", "desc").get();
      const leads = [];
      snapshot.forEach((docSnap) => leads.push(docSnap.data()));
      // merge with any backup leads
      return [...backupLeads, ...leads];
    } catch (err) {
      console.warn("Firestore admin getLeads error:", err);
    }
  }

  // If client SDK available
  if (firebaseDb && !isAdmin) {
    try {
      const leadsRef = collection(firebaseDb, "leads");
      const q = query(leadsRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const leadsList = [];
      querySnapshot.forEach((docSnap) => {
        leadsList.push(docSnap.data());
      });
      return [...backupLeads, ...leadsList];
    } catch (err) {
      console.warn("Firestore client getLeads error:", err);
    }
  }

  // No DB available, return backups
  return [...backupLeads];
}

export async function saveLead(lead) {
  const firebaseDb = initializeFirebase();
  // Try admin write first
  if (firebaseDb && isAdmin) {
    try {
      await firebaseDb.collection("leads").doc(lead.id).set(lead);
      console.log("Lead saved to Firestore (admin):", lead.id);
      return;
    } catch (err) {
      console.warn("Admin Firestore save error:", err);
      // fall through to fallback
    }
  }

  // Try client SDK write
  if (firebaseDb && !isAdmin) {
    try {
      await setDoc(doc(firebaseDb, "leads", lead.id), lead);
      console.log("Lead saved to Firestore (client):", lead.id);
      return;
    } catch (err) {
      console.warn("Client Firestore save error:", err);
      // If permission denied, fall back to backup
      backupLeads.unshift(lead);
      console.log("Lead saved to in-memory backup due to permissions:", lead.id);
      return;
    }
  }

  // No Firestore available at all — keep in-memory backup
  backupLeads.unshift(lead);
  console.log("Lead saved to in-memory backup (no firestore):", lead.id);
}

export async function updateLeadStatus(id, status) {
  const firebaseDb = initializeFirebase();
  // Admin path
  if (firebaseDb && isAdmin) {
    try {
      const ref = firebaseDb.collection("leads").doc(id);
      await ref.update({ status });
      const leadsList = await getLeads();
      return leadsList.find((l) => l.id === id) || null;
    } catch (err) {
      console.warn("Admin updateLeadStatus error:", err);
      throw err;
    }
  }

  // Client path
  if (firebaseDb && !isAdmin) {
    try {
      const leadRef = doc(firebaseDb, "leads", id);
      await updateDoc(leadRef, { status });
      const leadsList = await getLeads();
      return leadsList.find((l) => l.id === id) || null;
    } catch (err) {
      console.warn("Client updateLeadStatus error, updating backup if present:", err);
      const idx = backupLeads.findIndex((l) => l.id === id);
      if (idx !== -1) {
        backupLeads[idx].status = status;
        return backupLeads[idx];
      }
      throw err;
    }
  }

  // No DB
  const idx = backupLeads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    backupLeads[idx].status = status;
    return backupLeads[idx];
  }
  throw new Error("Firebase not initialized and lead not found in backup");
}
