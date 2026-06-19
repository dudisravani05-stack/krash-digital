import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
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

export function generateTemplateAudit(
  name: string,
  niche: string,
  goal: string,
  audience: string
): string {
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
