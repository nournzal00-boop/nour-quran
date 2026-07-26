import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight, ChevronLeft, Play, Pause, Copy, Share2, Bookmark,
  BookOpen, Type, Volume2, Repeat,
} from "lucide-react";
import {
  fetchSurahs, fetchSurahMultiple, ayahAudioUrl, RECITERS, TAFSIRS,
} from "@/lib/quran-api";

export const Route = createFileRoute("/quran/$surah")({
  head: ({ params }) => ({
    meta: [
      { title: `سورة رقم ${params.surah} — نور` },
      { name: "description", content: "اقرأ سورة من القرآن الكريم بخط عثماني، مع التفسير الميسّر والتلاوة الصوتية." },
    ],
  }),
  component: SurahReader,
});

function SurahReader() {
  const { surah } = Route.useParams();
  const num = Number(surah);

  const [fontSize, setFontSize] = useState(32);
  const [showTafsir, setShowTafsir] = useState(true);
  const [tafsirId, setTafsirId] = useState(TAFSIRS[0].id);
  const [reciterId, setReciterId] = useState(RECITERS[0].id);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [repeatMode, setRepeatMode] = useState(false);
  const [playingAll, setPlayingAll] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: surahs } = useQuery({ queryKey: ["surahs"], queryFn: fetchSurahs });
  const meta = surahs?.find(s => s.number === num);

  const { data, isLoading } = useQuery({
    queryKey: ["surah-full", num, tafsirId],
    queryFn: () => fetchSurahMultiple(num, ["quran-uthmani", tafsirId]),
    enabled: !isNaN(num),
  });

  const arabic = data?.[0];
  const tafsir = data?.[1];

  // Load font/bookmark prefs
  useEffect(() => {
    const fs = localStorage.getItem("font-size");
    if (fs) setFontSize(Number(fs));
    const r = localStorage.getItem("reciter"); if (r) setReciterId(r);
    const t = localStorage.getItem("tafsir"); if (t) setTafsirId(t);
    const bm = localStorage.getItem(`bookmarks-${num}`);
    if (bm) try { setBookmarks(new Set(JSON.parse(bm))); } catch {}
  }, [num]);

  useEffect(() => { localStorage.setItem("font-size", String(fontSize)); }, [fontSize]);
  useEffect(() => { localStorage.setItem("reciter", reciterId); }, [reciterId]);
  useEffect(() => { localStorage.setItem("tafsir", tafsirId); }, [tafsirId]);

  // Save last read
  useEffect(() => {
    if (arabic && meta) {
      localStorage.setItem("last-read", JSON.stringify({
        surah: num, ayah: 1, name: meta.name,
      }));
    }
  }, [arabic, meta, num]);

  const playAyah = (globalNum: number, numInSurah: number) => {
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(ayahAudioUrl(globalNum, reciterId));
    audioRef.current = audio;
    setPlayingAyah(numInSurah);
    audio.play().catch(() => setPlayingAyah(null));
    audio.onended = () => {
      if (repeatMode) {
        audio.currentTime = 0;
        audio.play();
        return;
      }
      if (playingAll && arabic) {
        const next = arabic.ayahs.find(a => a.numberInSurah === numInSurah + 1);
        if (next) {
          playAyah(next.number, next.numberInSurah);
          setTimeout(() => {
            document.getElementById(`ayah-${next.numberInSurah}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
          return;
        }
      }
      setPlayingAyah(null);
    };
  };

  const stopAll = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlayingAyah(null);
    setPlayingAll(false);
  };

  const playFullSurah = () => {
    if (!arabic) return;
    setPlayingAll(true);
    const first = arabic.ayahs[0];
    playAyah(first.number, first.numberInSurah);
  };

  const toggleBookmark = (n: number) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n); else next.add(n);
      localStorage.setItem(`bookmarks-${num}`, JSON.stringify([...next]));
      return next;
    });
  };

  const copyAyah = (text: string, n: number) => {
    const full = `${text} ﴿${n}﴾ — سورة ${meta?.name ?? ""}`;
    navigator.clipboard.writeText(full);
  };

  const shareAyah = async (text: string, n: number) => {
    const full = `${text} ﴿${n}﴾ — سورة ${meta?.name ?? ""}`;
    if (navigator.share) {
      try { await navigator.share({ text: full }); } catch {}
    } else {
      copyAyah(text, n);
    }
  };

  const ayahMap = useMemo(() => {
    const map = new Map<number, string>();
    tafsir?.ayahs.forEach(a => map.set(a.numberInSurah, a.text));
    return map;
  }, [tafsir]);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  return (
    <div className="bg-gradient-hero min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Nav between surahs */}
        <div className="flex items-center justify-between mb-4 text-sm">
          {num > 1 ? (
            <Link to="/quran/$surah" params={{ surah: String(num - 1) }} className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent">
              <ChevronRight className="h-4 w-4" /> السابقة
            </Link>
          ) : <span />}
          <Link to="/quran" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <BookOpen className="h-4 w-4" /> فهرس السور
          </Link>
          {num < 114 ? (
            <Link to="/quran/$surah" params={{ surah: String(num + 1) }} className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 hover:bg-accent">
              التالية <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : <span />}
        </div>

        {/* Surah header */}
        <div className="relative rounded-3xl border border-gold/30 bg-card shadow-elegant overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-emerald opacity-[0.04]" />
          <div className="relative px-6 py-8 text-center">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold text-gold-foreground font-bold shadow-gold">
              {num}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              سورة {meta?.name}
            </h1>
            {meta && (
              <p className="mt-2 text-xs text-muted-foreground">
                {meta.englishName} • {meta.numberOfAyahs} آية • {meta.revelationType === "Meccan" ? "مكية" : "مدنية"}
              </p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="sticky top-16 z-30 rounded-2xl border border-border bg-card/90 backdrop-blur-xl shadow-soft mb-6 px-3 py-3 flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={playingAll ? stopAll : playFullSurah}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2 font-semibold hover:opacity-90"
          >
            {playingAll ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playingAll ? "إيقاف" : "تشغيل السورة"}
          </button>

          <button
            onClick={() => setRepeatMode(v => !v)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-semibold transition ${repeatMode ? "bg-accent border-primary text-emerald-deep" : "border-border bg-card"}`}
            title="تكرار الآية"
          >
            <Repeat className="h-3.5 w-3.5" /> تكرار
          </button>

          <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1">
            <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={reciterId}
              onChange={e => setReciterId(e.target.value)}
              className="bg-transparent text-xs font-medium outline-none py-1"
            >
              {RECITERS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={tafsirId}
              onChange={e => setTafsirId(e.target.value)}
              className="bg-transparent text-xs font-medium outline-none py-1"
            >
              {TAFSIRS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <button
            onClick={() => setShowTafsir(v => !v)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-semibold ${showTafsir ? "bg-accent border-primary text-emerald-deep" : "border-border bg-card"}`}
          >
            {showTafsir ? "إخفاء التفسير" : "إظهار التفسير"}
          </button>

          <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1">
            <Type className="h-3.5 w-3.5 text-muted-foreground" />
            <button onClick={() => setFontSize(s => Math.max(20, s - 2))} className="px-1.5 hover:text-primary font-bold">-</button>
            <span className="text-xs w-6 text-center">{fontSize}</span>
            <button onClick={() => setFontSize(s => Math.min(56, s + 2))} className="px-1.5 hover:text-primary font-bold">+</button>
          </div>
        </div>

        {/* Basmala */}
        {arabic && num !== 1 && num !== 9 && (
          <div className="text-center mb-8">
            <p className="font-quran text-3xl md:text-4xl text-emerald-deep">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        )}

        {/* Ayahs */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {arabic?.ayahs.map((a) => {
              const isPlaying = playingAyah === a.numberInSurah;
              const isBookmarked = bookmarks.has(a.numberInSurah);
              // Strip basmala from first ayah for surahs other than Al-Fatihah
              let text = a.text;
              if (num !== 1 && a.numberInSurah === 1) {
                text = text.replace(/^بِسْمِ\s*اللَّـهِ\s*الرَّحْمَـٰنِ\s*الرَّحِيمِ\s*/, "");
              }
              return (
                <article
                  key={a.number}
                  id={`ayah-${a.numberInSurah}`}
                  className={`group rounded-2xl border p-6 transition-all ${
                    isPlaying
                      ? "border-primary bg-accent shadow-elegant"
                      : "border-border bg-card hover:border-gold/40 shadow-soft"
                  }`}
                >
                  <p
                    className="font-quran text-foreground leading-[2.4]"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {text}
                    <span className="inline-flex mx-2 h-8 w-8 items-center justify-center rounded-full bg-gradient-gold text-gold-foreground text-xs font-bold align-middle">
                      {a.numberInSurah}
                    </span>
                  </p>

                  {showTafsir && ayahMap.get(a.numberInSurah) && (
                    <div className="mt-5 pt-5 border-t border-border/50">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-gold-foreground/70 mb-2">
                        {TAFSIRS.find(t => t.id === tafsirId)?.name}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {ayahMap.get(a.numberInSurah)}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-1 text-xs">
                    <button
                      onClick={() => isPlaying ? stopAll() : playAyah(a.number, a.numberInSurah)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 hover:bg-accent text-muted-foreground hover:text-foreground"
                    >
                      {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      <span className="hidden sm:inline">استماع</span>
                    </button>
                    <button
                      onClick={() => toggleBookmark(a.numberInSurah)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 hover:bg-accent ${isBookmarked ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-current" : ""}`} />
                      <span className="hidden sm:inline">حفظ</span>
                    </button>
                    <button
                      onClick={() => copyAyah(text, a.numberInSurah)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 hover:bg-accent text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">نسخ</span>
                    </button>
                    <button
                      onClick={() => shareAyah(text, a.numberInSurah)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 hover:bg-accent text-muted-foreground hover:text-foreground"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">مشاركة</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
