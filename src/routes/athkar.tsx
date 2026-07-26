import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Sun, Moon, Bed, Star } from "lucide-react";

export const Route = createFileRoute("/athkar")({
  head: () => ({
    meta: [
      { title: "الأذكار — أذكار الصباح والمساء والنوم | نور" },
      { name: "description", content: "أذكار الصباح والمساء والنوم وأذكار بعد الصلاة، من الكتاب والسنة، مع عداد للتكرار." },
    ],
  }),
  component: Athkar,
});

interface Dhikr { text: string; count: number; source?: string; }

const CATEGORIES: { id: string; label: string; icon: any; items: Dhikr[] }[] = [
  {
    id: "morning",
    label: "أذكار الصباح",
    icon: Sun,
    items: [
      { text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ…", count: 1, source: "آية الكرسي" },
      { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ.", count: 1 },
      { text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.", count: 1 },
      { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.", count: 100 },
      { text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", count: 10 },
      { text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ.", count: 100 },
    ],
  },
  {
    id: "evening",
    label: "أذكار المساء",
    icon: Moon,
    items: [
      { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ.", count: 1 },
      { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.", count: 1 },
      { text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.", count: 3 },
      { text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.", count: 3 },
    ],
  },
  {
    id: "sleep",
    label: "أذكار النوم",
    icon: Bed,
    items: [
      { text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.", count: 1 },
      { text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.", count: 3 },
      { text: "سُبْحَانَ اللَّهِ (33) وَالْحَمْدُ لِلَّهِ (33) وَاللَّهُ أَكْبَرُ (34).", count: 1 },
    ],
  },
  {
    id: "prayer",
    label: "أذكار بعد الصلاة",
    icon: Star,
    items: [
      { text: "أَسْتَغْفِرُ اللَّهَ.", count: 3 },
      { text: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.", count: 1 },
      { text: "سُبْحَانَ اللَّهِ.", count: 33 },
      { text: "الْحَمْدُ لِلَّهِ.", count: 33 },
      { text: "اللَّهُ أَكْبَرُ.", count: 34 },
    ],
  },
];

function Athkar() {
  const [active, setActive] = useState(CATEGORIES[0].id);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const raw = localStorage.getItem("athkar-counts");
    if (raw) try { setCounts(JSON.parse(raw)); } catch {}
  }, []);

  const cat = CATEGORIES.find(c => c.id === active)!;

  const tap = (key: string, max: number) => {
    setCounts(prev => {
      const next = { ...prev, [key]: Math.min((prev[key] ?? 0) + 1, max) };
      localStorage.setItem("athkar-counts", JSON.stringify(next));
      return next;
    });
  };

  const reset = (key: string) => {
    setCounts(prev => {
      const next = { ...prev, [key]: 0 };
      localStorage.setItem("athkar-counts", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="bg-gradient-hero min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold">الأذكار</h1>
          <p className="mt-2 text-sm text-muted-foreground">حصن المسلم اليومي</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map(c => {
            const Icon = c.icon;
            const isActive = c.id === active;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-gradient-emerald text-primary-foreground border-transparent shadow-soft"
                    : "bg-card border-border hover:bg-accent"
                }`}
              >
                <Icon className="h-4 w-4" /> {c.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {cat.items.map((d, i) => {
            const key = `${cat.id}-${i}`;
            const current = counts[key] ?? 0;
            const done = current >= d.count;
            return (
              <div key={key} className={`rounded-2xl border p-5 shadow-soft transition ${done ? "bg-accent border-primary/40" : "bg-card border-border"}`}>
                <p className="font-display text-lg leading-loose text-foreground">{d.text}</p>
                {d.source && <p className="text-xs text-muted-foreground mt-2">{d.source}</p>}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => tap(key, d.count)}
                    disabled={done}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                      done
                        ? "bg-primary text-primary-foreground"
                        : "bg-gradient-gold text-gold-foreground shadow-gold hover:opacity-90"
                    }`}
                  >
                    {done ? <><Check className="h-4 w-4" /> تم</> : `${current} / ${d.count}`}
                  </button>
                  {current > 0 && (
                    <button onClick={() => reset(key)} className="text-xs text-muted-foreground hover:text-foreground">
                      إعادة
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
