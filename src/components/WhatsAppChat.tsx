import { useState, useRef, useEffect } from "react";

const PHONE_INTL = "2347036809459";
const WHATSAPP_BASE = `https://wa.me/${PHONE_INTL}`;

const WELCOME = [
  "Hello! Welcome to Wellness Journey Nigeria ✨",
  "I'm here to help you start your weight-loss journey with Mounjaro®.",
  "What would you like to do today?",
];

const QUICK_REPLIES = [
  { label: "💬 Book a consultation", message: "Hi, I'd like to book a consultation for Mounjaro weight loss treatment." },
  { label: "💊 Check stock & prices", message: "Hi, can you share current Mounjaro stock and prices?" },
  { label: "📦 Track my order", message: "Hi, I'd like to track my recent order." },
  { label: "❓ Ask a question", message: "Hi, I have a question about the Mounjaro programme." },
];

function getWhatsAppUrl(text: string) {
  const encoded = encodeURIComponent(text);
  return `${WHATSAPP_BASE}?text=${encoded}`;
}

export default function WhatsAppChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ from: "bot" | "user"; text: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      // Typing effect for welcome
      const welcomeMsgs = WELCOME.map((text, i) => ({ from: "bot" as const, text, delay: 400 + i * 600 }));
      welcomeMsgs.forEach((m) => {
        setTimeout(() => {
          setMessages((prev) => [...prev, { from: m.from, text: m.text }]);
        }, m.delay);
      });
    }
  }, [open, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleQuickReply = (message: string) => {
    setMessages((prev) => [...prev, { from: "user", text: message }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Opening WhatsApp for you… ✅" },
      ]);
    }, 500);
    setTimeout(() => {
      window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    }, 900);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Opening WhatsApp for you… ✅" },
      ]);
    }, 500);
    setTimeout(() => {
      window.open(getWhatsAppUrl(text), "_blank", "noopener,noreferrer");
    }, 900);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      {open && (
        <div className="flex w-[90vw] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-gold/30 bg-cream shadow-2xl"
          style={{ height: "clamp(420px, 60vh, 560px)" }}>
          {/* Header */}
          <div className="flex items-center gap-3 bg-emerald-deep px-5 py-4">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-gold-foreground font-display text-lg font-bold">
                WJ
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-emerald-deep bg-[#25D366]" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-cream">Wellness Journey</div>
              <div className="text-[11px] text-cream/70">Typically replies in minutes</div>
            </div>
            <button onClick={() => setOpen(false)} className="text-cream/70 hover:text-cream transition" aria-label="Close chat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#F9F7F2]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.from === "user"
                    ? "bg-emerald-deep text-cream rounded-br-md"
                    : "bg-white text-foreground shadow-sm border border-border/40 rounded-bl-md"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          <div className="shrink-0 border-t border-gold/10 bg-cream px-4 pt-3 pb-1">
            <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Quick options</div>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr.label}
                  onClick={() => handleQuickReply(qr.message)}
                  className="rounded-full border border-gold/40 bg-white px-3 py-1.5 text-xs font-medium text-primary hover:bg-gold/10 transition"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-gold/10 bg-cream px-4 py-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message…"
              className="flex-1 rounded-full border border-input bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white hover:scale-105 transition disabled:opacity-40 disabled:hover:scale-100"
              aria-label="Send"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition"
          aria-label="Open WhatsApp chat"
        >
          <svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor" aria-hidden>
            <path d="M19.11 17.21c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.21 5.08 4.5.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35zM16.02 5.33c-5.91 0-10.71 4.8-10.71 10.71 0 1.89.49 3.73 1.43 5.36L5 27l5.74-1.5a10.7 10.7 0 005.27 1.37h.01c5.91 0 10.71-4.8 10.71-10.71 0-2.86-1.11-5.55-3.14-7.58a10.65 10.65 0 00-7.57-3.25z"/>
          </svg>
        </button>
      )}
    </div>
  );
}
