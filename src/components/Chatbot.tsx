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
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 bg-teal text-white rounded-xl shadow-lg shadow-teal/30 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-105">
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[350px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
          <div className="bg-teal p-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-sm">VGMF Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                  <p className="text-[10px] text-white/70">Online</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-72 overflow-y-auto p-3 space-y-2.5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] flex items-start gap-1.5 ${msg.isUser ? "flex-row-reverse" : ""}`}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${msg.isUser ? "bg-teal text-white" : "bg-teal/10 text-teal"}`}>
                    {msg.isUser ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={`px-3 py-2 rounded-xl text-sm ${msg.isUser ? "bg-teal text-white rounded-br-md" : "bg-slate-50 text-ink border border-slate-100 rounded-bl-md"}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-teal/10 flex items-center justify-center"><Bot size={12} className="text-teal" /></div>
                <div className="px-3 py-2 bg-slate-50 rounded-xl rounded-bl-md border border-slate-100 text-sm text-muted animate-pulse">Typing...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {quickReplies.map(q => (
                <button key={q} onClick={() => { setInput(q); setTimeout(send, 50); }}
                  className="px-2.5 py-1 text-[10px] font-bold bg-teal/10 hover:bg-teal/20 text-teal rounded-full transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-slate-100 p-2.5 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20 transition-all" />
            <button onClick={send} disabled={loading || !input.trim()}
              className="p-2 bg-teal text-white rounded-xl hover:bg-teal-light transition-colors disabled:opacity-40">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
