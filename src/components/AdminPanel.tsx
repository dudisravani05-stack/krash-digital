import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, Filter, RefreshCw, Eye, Check, Clock, Download, HardDrive, AlertCircle, Trash2, Key } from "lucide-react";
import { Lead } from "../types";

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [verifiedPasscode, setVerifiedPasscode] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchLeads = async () => {
    if (!verifiedPasscode) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/leads", {
        headers: {
          "x-admin-passcode": verifiedPasscode
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
      } else if (response.status === 401) {
        setError("Session expired or invalid credentials.");
        setIsAuthenticated(false);
      } else {
        setError("Error communicating with leads database.");
      }
    } catch (err) {
      setError("Failed to reach server backend database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/leads", {
        headers: {
          "x-admin-passcode": passcode
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
        setVerifiedPasscode(passcode);
        setIsAuthenticated(true);
        setError("");
      } else if (response.status === 401) {
        setError("Incorrect agency administrative credentials.");
      } else {
        setError("Error communicating with leads database.");
      }
    } catch (err) {
      setError("Failed to reach server backend database.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: "new" | "contacted" | "completed") => {
    if (!verifiedPasscode) return;
    setActionLoading(leadId);
    try {
      const response = await fetch(`/api/leads/${leadId}/status`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-passcode": verifiedPasscode
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        const data = await response.json();
        // Update local state
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) return;
    const headers = ["ID", "Name", "Email", "Phone", "Business", "Source", "Status", "Timestamp", "Niche"];
    const rows = leads.map((l) => [
      l.id,
      l.name,
      l.email,
      l.phone || "",
      l.businessName || "",
      l.source,
      l.status,
      l.timestamp,
      l.businessNiche || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((val) => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `krash_digital_leads_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.businessName && l.businessName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.businessNiche && l.businessNiche.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSource = sourceFilter === "all" || l.source === sourceFilter;
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;

    return matchesSearch && matchesSource && matchesStatus;
  });

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "contact_form":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/10";
      case "lead_popup":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/10";
      case "newsletter":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10";
      case "ai_audit":
        return "bg-pink-500/10 text-pink-400 border border-pink-500/15";
      case "careers_application":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/10";
      default:
        return "bg-slate-500/10 text-slate-400 border border-white/5";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/10 px-2 py-0.5 rounded-full">
            <Check className="h-3 w-3" /> Completed
          </span>
        );
      case "contacted":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 px-2 py-0.5 rounded-full">
            <Clock className="h-3 w-3" /> Contacted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/10 px-2 py-0.5 rounded-full">
            New Lead
          </span>
        );
    }
  };

  return (
    <div id="admin-panel-container" className="fixed inset-y-0 right-0 z-50 w-full max-w-4xl bg-slate-950 border-l border-white/10 shadow-2xl flex flex-col h-full overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <HardDrive className="h-5 w-5 text-blue-400 animate-pulse" />
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Krash Digital CRM System</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Administrative Backoffice</p>
          </div>
        </div>
        <button
          id="close-admin-btn"
          onClick={onClose}
          className="p-1 px-1.5 rounded-lg border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* --- PASSWORD AUTH STAGE --- */}
      {!isAuthenticated ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/30 p-6 backdrop-blur-md shadow-xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
              <Key className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Passcode Required</h4>
            <div className="mb-4 inline-flex items-center gap-1.5 bg-blue-500/15 border border-blue-500/25 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-blue-300">ADMIN</span>
            </div>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Authenticate using administrative access parameters to download leads, resumes, and internship audits.
            </p>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Access Passcode
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter secure passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500/50"
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium pb-1 bg-red-500/5 border border-red-500/10 p-2 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Authenticate CRM
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* --- MAIN CRM PORTAL STAGE --- */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-950">
          {/* Main List Section */}
          <div className="flex-1 flex flex-col h-full border-r border-white/5 overflow-hidden">
            {/* Action Bar (Search & Filter) */}
            <div className="p-4 border-b border-white/5 bg-slate-900/10 space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search name, email, company or niche..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-white/10 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
                  />
                </div>
                <button
                  onClick={fetchLeads}
                  disabled={loading}
                  className="p-2.5 rounded-lg border border-white/10 hover:bg-slate-900 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                  title="Refresh Leads Table"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={exportToCSV}
                  disabled={filteredLeads.length === 0}
                  className="flex items-center gap-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors disabled:opacity-50 disabled:bg-slate-900/50"
                  title="Export Leads to CSV Excel format"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>

              {/* Advanced Filter row */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Filter className="h-3 w-3 text-slate-500" />
                  <span>Source:</span>
                </div>
                {["all", "contact_form", "careers_application", "newsletter", "ai_audit"].map((src) => (
                  <button
                    key={src}
                    onClick={() => setSourceFilter(src)}
                    className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                      sourceFilter === src
                        ? "bg-blue-600/15 border-blue-500/30 text-blue-300"
                        : "bg-slate-900/50 border-white/5 text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    {src === "all" ? "All Sources" : src === "careers_application" ? "Internships" : src.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads Table List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {loading && leads.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mb-3" />
                  <p className="text-xs">Synchronizing real-time databases...</p>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="flex flex-col.items-center text-center justify-center p-12 py-16 text-slate-500">
                  <Filter className="mx-auto h-10 w-10 text-slate-600 mb-3" />
                  <p className="text-xs font-semibold text-slate-400">No leads found in table</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                    Zero leads match selected criteria. Submit entries via public forms to populate databases in real-time.
                  </p>
                </div>
              ) : (
                filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-4 transition-all duration-150 cursor-pointer flex justify-between items-center ${
                      selectedLead && selectedLead.id === lead.id
                        ? "bg-blue-950/20 shadow-inner"
                        : "bg-slate-950 hover:bg-slate-900/20"
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate max-w-[150px]">{lead.name}</span>
                        {getStatusBadge(lead.status)}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{lead.email}</div>
                      <div className="text-[10px] text-slate-500 truncate font-mono">
                        {lead.businessName ? `${lead.businessName} - ` : ""}
                        {new Date(lead.timestamp).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${getSourceBadgeColor(lead.source)}`}>
                        {lead.source === "ai_audit" ? "AI AUDIT" : lead.source === "careers_application" ? "INTERNSHIP" : lead.source.replace("_", " ")}
                      </span>
                      <Eye className="h-3.5 w-3.5 text-slate-500 hover:text-white transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer diagnostics counters */}
            <div className="px-4 py-2.5 border-t border-white/5 bg-slate-900/30 text-[10px] text-slate-400 flex justify-between items-center font-mono">
              <span>Total DB Count: {leads.length}</span>
              <span>Matched filters: {filteredLeads.length}</span>
            </div>
          </div>

          {/* Lead Detail Panel (Right hand sidebar layout on desktops) */}
          <div className="w-full md:w-80 shrink-0 border-t md:border-t-0 border-white/5 bg-slate-900/20 flex flex-col overflow-hidden max-h-[40vh] md:max-h-full">
            {selectedLead ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900/30 shrink-0">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Lead Record Specs</h4>
                  <button onClick={() => setSelectedLead(null)} className="text-slate-500 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs font-sans">
                  <div>
                    <h5 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Profile Info</h5>
                    <p className="text-white font-bold text-sm leading-tight">{selectedLead.name}</p>
                    <p className="text-blue-400 truncate mt-0.5 select-all">{selectedLead.email}</p>
                    {selectedLead.phone && (
                      <p className="text-slate-300 mt-1 pb-1 border-b border-white/5">Mob: {selectedLead.phone}</p>
                    )}
                  </div>

                  <div>
                    <h5 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Company Attributes</h5>
                    <p className="text-slate-200">
                      <strong>Name:</strong> {selectedLead.businessName || "Not listed"}
                    </p>
                    {selectedLead.businessNiche && (
                      <p className="text-slate-300 mt-0.5">
                        <strong>Niche:</strong> {selectedLead.businessNiche}
                      </p>
                    )}
                  </div>

                  <div>
                    <h5 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Message / Inquiry Details</h5>
                    <p className="text-slate-300 bg-white/5 rounded-lg p-2.5 border border-white/5 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-24">
                      {selectedLead.message || "No attached comment files filed."}
                    </p>
                  </div>

                  {selectedLead.auditResults && (
                    <div>
                      <h5 className="text-[10px] font-semibold text-pink-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <span>✦ Generated AI Strategy Report</span>
                      </h5>
                      <div className="bg-pink-950/10 border border-pink-500/10 rounded-lg p-2 max-h-32 overflow-y-auto text-slate-400 text-[11px] prose-invert font-light leading-relaxed select-text">
                        {selectedLead.auditResults.split("\n").map((line, ix) => (
                          <div key={ix} className="mb-0.5 last:mb-0">
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Toggle control panel */}
                  <div className="pt-2 border-t border-white/5">
                    <h5 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Resolution Pipelines</h5>
                    <div className="grid grid-cols-3 gap-1">
                      {(["new", "contacted", "completed"] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateStatus(selectedLead.id, st)}
                          disabled={actionLoading === selectedLead.id}
                          className={`text-[9px] font-bold py-1.5 rounded uppercase tracking-wider transition-colors ${
                            selectedLead.status === st
                              ? st === "completed"
                                ? "bg-green-600 text-white"
                                : st === "contacted"
                                ? "bg-cyan-600 text-white"
                                : "bg-amber-600 text-white"
                              : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          {st === "new" ? "Reset" : st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <Eye className="h-8 w-8 text-slate-600 mb-2.5" />
                <p className="text-xs">No Lead Record Selected</p>
                <p className="text-[10px] text-slate-600 mt-1 max-w-[150px] leading-relaxed">
                  Select a prospect from the dashboard grid on your left to explore details, report text logs, or resolve task loops.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
