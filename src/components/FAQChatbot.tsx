import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, RefreshCw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export default function FAQChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Hello! I am KD-Bot, Krash Digital's conversational FAQ partner. Feel free to ask me anything about our Growth Services, custom Pricing tiers, and active Academy Internships!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickStartPrompts = [
    "What are your pricing plans?",
    "Tell me about the Facebook and Instagram Ads Internship.",
    "Do you offer technical SEO services?",
    "How can I apply for an internship?"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            content: m.content
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: ChatMessage = {
          id: `b-${Date.now()}`,
          role: "bot",
          content: data.reply || "I am here to guide you. Feel free to rephrase or check other sections of our portal.",
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error("API call was unsuccessful");
      }
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "bot",
        content: "I encountered a minor network latency issue. Our backend systems are solid. Could you try asking me that once more?",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "bot",
        content: "Let's start fresh! Ask me any questions regarding our services, custom packages, or career program tracks.",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div id="faq-chatbot-widget-container" className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {/* Toggle chat launcher button */}
        {!isOpen && (
          <motion.button
            id="faq-chatbot-launcher-button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer border border-blue-400/30"
          >
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="faq-chatbot-panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute bottom-0 right-0 w-[350px] sm:w-[380px] h-[520px] rounded-3xl border border-white/10 bg-[#080d1a]/95 text-white shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden"
          >
            {/* Header Section */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0c1326] relative">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest font-display text-white">KD-Bot</h4>
                  <p className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Ask anything about KD
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={clearChat}
                  title="Reset chat"
                  className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Message Streams Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                      {/* Icon Avatar spacer */}
                      {!isUser && (
                        <div className="h-7 w-7 rounded-lg bg-blue-600/10 border border-blue-500/20 shrink-0 flex items-center justify-center text-blue-400 text-[10px]">
                          🤖
                        </div>
                      )}
                      <div>
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 text-xs font-light leading-relaxed ${
                            isUser
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none"
                              : "bg-white/5 border border-white/5 text-slate-300 rounded-tl-none"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[8px] text-slate-500 pl-1 mt-1 block font-mono">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Loader indicator state */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[80%]">
                    <div className="h-7 w-7 rounded-lg bg-blue-600/10 border border-blue-500/20 shrink-0 flex items-center justify-center text-blue-400 text-[10px] animate-spin">
                      <RefreshCw className="h-3 w-3" />
                    </div>
                    <div className="bg-white/5 border border-white/5 text-slate-400 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs font-light flex items-center gap-1.5">
                      <span>Analyzing credentials</span>
                      <span className="flex gap-0.5 mt-1">
                        <span className="h-1 w-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="h-1 w-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="h-1 w-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Panel */}
            {messages.length === 1 && (
              <div className="px-4 py-2 bg-[#060a14] border-t border-white/5">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-blue-400" /> Suggested queries
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickStartPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-[10px] bg-white/[0.03] border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.08] text-slate-400 hover:text-white rounded-lg px-2.5 py-1 text-left transition-all cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form Controls */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 border-t border-white/10 bg-[#070b16] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="h-8.5 w-8.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-blue-500/10"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
