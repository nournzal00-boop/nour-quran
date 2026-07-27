import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Trash2, Loader2, AlertCircle, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "noor-assistant-messages";

const SUGGESTIONS = [
  "ما فضل قيام الليل؟",
  "كيف أزيد خشوعي في الصلاة؟",
  "ما معنى قوله تعالى ﴿وَاذْكُر رَّبَّكَ إِذَا نَسِيتَ﴾؟",
  "ما حكم قراءة القرآن بدون وضوء؟",
  "أفضل الأذكار بعد الصلاة",
];

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "مساعد نور الذكي — أسئلة دينية وشرعية | نور" },
      { name: "description", content: "اسأل مساعد نور الذكي أي سؤال ديني، وتلقّ إجابة عربية موثقة بالآيات والأحاديث وأقوال العلماء." },
      { property: "og:title", content: "مساعد نور الذكي — أسئلة دينية وشرعية" },
      { property: "og:description", content: "إجابات إسلامية موثقة بالقرآن والسنة وأقوال العلماء، بلغة عربية واضحة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load persisted messages
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);

    const next: Msg[] = [...messages, { role: "user", content: trimmed }, { role: "assistant", content: "" }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next
            .slice(0, -1) // exclude the empty placeholder
            .map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const txt = await res.text().catch(() => "");
        if (res.status === 429) throw new Error("الطلبات كثيرة، يرجى الانتظار قليلاً ثم المحاولة مجدداً.");
        if (res.status === 402) throw new Error("انتهى رصيد المساعد الذكي مؤقتاً. حاول لاحقاً.");
        throw new Error(txt || "تعذّر الوصول إلى المساعد.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      const msg = e instanceof Error ? e.message : "حدث خطأ غير متوقع.";
      setError(msg);
      setMessages((prev) => prev.slice(0, -1)); // remove empty assistant bubble
    } finally {
      setLoading(false);
      abortRef.current = null;
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="bg-gradient-hero min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Header */}
        <div className="relative rounded-3xl border border-gold/30 bg-card shadow-elegant overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-emerald opacity-[0.04]" />
          <div className="relative px-6 py-8 text-center">
            <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-gold text-gold-foreground shadow-gold">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              مساعد نور الذكي
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
              اسأل أي سؤال ديني، وتلقَّ إجابة موثقة بالقرآن والسنة وأقوال العلماء، بلغة عربية واضحة.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-4 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 flex items-start gap-2 text-xs text-muted-foreground">
          <BookOpen className="h-4 w-4 text-gold shrink-0 mt-0.5" />
          <p>
            المساعد أداة استرشادية تعتمد على الذكاء الاصطناعي. للفتاوى الشخصية والمسائل الحساسة، يُرجى الرجوع إلى أهل العلم الموثوقين.
          </p>
        </div>

        {/* Chat */}
        <div className="rounded-2xl border border-border bg-card shadow-soft flex flex-col h-[65vh] min-h-[500px]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-accent mb-4">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <p className="text-muted-foreground mb-6">اختر سؤالاً للبدء، أو اكتب سؤالك بنفسك</p>
                <div className="grid gap-2 w-full max-w-lg">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-right rounded-xl border border-border bg-background px-4 py-3 text-sm hover:border-primary hover:bg-accent/50 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    m.role === "user"
                      ? "bg-gradient-emerald text-primary-foreground shadow-soft"
                      : "bg-accent/40 border border-border"
                  }`}
                >
                  {m.role === "assistant" ? (
                    m.content ? (
                      <div className="prose prose-sm max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground prose-strong:text-emerald-deep prose-blockquote:border-r-4 prose-blockquote:border-r-gold prose-blockquote:border-l-0 prose-blockquote:pr-4 prose-blockquote:pl-0 prose-blockquote:not-italic prose-blockquote:text-foreground prose-blockquote:bg-gold/5 prose-blockquote:py-2 prose-blockquote:rounded-lg prose-li:text-foreground">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>يفكّر…</span>
                      </div>
                    )
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </div>
            ))}

            {error && (
              <div className="mx-auto max-w-md rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-start gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border p-3 bg-background/50">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="اكتب سؤالك هنا…"
                rows={1}
                className="flex-1 resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 max-h-32"
                disabled={loading}
              />
              {loading ? (
                <button
                  onClick={stop}
                  className="grid h-11 w-11 place-items-center rounded-xl bg-destructive text-destructive-foreground hover:opacity-90"
                  aria-label="إيقاف"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                </button>
              ) : (
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim()}
                  className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="إرسال"
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
            </div>
            {messages.length > 0 && (
              <div className="mt-2 flex justify-end">
                <button
                  onClick={clearChat}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3 w-3" /> مسح المحادثة
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
