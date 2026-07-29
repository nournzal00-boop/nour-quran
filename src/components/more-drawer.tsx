import { Link } from "@tanstack/react-router";
import { X, BookMarked, Compass, GraduationCap, Sparkles, Info, Phone, Home, Feather, HandHeart } from "lucide-react";
import { useEffect } from "react";

const LINKS = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/tajweed", label: "مِئْذَنَةُ التَّجْوِيدِ", icon: Feather },
  { to: "/sunnah", label: "سُنَنُ الحَبِيبِ ﷺ", icon: HandHeart },
  { to: "/hadith", label: "الأحاديث النبوية", icon: BookMarked },
  { to: "/learn", label: "تعليم الصلاة والوضوء", icon: GraduationCap },
  { to: "/qibla", label: "اتجاه القبلة", icon: Compass },
  { to: "/assistant", label: "المساعد الذكي", icon: Sparkles },
  { to: "/about", label: "من نحن", icon: Info },
  { to: "/contact", label: "تواصل معنا", icon: Phone },
] as const;

export function MoreDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      <aside
        className="absolute inset-y-0 right-0 w-[85%] max-w-sm bg-background/95 backdrop-blur-2xl border-l border-border shadow-elegant flex flex-col animate-in slide-in-from-right"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-4">
          <div>
            <div className="font-display text-lg font-bold text-foreground">القائمة</div>
            <div className="text-[11px] text-muted-foreground">استكشف كل الأقسام</div>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="grid h-9 w-9 place-items-center rounded-xl border border-border hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="grid gap-1">
            {LINKS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors [&.active]:bg-accent/70 [&.active]:text-primary"
                  activeOptions={{ exact: to === "/" }}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-emerald text-primary-foreground shadow-soft">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
