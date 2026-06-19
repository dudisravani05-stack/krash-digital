import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, query, orderBy } from "firebase/firestore";
let db = null;
const backupLeads = [];

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
      if (leadsList.length > 0) return leadsList;
    } catch (err) {
      console.warn("Firestore error:", err);
    }
  }

  // Try GitHub repo fallback if token provided
  if (process.env.GITHUB_TOKEN) {
    try {
      const repo = process.env.GITHUB_REPO || 'dudisravani05-stack/krash-digital';
      const path = 'data/leads.json';
      const url = `https://api.github.com/repos/${repo}/contents/${path}`;
      const res = await fetch(url, { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } });
      if (res.ok) {
        const json = await res.json();
        const content = Buffer.from(json.content, 'base64').toString('utf8');
        const parsed = JSON.parse(content || '[]');
        return [...backupLeads, ...parsed];
      }
    } catch (e) {
      console.warn('GitHub leads fetch failed:', e);
    }
  }

  return [...backupLeads];
}

export async function saveLead(lead) {
  const firebaseDb = initializeFirebase();
  if (firebaseDb) {
    try {
      await setDoc(doc(firebaseDb, "leads", lead.id), lead);
      console.log("Lead saved to Firestore:", lead.id);
      return;
    } catch (err) {
      console.warn("Failed to save lead to Firestore:", err);
    }
  }

  // Try GitHub fallback
  if (process.env.GITHUB_TOKEN) {
    try {
      const repo = process.env.GITHUB_REPO || 'dudisravani05-stack/krash-digital';
      const path = 'data/leads.json';
      const url = `https://api.github.com/repos/${repo}/contents/${path}`;
      // fetch existing file
      const getRes = await fetch(url, { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } });
      let existing = [];
      let sha = undefined;
      if (getRes.ok) {
        const js = await getRes.json();
        sha = js.sha;
        existing = JSON.parse(Buffer.from(js.content, 'base64').toString('utf8') || '[]');
      }
      existing.unshift(lead);
      const contentBase64 = Buffer.from(JSON.stringify(existing, null, 2), 'utf8').toString('base64');
      const putRes = await fetch(url, {
        method: 'PUT',
        headers: { Authorization: `token ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Add lead via API fallback', content: contentBase64, sha }),
      });
      if (putRes.ok) {
        console.log('Lead saved to GitHub repo fallback:', lead.id);
        return;
      } else {
        console.warn('Failed to save lead to GitHub fallback', await putRes.text());
      }
    } catch (e) {
      console.warn('GitHub fallback error:', e);
    }
  }

  backupLeads.unshift(lead);
  console.log("Lead saved to in-memory backup (no firestore):", lead.id);
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
  const idx = backupLeads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    backupLeads[idx].status = status;
    return backupLeads[idx];
  }
  throw new Error("Firebase not initialized and lead not found in backup");
}
