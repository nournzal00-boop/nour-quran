import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/prayer-times")({
  head: () => ({
    meta: [
      { title: "مواقيت الصلاة | نور" },
      { name: "description", content: "مواقيت الصلاة الخمس حسب موقعك مع عدّاد تنازلي للصلاة القادمة." },
    ],
  }),
  component: PrayerTimes,
});

const NAMES: Record<string, string> = {
  Fajr: "الفجر", Sunrise: "الشروق", Dhuhr: "الظهر",
  Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء",
};
const ORDER = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

function PrayerTimes() {
  const [loc, setLoc] = useState<{ lat: number; lon: number; city?: string } | null>(null);
  const [times, setTimes] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("المتصفح لا يدعم تحديد الموقع.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setError("يرجى السماح بالوصول للموقع لعرض المواقيت."),
    );
  }, []);

  useEffect(() => {
    if (!loc) return;
    const d = new Date();
    const url = `https://api.aladhan.com/v1/timings/${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}?latitude=${loc.lat}&longitude=${loc.lon}&method=4`;
    fetch(url).then(r => r.json()).then(j => setTimes(j.data.timings)).catch(() => setError("تعذّر جلب المواقيت."));
  }, [loc]);

  const nextPrayer = () => {
    if (!times) return null;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    for (const key of ORDER) {
      if (key === "Sunrise") continue;
      const [h, m] = times[key].split(":").map(Number);
      const t = h * 60 + m;
      if (t > nowMin) return { key, mins: t - nowMin };
    }
    return null;
  };

  const next = nextPrayer();

  return (
    <div className="bg-gradient-hero min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold">مواقيت الصلاة</h1>
          <p className="mt-2 text-sm text-muted-foreground inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> حسب موقعك الجغرافي
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-center">{error}</div>
        )}

        {next && (
          <div className="rounded-3xl bg-gradient-emerald text-primary-foreground p-8 shadow-elegant mb-6 text-center">
            <div className="text-xs opacity-80 uppercase tracking-wider">الصلاة القادمة</div>
            <div className="font-display text-4xl font-bold mt-2">{NAMES[next.key]}</div>
            <div className="mt-3 inline-flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              بعد {Math.floor(next.mins / 60)} س و {next.mins % 60} د
            </div>
          </div>
        )}

        {times && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ORDER.map(key => {
              const isNext = next?.key === key;
              return (
                <div
                  key={key}
                  className={`rounded-2xl border p-5 text-center transition ${
                    isNext ? "border-primary bg-accent shadow-elegant" : "border-border bg-card shadow-soft"
                  }`}
                >
                  <div className="text-xs text-muted-foreground">{key === "Sunrise" ? "شروق" : "صلاة"}</div>
                  <div className="font-display text-xl font-bold mt-1">{NAMES[key]}</div>
                  <div className="mt-2 font-bold text-primary text-lg tabular-nums">{times[key]?.slice(0, 5)}</div>
                </div>
              );
            })}
          </div>
        )}

        {!times && !error && (
          <div className="text-center text-muted-foreground text-sm py-10">جارٍ جلب المواقيت…</div>
        )}
      </div>
    </div>
  );
}
