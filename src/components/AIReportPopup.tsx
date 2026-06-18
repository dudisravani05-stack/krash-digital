import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Bot, Compass, Target, Sparkles, CheckCircle2, ChevronRight, ArrowRight, ClipboardCopy } from "lucide-react";

interface AIReportPopupProps {
  onClose: () => void;
}

export default function AIReportPopup({ onClose }: AIReportPopupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessNiche: "",
    primaryGoal: "Acquire More Qualified Leads",
    targetAudience: "",
    websiteUrl: "",
    email: "",
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const niches = [
    "SaaS / Software Startups",
    "Professional Consulting & B2B Services",
    "E-commerce & D2C Brands",
    "Local Medical / Aesthetic Practices",
    "Real Estate & Luxury Agencies",
    "Fitness & Wellness Companies",
    "Insurtech & Financial Advisors",
    "Other/Custom Industry"
  ];

  const goals = [
    "Acquire More Qualified Leads",
    "Boost E-commerce Sales & ROAS",
    "Build High Organic Search Authority (SEO)",
    "Differentiate Branding & High-Impact Identity",
    "Scale Organic Social Media Feed Community",
    "Automate Workflows using Conversational AI"
  ];

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.businessName || !formData.businessNiche) {
        setError("Please clarify your Business Name and Niche/Industry.");
        return;
      }
    } else if (step === 2) {
      if (!formData.primaryGoal) {
        setError("Please clarify your main marketing objective.");
        return;
      }
    }
    setError("");
    setStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("Please fill out your Name and Agency Email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Core audit report generation
      const response = await fetch("/api/marketing-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Analytics server failed to process parameters.");
      }

      const data = await response.json();
      setReport(data.auditReport);

      // 2. Register lead database entry on the backend
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          businessName: formData.businessName,
          businessNiche: formData.businessNiche,
          source: "ai_audit",
          message: `Generated AI Marketing Audit for goal: "${formData.primaryGoal}"`,
          auditResults: data.auditReport,
        }),
      });

      setStep(4); // Display completed report step
    } catch (err: any) {
      setError(err.message || "Failed to finalize diagnostics. Please double check submission.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="ai-audit-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        id="ai-audit-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Sheet panel */}
      <motion.div
        id="ai-audit-dialog"
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl backdrop-blur-xl md:p-8"
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 h-40 w-44 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          id="close-audit-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo label */}
        <div className="flex items-center gap-2 mb-6 pointer-events-none">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/15">
            <Bot className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Krash Digital Marketing AI Lab
          </span>
        </div>

        {/* --- STEP 1: Basic Business Profile --- */}
        {step === 1 && (
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
              Run Free AI Growth Diagnostics
            </h3>
            <p className="text-sm text-slate-400 mb-6 font-sans">
              Connect our fine-tuned Gemini growth engine to map out actionable optimizations, keyword priorities, and ad recommendations tailored directly for your marketplace niche.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Health Co."
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                  Select Industry / Niche *
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {niches.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFormData({ ...formData, businessNiche: n })}
                      className={`text-left text-xs px-3.5 py-2.5 rounded-lg border transition-all ${
                        formData.businessNiche === n
                          ? "bg-blue-600/15 border-blue-500 text-blue-200 font-medium"
                          : "bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {formData.businessNiche === "Other/Custom Industry" && (
                  <input
                    type="text"
                    placeholder="Enter custom niche description..."
                    onChange={(e) => setFormData({ ...formData, businessNiche: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2 text-xs text-white outline-none focus:border-blue-500/50"
                  />
                )}
              </div>

              {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.98]"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: Marketing Objectives & Goals --- */}
        {step === 2 && (
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
              Establish Growth Targets
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Our marketing models need to understand what you want to achieve, your demographics, and where your audience resides to compile custom metrics.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                  Primary Objective *
                </label>
                <div className="space-y-1.5">
                  {goals.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, primaryGoal: g })}
                      className={`w-full flex items-center gap-3 text-left text-xs px-3.5 py-2.5 rounded-lg border transition-all ${
                        formData.primaryGoal === g
                          ? "bg-blue-600/15 border-blue-500 text-blue-200 font-medium"
                          : "bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300"
                      }`}
                    >
                      <Target className={`h-4 w-4 shrink-0 ${formData.primaryGoal === g ? "text-blue-400" : "text-slate-500"}`} />
                      <span>{g}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 col-span-2">
                  Target Audience / Customer Demographic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Local property buyers aged 30-55, SaaS tech leads"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-blue-500/50"
                />
              </div>

              {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="flex-1 rounded-lg border border-white/10 hover:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.98]"
                >
                  <span>Next Step</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 3: Contact Details & Audit Kickoff --- */}
        {step === 3 && (
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
              Generate Your Strategy Report
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Enter your professional coordinates below to authenticate and build your custom growth diagnostics plan.
            </p>

            <form onSubmit={handleRunAudit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexis Carter"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                    Agency E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alexis@acme.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                  Business Website URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. www.apexhealth.co"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
                />
              </div>

              {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleBackStep}
                  className="flex-1 rounded-lg border border-white/10 hover:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-75"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Running diagnostics...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4" />
                      <span>Build Growth Plan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- STEP 4: Render Markdown Results! --- */}
        {step === 4 && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/5 pb-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  Your Diagnostics: <span className="text-blue-300">{formData.businessName}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Custom compiled actionable protocols for {formData.businessNiche}.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-[11px] font-semibold bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <ClipboardCopy className="h-3 w-3" />
                  <span>{copied ? "Copied" : "Copy Report"}</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span>Finish</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900/45 p-6 overflow-y-auto max-h-[50vh] scrollbar-thin text-slate-300 text-sm space-y-4 font-sans leading-relaxed pointer-events-auto select-text selection:bg-blue-500/30">
              <div className="prose prose-invert prose-slate prose-sm max-w-none">
                {report.split("\n\n").map((paragraph, pi) => {
                  if (paragraph.startsWith("###")) {
                    return (
                      <h4 key={pi} className="text-base font-bold text-white tracking-tight mt-5 mb-2 first:mt-0 flex items-center gap-2 border-l-2 border-blue-500 pl-2">
                        {paragraph.replace("###", "").trim()}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith("-") || paragraph.startsWith("*")) {
                    return (
                      <ul key={pi} className="space-y-1.5 list-disc pl-5 mb-3 text-slate-300">
                        {paragraph.split("\n").map((li, liIndex) => (
                          <li key={liIndex} className="text-sm">
                            {li.replace(/^[\s-*]+/, "").trim()}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={pi} className="mb-3 text-slate-300 font-light text-sm">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-950/20 rounded-xl border border-blue-900/30 p-4 mt-6 flex gap-3 items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">Save this Strategy!</p>
                <p className="text-slate-400 mt-0.5">
                  We've dispathed a permanent file copy of these diagnostics and custom timeline recommendation steps directly to <strong className="text-blue-300">{formData.email}</strong>.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
