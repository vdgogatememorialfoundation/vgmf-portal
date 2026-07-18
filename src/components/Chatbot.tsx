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
        className="fixed bottom-5 right-5 z-50 w-12 h-12 bg-[#0d6662] text-white rounded-xl shadow-lg shadow-[#0d6662]/30 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-105">
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-scale-in">
          <div className="bg-[#0d6662] p-4">
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
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${msg.isUser ? "bg-[#0d6662] text-white" : "bg-[#0d6662]/10 text-[#0d6662]"}`}>
                    {msg.isUser ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={`px-3 py-2 rounded-xl text-sm font-body ${msg.isUser ? "bg-[#0d6662] text-white rounded-br-md" : "bg-[#faf9f6] text-[#1a1a2e] border border-gray-100 rounded-bl-md"}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#0d6662]/10 flex items-center justify-center"><Bot size={12} className="text-[#0d6662]" /></div>
                <div className="px-3 py-2 bg-[#faf9f6] rounded-xl rounded-bl-md border border-gray-100 text-sm text-[#7c7c8a] animate-pulse font-body">Typing...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {quickReplies.map(q => (
                <button key={q} onClick={() => { setInput(q); setTimeout(send, 50); }}
                  className="px-2.5 py-1 text-[10px] font-bold bg-[#0d6662]/10 hover:bg-[#0d6662]/20 text-[#0d6662] rounded-full transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-gray-100 p-2.5 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d6662] focus:ring-1 focus:ring-[#0d6662]/20 transition-all font-body" />
            <button onClick={send} disabled={loading || !input.trim()}
              className="p-2 bg-[#0d6662] text-white rounded-xl hover:bg-[#0a5450] transition-colors disabled:opacity-40">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
