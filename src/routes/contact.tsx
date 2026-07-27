import { createFileRoute } from "@tanstack/react-router";
import { Phone, MessageCircle, Copy, Check } from "lucide-react";
import { useState } from "react";

const PHONE = "+963995244293";
const PHONE_DIGITS = PHONE.replace(/\D/g, "");

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا — نور" },
      { name: "description", content: "تواصل مع فريق منصة نور عبر الهاتف أو واتساب: +963 995 244 293." },
      { property: "og:title", content: "تواصل معنا — نور" },
      { property: "og:description", content: "نرحّب بأسئلتك واقتراحاتك. تواصل معنا في أي وقت." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PHONE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="bg-gradient-hero min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-card/60 px-4 py-1.5 text-xs font-semibold text-emerald-deep backdrop-blur">
            <Phone className="h-3.5 w-3.5 text-gold" />
            تواصل معنا
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
            نسعد بتواصلك معنا
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            لأي استفسار أو اقتراح أو ملاحظة حول منصة نور، لا تتردد بمراسلتنا.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-gold/20 bg-card p-8 shadow-elegant text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-emerald shadow-elegant">
            <Phone className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            رقم الهاتف
          </div>
          <div dir="ltr" className="mt-2 font-display text-3xl md:text-4xl font-bold text-foreground">
            {PHONE}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={`tel:${PHONE_DIGITS}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-emerald px-5 py-3 text-sm font-bold text-[#F3E5AB] shadow-soft hover:shadow-elegant transition"
            >
              <Phone className="h-4 w-4" />
              اتصال
            </a>
            <a
              href={`https://wa.me/${PHONE_DIGITS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-gold px-5 py-3 text-sm font-bold text-gold-foreground shadow-gold hover:opacity-95 transition"
            >
              <MessageCircle className="h-4 w-4" />
              واتساب
            </a>
            <button
              onClick={copy}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-5 py-3 text-sm font-bold text-foreground hover:bg-accent transition"
            >
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              {copied ? "تم النسخ" : "نسخ الرقم"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          نجيب على رسائلكم بأسرع وقت ممكن، بإذن الله.
        </p>
      </div>
    </div>
  );
}
