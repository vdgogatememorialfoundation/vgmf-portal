"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Minimize2, Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
}

const quickReplies = [
  "Registration Help",
  "Payment Issue",
  "Certificate Query",
  "Event Info",
  "Other",
];

export default function DashboardChatbot() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "authenticated") {
      setMessages([{
        id: "welcome",
        content: "Hello! Welcome to VGMF Support. How can I help you today?",
        isFromUser: false,
        timestamp: new Date(),
      }]);
    }
  }, [status]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      content: text.trim(),
      isFromUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), sessionId }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          content: data.reply,
          isFromUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMsg]);
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }
      } else {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          content: "Our team will respond shortly. Please leave your contact details.",
          isFromUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: "Our team will respond shortly. Please leave your contact details.",
        isFromUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  if (status !== "authenticated") return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-20 right-4 z-50 w-[360px] max-h-[500px] bg-white rounded-2xl shadow-2xl border border-ink/10 flex flex-col overflow-hidden ${
              isMinimized ? "h-14" : "h-[500px]"
            }`}
          >
            <div className="bg-gradient-to-r from-[#0d6662] to-[#0a8480] px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageCircle size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-heading font-bold text-sm">VGMF Support</p>
                  <p className="text-white/60 text-[10px]">Typically replies instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Minimize2 size={14} className="text-white" />
                </button>
                <button
                  onClick={() => { setIsOpen(false); setIsMinimized(false); }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isFromUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.isFromUser
                            ? "bg-[#0d6662] text-white rounded-br-md"
                            : "bg-cream text-ink rounded-bl-md"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-cream px-3.5 py-2.5 rounded-2xl rounded-bl-md">
                        <Loader2 size={14} className="text-teal animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-ink/5 p-3 shrink-0 bg-cream/30">
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {quickReplies.map(reply => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
                        className="text-[10px] font-semibold px-2.5 py-1 bg-white border border-ink/10 rounded-full hover:border-teal hover:text-teal transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 text-sm bg-white border border-ink/10 rounded-xl focus:outline-none focus:border-teal"
                    />
                    <button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || loading}
                      className="w-9 h-9 bg-[#0d6662] rounded-xl flex items-center justify-center hover:bg-[#0a8480] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#0d6662] to-[#0a8480] rounded-full shadow-lg shadow-teal/30 flex items-center justify-center hover:scale-105 transition-transform"
        >
          <MessageCircle size={20} className="text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold rounded-full flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
          </span>
        </motion.button>
      )}
    </>
  );
}
