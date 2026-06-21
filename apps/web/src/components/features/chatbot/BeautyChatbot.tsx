"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Bot } from "lucide-react";
import type { ChatMessage } from "@/types";

const INITIAL_MESSAGE: ChatMessage = {
  id: "init",
  role: "assistant",
  content: "Hi! I'm your GlowIQ AI assistant ✨ I can help with skincare questions, ingredient safety, product recommendations, and routine planning. What would you like to know?",
  createdAt: new Date(),
};

const QUICK_PROMPTS = [
  "Ingredients to avoid?",
  "Morning routine tips",
  "Niacinamide for oily skin?",
  "Fix dark spots",
];

export function BeautyChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      createdAt: new Date(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages((m) => [
      ...m,
      { id: assistantId, role: "assistant", content: "", createdAt: new Date() },
    ]);

    try {
      const history = updatedMessages
        .filter((m) => m.id !== "init")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const token = decoder.decode(value, { stream: true });
        setMessages((m) =>
          m.map((msg) =>
            msg.id === assistantId ? { ...msg, content: msg.content + token } : msg
          )
        );
      }
    } catch {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: "Sorry, I couldn't connect. Please try again." }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: "linear-gradient(135deg,#2563EB,#3B82F6)", boxShadow: "0 4px 24px rgba(37,99,235,0.4)" }}>
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[9px] flex items-center justify-center text-white font-bold"
            style={{ background: "#EC4899" }}>AI</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 w-80 flex flex-col rounded-3xl overflow-hidden"
          style={{
            height: 500,
            background: "#fff",
            boxShadow: "0 8px 48px rgba(37,99,235,0.2)",
            border: "1px solid rgba(37,99,235,0.12)",
          }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3"
            style={{ background: "linear-gradient(135deg,#1D4ED8,#2563EB)" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">GlowIQ Assistant</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation: "pulse 2s infinite" }} />
                <p className="text-xs text-white/70">Online • GPT-4o</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide"
            style={{ background: "#F7F9FF" }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "linear-gradient(135deg,#2563EB,#3B82F6)" }}>
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div
                  className="max-w-[80%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={msg.role === "user"
                    ? { background: "linear-gradient(135deg,#2563EB,#3B82F6)", color: "#fff", borderTopRightRadius: 4 }
                    : { background: "#fff", color: "#0D1526", border: "1px solid rgba(37,99,235,0.08)", borderTopLeftRadius: 4 }}>
                  {msg.content || (
                    <div className="flex gap-1 py-1">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full"
                          style={{ background: "#3B82F6", animation: `bounce 1.2s ${i * 0.15}s infinite` }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick prompts */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5" style={{ background: "#F7F9FF" }}>
              {QUICK_PROMPTS.map((p) => (
                <button key={p} onClick={() => sendMessage(p)}
                  className="text-[11px] px-2.5 py-1.5 rounded-xl font-medium"
                  style={{ background: "#EFF4FF", color: "#2563EB" }}>
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t" style={{ borderColor: "rgba(37,99,235,0.08)", background: "#fff" }}>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skincare..."
                className="flex-1 px-4 py-2.5 rounded-2xl text-sm outline-none"
                style={{
                  background: "#F7F9FF",
                  border: "1px solid rgba(37,99,235,0.12)",
                  color: "#0D1526",
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: input.trim() && !loading ? "linear-gradient(135deg,#2563EB,#3B82F6)" : "#E5E7EB",
                  opacity: loading ? 0.7 : 1,
                }}>
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
