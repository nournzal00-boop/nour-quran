import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BookOpen, Search, Sparkles, ArrowLeft, Bookmark, Compass, Clock } from "lucide-react";
import { fetchRandomAyah, fetchSurahs } from "@/lib/quran-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "نور — القرآن الكريم بخط عثماني" },
      { name: "description", content: "ابدأ رحلتك مع القرآن الكريم: قراءة بخط عثماني، تفسير مبسّط، تلاوات لكبار القراء، أذكار، سبحة، ومواقيت الصلاة." },
    ],
  }),
  component: Home,
});

interface LastRead {
  surah: number;
  ayah: number;
  name: string;
}

function Home() {
  const [q, setQ] = useState("");
  const [lastRead, setLastRead] = useState<LastRead | null>(null);
  const { data: ayah } = useQuery({ queryKey: ["random-ayah"], queryFn: fetchRandomAyah, staleTime: 0, refetchOnMount: true });
  const { data: surahs } = useQuery({ queryKey: ["surahs"], queryFn: fetchSurahs });

  useEffect(() => {
    const raw = localStorage.getItem("last-read");
    if (raw) try { setLastRead(JSON.parse(raw)); } catch {}
  }, []);

  const results = q.trim().length > 0 && surahs
    ? surahs.filter(s => s.name.includes(q) || s.englishName.toLowerCase().includes(q.toLowerCase()) || String(s.number) === q.trim()).slice(0, 6)
    : [];

  return (
    <div className="bg-gradient-hero">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center relative">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-card/60 px-4 py-1.5 text-xs font-medium text-emerald-deep backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            منصة نور لقراءة القرآن الكريم
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight">
            اقرأ. تدبّر.
            <span className="block bg-gradient-emerald bg-clip-text text-transparent mt-2">اطمئن بذكر الله</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            رفيقك اليومي لقراءة القرآن الكريم بخط عثماني أنيق، مع التفسير الميسّر، وتلاوات لكبار القراء، والأذكار والمواقيت.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/quran"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-emerald px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-elegant hover:shadow-gold transition-all hover:-translate-y-0.5"
            >
              <BookOpen className="h-4 w-4" />
              ابدأ القراءة
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              to="/athkar"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/70 backdrop-blur px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-accent transition-all"
            >
              أذكار اليوم
            </Link>
          </div>

          {/* Search */}
          <div className="mx-auto mt-10 max-w-xl relative">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث عن سورة… (مثال: البقرة أو 2)"
                className="w-full rounded-2xl border border-border bg-card/80 backdrop-blur px-12 py-4 text-sm text-foreground shadow-soft placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {results.length > 0 && (
              <div className="absolute z-20 mt-2 w-full rounded-2xl border border-border bg-popover shadow-elegant overflow-hidden text-right">
                {results.map((s) => (
                  <Link
                    key={s.number}
                    to="/quran/$surah"
                    params={{ surah: String(s.number) }}
                    onClick={() => setQ("")}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent transition-colors border-b border-border/50 last:border-0"
                  >
                    <div>
                      <div className="font-display text-base font-bold">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.englishName} • {s.numberOfAyahs} آية</div>
                    </div>
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-gold text-gold-foreground text-xs font-bold">
                      {s.number}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Random Ayah */}
      <section className="mx-auto max-w-4xl px-4 pb-12">
        <div className="relative rounded-3xl border border-gold/20 bg-card shadow-elegant p-8 md:p-12 overflow-hidden">
          <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-gradient-gold opacity-10 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-gradient-emerald opacity-10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 text-xs font-semibold text-gold-foreground/70 uppercase tracking-wider">
              <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold to-transparent" />
              آية اليوم
              <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold to-transparent" />
            </div>
            {ayah ? (
              <>
                <p className="font-quran text-3xl md:text-4xl text-center text-foreground mt-8 leading-[2.4]">
                  {ayah.text}
                </p>
                <div className="mt-6 text-center">
                  <Link
                    to="/quran/$surah"
                    params={{ surah: String(ayah.surah.number) }}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-emerald-deep hover:bg-primary hover:text-primary-foreground transition"
                  >
                    سورة {ayah.surah.name} — آية {ayah.numberInSurah}
                  </Link>
                </div>
                <p className="mt-6 text-sm md:text-base text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto">
                  {ayah.translation}
                </p>
              </>
            ) : (
              <div className="h-40 grid place-items-center text-muted-foreground text-sm">جارٍ تحميل آية اليوم…</div>
            )}
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mx-auto max-w-4xl px-4 pb-20 grid grid-cols-1 md:grid-cols-3 gap-4">
        {lastRead && (
          <Link to="/quran/$surah" params={{ surah: String(lastRead.surah) }} className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant transition-all hover:-translate-y-1">
            <Bookmark className="h-6 w-6 text-gold mb-3" />
            <div className="text-xs text-muted-foreground">تابع القراءة</div>
            <div className="font-display text-xl font-bold mt-1">سورة {lastRead.name}</div>
            <div className="text-xs text-muted-foreground mt-1">الآية {lastRead.ayah}</div>
          </Link>
        )}
        {!lastRead && (
          <Link to="/quran" className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant transition-all hover:-translate-y-1">
            <BookOpen className="h-6 w-6 text-primary mb-3" />
            <div className="font-display text-xl font-bold">تصفح السور</div>
            <div className="text-xs text-muted-foreground mt-1">114 سورة</div>
          </Link>
        )}
        <Link to="/prayer-times" className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant transition-all hover:-translate-y-1">
          <Clock className="h-6 w-6 text-primary mb-3" />
          <div className="font-display text-xl font-bold">مواقيت الصلاة</div>
          <div className="text-xs text-muted-foreground mt-1">حسب موقعك</div>
        </Link>
        <Link to="/qibla" className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant transition-all hover:-translate-y-1">
          <Compass className="h-6 w-6 text-gold mb-3" />
          <div className="font-display text-xl font-bold">اتجاه القبلة</div>
          <div className="text-xs text-muted-foreground mt-1">بوصلة تفاعلية</div>
        </Link>
      </section>
    </div>
  );
}
