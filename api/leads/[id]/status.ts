import { VercelRequest, VercelResponse } from "@vercel/node";
import { updateLeadStatus } from "../../lib/firebase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-passcode");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const passcode = req.headers["x-admin-passcode"];
      if (passcode !== "Lol@4455") {
        return res.status(401).json({ error: "Unauthorized access." });
      }

      const { id } = req.query;
      const { status } = req.body;

      if (!status || !["new", "contacted", "completed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Lead ID is required" });
      }

      const updatedLead = await updateLeadStatus(id, status as "new" | "contacted" | "completed");
      if (!updatedLead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      return res.json({ success: true, lead: updatedLead });
    } catch (error) {
      console.error("Error updating lead status:", error);
      return res.status(500).json({ error: "Failed to update lead status" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
