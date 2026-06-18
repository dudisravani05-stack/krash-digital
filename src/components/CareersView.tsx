import React, { useState } from "react";
import { 
  Briefcase, Calendar, Award, GraduationCap, ArrowRight, 
  CheckCircle2, Clock, Users, Send, Target, Sparkles, Code
} from "lucide-react";
import { motion } from "motion/react";

// Types for Career details
interface ActiveInternship {
  id: string;
  title: string;
  description: string;
  subCategories: string[];
  skillsLearned: string[];
  perks: string[];
}

export default function CareersView() {
  const [selectedRole, setSelectedRole] = useState<string>("Digital Marketing Internship");
  const [selectedDuration, setSelectedDuration] = useState<string>("3 Months");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whyJoin: "",
    githubOrPortfolio: "",
    durationAgreement: false
  });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const INTERNSHIPS: ActiveInternship[] = [
    {
      id: "dm",
      title: "Digital Marketing Internship",
      description: "A comprehensive digital marketing accelerator program. You will plan, create, and launch client-level marketing operations alongside senior advisors.",
      subCategories: ["General Growth Strategy", "Campaign Auditing", "Client Interaction Frameworks", "Marketing Psychology Experiments"],
      skillsLearned: ["A/B Conversion Tests", "Direct-Response Copywriting", "Automation Integration", "B2B client pitches"],
      perks: ["Industry-standard Certificate", "Client Account shadowing", "1-on-1 mentorship", "Top performer direct payroll conversion offer"]
    },
    {
      id: "seo",
      title: "SEO Internship",
      description: "Master the algorithms powering modern organic visibility graphs. Learn search intent architectures, site speed optimizations, and rank conversion engineering.",
      subCategories: ["Keyword Mapping Hierarchy", "Technical Site Audits", "Backlink Equity Growth", "On-Page Schema Engineering"],
      skillsLearned: ["Google Search Console proficiency", "ScreamingFrog tech analysis", "Ahrefs/Semrush auditing", "SEO optimized programmatic content"],
      perks: ["Certificate of SEO Excellence", "Live client campaign ownership", "Direct access to enterprise search strategies"]
    },
    {
      id: "smm",
      title: "SMM Internship",
      description: "Engineer high-impact content loops and organic reach engines. Leverage design principles and user psychology to produce visual brand assets.",
      subCategories: ["Content Grid Storyboards", "Viral Video Hook Testing", "Community Management Systems", "Organic Carousel Strategy"],
      skillsLearned: ["Social algorithmic metrics reading", "Premium visual styling direction", "Canva / Figma layout planning", "Interactive audience funnels"],
      perks: ["Design Portfolio expansion", "High-exposure case studies", "Team collaborative creative freedom"]
    },
    {
      id: "fb_insta",
      title: "Facebook & Instagram Ads Internship",
      description: "Learn to build high-ROI Meta ad campaigns. Master custom audience nesting, pixel integration, direct-response design testing, and full paid digital funnel architectures.",
      subCategories: ["Custom & Lookalike Audiences", "Meta Pixel & API Integration", "CBO/ABO Budget Optimizations", "Direct-Response Ad Creative Briefs"],
      skillsLearned: ["Meta Ads Manager hierarchy", "ROAS metrics tracking & evaluation", "Scroll-stopper visual hooks writing", "A/B creative testing models"],
      perks: ["Shadow ads of high-spend accounts", "Certificate of Paid Acquisition", "Professional ad portfolio templates"]
    },
    {
      id: "google_ads_ppc",
      title: "Google Ads (PPC) Internship",
      description: "Harness the intent-driven power of search engines. Learn to plan, structure, and optimize Google Search, Display, and Performance Max ad campaigns.",
      subCategories: ["Targeted Keyword Selection Rules", "Negative Keyword Audit Controls", "Ad Copy Variant Testing", "Landing Page Compatibility Index"],
      skillsLearned: ["Google Ads Dashboard structure", "CTR and Quality Score analytics", "Bid Strategy automation rules", "Conversion tag debugging tools"],
      perks: ["Google certified materials support", "Enterprise budget shadowing", "Certificate of Search Engine Marketing"]
    },
    {
      id: "content",
      title: "Content Strategy & Copywriting Internship",
      description: "Harness the power of high-converting language. Write landing page landing copies, cold outreach assets, or content that triggers high-loyalty organic subscriptions.",
      subCategories: ["Emotional Copywriting Hooks", "Email Campaign Cycles", "Blog Authority Creation", "Micro-ad Retargeting Scripts"],
      skillsLearned: ["Copywriting frameworks (AIDA, PAS)", "Subject line click rate testing", "AI prompt engineering co-pilot", "Conversion-focused style guide"],
      perks: ["Pristine portfolio of published work", "Direct tutoring by Senior Strategist", "Certificate of Copywriting Proficiency"]
    },
    {
      id: "web_dev",
      title: "Website Design & Development Internship",
      description: "Craft state-of-the-art landing screens and web assets with React, Vite, and Tailwind CSS. Learn conversion-focused user interfaces and speed diagnostics.",
      subCategories: ["Responsive UX Grid Architectures", "Interactive Lead capture modals", "Site speed loading optimizations", "Fluid motion/state animations"],
      skillsLearned: ["Modern React framework hooks", "Tailwind styling custom systems", "Vite production asset packaging", "TypeScript type-safe layouts"],
      perks: ["Interactive source-code folder access", "Development credit attribution", "Certificate of Frontend Engineering"]
    },
    {
      id: "branding_design",
      title: "Branding & Graphic Design Internship",
      description: "Shape the complete visual face of high-contrast modern brands. Establish typography pairs, vector logomarks, and premium brand book guidelines.",
      subCategories: ["Vector Icon & Logomark Creation", "Cohesive Brand books styles", "Contrast hierarchy layout grids", "Social post visual layouts"],
      skillsLearned: ["Figma design workflow systems", "Adobe Illustrator bezier paths", "Color theory and visual accents", "Modern font selections paired structures"],
      perks: ["Comprehensive graphic portfolio", "Real brand assets launch history", "Certificate of Brand Identity design"]
    }
  ];

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMessage("Please fill out all required background fields (Name, Email, Phone).");
      setFormStatus("error");
      return;
    }

    setFormStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          businessName: selectedRole, // Overload as Internship target
          message: `Preferred Duration: ${selectedDuration}\nPortfolio Link: ${formData.githubOrPortfolio || "Not Provided"}\nMotivation: ${formData.whyJoin || "Not Provided"}`,
          source: "careers_application"
        })
      });

      if (response.ok) {
        setFormStatus("success");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Submission could not proceed.");
        setFormStatus("error");
      }
    } catch (err) {
      setErrorMessage("A transport error occurred. Please verify your connection.");
      setFormStatus("error");
    }
  };

  return (
    <div id="careers-page-view" className="relative pb-24 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Intro Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            <GraduationCap className="h-3.5 w-3.5" />
            krash digital academy
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Launch Your Marketing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 underline decoration-blue-500/20">Career With Us</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed max-w-xl mx-auto">
            Experience real agency projects, handle active campaign workflows under absolute premium guidance, and launch your digital skill limits to the next atmosphere.
          </p>
        </div>

        {/* Bento Grid layout for Internships & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Internship Selector List (Left) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Select Your Path</h3>
            <div className="space-y-3">
              {INTERNSHIPS.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelection(role.title)}
                  className={`w-full text-left p-4.5 rounded-2xl border text-sm transition-all duration-200 cursor-pointer ${
                    selectedRole === role.title
                      ? "bg-blue-600/10 border-blue-500/50 text-white shadow-lg shadow-blue-500/5"
                      : "bg-[#0a0f1d]/40 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedRole === role.title ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-slate-500"
                    }`}>
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm tracking-tight leading-none mb-1">{role.title}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Krash Academy Offer</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* General Highlights Cards */}
            <div className="bg-gradient-to-br from-indigo-500/5 to-blue-500/5 border border-white/5 rounded-2xl p-5 space-y-4 mt-6">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                Why Krash Academy?
              </h4>
              <div className="space-y-3 text-xs text-slate-400 font-light">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Fluff:</strong> Focus strictly on modern, ROI-driven agency operations instead of stale textbook formulas.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Pristine Credentials:</strong> High-authenticity recommendation letters & showcaseable real work portfolios.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Content card for Selected Role (Right) */}
          <div className="lg:col-span-8">
            {INTERNSHIPS.map((role) => {
              if (selectedRole !== role.title) return null;
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl"
                >
                  {/* Title & Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1 mb-2">
                        <Target className="h-3 w-3" />
                        ACTIVE ACADEMY ENROLLMENT
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white">{role.title}</h2>
                    </div>
                    {/* Floating Duration Indicators */}
                    <div className="flex items-center gap-1.5 bg-[#050810]/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300">
                      <Clock className="h-3.5 w-3.5 text-blue-400" />
                      <span className="font-semibold text-[11px] uppercase tracking-wide">Durations Available:</span>
                      <span className="font-bold text-white text-[11px] bg-blue-500/20 px-1.5 py-0.5 rounded">1m, 2m, 3m, 6m</span>
                    </div>
                  </div>

                  {/* General Description */}
                  <div className="my-6">
                    <p className="text-sm text-slate-300 font-light leading-relaxed">{role.description}</p>
                  </div>

                  {/* Sub-categories details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Track focus */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-blue-400" />
                        Key Tracks & Sub-categories
                      </h4>
                      <ul className="space-y-2">
                        {role.subCategories.map((sub, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-400 font-light">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills learned */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Code className="h-3.5 w-3.5 text-indigo-400" />
                        Industry Skills Learned
                      </h4>
                      <ul className="space-y-2">
                        {role.skillsLearned.map((skill, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-400 font-light">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Perks line metrics */}
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <Award className="h-4 w-4 text-emerald-400" />
                      Internship Perks & Assets Provided
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {role.perks.map((perk, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-[#050810]/30 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span className="font-light">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Custom Form of CTA Application Panel */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="relative rounded-3xl border border-white/10 bg-[#070b16]/70 p-6 sm:p-10 backdrop-blur-md shadow-2xl overflow-hidden">
            {/* Ambient background blur circles */}
            <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

            <div className="text-center mb-10 relative z-10">
              <h3 className="font-display text-2xl font-extrabold text-white">Apply For Internship Position</h3>
              <p className="text-xs text-slate-400 font-light max-w-md mx-auto mt-2 leading-relaxed">
                Take the leap. Highlight your interest, pick your timeline preference, and hook our attention immediately.
              </p>
            </div>

            {formStatus !== "success" ? (
              <form onSubmit={handleApply} className="space-y-6 relative z-10">
                {/* Error Banner */}
                {formStatus === "error" && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs text-center font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-1 font-mono">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-1 font-mono">Professional Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. johndoe@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-1 font-mono">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-1 font-mono">Portfolio / LinkedIn / GitHub</label>
                    <input
                      type="text"
                      placeholder="e.g. https://linkedin.com/in/myprofile"
                      value={formData.githubOrPortfolio}
                      onChange={(e) => setFormData({ ...formData, githubOrPortfolio: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                </div>

                {/* Role and Duration selects side-by-side */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-1 font-mono">Preferred Internship Track *</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#0a0f1d] px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500/50 transition-all select-custom-icon"
                    >
                      {INTERNSHIPS.map((role) => (
                        <option key={role.id} value={role.title}>{role.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-1 font-mono">Duration Option *</label>
                    <select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#0a0f1d] px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500/50 transition-all"
                    >
                      <option value="1 Month">1 Month Internship</option>
                      <option value="2 Months">2 Months Internship</option>
                      <option value="3 Months">3 Months Internship</option>
                      <option value="6 Months">6 Months Internship</option>
                    </select>
                  </div>
                </div>

                {/* Textarea motivations */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-1 font-mono">Why do you want to join Krash Digital? *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about yourself and why this internship opportunity matches your journey."
                    value={formData.whyJoin}
                    onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all resize-none"
                  />
                </div>

                {/* Confirmation checklist */}
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="durationAgreement"
                    required
                    checked={formData.durationAgreement}
                    onChange={(e) => setFormData({ ...formData, durationAgreement: e.target.checked })}
                    className="mt-0.5 rounded border-white/10 bg-[#0a0f1d] accent-blue-500"
                  />
                  <label htmlFor="durationAgreement" className="text-[11px] text-slate-400 leading-normal select-none cursor-pointer font-light">
                    I confirm my availability for the selected duration ({selectedDuration}) and agree that my provided contact details are verified and correct.
                  </label>
                </div>

                {/* Apply Button CTA */}
                <div className="pt-2">
                  <button
                    id="careers-submit-btn"
                    type="submit"
                    disabled={formStatus === "loading"}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 active:scale-98 cursor-pointer"
                  >
                    {formStatus === "loading" ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Submit Internship Application</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            ) : (
              /* Beautiful application success view */
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center text-center py-8 relative z-10"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-4 ring-emerald-500/5">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-display">Application Received!</h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-md mb-6 leading-relaxed font-light">
                  Thank you for applying to the <strong className="text-white font-semibold">{selectedRole}</strong> for a duration of <strong className="text-white font-semibold">{selectedDuration}</strong>. Our recruiting coordinators will audit your portfolio details and follow up with a briefing invitation via email within 48 hours.
                </p>
                <button
                  onClick={() => {
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      whyJoin: "",
                      githubOrPortfolio: "",
                      durationAgreement: false
                    });
                    setFormStatus("idle");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                  <span>Apply for another program</span>
                </button>
              </motion.div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
