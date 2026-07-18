"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Namaste! I'm the VGMF virtual assistant. How can I help you today?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { text: data.reply || "I'm here to help! Ask me about fellowships, seminars, or autism programmes.", isUser: false },
      ]);
    } catch {
      setMessages(prev => [...prev, { text: "Please try again or contact care@vaidyagogate.org", isUser: false }]);
    }
    setLoading(false);
  };

  const quickReplies = ["Fellowship", "Seminar", "Autism", "Contact"];

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-navy to-navy-light text-white rounded-2xl shadow-xl shadow-navy/30 flex items-center justify-center hover:shadow-2xl hover:shadow-navy/40 transition-all duration-300 hover:scale-105"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] bg-white rounded-3xl shadow-2xl shadow-navy/20 border border-gray-100 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy to-navy-light p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Bot size={20} className="text-gold" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-base">VGMF Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-accent rounded-full animate-pulse" />
                  <p className="text-xs text-white/60">Online now</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] flex items-start gap-2 ${msg.isUser ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${msg.isUser ? "bg-navy text-white" : "bg-gold/10 text-gold"}`}>
                    {msg.isUser ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.isUser ? "bg-navy text-white rounded-br-md" : "bg-gray-50 text-ink border border-gray-100 rounded-bl-md"}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center"><Bot size={14} className="text-gold" /></div>
                <div className="px-4 py-2.5 bg-gray-50 rounded-2xl rounded-bl-md border border-gray-100">
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickReplies.map(q => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => send(), 50);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-gold/10 hover:bg-gold/20 text-gold rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="p-2.5 bg-gradient-to-br from-navy to-navy-light text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
