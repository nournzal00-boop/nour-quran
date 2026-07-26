import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/sebha")({
  head: () => ({
    meta: [
      { title: "السبحة الإلكترونية | نور" },
      { name: "description", content: "سبحة رقمية أنيقة مع عدّاد تلقائي وحفظ آخر عدد، لتذكّر الله في أي وقت." },
    ],
  }),
  component: Sebha,
});

const DHIKRS = [
  "سُبْحَانَ اللَّهِ",
  "الْحَمْدُ لِلَّهِ",
  "اللَّهُ أَكْبَرُ",
  "لَا إِلَهَ إِلَّا اللَّهُ",
  "أَسْتَغْفِرُ اللَّهَ",
  "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
  "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
];

function Sebha() {
  const [count, setCount] = useState(0);
  const [dhikr, setDhikr] = useState(DHIKRS[0]);
  const [target, setTarget] = useState(33);

  useEffect(() => {
    const raw = localStorage.getItem("sebha");
    if (raw) try {
      const s = JSON.parse(raw);
      setCount(s.count ?? 0); setDhikr(s.dhikr ?? DHIKRS[0]); setTarget(s.target ?? 33);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("sebha", JSON.stringify({ count, dhikr, target }));
  }, [count, dhikr, target]);

  const tap = () => {
    setCount(c => c + 1);
    if (navigator.vibrate) navigator.vibrate(20);
  };
  const reset = () => setCount(0);

  const progress = Math.min((count / target) * 100, 100);
  const rounds = Math.floor(count / target);

  return (
    <div className="bg-gradient-hero min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display text-3xl font-bold mb-2">السبحة الإلكترونية</h1>
        <p className="text-sm text-muted-foreground mb-8">اضغط على الدائرة لتذكّر الله</p>

        <select
          value={dhikr}
          onChange={e => setDhikr(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-center font-display text-lg mb-4 shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {DHIKRS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <div className="flex items-center justify-center gap-2 mb-6 text-xs">
          <span className="text-muted-foreground">الهدف:</span>
          {[33, 99, 100, 500].map(t => (
            <button
              key={t}
              onClick={() => setTarget(t)}
              className={`rounded-lg px-3 py-1.5 font-bold transition ${target === t ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-accent"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={tap}
          className="relative mx-auto grid h-64 w-64 place-items-center rounded-full bg-gradient-emerald shadow-elegant active:scale-95 transition-transform"
          style={{
            background: `conic-gradient(var(--gold) ${progress}%, transparent ${progress}%), var(--gradient-emerald)`,
          }}
        >
          <div className="grid h-56 w-56 place-items-center rounded-full bg-card">
            <div className="text-6xl font-bold text-emerald-deep font-display">{count % target}</div>
            <div className="mt-2 text-xs text-muted-foreground">/ {target}</div>
            <div className="mt-3 font-display text-base text-foreground max-w-[180px]">{dhikr}</div>
          </div>
        </button>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-gold">{rounds}</div>
            <div className="text-xs text-muted-foreground">دورات</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{count}</div>
            <div className="text-xs text-muted-foreground">إجمالي</div>
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 hover:bg-accent"
          >
            <RotateCcw className="h-4 w-4" /> صفر
          </button>
        </div>
      </div>
    </div>
  );
}
