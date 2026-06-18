import { Service, WhyChooseUsItem, StatItem, PortfolioItem, Testimonial, PricingPlan, FAQItem } from "./types";
import websiteDesignImg from "./assets/images/website_design_mockup_1781671709062.jpg";
import brandingShowcaseImg from "./assets/images/branding_showcase_1781671726310.jpg";
import socialMediaImg from "./assets/images/social_media_posts_1781671743760.jpg";

export const SERVICES: Service[] = [
  {
    id: "seo",
    icon: "TrendingUp",
    title: "Search Engine Optimization (SEO)",
    description: "Rank #1 on Google and capture organic high-intent search traffic ready to buy from you.",
    longDescription: "Our comprehensive SEO service includes complete technical page audits, on-page optimization, backlink profiles creation, local SEO mapping, and strategic keyword mapping tailored to capture high-buying intent long-tail searches."
  },
  {
    id: "social_media",
    icon: "Instagram",
    title: "Social Media Management",
    description: "Build an active, loyal brand community across platform channels with custom designed feeds.",
    longDescription: "We design premium content grids, write compelling captions, engage directly with your target audience daily, and schedule cross-platform postings to elevate your online presence and turn followers into brand advocates."
  },
  {
    id: "facebook_ads",
    icon: "Target",
    title: "Facebook & Instagram Ads",
    description: "Scale your revenue fast using high-converting, highly targeting digital ad funnels.",
    longDescription: "From modern interactive graphic ad creatives to precision lookalike audience routing, we build, manage, and split-test Meta ad sequences that consistently return a positive return on ad spend (ROAS)."
  },
  {
    id: "google_ads",
    icon: "Search",
    title: "Google Ads (PPC)",
    description: "Appear in front of customers at the exact millisecond they search for your services.",
    longDescription: "Maximize instant conversion rates with tightly configured Search, Display, and Performance Max campaigns backed by intensive negative-keyword research, smart bidding strategies, and dynamic copy."
  },
  {
    id: "content_marketing",
    icon: "PenTool",
    title: "Content Marketing",
    description: "Establish industry authority and trust with highly value-driven blogs, whitepapers, and scripts.",
    longDescription: "We craft deeply researched articles, e-books, infographics, and email newsletter articles that solve true pain points for your prospects, keeping your brand top-of-mind."
  },
  {
    id: "web_dev",
    icon: "Code",
    title: "Website Design & Development",
    description: "Stunning, rapid-loading website experiences engineered with high-contrast layouts for conversions.",
    longDescription: "We design responsive, state-of-the-art websites using modern tech layouts (like React & Tailwind CSS), custom interactive lead generation widgets, fast hosting configurations, and flawless UX."
  },
  {
    id: "branding",
    icon: "Palette",
    title: "Branding & Graphic Design",
    description: "Differentiate with clear brand guidelines, custom vector logomarks, and premium collateral.",
    longDescription: "Craft a memorable identity. We design elegant, high-contrast logomarks, set typography hierarchies, build brand stylebooks, and format social design systems that stand out universally."
  },
  {
    id: "ai_marketing",
    icon: "Bot",
    title: "AI-Powered Marketing Solutions",
    description: "Supercharge your business workflows using automated conversational flows and smart copy engines.",
    longDescription: "Integrate custom AI lead qualification pipelines, automated personalized nurture campaigns, smart performance predictors, and machine-learning analysis tools to run lean, high-output campaigns."
  }
];

export const WHY_CHOOSE_US: WhyChooseUsItem[] = [
  {
    id: "pricing",
    title: "Affordable Startup Pricing",
    description: "We offer budget-flexible packages tailored specifically to help seed-stage and growing companies launch quickly.",
    iconName: "DollarSign"
  },
  {
    id: "strategy",
    title: "Custom Marketing Strategies",
    description: "No generic copy-paste marketing. Every channel, objective, and asset is engineered for your niche and buying audience.",
    iconName: "Compass"
  },
  {
    id: "communication",
    title: "Transparent Communication",
    description: "Get real-time updates and clear, jargon-free bi-weekly marketing updates detailing tangible milestones.",
    iconName: "Inbox"
  },
  {
    id: "performance",
    title: "Performance-Focused Approach",
    description: "We measure success in cold metrics: leads captured, meetings booked, click-through rates, and cold hard revenue generated.",
    iconName: "Activity"
  },
  {
    id: "ai_tools",
    title: "Latest AI Marketing Tools",
    description: "Leverage advanced LLMs, predictive targeting models, and automated booking assistants to stay miles ahead of legacy competitors.",
    iconName: "Sparkles"
  },
  {
    id: "support",
    title: "Dedicated Support",
    description: "Enjoy direct access to your account growth strategist, responsive support channels, and seamless integration.",
    iconName: "UserCheck"
  }
];

export const STATS: StatItem[] = [
  { id: "campaigns", value: "100+", numberValue: 100, suffix: "+", label: "Campaigns Managed" },
  { id: "impressions", value: "1M+", numberValue: 1, suffix: "M+", label: "Impressions Generated" },
  { id: "leads", value: "500+", numberValue: 500, suffix: "+", label: "Leads Delivered" },
  { id: "satisfaction", value: "95%", numberValue: 95, suffix: "%", label: "Client Satisfaction" }
];

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: "p1",
    category: "Website Design",
    title: "Revamped Next-Gen Fintech Landing Platform",
    client: "Shikhar Finance",
    image: websiteDesignImg,
    metric: "340% Lead Boost",
    desc: "A custom high-contrast dark visual interface focused on secure lead-capture, fluid micro-interactions, and visual credibility indicators."
  },
  {
    id: "p2",
    category: "Branding",
    title: "Holistic Identity System for AI Logistics Hub",
    client: "Gati Logistics",
    image: brandingShowcaseImg,
    metric: "100% Cohesive Presence",
    desc: "Engineered elegant abstract neon logo, glass-molded industrial packaging guidelines, and premium digital assets for corporate pitches."
  },
  {
    id: "p3",
    category: "Social Media",
    title: "Omnichannel Organic Engagement Scale-up",
    client: "Tejas Wearables",
    image: socialMediaImg,
    metric: "+56K Organic Followers",
    desc: "Curated responsive minimalist content grids, aesthetic tech diagrams, and value carousel series which drove record viral reach on digital reels."
  },
  {
    id: "p4",
    category: "Ad Creatives",
    title: "Direct-Response Meta Funnel Optimization",
    client: "Akshar AI",
    image: "https://picsum.photos/seed/adgraphics/800/600",
    metric: "4.8x Ad Return (ROAS)",
    desc: "Designed high-contrast video scroll-stoppers paired with psychological angle tests that slashed acquisition cost by 45% in 3 weeks."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    rating: 5,
    quote: "Professional service and amazing results. Our inbound leads and ad efficiency grew beyond what we thought was possible in such a short window.",
    author: "Sneha Patel",
    role: "Founder, Aarogya Wellness",
    avatarSeed: "sneha"
  },
  {
    id: "t2",
    rating: 5,
    quote: "Our online presence improved significantly. Their custom AI-driven chatbot qualified thousands of visitors without requiring our operations team.",
    author: "Rahul Mehta",
    role: "Director of Growth, Suraksha Logistics",
    avatarSeed: "rahul"
  },
  {
    id: "t3",
    rating: 5,
    quote: "Working with Krash Digital was an absolute gamechanger. They delivered a high-converting website design in record time accompanied by pristine SEO frameworks.",
    author: "Arjun Desai",
    role: "Marketing VP, Urja Energy",
    avatarSeed: "arjun"
  },
  {
    id: "t4",
    rating: 5,
    quote: "Their Facebook and Instagram ads strategy was incredible. Within two months, our Return on Ad Spend (ROAS) hit 5.2x, bringing a massive influx of daily orders.",
    author: "Priya Sharma",
    role: "CEO, Sparkle E-Commerce",
    avatarSeed: "priya"
  },
  {
    id: "t5",
    rating: 5,
    quote: "Krash Digital built our entire programmatic SEO flow. Technical precision coupled with expert conversion design helped us rank for 800+ high-intent keywords.",
    author: "Karthik Nair",
    role: "Co-Founder, PeakSaaS Solutions",
    avatarSeed: "karthik"
  },
  {
    id: "t6",
    rating: 5,
    quote: "The custom interactive landing pages built by Krash Digital convert at an unbelievable 11.4%. Combined with automated qualification, it completely transformed our inbound pipeline.",
    author: "Rohan Roy",
    role: "Product Manager, Neocut Tech",
    avatarSeed: "rohan"
  },
  {
    id: "t7",
    rating: 5,
    quote: "Our local leads skyrocketed and cost per acquisition dropped by 50%. The team is exceptionally transparent, precise, and data-driven.",
    author: "Diya Sengupta",
    role: "Marketing Head, Elevate Dental Care",
    avatarSeed: "diya"
  }
];

export const PRICING: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "199",
    period: "month",
    popular: false,
    features: [
      "Social Media Management (3 platforms)",
      "12 Custom Designed Feed Posts",
      "Monthly KPI Performance Reports",
      "Essential SEO Content Plan",
      "E-mail Support Only"
    ]
  },
  {
    id: "growth",
    name: "Growth",
    price: "499",
    period: "month",
    popular: true,
    features: [
      "All Starter Plan features included",
      "Social Media + Active Paid Ads Setup",
      "Facebook, Instagram & Google Ads Setup",
      "Advanced Lead Generation Funnels",
      "Bi-Weekly Analytics Sync Calls",
      "AI-Powered Qualified Chatbot Integration"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: "1,499",
    period: "month",
    popular: false,
    features: [
      "Full Stack Omnichannel Digital Marketing",
      "Unlimited Paid Ad Creative Adjustments",
      "PR & Organic Backlink Outreaches",
      "Monthly SEO Blog Creation & Mapping",
      "Custom React Landing Page & API Funnel",
      "Priority Strategy Consultant & Slack Channel"
    ]
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "faq1",
    question: "How long before I see tangible marketing results?",
    answer: "Paid advertising programs (like Meta & Google Ads) typically produce leads, engagement, and click-through tracking within 3-4 days of launch. Organic search campaigns (SEO) and content authority structures require 3 to 6 months of active compounding to achieve sustained dominance in competitive search grids."
  },
  {
    id: "faq2",
    question: "Do you specialize in working with startups?",
    answer: "Yes! Krash Digital was founded precisely to supply seedling-stage and growing startups with high-converting frameworks and strategic services that don't depend on enterprise-scale corporate marketing overhead."
  },
  {
    id: "faq3",
    question: "What specific social platforms do you actively manage?",
    answer: "We actively build campaigns and manage feeds across Instagram, LinkedIn, Facebook, TikTok, YouTube (Shorts), and X. We tailor the exact platform priority to match where your prospective customers actually spend time."
  },
  {
    id: "faq4",
    question: "Am I locked in, or can I customize a package?",
    answer: "You are never locked into yearly contracts. We operate strictly on transparent month-to-month service retainers. We also joyfully design customized packages depending on your active business goals or launch schedule."
  }
];
