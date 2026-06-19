import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, query, orderBy } from "firebase/firestore";
let db = null;
const backupLeads = [];

// Helper to construct GitHub API URLs
function _githubUrl(path) {
  const repo = process.env.GITHUB_REPO || 'dudisravani05-stack/krash-digital';
  return `https://api.github.com/repos/${repo}/contents/${path}`;
}

async function _githubGet(path) {
  if (!process.env.GITHUB_TOKEN) return null;
  try {
    const url = _githubUrl(path);
    const res = await fetch(url, { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('GitHub GET error:', e);
    return null;
  }
}

async function _githubPut(path, contentStr, message = 'Update via API') {
  if (!process.env.GITHUB_TOKEN) return { ok: false, error: 'no-token' };
  try {
    const url = _githubUrl(path);
    const existing = await _githubGet(path);
    const sha = existing ? existing.sha : undefined;
    const content = Buffer.from(contentStr, 'utf8').toString('base64');
    const res = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, content, sha }),
    });
    const json = await res.json();
    return { ok: res.ok, json };
  } catch (e) {
    return { ok: false, error: e.message || String(e) };
  }
}

async function githubFetchLeads() {
  const js = await _githubGet('data/leads.json');
  if (!js) return null;
  try {
    const parsed = JSON.parse(Buffer.from(js.content, 'base64').toString('utf8') || '[]');
    return parsed;
  } catch (e) {
    return null;
  }
}

async function githubSaveLeads(leads) {
  return await _githubPut('data/leads.json', JSON.stringify(leads, null, 2), 'Update leads via API');
}

async function githubAppendLog(entry) {
  const path = 'data/logs.json';
  const existing = await _githubGet(path);
  let logs = [];
  let sha;
  if (existing && existing.content) {
    try {
      logs = JSON.parse(Buffer.from(existing.content, 'base64').toString('utf8') || '[]');
      sha = existing.sha;
    } catch (e) {
      logs = [];
    }
  }
  logs.unshift(entry);
  return await _githubPut(path, JSON.stringify(logs, null, 2), 'Append log via API');
}

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
      // keep firestore results even if empty and merge with GitHub fallback later
      const firestoreLeads = leadsList;
      // If firestore returned leads, prefer them but still attempt to merge with GitHub for redundancy
      const ghLeads = await githubFetchLeads();
      if (ghLeads && Array.isArray(ghLeads)) {
        // merge and dedupe by id, prefer firestore entries
        const map = new Map();
        for (const l of ghLeads) map.set(l.id, l);
        for (const l of firestoreLeads) map.set(l.id, l);
        return [...backupLeads, ...Array.from(map.values()).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))];
      }
      if (firestoreLeads.length > 0) return firestoreLeads;
    } catch (err) {
      console.warn("Firestore error:", err);
    }
  }
  // Try GitHub repo fallback if token provided
  const ghLeads = await githubFetchLeads();
  if (ghLeads && Array.isArray(ghLeads)) return [...backupLeads, ...ghLeads];

  return [...backupLeads];
}

export async function saveLead(lead) {
  const firebaseDb = initializeFirebase();
  const logEntry = { event: 'saveLead_attempt', id: lead.id, timestamp: new Date().toISOString() };
  let firestoreOk = false;
  if (firebaseDb) {
    try {
      await setDoc(doc(firebaseDb, "leads", lead.id), lead);
      console.log("Lead saved to Firestore:", lead.id);
      firestoreOk = true;
    } catch (err) {
      console.warn("Failed to save lead to Firestore:", err);
      logEntry.firestoreError = String(err.message || err);
    }
  }

  // Always attempt GitHub persistence for redundancy
  try {
    const gh = await githubFetchLeads();
    const leads = Array.isArray(gh) ? gh : [];
    // ensure we don't duplicate
    const map = new Map();
    for (const l of leads) map.set(l.id, l);
    map.set(lead.id, lead);
    const merged = Array.from(map.values()).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
    const res = await githubSaveLeads(merged);
    if (res && res.ok) {
      console.log('Lead persisted to GitHub fallback:', lead.id);
      logEntry.github = 'ok';
    } else {
      console.warn('GitHub save result:', res && (res.error || JSON.stringify(res.json).slice(0,200)));
      logEntry.github = res && (res.error || 'failed');
    }
  } catch (e) {
    console.warn('GitHub persistence error:', e);
    logEntry.github = String(e.message || e);
  }

  // append server log
  try {
    await githubAppendLog({ ...logEntry, lead });
  } catch (e) {
    console.warn('Failed to append log:', e);
  }

  // if neither persisted, keep in-memory backup
  if (!firestoreOk) {
    backupLeads.unshift(lead);
    console.log("Lead saved to in-memory backup:", lead.id);
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
  const idx = backupLeads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    backupLeads[idx].status = status;
    return backupLeads[idx];
  }
  throw new Error("Firebase not initialized and lead not found in backup");
}
