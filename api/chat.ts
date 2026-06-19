import { VercelRequest, VercelResponse } from "@vercel/node";
import { getAiClient } from "../lib/ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      // Check if API key exists
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          reply: "Hi there! I am KD-Bot, Krash Digital's AI FAQ companion. (Note: Gemini API key is currently not fully configured, but I can guide you!). Krash Digital provides industry-leading SEO optimization, Paid Google & Social Media Campaigns, Web Design & Development, and Strategic Copywriting. Our pricing plans include Starter ($199), Growth ($499), and Premium ($1,499). To learn more about our internships, please navigate to the CAREERS tab!",
        });
      }

      const ai = getAiClient();

      // Format conversation history
      const contents: any[] = [];
      if (Array.isArray(history)) {
        history.slice(-10).forEach((msg: any) => {
          contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text || msg.content || "" }],
          });
        });
      }

      // Add current user message
      contents.push({
        role: "user",
        parts: [{ text: message }],
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
        },
      });

      return res.json({ reply: response.text });
    } catch (error: any) {
      console.log("Chatbot API fallback applied: " + (error.message || error));
      return res.json({
        reply: "Hi there! I am currently operating in standalone backup mode. Krash Digital provides industry-leading SEO optimization, Paid Google & Social Media Campaigns, Web Design & Development, and Strategic Copywriting. Our pricing plans include Starter ($199), Growth ($499), and Premium ($1,499). To learn more or apply for our active academy internships, please feel free to click the CAREERS tab in the top navigation bar!",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
