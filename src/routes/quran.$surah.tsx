import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronRight, ChevronLeft, Play, Pause, Copy, Share2, Bookmark,
  BookOpen, Type, Volume2, Repeat, Settings2, X, Maximize2, Minimize2,
} from "lucide-react";
import {
  fetchSurahs, fetchSurahMultiple, ayahAudioUrl, RECITERS, TAFSIRS,
} from "@/lib/quran-api";

export const Route = createFileRoute("/quran/$surah")({
  head: ({ params }) => ({
    meta: [
      { title: `سورة رقم ${params.surah} — نور` },
      { name: "description", content: "اقرأ سورة من القرآن الكريم بخط عثماني مصحفي مستمر، مع التفسير والتلاوة الصوتية." },
    ],
  }),
  component: SurahReader,
});

function SurahReader() {
  const { surah } = Route.useParams();
  const num = Number(surah);

  const [fontSize, setFontSize] = useState(34);
  const [showTafsir, setShowTafsir] = useState(false);
  const [tafsirId, setTafsirId] = useState(TAFSIRS[0].id);
  const [reciterId, setReciterId] = useState(RECITERS[0].id);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [repeatMode, setRepeatMode] = useState(false);
  const [playingAll, setPlayingAll] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<number | null>(null);
  const [audioOpen, setAudioOpen] = useState(false);
  const [immersive, setImmersive] = useState(false);
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

  useEffect(() => {
    const fs = localStorage.getItem("font-size"); if (fs) setFontSize(Number(fs));
    const r = localStorage.getItem("reciter"); if (r) setReciterId(r);
    const t = localStorage.getItem("tafsir"); if (t) setTafsirId(t);
    const bm = localStorage.getItem(`bookmarks-${num}`);
    if (bm) try { setBookmarks(new Set(JSON.parse(bm))); } catch {}
  }, [num]);

  useEffect(() => { localStorage.setItem("font-size", String(fontSize)); }, [fontSize]);
  useEffect(() => { localStorage.setItem("reciter", reciterId); }, [reciterId]);
  useEffect(() => { localStorage.setItem("tafsir", tafsirId); }, [tafsirId]);

  useEffect(() => {
    if (arabic && meta) {
      localStorage.setItem("last-read", JSON.stringify({ surah: num, ayah: 1, name: meta.name }));
    }
  }, [arabic, meta, num]);

  const playAyah = (globalNum: number, numInSurah: number) => {
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(ayahAudioUrl(globalNum, reciterId));
    audioRef.current = audio;
    setPlayingAyah(numInSurah);
    audio.play().catch(() => setPlayingAyah(null));
    audio.onended = () => {
      if (repeatMode) { audio.currentTime = 0; audio.play(); return; }
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

  const getAyahText = (n: number) => {
    const a = arabic?.ayahs.find(x => x.numberInSurah === n);
    if (!a) return "";
    let text = a.text;
    if (num !== 1 && a.numberInSurah === 1) {
      text = text.replace(/^بِسْمِ\s*اللَّـهِ\s*الرَّحْمَـٰنِ\s*الرَّحِيمِ\s*/, "");
    }
    return text;
  };

  const copyAyah = (n: number) => {
    const t = getAyahText(n);
    navigator.clipboard.writeText(`${t} ﴿${n}﴾ — سورة ${meta?.name ?? ""}`);
  };
  const shareAyah = async (n: number) => {
    const full = `${getAyahText(n)} ﴿${n}﴾ — سورة ${meta?.name ?? ""}`;
    if (navigator.share) { try { await navigator.share({ text: full }); } catch {} }
    else navigator.clipboard.writeText(full);
  };

  const ayahMap = useMemo(() => {
    const map = new Map<number, string>();
    tafsir?.ayahs.forEach(a => map.set(a.numberInSurah, a.text));
    return map;
  }, [tafsir]);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const pageBg = immersive ? "bg-[#111111]" : "bg-gradient-hero";
  const pageText = immersive ? "text-[#f5efe0]" : "text-foreground";

  return (
    <div className={`${pageBg} min-h-[calc(100vh-4rem)] transition-colors`}>
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Nav between surahs */}
        {!immersive && (
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
        )}

        {/* Surah header */}
        {!immersive && (
          <div className="relative rounded-3xl border border-gold/30 bg-card shadow-elegant overflow-hidden mb-4">
            <div className="absolute inset-0 bg-gradient-emerald opacity-[0.04]" />
            <div className="relative px-6 py-8 text-center">
              <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold text-gold-foreground font-bold shadow-gold">
                {num}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">سورة {meta?.name}</h1>
              {meta && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {meta.englishName} • {meta.numberOfAyahs} آية • {meta.revelationType === "Meccan" ? "مكية" : "مدنية"}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Floating toolbar */}
        <div className={`sticky top-16 z-30 rounded-2xl border shadow-soft mb-6 px-3 py-2.5 flex flex-wrap items-center gap-2 text-xs ${immersive ? "border-white/10 bg-black/70 backdrop-blur-xl text-[#f5efe0]" : "border-border bg-card/90 backdrop-blur-xl"}`}>
          <button
            onClick={() => setAudioOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-emerald text-[#F3E5AB] px-3 py-2 font-bold hover:opacity-90"
          >
            <Volume2 className="h-3.5 w-3.5" /> التلاوة الصوتية
            {playingAll && <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />}
          </button>

          <button
            onClick={() => setShowTafsir(v => !v)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-semibold ${showTafsir ? "bg-accent border-primary text-emerald-deep" : (immersive ? "border-white/20 bg-white/5" : "border-border bg-card")}`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            {showTafsir ? "إخفاء التفسير" : "التفسير"}
          </button>

          <div className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 ${immersive ? "border-white/20 bg-white/5" : "border-border bg-card"}`}>
            <Type className="h-3.5 w-3.5 opacity-70" />
            <button onClick={() => setFontSize(s => Math.max(22, s - 2))} className="px-1.5 font-bold hover:opacity-70">-</button>
            <span className="text-xs w-6 text-center">{fontSize}</span>
            <button onClick={() => setFontSize(s => Math.min(64, s + 2))} className="px-1.5 font-bold hover:opacity-70">+</button>
          </div>

          <button
            onClick={() => setImmersive(v => !v)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-semibold ${immersive ? "border-white/20 bg-white/5" : "border-border bg-card"}`}
            title="وضع المصحف"
          >
            {immersive ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            وضع المصحف
          </button>
        </div>

        {/* Mushaf continuous page */}
        {isLoading ? (
          <div className="h-96 rounded-3xl bg-card/60 animate-pulse" />
        ) : arabic && (
          <div
            className={`relative rounded-[2rem] border shadow-elegant overflow-hidden ${immersive
              ? "border-[#c7a86a]/30 bg-[#111111]"
              : "border-gold/30 bg-[#fbf6ea]"}`}
          >
            {/* decorative border */}
            <div className={`absolute inset-3 rounded-[1.5rem] pointer-events-none border ${immersive ? "border-[#c7a86a]/20" : "border-gold/30"}`} />

            <div className="relative px-6 md:px-14 py-10 md:py-14">
              {/* Basmala */}
              {num !== 1 && num !== 9 && (
                <div className="text-center mb-6">
                  <p
                    className={`font-quran ${immersive ? "text-[#e9dfbf]" : "text-emerald-deep"}`}
                    style={{ fontSize: `${Math.max(fontSize - 2, 26)}px`, lineHeight: 2 }}
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <div className="mt-3 mx-auto h-px w-40 bg-gradient-to-l from-transparent via-gold/60 to-transparent" />
                </div>
              )}

              {/* Continuous flowing text */}
              <p
                className={`font-quran text-justify ${immersive ? "text-[#f5efe0]" : "text-[#1c1c1c]"}`}
                style={{ fontSize: `${fontSize}px`, lineHeight: 2.55, textAlignLast: "center", wordSpacing: "0.05em" }}
              >
                {arabic.ayahs.map((a) => {
                  const text = getAyahText(a.numberInSurah);
                  const isPlaying = playingAyah === a.numberInSurah;
                  const isSelected = selected === a.numberInSurah;
                  const isBookmarked = bookmarks.has(a.numberInSurah);
                  return (
                    <span key={a.number} id={`ayah-${a.numberInSurah}`}>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelected(isSelected ? null : a.numberInSurah)}
                        className={`cursor-pointer rounded-md transition-colors ${
                          isPlaying
                            ? (immersive ? "bg-[#c7a86a]/20 text-[#f7e8b0]" : "bg-gold/20")
                            : isSelected
                              ? (immersive ? "bg-white/10" : "bg-gold/10")
                              : "hover:bg-black/5"
                        }`}
                      >
                        {text}
                      </span>
                      {/* Ayah end circle */}
                      <span
                        onClick={() => setSelected(isSelected ? null : a.numberInSurah)}
                        className={`inline-flex align-middle mx-1.5 items-center justify-center rounded-full font-sans font-bold cursor-pointer transition ${
                          immersive
                            ? "bg-transparent border border-[#c7a86a]/70 text-[#e9dfbf]"
                            : "bg-transparent border border-gold/70 text-gold-foreground"
                        } ${isBookmarked ? "ring-2 ring-gold" : ""}`}
                        style={{ width: `${fontSize * 0.9}px`, height: `${fontSize * 0.9}px`, fontSize: `${fontSize * 0.35}px` }}
                        title={`آية ${a.numberInSurah}`}
                      >
                        {a.numberInSurah.toLocaleString("ar-EG")}
                      </span>{" "}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        )}

        {/* Tafsir panel (side list, when toggled) */}
        {showTafsir && arabic && (
          <div className={`mt-6 rounded-3xl border p-5 ${immersive ? "border-white/10 bg-white/[0.03] text-[#e9dfbf]" : "border-border bg-card"}`}>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gold-foreground/70 mb-3">
              {TAFSIRS.find(t => t.id === tafsirId)?.name}
            </div>
            <div className="space-y-4">
              {arabic.ayahs.map(a => (
                <div key={a.number} className={`pb-3 border-b last:border-0 ${immersive ? "border-white/10" : "border-border/50"}`}>
                  <div className="text-xs font-bold text-emerald-deep mb-1">آية {a.numberInSurah}</div>
                  <p className={`text-sm leading-relaxed ${immersive ? "text-[#e9dfbf]/90" : "text-muted-foreground"}`}>
                    {ayahMap.get(a.numberInSurah) || "—"}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <select
                value={tafsirId}
                onChange={e => setTafsirId(e.target.value)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium ${immersive ? "bg-black/40 border-white/20 text-[#f5efe0]" : "bg-card border-border"}`}
              >
                {TAFSIRS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Ayah action popover (fixed bottom sheet) */}
      {selected !== null && (
        <div className="fixed inset-x-0 bottom-[80px] md:bottom-6 z-50 px-4 pointer-events-none">
          <div className="mx-auto max-w-md rounded-2xl border border-gold/40 bg-card/95 backdrop-blur-xl shadow-elegant p-3 pointer-events-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-emerald-deep">آية {selected} • سورة {meta?.name}</div>
              <button onClick={() => setSelected(null)} className="grid h-7 w-7 place-items-center rounded-lg hover:bg-accent">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-[11px] font-semibold">
              <button
                onClick={() => {
                  const a = arabic?.ayahs.find(x => x.numberInSurah === selected);
                  if (!a) return;
                  playingAyah === selected ? stopAll() : playAyah(a.number, a.numberInSurah);
                }}
                className="flex flex-col items-center gap-1 rounded-xl p-2 hover:bg-accent"
              >
                {playingAyah === selected ? <Pause className="h-4 w-4 text-primary" /> : <Play className="h-4 w-4 text-primary" />}
                استماع
              </button>
              <button
                onClick={() => toggleBookmark(selected)}
                className="flex flex-col items-center gap-1 rounded-xl p-2 hover:bg-accent"
              >
                <Bookmark className={`h-4 w-4 ${bookmarks.has(selected) ? "fill-gold text-gold" : "text-primary"}`} />
                حفظ
              </button>
              <button onClick={() => copyAyah(selected)} className="flex flex-col items-center gap-1 rounded-xl p-2 hover:bg-accent">
                <Copy className="h-4 w-4 text-primary" /> نسخ
              </button>
              <button onClick={() => shareAyah(selected)} className="flex flex-col items-center gap-1 rounded-xl p-2 hover:bg-accent">
                <Share2 className="h-4 w-4 text-primary" /> مشاركة
              </button>
            </div>
            {ayahMap.get(selected) && (
              <div className="mt-2 rounded-xl bg-accent/60 p-3">
                <div className="text-[10px] font-bold text-emerald-deep mb-1">
                  {TAFSIRS.find(t => t.id === tafsirId)?.name}
                </div>
                <p className="text-xs text-foreground leading-relaxed max-h-32 overflow-y-auto">
                  {ayahMap.get(selected)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audio settings bottom sheet */}
      {audioOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setAudioOpen(false)}>
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-gold/30 bg-card shadow-elegant p-5 max-h-[85vh] overflow-y-auto"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
          >
            <div className="mx-auto max-w-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-gold" />
                  <div className="font-display text-lg font-bold">إعدادات التلاوة</div>
                </div>
                <button onClick={() => setAudioOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-accent">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2">القارئ</label>
                  <select
                    value={reciterId}
                    onChange={e => setReciterId(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium"
                  >
                    {RECITERS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>

                <button
                  onClick={() => setRepeatMode(v => !v)}
                  className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition ${repeatMode ? "bg-accent border-primary text-emerald-deep" : "border-border bg-card"}`}
                >
                  <span className="flex items-center gap-2"><Repeat className="h-4 w-4" /> تكرار الآية</span>
                  <span className={`h-5 w-9 rounded-full transition ${repeatMode ? "bg-primary" : "bg-muted"} relative`}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${repeatMode ? "right-0.5" : "right-4"}`} />
                  </span>
                </button>

                <button
                  onClick={() => { playingAll ? stopAll() : playFullSurah(); setAudioOpen(false); }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-emerald text-[#F3E5AB] px-4 py-3 text-sm font-bold shadow-elegant"
                >
                  {playingAll ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {playingAll ? "إيقاف التلاوة" : "تشغيل السورة كاملة"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
