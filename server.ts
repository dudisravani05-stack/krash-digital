import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, query, orderBy, deleteDoc } from "firebase/firestore";

// Initialize express app
const app = express();
const PORT = 5000;

app.use(express.json());

// In-memory/filesystem file path for fallback leads storage
const LEADS_FILE = path.join(process.cwd(), "leads.json");

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  message?: string;
  source: "contact_form" | "lead_popup" | "newsletter" | "ai_audit" | "careers_application";
  timestamp: string;
  status: "new" | "contacted" | "completed";
  auditResults?: string; // Stored results if generated via AI
  businessNiche?: string;
}

// Global Firebase Firestore reference
let db: any = null;

try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || undefined);
    console.log("Firebase Database successfully initialized on server with project ID:", firebaseConfig.projectId);
  } else if (process.env.FIREBASE_CONFIG) {
    try {
      const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG as string);
      const firebaseApp = initializeApp(firebaseConfig);
      db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || undefined);
      console.log("Firebase Database initialized from FIREBASE_CONFIG env var with project ID:", firebaseConfig.projectId);
    } catch (e) {
      console.warn("Failed to parse FIREBASE_CONFIG env var, falling back to local storage:", e);
    }
  } else {
    console.warn("firebase-applet-config.json not found and FIREBASE_CONFIG env var missing. Falling back to local flat file storage.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase database:", error);
}

// Local flat-file fallback helpers
function loadLeadsLocal(): Lead[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading leads file:", err);
  }
  return [];
}

function saveLeadsLocal(leads: Lead[]) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing leads file:", err);
  }
}

// Database-backed operations with graceful fallback
async function getLeads(): Promise<Lead[]> {
  if (db) {
    try {
      const leadsRef = collection(db, "leads");
      const q = query(leadsRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const leadsList: Lead[] = [];
      querySnapshot.forEach((docSnap) => {
        leadsList.push(docSnap.data() as Lead);
      });
      return leadsList;
    } catch (err) {
      console.warn("Firestore leads load error, using local fallback:", err);
    }
  }
  return loadLeadsLocal();
}

async function saveLead(lead: Lead): Promise<void> {
  let savedToDb = false;
  if (db) {
    try {
      await setDoc(doc(db, "leads", lead.id), lead);
      savedToDb = true;
    } catch (err) {
      console.warn("Firestore lead save error, syncing locally:", err);
    }
  }
  // Always sync locally as well for backup
  const currentLeads = loadLeadsLocal();
  currentLeads.unshift(lead);
  saveLeadsLocal(currentLeads);
}

async function updateLeadStatus(id: string, status: "new" | "contacted" | "completed"): Promise<Lead | null> {
  if (db) {
    try {
      const leadRef = doc(db, "leads", id);
      await updateDoc(leadRef, { status });
      
      const leadsList = await getLeads();
      return leadsList.find((l) => l.id === id) || null;
    } catch (err) {
      console.warn("Firestore status update error, using local fallback:", err);
    }
  }
  
  const currentLeads = loadLeadsLocal();
  const idx = currentLeads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    currentLeads[idx].status = status;
    saveLeadsLocal(currentLeads);
    return currentLeads[idx];
  }
  return null;
}

// Lazy initialization of Gemini AI
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.log("No custom key detected, applying customized templates instead.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ------------------- API ROUTES -------------------

// 1. Submit a lead (from any funnel: contact form, newsletter, AI audit, popup)
app.post("/api/leads", async (req, res) => {
  try {
    const { name, email, phone, businessName, message, source, businessNiche, auditResults } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    const newLead: Lead = {
      id: Math.random().toString(36).substring(2, 11),
      name,
      email,
      phone: phone || "",
      businessName: businessName || "",
      message: message || "",
      source: source || "contact_form",
      timestamp: new Date().toISOString(),
      status: "new",
      businessNiche: businessNiche || "",
      auditResults: auditResults || ""
    };

    await saveLead(newLead);

    res.status(201).json({ success: true, lead: newLead });
  } catch (error: any) {
    console.error("Error saving lead:", error);
    res.status(500).json({ error: "Failed to submit lead." });
  }
});

// 2. Retrieve leads (accessible by our subtle Admin screen if they present the correct hidden passcode)
app.get("/api/leads", async (req, res) => {
  try {
    const passcode = req.headers["x-admin-passcode"];
    if (passcode !== "Lol@4455") {
      return res.status(401).json({ error: "Unauthorized access: Incorrect administrative credentials." });
    }
    const leads = await getLeads();
    res.json({ leads });
  } catch (error) {
    res.status(500).json({ error: "Failed to load leads." });
  }
});

// 3. Update status of lead (resolve it)
app.post("/api/leads/:id/status", async (req, res) => {
  try {
    const passcode = req.headers["x-admin-passcode"];
    if (passcode !== "Lol@4455") {
      return res.status(401).json({ error: "Unauthorized access." });
    }
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !["new", "contacted", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedLead = await updateLeadStatus(id, status);
    if (!updatedLead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    res.json({ success: true, lead: updatedLead });
  } catch (error) {
    res.status(500).json({ error: "Failed to update lead status" });
  }
});

// 4. Generate dynamic marketing audit report using Gemini API link structure
app.post("/api/marketing-audit", async (req, res) => {
  try {
    const { businessName, websiteUrl, businessNiche, primaryGoal, targetAudience } = req.body;

    if (!businessName || !businessNiche || !primaryGoal) {
      return res.status(400).json({ error: "Business name, niche, and goal are required." });
    }

    // Check if key exists; if not, return high-quality customized template
    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY. Yielding customized template.");
      const fallbackReport = generateTemplateAudit(businessName, businessNiche, primaryGoal, targetAudience);
      return res.json({ auditReport: fallbackReport, usedAI: false });
    }

    const ai = getAi();
    const prompt = `
      You are Krash Digital's Senior AI Growth Marketing Strategist. 
      Generate a customized, incredibly detailed, professional marketing audit & action plan for a business.
      
      Business Details:
      - Name: "${businessName}"
      - Website/URL: "${websiteUrl || 'Not provided'}"
      - Industry/Niche: "${businessNiche}"
      - Primary Marketing Goal: "${primaryGoal}"
      - Target Audience: "${targetAudience || 'General market'}"

      Format your response in neat, high-impact Markdown. Do not include introductory conversational fluff or concluding remarks about being an AI. Start directly with the professional report. 
      The report must include these 5 standard growth pillars, specifically customized to support their industry, marketing goals, and audience:
      
      ### 1. 🔍 SEO & Visibility Diagnosis
      Provide 2 customized tactical actions to boost they organic search visibility for their niche. Explain which long-tail keywords they should target.
      
      ### 2. 📱 Content & Social Media Blueprint
      Provide 2 customized, highly creative social media hook angles or content concepts geared toward their specific target audience.
      
      ### 3. 🎯 High-Converting Ad Campaign Strategy
      Suggest 1 custom creative concept for Facebook/Instagram ads or Google Ads (depending on their category) and specify the precise targeting demographics/interests to maximize conversions.
      
      ### 4. 🤖 AI-Powered Optimization Suggestion
      How they can leverage the latest AI tools/automation (like AI chatbots, personalized content grids, or automated nurture flows) to cut down lead acquisition costs in their industry.
      
      ### 5. 🚀 Krash Digital Direct Recommendations
      Provide a specific 30-day timeline outlining what Krash Digital can build and manage for them to achieve their primary marketing goal. Make it sound extremely compelling, professional, performance-driven, and confidence-inspiring! Use strong conversion-focused copywriting.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    const reportText = response.text;
    res.json({ auditReport: reportText, usedAI: true });

  } catch (error: any) {
    console.log("Gemini marketing audit API fallback applied successfully: " + (error.message || error));
    // Graceful fallback to rich template rather than hard crash
    const { businessName, businessNiche, primaryGoal, targetAudience } = req.body;
    const fallbackReport = generateTemplateAudit(businessName, businessNiche, primaryGoal, targetAudience);
    res.json({ auditReport: fallbackReport, error: error.message || "Service temporarily offline", usedAI: false });
  }
});

// 5. Intelligent friendly AI chatbot FAQ engine
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Check if key exists; if not, return high-quality customized mockup template
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: "Hi there! I am KD-Bot, Krash Digital's AI FAQ companion. (Note: Gemini API key is currently not fully configured, but I can guide you!). Krash Digital provides industry-leading SEO optimization, Paid Google & Social Media Campaigns, Web Design & Development, and Strategic Copywriting. Our pricing plans include Starter ($199), Growth ($499), and Premium ($1,499). To learn more about our internships, please navigate to the CAREERS tab!"
      });
    }

    const ai = getAi();
    
    // Format conversation history for Gemini contents
    const contents: any[] = [];
    if (Array.isArray(history)) {
      history.slice(-10).forEach((msg: any) => {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text || msg.content || "" }]
        });
      });
    }
    
    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const systemInstruction = `You are KD-Bot, the official, intelligent, friendly AI representative and FAQ assistant for Krash Digital. Your purpose is to answer user questions, explain Krash Digital's services, internships, and pricing in a helpful, accurate, and professional manner. You communicate with crisp, modern, confident, but humble tone. 

About Krash Digital:
- Krash Digital is a premier growth-marketing agency specializing in helping businesses scale through technical SEO, high-impact Meta (Facebook/Instagram) and Google PPC Ads, modern high-converting UI landing pages, copywriting, and strategic automation.
- Services we provide:
  1. SEO & Organic Audits (Technical SEO, Rank visibility, link building)
  2. Paid Ads Management (High-ROI Meta & Google PPC performance campaigns)
  3. UI Design & landing page development (React, Vite, Tailwind CSS, built for high conversion)
  4. Content & Copywriting frameworks (Highly engaging ad hooks, email cycles, authoritative copy)
  5. Performance Automation (Zapier/n8n workflows, smart lead qualifications)
- Pricing plans:
  1. Starter Plan: $199/month. Includes core lead templates, basic search exposure, local seo blueprint, weekly report logs.
  2. Growth Plan: $499/month. Most popular. Includes custom high-converting single landing page design, hyper-targeted Google & Meta PPC ads setup (budget managed by client), technical organic keywords mapping, 1 AI lead auto-qualifier.
  3. Premium Plan: $1,499/month. Full enterprise scale. 3 customized interactive high-converting page systems, end-to-end paid acquisition manage with full custom audiences and cross-funnel remarketing, authority high-equity search link building, unlimited automation runs & custom API integrations, 1-on-1 performance consultations, priority dedicated engineer support.
- Internship Programs (Krash Digital Academy - available for 1, 2, 3, or 6 months duration):
  1. Digital Marketing Internship (General growth strategy, Campaign auditing)
  2. SEO Internship (Search intent architecture, site diagnostics, organic rank visibility)
  3. SMM (Social Media Marketing) Internship (Content grids, viral video hook testing, carousel designs)
  4. Facebook & Instagram Ads Internship (Nesting high-ROI campaigns, Meta Pixel & CBO/ABO optimizations)
  5. Google Ads (PPC) Internship (Google Search, Display, and Performance Max planning and bid optimization)
  6. Content Strategy & Copywriting Internship (High-converting direct response copy, emotional hooks, email cycles)
  7. Website Design & Development Internship (Responsive UX layout design, React/Vite/Tailwind engineering)
  8. Branding & Graphic Design Internship (Establish typography pairs, vector logomarks, premium brand books)
- Contact / Office Location:
  - Email: growth.krashdigital@gmail.com
  - Note: Physical locations have been general/removed from website to emphasize our fully remote, digital-first presence. We work natively as an agile remote global operation!
- Team and Ethos: Built on absolute transparency, data-driven engineering, custom conversion components, and ultra-high contrast dark-mode branding concepts.

Answer questions concisely, keeping replies helpful. If asked to apply for an internship, direct the user to go to the CAREERS tab on the website navigation bar to fill out the custom application form. Use simple markdown as needed. Keep responses relatively short (under 3 or 4 sentences is best).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.log("Chatbot API fallback applied successfully: " + (error.message || error));
    res.json({
      reply: "Hi there! I am currently operating in standalone backup mode. Krash Digital provides industry-leading SEO optimization, Paid Google & Social Media Campaigns, Web Design & Development, and Strategic Copywriting. Our pricing plans include Starter ($199), Growth ($499), and Premium ($1,499). To learn more or apply for our active academy internships, please feel free to click the CAREERS tab in the top navigation bar!"
    });
  }
});

// Helper for high-quality customized template fallback
function generateTemplateAudit(name: string, niche: string, goal: string, audience: string): string {
  return `### 🔍 SEO & Visibility Diagnosis for ${name}
- **Competitive Focus**: Based on the **${niche}** landscape, you should pivot targeting towards hyper-specific long-tail keywords like "*affordable ${niche} near me*" and "*custom ${niche} solutions for ${audience || "local businesses"}*".
- **Action Item**: Optimize schema markup on your services pages to capture rich Google snippets, increasing click-through rates by up to 34%.

### 📱 Content & Social Media Blueprint
- **Hook Strategy**: Create a video series answering the top 5 questions clients in **${niche}** ask before buying.
- **Audience Resonance**: Target **${audience || "your buyers"}** with comparison grids showing your offering vs. legacy workflows.

### 🎯 High-Converting Ad Campaign Strategy
- **Platform Advantage**: For your target audience, we recommend launching a Meta/Google hybrid campaign focused on *Lead Generation Forms* instead of basic landing page clicks.
- **Creative Angle**: A "Before & After" or "Problem-Agony-Solution" dynamic video ad showcasing exactly how you achieve: **"${goal}"**.

### 🤖 AI-Powered Optimization Suggestion
- Use automated smart qualifiers on your website. Implementing a conversational, AI-driven booking assistant can qualify and segment incoming leads in **${niche}** before booking a sales call, saving up to 18 hours per week.

### 🚀 Krash Digital Direct Recommendations (30-Day Growth Plan)
- **Day 1-10**: Setup high-converting landing pages styled with modern glassmorphism UI components.
- **Day 11-20**: Launch targeted Google SEM and Meta Retargeting sequences focused on high-intent search volumes.
- **Day 21-30**: Deploy custom automation flows to follow up with new leads within 5 minutes, boosting conversion rates by 390%.`;
}

// ------------------- MIDDLEWARE AND VITE BOOTSTRAP -------------------

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve client static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting... running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
