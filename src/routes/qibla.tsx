import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Compass, MapPin } from "lucide-react";

export const Route = createFileRoute("/qibla")({
  head: () => ({
    meta: [
      { title: "اتجاه القبلة | نور" },
      { name: "description", content: "تحديد اتجاه القبلة باستخدام موقعك الجغرافي وبوصلة الجهاز." },
    ],
  }),
  component: Qibla,
});

// Compute bearing from user to Kaaba
function qiblaBearing(lat: number, lon: number) {
  const kLat = 21.4225 * Math.PI / 180;
  const kLon = 39.8262 * Math.PI / 180;
  const uLat = lat * Math.PI / 180;
  const uLon = lon * Math.PI / 180;
  const y = Math.sin(kLon - uLon);
  const x = Math.cos(uLat) * Math.tan(kLat) - Math.sin(uLat) * Math.cos(kLon - uLon);
  let brng = Math.atan2(y, x) * 180 / Math.PI;
  return (brng + 360) % 360;
}

function Qibla() {
  const [bearing, setBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) { setError("المتصفح لا يدعم تحديد الموقع."); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setBearing(qiblaBearing(pos.coords.latitude, pos.coords.longitude)),
      () => setError("يرجى السماح بالوصول للموقع."),
    );
  }, []);

  useEffect(() => {
    const handler = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      const h = e.webkitCompassHeading ?? (e.alpha != null ? 360 - e.alpha : null);
      if (h != null) setHeading(h);
    };
    window.addEventListener("deviceorientation", handler as any, true);
    return () => window.removeEventListener("deviceorientation", handler as any, true);
  }, []);

  const requestOrientation = async () => {
    const anyDOE = DeviceOrientationEvent as any;
    if (typeof anyDOE?.requestPermission === "function") {
      try { await anyDOE.requestPermission(); } catch {}
    }
  };

  const rotation = bearing != null && heading != null ? bearing - heading : bearing ?? 0;

  return (
    <div className="bg-gradient-hero min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display text-4xl font-bold">اتجاه القبلة</h1>
        <p className="mt-2 text-sm text-muted-foreground inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> الكعبة المشرفة — مكة المكرمة
        </p>

        {error && <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm">{error}</div>}

        {bearing != null && (
          <>
            <div className="relative mx-auto mt-10 h-72 w-72">
              <div className="absolute inset-0 rounded-full border-4 border-border bg-card shadow-elegant" />
              <div className="absolute inset-4 rounded-full border border-gold/40" />
              {["N", "E", "S", "W"].map((c, i) => (
                <div
                  key={c}
                  className="absolute inset-0 text-xs font-bold text-muted-foreground"
                  style={{ transform: `rotate(${i * 90}deg)` }}
                >
                  <div style={{ transform: `rotate(-${i * 90}deg)` }} className="absolute top-3 left-1/2 -translate-x-1/2">
                    {c === "N" ? "ش" : c === "E" ? "ق" : c === "S" ? "ج" : "غ"}
                  </div>
                </div>
              ))}
              <div
                className="absolute inset-0 transition-transform duration-500"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[26px] border-b-gold" />
                  <div className="mt-2 rounded-full bg-gradient-gold px-3 py-1 text-xs font-bold text-gold-foreground shadow-gold">
                    القبلة
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid h-16 w-16 place-items-center rounded-full bg-gradient-emerald text-primary-foreground shadow-elegant">
                <Compass className="h-7 w-7" />
              </div>
            </div>

            <div className="mt-8 text-sm text-muted-foreground">
              زاوية القبلة: <span className="font-bold text-foreground tabular-nums">{Math.round(bearing)}°</span>
            </div>

            <button
              onClick={requestOrientation}
              className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
            >
              تفعيل البوصلة
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              على iPhone: قد يحتاج تفعيل البوصلة من زر الأعلى.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
