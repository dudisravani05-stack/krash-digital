import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, Instagram, Target, Search, PenTool, Code, Palette, Bot, Sparkles, Star, Check, CheckCircle2, 
  ArrowRight, Mail, Phone, MapPin, Menu, X, Send, Linkedin, ExternalLink, Lock, Layers, MessageSquare, Clock, 
  ArrowUpRight, Shield, Compass, Inbox, Activity, UserCheck, DollarSign, ChevronRight, ChevronLeft, Laptop, BarChart
} from "lucide-react";

import { SERVICES, WHY_CHOOSE_US, STATS, PORTFOLIO, TESTIMONIALS, PRICING, FAQS } from "./data";
import logoImg from "./assets/images/krash_logo_v2_1781676503515.jpg";
import marketingMockup from "./assets/images/marketing_dashboard_mockup_1781671692621.jpg";
import { Service } from "./types";

import AIReportPopup from "./components/AIReportPopup";
import AdminPanel from "./components/AdminPanel";
import CareersView from "./components/CareersView";
import FAQChatbot from "./components/FAQChatbot";

// Dynamic Lucide-react Icon mapping structure
const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Instagram,
  Target,
  Search,
  PenTool,
  Code,
  Palette,
  Bot,
  Sparkles,
  DollarSign,
  Compass,
  Inbox,
  Activity,
  UserCheck
};

export default function App() {
  // Navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // Multi-funnel popups state
  const [showAiAudit, setShowAiAudit] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  
  // Custom interactive highlights states
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [secretClickCount, setSecretClickCount] = useState(0);

  // Stats numerical counters simulation
  const [animatedStats, setAnimatedStats] = useState(STATS.map(s => ({ ...s, current: 0 })));

  // Contact Form state variables
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    message: ""
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");

  // Newsletter subscription
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Animate counters on mount
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 40;
    const intervalTime = duration / steps;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      setAnimatedStats(prev =>
        prev.map(stat => {
          const target = stat.numberValue;
          const currentVal = Math.min(target, Math.round((target / steps) * stepCount));
          return { ...stat, current: currentVal };
        })
      );

      if (stepCount >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Auto-slide testimonials every 5.5 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setTestimonialIndex(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5500);
    return () => clearInterval(slideTimer);
  }, []);

  // Secretariat Click Code in copyright to toggle Admin DRM
  const handleSecretClick = () => {
    setSecretClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setShowAdmin(true);
        return 0; // reset
      }
      return next;
    });
  };

  // Contact Form handler
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) {
      setContactError("Name and Professional Email are required indicators.");
      return;
    }

    setContactLoading(true);
    setContactError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contactForm,
          source: "contact_form"
        })
      });

      if (response.ok) {
        setContactSubmitted(true);
        setContactForm({ name: "", email: "", phone: "", businessName: "", message: "" });
      } else {
        const errData = await response.json();
        setContactError(errData.error || "Form submission rejected.");
      }
    } catch (err) {
      setContactError("Communications breakdown. Please retry contact details.");
    } finally {
      setContactLoading(false);
    }
  };

  // Newsletter form submission
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          email: newsletterEmail,
          source: "newsletter"
        })
      });

      if (response.ok) {
        setNewsletterSubscribed(true);
        setNewsletterEmail("");
      }
    } catch (err) {
      console.warn("Newsletter registration error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] font-sans text-slate-200 antialiased overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-300px] left-[-200px] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[-250px] right-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[110px]" />
        <div className="absolute top-[400px] left-[20%] w-[350px] h-[350px] rounded-full bg-violet-600/5 blur-[90px]" />
      </div>

      {/* --- STICKY NAVIGATION BAR --- */}
      <header id="main-navigation-header" className="sticky top-0 z-40 w-full py-3 bg-[#050810]/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-6 py-3 backdrop-blur-md shadow-xl shadow-black/20">
            
            {/* Brand Logo */}
            <a href="#hero" onClick={() => setActiveTab("home")} className="flex items-center gap-2.5 group">
              <img 
                src={logoImg} 
                alt="Krash Digital Logo"
                className="w-10 h-10 object-cover rounded-xl border border-white/10 group-hover:scale-105 transition-transform duration-200"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="font-display text-xs tracking-[0.25em] font-black text-white group-hover:text-blue-200 transition-colors uppercase leading-none">
                  Krash
                </span>
                <span className="font-display text-[9px] tracking-[0.15em] font-medium text-blue-500 uppercase leading-none mt-1">
                  Digital
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
              <button onClick={() => setActiveTab("home")} className={`hover:text-white transition-colors cursor-pointer font-bold ${activeTab === "home" ? "text-blue-400" : "text-white"}`}>HOME</button>
              <a href="#services" onClick={() => setActiveTab("home")} className="hover:text-white transition-colors">Services</a>
              <a href="#about" onClick={() => setActiveTab("home")} className="hover:text-white transition-colors">About Us</a>
              <a href="#portfolio" onClick={() => setActiveTab("home")} className="hover:text-white transition-colors">Case Studies</a>
              <a href="#pricing" onClick={() => setActiveTab("home")} className="hover:text-white transition-colors">Pricing</a>
              <button onClick={() => setActiveTab("careers")} className={`hover:text-white transition-colors cursor-pointer font-bold ${activeTab === "careers" ? "text-blue-400" : "text-white"}`}>CAREERS</button>
              <a href="#contact" onClick={() => setActiveTab("home")} className="hover:text-white transition-colors">Contact</a>
            </nav>

            {/* Consultation Button */}
            <div className="hidden md:flex items-center gap-4">
              <button
                id="nav-consultation-btn"
                onClick={() => setShowAiAudit(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-blue-900/20"
              >
                Free Consultation
              </button>
            </div>

            {/* Mobile responsive toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 px-1.5 rounded-lg border border-white/10 hover:border-white/20 text-slate-400 hover:text-white md:hidden transition-all"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10 bg-[#050810]/95 backdrop-blur-md md:hidden overflow-hidden mx-4 sm:mx-6 mt-2 rounded-xl border"
            >
              <div className="space-y-1.5 px-4 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                <button onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }} className={`block w-full text-left py-2.5 px-3 hover:bg-white/5 rounded-lg hover:text-white font-bold ${activeTab === "home" ? "text-blue-500" : "text-white"}`}>HOME</button>
                <a href="#services" onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }} className="block py-2.5 px-3 hover:bg-white/5 rounded-lg hover:text-white">Services</a>
                <a href="#about" onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }} className="block py-2.5 px-3 hover:bg-white/5 rounded-lg hover:text-white">About Us</a>
                <a href="#portfolio" onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }} className="block py-2.5 px-3 hover:bg-white/5 rounded-lg hover:text-white">Case Studies</a>
                <a href="#pricing" onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }} className="block py-2.5 px-3 hover:bg-white/5 rounded-lg hover:text-white">Pricing</a>
                <button onClick={() => { setActiveTab("careers"); setMobileMenuOpen(false); }} className={`block w-full text-left py-2.5 px-3 hover:bg-white/5 rounded-lg hover:text-white font-bold ${activeTab === "careers" ? "text-blue-500" : "text-white"}`}>CAREERS</button>
                <a href="#contact" onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }} className="block py-2.5 px-3 hover:bg-white/5 rounded-lg hover:text-white">Contact</a>
                <div className="pt-3 border-t border-white/10 px-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowAiAudit(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white"
                  >
                    <span>Free Consultation</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {activeTab === "home" ? (
        <>
          {/* --- HERO SECTION --- */}
          <section id="hero" className="relative pt-10 pb-16 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            
            {/* Left Texts Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Premium label badge */}
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                Guaranteed Metric Growth • Trusted by 50+ Startups
              </div>

              <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                We Help Businesses <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Scale Smarter</span>
              </h1>

              <p className="mx-auto lg:mx-0 max-w-xl text-md sm:text-lg text-slate-400 font-light leading-relaxed">
                From social media management to high-converting ad campaigns, we help brands attract customers, build digital authority, and increase repeatable revenue through precision engineering.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-2">
                <button
                  id="hero-primary-btn"
                  onClick={() => setShowAiAudit(true)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                >
                  <span>Free Consultation</span>
                </button>
                <a
                  id="hero-secondary-btn"
                  href="#services"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/10 text-white hover:bg-white/5 px-6 py-3 text-sm font-semibold transition-all"
                >
                  <span>View Services</span>
                </a>
              </div>

              {/* Credentials labels trust badge */}
              <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-6 max-w-sm mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl font-bold text-white">4.7/5★</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Agency Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">400%+</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Average ROI</p>
                </div>
              </div>

            </div>

            {/* Right Graphics Mockup Container */}
            <div className="lg:col-span-5 relative z-10">
              <div className="relative mx-auto max-w-sm lg:max-w-none bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-sm group overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent)] pointer-events-none"></div>
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
                
                {/* Visual Image representing mockup dashboard */}
                <img
                  src={marketingMockup}
                  alt="Krash Digital Marketing Diagnostics Mockup Chart"
                  referrerPolicy="no-referrer"
                  className="rounded-2xl border border-white/15 shadow-inner object-cover w-full h-[320px] sm:h-[400px]"
                />

                {/* Micro overlay panel cards */}
                <div className="absolute bottom-10 -left-4 hidden sm:flex items-center gap-3 rounded-2xl border border-white/15 bg-[#050810]/95 p-3 px-4 shadow-xl backdrop-blur-md">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-400 border border-green-500/10">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Inbound Growth</p>
                    <p className="text-xs font-bold text-white">+148% Leads MoM</p>
                  </div>
                </div>

                <div className="absolute top-10 -right-4 hidden sm:flex items-center gap-3 rounded-2xl border border-white/15 bg-[#050810]/95 p-3 px-4 shadow-xl backdrop-blur-md">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/10 text-blue-400 border border-blue-500/10">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wildest font-bold">AI Autopilot</p>
                    <p className="text-xs font-bold text-white">Ad Spend: Slashed 30%</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- STATISTICS RESULTS PANEL --- */}
      <section id="results" className="relative border-y border-white/15 bg-[#050810] px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-y-8 gap-x-4 md:grid-cols-4 text-center">
            {animatedStats.map((stat, i) => (
              <div key={stat.id} className="space-y-1">
                <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                    {stat.current}
                  </span>
                  <span className="text-blue-400">{stat.suffix}</span>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="services" className="relative py-20 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              capabilities
            </div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Scale With Attractive Growth Services
            </h2>
            <p className="text-slate-400 text-sm font-light max-w-xl mx-auto">
              We engineer direct-response systems and organic marketing loops designed specifically to expand customer acquisition metrics for growth companies.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((serv) => {
              const IconComponent = IconMap[serv.icon] || Code;
              return (
                <div
                  key={serv.id}
                  className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Icon container */}
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <IconComponent className="h-5 w-5" />
                    </span>

                    <h3 className="text-sm font-bold text-white tracking-tight mb-2 group-hover:text-blue-300 transition-colors uppercase tracking-[0.05em]">
                      {serv.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-3">
                      {serv.description}
                    </p>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => setActiveService(serv)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-all"
                    >
                      <span>Learn More</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct CTA action box in services */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/5 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold text-white uppercase tracking-[0.05em]">Need a highly engineered bespoke plan?</h4>
              <p className="text-xs text-slate-400 mt-1 font-light">Select and package services dynamically or receive our tailored proposal blueprint.</p>
            </div>
            <button
              onClick={() => setShowAiAudit(true)}
              className="flex items-center gap-1.5 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-semibold text-white transition-all shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
            >
              <span>Build AI Marketing Package</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* --- ABOUT SECTION & WHY CHOOSE US --- */}
      <section id="about" className="relative py-20 bg-transparent border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
            
            {/* Left side Texts */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                your partner
              </div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                We Combine Creativity, Technology, and Mathematics
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                We combine creativity, technology, and marketing expertise to help businesses build a strong online presence and generate consistent results.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Our operations strategy focuses entirely around conversion optimization. We align modern software engineering frameworks with creative ad concepts to eliminate useless programmatic overhead and maximize lead volumes.
              </p>

              {/* Founder Quote sign */}
              <div className="border-l-2 border-blue-500 pl-4 py-2 bg-white/5 pr-2 rounded-r-xl border border-white/10 border-l-0 text-left">
                <p className="text-xs italic text-slate-300">"In modern spaces, you either dominate high-intent organic graphs or spend a premium matching algorithms. We engineer systems that ensure you win."</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mt-2">— Growth Director, Krash Digital</p>
              </div>
            </div>

            {/* Right side Grid - Why Choose Us Cards */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {WHY_CHOOSE_US.map((item) => {
                  const ItemIcon = IconMap[item.iconName] || CheckCircle2;
                  return (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-all duration-300 flex items-start gap-3.5"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                        <ItemIcon className="h-4 w-4" />
                      </span>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white tracking-tight uppercase tracking-[0.05em]">{item.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-light">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- PORTFOLIO CASE STUDIES --- */}
      <section id="portfolio" className="relative py-20 bg-transparent border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                outcome showcase
              </div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Our Showcase of Results
              </h2>
              <p className="text-sm text-slate-400 font-light">
                Discover how we've deployed custom digital strategies to scale visibility, boost leads, and deliver industry-leading conversion figures.
              </p>
            </div>
          </div>

          {/* Grid Layout of portfolio items */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PORTFOLIO.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow-xl transition-transform duration-300 hover:scale-[1.01]"
              >
                
                {/* Image backdrop container */}
                <div className="h-56 w-full relative overflow-hidden bg-[#050810]">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category Pill Tag */}
                  <span className="absolute top-3 left-3 bg-[#050810]/80 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest text-blue-400 border border-white/10 px-2.5 py-1 rounded-xl">
                    {item.category}
                  </span>
                </div>

                {/* Bottom descriptor drawer */}
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{item.client}</p>
                    <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                      {item.metric}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-snug group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- TESTIMONIALS SLIDER SECTION --- */}
      <section id="testimonials" className="relative py-20 bg-transparent border-t border-white/10 overflow-hidden">
        
        {/* Glow dots decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-1">
              endorsements
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Loved by Fast Growing Startups
            </h2>
          </div>

          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 backdrop-blur-md">
            
            {/* Quote container with auto transition slide */}
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-center"
              >
                {/* Stars display */}
                <div className="flex items-center justify-center gap-1 text-amber-500">
                  {Array.from({ length: TESTIMONIALS[testimonialIndex].rating }).map((_, id) => (
                    <Star key={id} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>

                <blockquote className="font-display text-lg sm:text-xl text-white font-medium italic leading-relaxed max-w-2xl mx-auto">
                  "{TESTIMONIALS[testimonialIndex].quote}"
                </blockquote>

                <div>
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 font-bold text-xs text-blue-400 uppercase tracking-wider mb-2">
                    {TESTIMONIALS[testimonialIndex].author.split(" ").map(w => w[0]).join("")}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{TESTIMONIALS[testimonialIndex].author}</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">{TESTIMONIALS[testimonialIndex].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider controls buttons */}
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => setTestimonialIndex(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all"
                title="Previous feedback"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {/* Pagination Dots indicator */}
              <div className="flex gap-1.5 px-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${testimonialIndex === i ? "w-6 bg-blue-500" : "w-1.5 bg-slate-800"}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setTestimonialIndex(prev => (prev + 1) % TESTIMONIALS.length)}
                className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all"
                title="Next feedback"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* --- PRICING PLANS SECTION --- */}
      <section id="pricing" className="relative py-20 bg-transparent border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              retainers
            </div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Transparent, Value-Focused Packages
            </h2>
            <p className="text-slate-400 text-sm font-light max-w-xl mx-auto">
              Choose the speed and volume of customer acquisition you need. Zero yearly locks, transparent bi-weekly sync deliverables.
            </p>
          </div>

          {/* Pricing cards grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {PRICING.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-b from-blue-950/20 via-slate-900/70 to-blue-950/15 border-2 border-blue-500 shadow-xl"
                    : "bg-slate-900/15 border border-white/10"
                }`}
              >
                {/* Popularity Badge sticker overlay */}
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full shadow-lg">
                    Highest ROAS Value
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight uppercase tracking-[0.05em]">{plan.name}</h3>
                  
                  {/* Pricing cost banner */}
                  <div className="my-5 flex items-baseline gap-1 font-display">
                    <span className="text-sm font-semibold text-slate-500">$</span>
                    <span className="text-4xl font-extrabold text-white tracking-tight">{plan.price}</span>
                    <span className="text-xs text-slate-500">/{plan.period}</span>
                  </div>

                  {/* Bullet features specifications */}
                  <ul className="space-y-3 pt-4 border-t border-white/5 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="leading-normal font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setShowAiAudit(true)}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                      : "bg-[#050810] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white"
                  }`}
                >
                  Acquire This Package
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-500 mt-10">
            * All services require month-to-month retainers. Custom plans available. Click <button onClick={() => setShowAiAudit(true)} className="text-blue-400 underline font-semibold">Free Audit</button> to configure.
          </p>

        </div>
      </section>

      {/* --- FAQ ACCORDIONS --- */}
      <section id="faq" className="relative py-20 bg-transparent border-t border-white/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-1">
              questions answered
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Frequently Asked Queries
            </h2>
          </div>

          <div className="space-y-3.5">
            {FAQS.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-200"
                >
                  {/* Top Accordion Trigger header */}
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between gap-4 text-left p-5 text-sm sm:text-base font-semibold text-white hover:bg-white/5 cursor-pointer select-none transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="shrink-0 p-1.5 px-2 rounded-lg bg-[#050810] border border-white/10 font-mono text-[10px] text-slate-400">
                      {isOpen ? "Collapse —" : "Expand +"}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-5 pt-0 border-t border-white/5 text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* --- CONTACT SECTION & INTEGRATED LEAD FORM --- */}
      <section id="contact" className="relative py-20 bg-transparent border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            
            {/* Left coordinate details */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                get in touch
              </div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ready to Accelerate Growth?
              </h2>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Connect with our growth strategist. Whether you're interested in full retainers or want to schedule a custom strategy blueprint, submit details instantly.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="font-light">growth.krashdigital@gmail.com</span>
                </div>
              </div>

              {/* Secure WhatsApp direct CTA placeholder replaced with simple gap */}
              <div className="pt-2"></div>
            </div>

            {/* Right integrated CRM lead submission form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-xl backdrop-blur-md">
                
                {!contactSubmitted ? (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                          Your Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          placeholder="e.g. Alexis Carter"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-[#050810]/60 px-4 py-3 text-xs text-white outline-none focus:border-blue-500 font-light"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                          Professional E-mail *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          placeholder="alexis@acme.com"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-[#050810]/60 px-4 py-3 text-xs text-white outline-none focus:border-blue-500 font-light"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-phone" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                          Phone Number
                        </label>
                        <input
                          id="contact-phone"
                          type="text"
                          placeholder="+1 (555) 0192"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-[#050810]/60 px-4 py-3 text-xs text-white outline-none focus:border-blue-500 font-light"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-company" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                          Company / Business Name
                        </label>
                        <input
                          id="contact-company"
                          type="text"
                          placeholder="Acme Growth Corp"
                          value={contactForm.businessName}
                          onChange={(e) => setContactForm({ ...contactForm, businessName: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-[#050810]/60 px-4 py-3 text-xs text-white outline-none focus:border-blue-500 font-light"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                        Brief Project Description / Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        placeholder="Tell us about your brand model, active campaign pain points, and conversion objectives..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#050810]/60 px-4 py-3 text-xs text-white outline-none focus:border-blue-500 resize-y font-light"
                      />
                    </div>

                    {contactError && <p className="text-xs text-red-400 font-medium">{contactError}</p>}

                    <button
                      id="contact-submit-btn"
                      type="submit"
                      disabled={contactLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-3.5 text-xs font-semibold text-white transition-all disabled:opacity-50"
                    >
                      {contactLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Delivering Strategy Inbound...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Consultation Inquiry</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="flex flex-col items-center text-center py-10">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Request Handled!</h3>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-sm mb-4 leading-relaxed font-light">
                      Thank you for submitting your project specs. Our principal growth strategist will review details and schedule a presentation slot within 12 business hours.
                    </p>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="text-xs font-semibold text-blue-400 hover:underline"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>
        </>
      ) : (
        <CareersView />
      )}

      {/* --- FOOTER & COOPERATIVE CREDIT --- */}
      <footer id="main-agency-footer" className="relative bg-[#050810] border-t border-white/10 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 mb-10 pb-10 border-b border-white/10">
            
            {/* Logo and brief summary */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <img 
                  src={logoImg} 
                  alt="Krash Digital Logo"
                  className="w-10 h-10 object-cover rounded-xl border border-white/10"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col">
                  <span className="font-display text-xs tracking-[0.25em] font-black text-white uppercase leading-none">
                    Krash
                  </span>
                  <span className="font-display text-[9px] tracking-[0.15em] font-medium text-blue-500 uppercase leading-none mt-1">
                    Digital
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-light max-w-sm">
                Next-generation marketing technology architectures engineered purely for client lead generation, scalable brand authority, and high ROI.
              </p>
              
              {/* Social icons */}
              <div className="flex items-center gap-3 text-slate-400">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter">
                  <span className="text-sm font-semibold">𝕏</span>
                </a>
                <button
                  onClick={() => setShowAdmin(true)}
                  className="hover:text-white transition-colors opacity-60 hover:opacity-100 cursor-pointer"
                  title="CRM Backend Login Lock"
                >
                  <Lock className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Links Menu */}
            <div className="md:col-span-3 space-y-3 text-xs">
              <h4 className="font-semibold text-white uppercase tracking-wider text-[10px]">Services Menu</h4>
              <ul className="space-y-2 text-slate-400 font-light">
                <li><a href="#services" className="hover:text-white transition-colors">Search Optimization (SEO)</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Social Management</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Paid Ads Strategy</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">AI Funnel Automation</a></li>
              </ul>
            </div>

            {/* Newsletter input subscription box */}
            <div className="md:col-span-4 space-y-3.5">
              <h4 className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Subscription Bulletin</h4>
              <p className="text-xs text-slate-400 leading-normal font-light">
                Secure the bi-weekly <strong className="text-white">Growth Protocols newsletter</strong> detailing local Google SEO algorithm shifts.
              </p>

              {!newsletterSubscribed ? (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-[#050810]/60 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 font-light"
                  />
                  <button
                    type="submit"
                    className="px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all"
                  >
                    Join
                  </button>
                </form>
              ) : (
                <p className="text-xs font-semibold text-green-400 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5 animate-bounce" />
                  <span>Welcome onboard! Dispatched welcome file pack.</span>
                </p>
              )}
            </div>

          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
            <span 
              onClick={handleSecretClick} 
              className="select-none text-slate-500 hover:text-slate-400"
            >
              © {new Date().getFullYear()} Krash Digital. All Rights Reserved.
            </span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Framework</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Retainer Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Client Conversational AI FAQ Chatbot Widget */}
      <FAQChatbot />

      {/* --- ALL INJECTED POPUPS AND FULL BACKOFFICE CRM SIDER SHEET --- */}
      <AnimatePresence>
        
        {/* 2. Dynamic AI consultation audit popup */}
        {showAiAudit && (
          <AIReportPopup onClose={() => setShowAiAudit(false)} />
        )}

        {/* 3. Fully working leads back-office panel drawer */}
        {showAdmin && (
          <AdminPanel onClose={() => setShowAdmin(false)} />
        )}

        {/* 4. Service Detail modal */}
        {activeService && (
          <div id="service-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveService(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              id="service-modal-content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#050810] p-6 shadow-2xl backdrop-blur-2xl md:p-8"
            >
              <button
                onClick={() => setActiveService(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  {React.createElement(IconMap[activeService.icon] || Code, { className: "h-5 w-5" })}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">{activeService.title}</h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-light font-sans">
                <p>{activeService.longDescription}</p>
                <p className="bg-slate-900/60 rounded-lg p-3 border border-white/5 font-medium text-blue-300">
                  ✦ Dynamic Inbound Guarantee: All projects under {activeService.title} can qualify for optimized lead dashboards and analytics trackers.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setActiveService(null)}
                  className="flex-1 rounded-xl border border-white/10 hover:bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setActiveService(null);
                    setShowAiAudit(true);
                  }}
                  className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition-all"
                >
                  Acquire Proposal
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
