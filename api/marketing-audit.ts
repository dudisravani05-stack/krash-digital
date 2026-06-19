import { VercelRequest, VercelResponse } from "@vercel/node";
import { getAiClient, generateTemplateAudit } from "../lib/ai.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { businessName, websiteUrl, businessNiche, primaryGoal, targetAudience } = req.body;

      if (!businessName || !businessNiche || !primaryGoal) {
        return res.status(400).json({ error: "Business name, niche, and goal are required." });
      }

      // Check if API key exists
      if (!process.env.GEMINI_API_KEY) {
        console.warn("No GEMINI_API_KEY. Using template fallback.");
        const fallbackReport = generateTemplateAudit(businessName, businessNiche, primaryGoal, targetAudience);
        return res.json({ auditReport: fallbackReport, usedAI: false });
      }

      const ai = getAiClient();
      const prompt = `
        You are Krash Digital's Senior AI Growth Marketing Strategist. 
        Generate a customized, incredibly detailed, professional marketing audit & action plan for a business.
        
        Business Details:
        - Name: "${businessName}"
        - Website/URL: "${websiteUrl || "Not provided"}"
        - Industry/Niche: "${businessNiche}"
        - Primary Marketing Goal: "${primaryGoal}"
        - Target Audience: "${targetAudience || "General market"}"

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
        },
      });

      const reportText = response.text;
      return res.json({ auditReport: reportText, usedAI: true });
    } catch (error: any) {
      console.log("Gemini API fallback applied: " + (error.message || error));
      const { businessName, businessNiche, primaryGoal, targetAudience } = req.body;
      const fallbackReport = generateTemplateAudit(businessName, businessNiche, primaryGoal, targetAudience);
      return res.json({ auditReport: fallbackReport, error: error.message || "Service temporarily offline", usedAI: false });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
