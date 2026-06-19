import { VercelRequest, VercelResponse } from "@vercel/node";
import { getLeads, saveLead, Lead } from "../lib/firebase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-passcode");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // GET /api/leads - retrieve leads
  if (req.method === "GET" && req.url === "/api/leads") {
    try {
      const passcode = req.headers["x-admin-passcode"];
      if (passcode !== "Lol@4455") {
        return res.status(401).json({ error: "Unauthorized access: Incorrect administrative credentials." });
      }

      const leads = await getLeads();
      return res.json({ leads });
    } catch (error) {
      console.error("Error retrieving leads:", error);
      return res.status(500).json({ error: "Failed to load leads." });
    }
  }

  // POST /api/leads - submit new lead
  if (req.method === "POST" && req.url === "/api/leads") {
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
        auditResults: auditResults || "",
      };

      await saveLead(newLead);
      return res.status(201).json({ success: true, lead: newLead });
    } catch (error: any) {
      console.error("Error saving lead:", error);
      return res.status(500).json({ error: "Failed to submit lead." });
    }
  }

  return res.status(404).json({ error: "API endpoint not found" });
}
