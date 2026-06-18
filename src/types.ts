export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  longDescription: string;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface StatItem {
  id: string;
  value: string;
  numberValue: number;
  suffix: string;
  label: string;
}

export interface PortfolioItem {
  id: string;
  category: "Social Media" | "Ad Creatives" | "Website Design" | "Branding";
  title: string;
  client: string;
  image: string;
  metric: string;
  desc: string;
}

export interface Testimonial {
  id: string;
  rating: number;
  quote: string;
  author: string;
  role: string;
  avatarSeed: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  popular: boolean;
  features: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  message?: string;
  source: "contact_form" | "lead_popup" | "newsletter" | "ai_audit" | "careers_application";
  timestamp: string;
  status: "new" | "contacted" | "completed";
  businessNiche?: string;
  auditResults?: string;
}
