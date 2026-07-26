import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { fetchSurahs } from "@/lib/quran-api";

export const Route = createFileRoute("/quran/")({
  head: () => ({
    meta: [
      { title: "القرآن الكريم — 114 سورة | نور" },
      { name: "description", content: "تصفّح جميع سور القرآن الكريم الـ114، مرتبة، مع رقم السورة وعدد آياتها ومكان نزولها." },
    ],
  }),
  component: SurahList,
});

function SurahList() {
  const { data, isLoading } = useQuery({ queryKey: ["surahs"], queryFn: fetchSurahs });
  const [q, setQ] = useState("");

  const filtered = data?.filter(s =>
    !q.trim() ||
    s.name.includes(q) ||
    s.englishName.toLowerCase().includes(q.toLowerCase()) ||
    String(s.number) === q.trim()
  ) ?? [];

  return (
    <div className="bg-gradient-hero min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">القرآن الكريم</h1>
          <p className="mt-2 text-sm text-muted-foreground">اختر السورة التي تريد قراءتها</p>
        </div>

        <div className="relative mx-auto max-w-xl mb-8">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن سورة…"
            className="w-full rounded-2xl border border-border bg-card px-12 py-3.5 text-sm shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((s) => (
              <Link
                key={s.number}
                to="/quran/$surah"
                params={{ surah: String(s.number) }}
                className="group relative rounded-2xl border border-border bg-card p-4 shadow-soft hover:shadow-elegant hover:border-gold/40 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-gold text-gold-foreground text-sm font-bold shadow-gold">
                    {s.number}
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-bold text-foreground">{s.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{s.englishName}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{s.numberOfAyahs} آية</span>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-emerald-deep font-medium">
                    {s.revelationType === "Meccan" ? "مكية" : "مدنية"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
