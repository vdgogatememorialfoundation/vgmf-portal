"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string; isUser: boolean}[]>([
    { text: "Namaste! 🙏 I'm the VGMF virtual assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: userMsg }) });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.reply || "I'm here to help! Ask me about fellowships, seminars, or autism programmes.", isUser: false }]);
    } catch {
      setMessages(prev => [...prev, { text: "Please try again or contact care@vaidyagogate.org", isUser: false }]);
    }
    setLoading(false);
  };

  const quickReplies = ["Fellowship", "Seminar", "Autism", "Contact"];

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-navy text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-navy-light transition-all hover:scale-105">
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border overflow-hidden animate-scale-in">
          <div className="bg-navy text-white p-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse-dot" />
              <h3 className="font-heading font-bold">VGMF Assistant</h3>
            </div>
            <p className="text-xs text-white/70 mt-0.5">Online</p>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${msg.isUser ? "bg-navy text-white rounded-br-md" : "bg-gray-100 text-ink rounded-bl-md"}`}>{msg.text}</div>
              </div>
            ))}
            {loading && <div className="text-sm text-muted animate-pulse">Typing...</div>}
            <div ref={bottomRef} />
          </div>
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickReplies.map(q => (
                <button key={q} onClick={() => { setInput(q); send(); }}
                  className="px-3 py-1.5 text-xs bg-navy/5 hover:bg-navy/10 text-navy rounded-full transition-colors">{q}</button>
              ))}
            </div>
          )}
          <div className="border-t p-3 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message..." className="flex-1 px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20" />
            <button onClick={send} disabled={loading} className="p-2 bg-navy text-white rounded-xl hover:bg-navy-light transition-colors"><Send size={18} /></button>
          </div>
        </div>
      )}
    </>
  );
}
