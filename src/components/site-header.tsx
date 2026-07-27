import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Moon, Sun, BookOpen, Menu, X, Sparkles, BookMarked, GraduationCap,
  Hand, CircleDot, Clock, Compass, Home, Info, Phone,
} from "lucide-react";

const NAV = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/assistant", label: "المساعد الذكي", icon: Sparkles },
  { to: "/quran", label: "القرآن الكريم", icon: BookOpen },
  { to: "/hadith", label: "الأحاديث النبوية", icon: BookMarked },
  { to: "/learn", label: "تعليم الصلاة", icon: GraduationCap },
  { to: "/athkar", label: "الأذكار", icon: Hand },
  { to: "/sebha", label: "السبحة", icon: CircleDot },
  { to: "/prayer-times", label: "المواقيت", icon: Clock },
  { to: "/qibla", label: "القبلة", icon: Compass },
  { to: "/about", label: "من نحن", icon: Info },
  { to: "/contact", label: "تواصل معنا", icon: Phone },
] as const;

export function SiteHeader() {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-emerald shadow-soft">
            <BookOpen className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold text-foreground">نور</div>
            <div className="text-[10px] text-muted-foreground -mt-0.5">القرآن الكريم</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {NAV.slice(0, 8).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground [&.active]:text-primary [&.active]:bg-accent/60"
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            aria-label="تبديل الوضع"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-accent transition-colors"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            aria-label="القائمة"
            className="md:hidden grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-accent"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="mx-auto max-w-6xl px-4 py-3 grid gap-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-accent [&.active]:bg-accent/70 [&.active]:text-primary transition-colors"
                activeOptions={{ exact: to === "/" }}
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/60 text-emerald-deep">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
