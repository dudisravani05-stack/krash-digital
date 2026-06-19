import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import * as admin from 'firebase-admin';

let db: any;

// Initialize Firebase
try {
  if (process.env.FIREBASE_CONFIG) {
    try {
      const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG as string);
      const firebaseApp = initializeApp(firebaseConfig);
      db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || undefined);
      console.log("Firebase Database initialized from FIREBASE_CONFIG env var...");
    } catch (e) {
      console.warn("Failed to parse FIREBASE_CONFIG env var...", e);
    }
  }
} catch (e) {
  console.error("Error initializing Firebase:", e);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-passcode');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(404).json({ error: 'API endpoint not implemented yet' });
}
