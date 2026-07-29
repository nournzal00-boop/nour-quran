import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Share2, Copy, Sparkles, Sun, Moon, HandHeart, Gem } from "lucide-react";
import { SUNNAHS, CATEGORIES, type Sunnah } from "@/lib/sunnah-data";

export const Route = createFileRoute("/sunnah")({
  head: () => ({
    meta: [
      { title: "سُنَنُ الحَبِيبِ ﷺ — نور" },
      { name: "description", content: "مكتبة السنن النبوية: سنن اليوم والليلة، العبادات، المعاملات، والسنن المهجورة، مع الدليل والفضل وخطوات التطبيق." },
      { property: "og:title", content: "سُنَنُ الحَبِيبِ ﷺ — نور" },
      { property: "og:description", content: "أحيِ السنة النبوية في يومك مع دليل تفاعلي وبطاقات مصنفة." },
    ],
  }),
  component: SunnahPage,
});

const CATEGORY_META: Record<Sunnah["category"], { icon: any; color: string }> = {
  daily: { icon: Sun, color: "from-amber-400/20 to-amber-600/10" },
  worship: { icon: Moon, color: "from-emerald-400/20 to-emerald-700/10" },
  manners: { icon: HandHeart, color: "from-rose-400/20 to-rose-600/10" },
  forgotten: { icon: Gem, color: "from-violet-400/20 to-violet-700/10" },
};

function SunnahPage() {
  const [cat, setCat] = useState<Sunnah["category"] | "all">("all");
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    const raw = localStorage.getItem("sunnah-done");
    if (raw) try { setDone(new Set(JSON.parse(raw))); } catch {}
  }, []);

  const toggle = (id: string) => {
    setDone(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("sunnah-done", JSON.stringify([...next]));
      return next;
    });
  };

  const shareOne = async (s: Sunnah) => {
    const text = `${s.title}\n${s.evidence}\n(${s.source})`;
    if (navigator.share) { try { await navigator.share({ text }); } catch {} }
    else navigator.clipboard.writeText(text);
  };
  const copyOne = (s: Sunnah) => navigator.clipboard.writeText(`${s.title}\n${s.evidence}\n(${s.source})`);

  const list = cat === "all" ? SUNNAHS : SUNNAHS.filter(s => s.category === cat);

  return (
    <div className="bg-gradient-hero min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="text-center mb-8">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-card/60 px-4 py-1.5 text-xs font-medium text-emerald-deep">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> أحيِ السُّنة في يومك
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">سُنَنُ الحَبِيبِ ﷺ</h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            مكتبة تفاعلية بالسنن النبوية مع الدليل، والمصدر، وخطوات التطبيق، والأجر الموعود.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setCat("all")}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${cat === "all" ? "bg-gradient-emerald text-[#F3E5AB] border-transparent" : "border-border bg-card hover:bg-accent"}`}
          >
            الكل
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${cat === c.id ? "bg-gradient-emerald text-[#F3E5AB] border-transparent" : "border-border bg-card hover:bg-accent"}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {list.map(s => {
            const M = CATEGORY_META[s.category];
            const isDone = done.has(s.id);
            return (
              <article
                key={s.id}
                className={`relative rounded-3xl border p-6 shadow-soft transition-all ${isDone ? "border-gold/60 bg-gradient-to-br from-gold/5 to-transparent" : "border-border bg-card hover:shadow-elegant hover:border-gold/40"}`}
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${M.color} opacity-40 pointer-events-none`} />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-gold text-gold-foreground shadow-gold shrink-0">
                        <M.icon className="h-5 w-5" />
                      </div>
                      <h2 className="font-display text-lg md:text-xl font-bold text-foreground leading-tight">{s.title}</h2>
                    </div>
                  </div>

                  <blockquote className="mt-4 rounded-2xl bg-background/60 border border-border/60 p-4 font-display text-base leading-loose text-foreground">
                    {s.evidence}
                    <footer className="mt-2 text-[11px] font-semibold text-emerald-deep">— {s.source}</footer>
                  </blockquote>

                  <div className="mt-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">خطوات التطبيق</div>
                    <ul className="space-y-1.5">
                      {s.steps.map((st, i) => (
                        <li key={i} className="flex gap-2 text-sm text-foreground/90">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                          {st}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 rounded-xl border border-gold/30 bg-gradient-to-l from-gold/10 to-transparent p-3">
                    <div className="text-[11px] font-bold text-gold-foreground/80 mb-0.5">الفضل والأجر</div>
                    <p className="text-sm font-semibold text-emerald-deep">{s.virtue}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => toggle(s.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${isDone ? "bg-gradient-emerald text-[#F3E5AB]" : "border border-border bg-card hover:bg-accent"}`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      {isDone ? "تم التطبيق" : "تطبيق السنة"}
                    </button>
                    <button onClick={() => copyOne(s)} className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-accent">
                      <Copy className="h-3.5 w-3.5" /> نسخ
                    </button>
                    <button onClick={() => shareOne(s)} className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-accent">
                      <Share2 className="h-3.5 w-3.5" /> مشاركة
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
