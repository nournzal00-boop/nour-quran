import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, Search, Sparkles, ArrowLeft, Bookmark, Compass, Clock,
  Hand, CircleDot, BookMarked, Feather, HandHeart,
} from "lucide-react";
import { fetchRandomAyah, fetchSurahs } from "@/lib/quran-api";
import { getSunnahOfDay } from "@/lib/sunnah-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "نور القرآن — القرآن الكريم بخط عثماني" },
      { name: "description", content: "ابدأ رحلتك مع القرآن الكريم: قراءة بخط عثماني، تفسير مبسّط، تلاوات لكبار القراء، أذكار، سبحة، مواقيت الصلاة، التجويد، والسنن النبوية." },
    ],
  }),
  component: Home,
});

interface LastRead { surah: number; ayah: number; name: string }

const QUICK = [
  { to: "/quran", label: "القرآن الكريم", desc: "114 سورة", icon: BookOpen },
  { to: "/tajweed", label: "مِئْذَنَةُ التجويد", desc: "أحكام ومخارج", icon: Feather },
  { to: "/sunnah", label: "سُنن الحبيب ﷺ", desc: "أحيِ السُّنة", icon: HandHeart },
  { to: "/athkar", label: "الأذكار", desc: "الصباح والمساء", icon: Hand },
  { to: "/prayer-times", label: "مواقيت الصلاة", desc: "حسب موقعك", icon: Clock },
  { to: "/sebha", label: "السبحة الإلكترونية", desc: "عدّاد ذكي", icon: CircleDot },
  { to: "/qibla", label: "اتجاه القبلة", desc: "بوصلة تفاعلية", icon: Compass },
  { to: "/hadith", label: "الأحاديث النبوية", desc: "مع الشرح", icon: BookMarked },
] as const;

function Home() {
  const [q, setQ] = useState("");
  const [lastRead, setLastRead] = useState<LastRead | null>(null);
  const { data: ayah } = useQuery({ queryKey: ["random-ayah"], queryFn: fetchRandomAyah, staleTime: 0, refetchOnMount: true });
  const { data: surahs } = useQuery({ queryKey: ["surahs"], queryFn: fetchSurahs });
  const sunnah = useMemo(() => getSunnahOfDay(), []);


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
        <div className="mx-auto max-w-4xl px-4 pt-12 md:pt-16 pb-8 text-center relative">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-card/60 px-4 py-1.5 text-xs font-medium text-emerald-deep backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            منصة نور لقراءة القرآن الكريم
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight">
            اقرأ. تدبّر.
            <span className="block bg-gradient-emerald bg-clip-text text-transparent mt-2">اطمئن بذكر الله</span>
          </h1>

          {/* Islamic geometric divider (replaces empty gap) */}
          <div className="mx-auto mt-6 flex items-center justify-center gap-3 max-w-sm" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/60 to-transparent" />
            <svg viewBox="0 0 40 40" className="h-6 w-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M20 3 L27 12 L37 12 L30 20 L37 28 L27 28 L20 37 L13 28 L3 28 L10 20 L3 12 L13 12 Z" />
              <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.7" />
            </svg>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/60 to-transparent" />
          </div>

          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            رفيقك اليومي لقراءة القرآن الكريم بخط عثماني أنيق، مع التفسير الميسّر، وتلاوات لكبار القراء، والأذكار والمواقيت.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/quran"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-emerald px-7 py-3.5 text-sm font-bold text-[#F3E5AB] shadow-elegant hover:shadow-gold transition-all hover:-translate-y-0.5"
            >
              <BookOpen className="h-4 w-4" />
              ابدأ القراءة
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              to="/athkar"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/80 backdrop-blur px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-accent transition-all"
            >
              أذكار اليوم
            </Link>
          </div>

          {/* Search */}
          <div className="mx-auto mt-10 max-w-xl relative">
            <div className="relative group">
              <Search className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث عن سورة… (مثال: البقرة أو 2)"
                className="w-full rounded-2xl border border-border bg-card/90 backdrop-blur px-12 py-4 text-sm text-foreground shadow-soft placeholder:text-muted-foreground/80 transition-all focus:outline-none focus:border-gold/60 focus:bg-card focus:shadow-gold focus:ring-4 focus:ring-gold/15"
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

      {/* Quick Access Grid */}
      <section className="mx-auto max-w-5xl px-4 pt-4 pb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">وصول سريع</h2>
          <span className="text-xs text-muted-foreground">اختر ما تحتاجه الآن</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4">
          {QUICK.map(({ to, label, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 md:p-5 shadow-soft hover:shadow-elegant hover:border-gold/40 transition-all hover:-translate-y-0.5"
            >
              <div className="absolute -top-8 -left-8 h-24 w-24 rounded-full bg-gradient-gold opacity-0 group-hover:opacity-10 blur-2xl transition-opacity" />
              <div className="relative flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold/25 to-gold/10 text-gold ring-1 ring-gold/30 shadow-soft">
                  <Icon className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-base md:text-lg font-bold text-foreground leading-tight">{label}</div>
                  <div className="text-[11px] md:text-xs text-muted-foreground mt-0.5">{desc}</div>
                </div>
              </div>
            </Link>
          ))}
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
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-emerald-deep hover:bg-primary hover:text-[#F3E5AB] transition"
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

      {/* Sunnah of the Day */}
      <section className="mx-auto max-w-4xl px-4 pb-12">
        <Link
          to="/sunnah"
          className="group relative block overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-l from-emerald-deep/95 via-emerald-deep to-emerald-deep p-6 md:p-8 shadow-elegant hover:shadow-gold transition-all"
        >
          <div className="absolute -top-16 -left-16 h-52 w-52 rounded-full bg-gradient-gold opacity-20 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,#F3E5AB_1px,transparent_0)] [background-size:20px_20px]" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#F3E5AB]/80">
              <HandHeart className="h-3.5 w-3.5" /> سُنة اليوم
            </div>
            <h3 className="mt-3 font-display text-2xl md:text-3xl font-bold text-[#F3E5AB]">{sunnah.title}</h3>
            <p className="mt-3 font-display text-base md:text-lg leading-loose text-[#F3E5AB]/90 line-clamp-3">
              {sunnah.evidence}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-[#F3E5AB]/70">— {sunnah.source}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold text-gold-foreground px-3 py-1 text-xs font-bold group-hover:gap-3 transition-all">
                طبّق السُّنة <ArrowLeft className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Link>
      </section>


      {/* Continue reading */}
      {lastRead && (
        <section className="mx-auto max-w-4xl px-4 pb-16">
          <Link
            to="/quran/$surah"
            params={{ surah: String(lastRead.surah) }}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elegant hover:border-gold/40 transition-all"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-gold text-gold-foreground shadow-gold shrink-0">
              <Bookmark className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground">تابع القراءة</div>
              <div className="font-display text-lg font-bold text-foreground truncate">
                سورة {lastRead.name} — الآية {lastRead.ayah}
              </div>
            </div>
            <ArrowLeft className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-x-1" />
          </Link>
        </section>
      )}
    </div>
  );
}
