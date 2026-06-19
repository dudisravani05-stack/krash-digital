import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, query, orderBy } from "firebase/firestore";

let db = null;

export function initializeFirebase() {
  if (db) return db;

  try {
    if (process.env.FIREBASE_CONFIG) {
      try {
        const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
        const firebaseApp = initializeApp(firebaseConfig);
        db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || undefined);
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
  if (firebaseDb) {
    try {
      const leadsRef = collection(firebaseDb, "leads");
      const q = query(leadsRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const leadsList = [];
      querySnapshot.forEach((docSnap) => {
        leadsList.push(docSnap.data());
      });
      return leadsList;
    } catch (err) {
      console.warn("Firestore error:", err);
    }
  }
  return [];
}

export async function saveLead(lead) {
  const firebaseDb = initializeFirebase();
  if (firebaseDb) {
    try {
      await setDoc(doc(firebaseDb, "leads", lead.id), lead);
      console.log("Lead saved to Firestore:", lead.id);
    } catch (err) {
      console.warn("Failed to save lead:", err);
      throw err;
    }
  } else {
    throw new Error("Firebase not initialized");
  }
}

export async function updateLeadStatus(id, status) {
  const firebaseDb = initializeFirebase();
  if (firebaseDb) {
    try {
      const leadRef = doc(firebaseDb, "leads", id);
      await updateDoc(leadRef, { status });
      const leadsList = await getLeads();
      return leadsList.find((l) => l.id === id) || null;
    } catch (err) {
      console.warn("Failed to update lead status:", err);
      throw err;
    }
  }
  throw new Error("Firebase not initialized");
}
