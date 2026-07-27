import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Hand, Clock, CircleDot, Menu } from "lucide-react";
import { useState } from "react";
import { MoreDrawer } from "./more-drawer";

const TABS = [
  { to: "/quran", label: "القرآن", icon: BookOpen },
  { to: "/athkar", label: "الأذكار", icon: Hand },
  { to: "/prayer-times", label: "المواقيت", icon: Clock },
  { to: "/sebha", label: "السبحة", icon: CircleDot },
] as const;

export function BottomNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/75 backdrop-blur-xl shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.15)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="التنقل السفلي"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5 px-2 py-1.5">
          {TABS.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to === "/quran" && pathname.startsWith("/quran"));
            return (
              <li key={to}>
                <Link
                  to={to}
                  className="group relative flex flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition-colors"
                >
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-xl transition-all ${
                      active
                        ? "bg-gradient-gold text-gold-foreground shadow-gold"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
                  </span>
                  <span className={active ? "text-primary" : "text-muted-foreground"}>{label}</span>
                  {active && (
                    <span className="absolute -top-0.5 h-1 w-8 rounded-full bg-gradient-gold shadow-gold" />
                  )}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              onClick={() => setOpen(true)}
              className="group relative flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-semibold text-muted-foreground"
              aria-label="المزيد"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl transition-all group-hover:text-foreground">
                <Menu className="h-[18px] w-[18px]" strokeWidth={2.25} />
              </span>
              <span>المزيد</span>
            </button>
          </li>
        </ul>
      </nav>
      <MoreDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
