import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen, Hand, Clock, CircleDot, Compass, BookMarked,
  GraduationCap, Sparkles, Heart, Phone,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن — نور | منصة إسلامية شاملة" },
      { name: "description", content: "تعرّف على منصة نور: مصحف إلكتروني بخط عثماني، مساعد ذكي، أذكار، سبحة، مواقيت الصلاة، القبلة، تعليم الصلاة، والأحاديث النبوية." },
      { property: "og:title", content: "من نحن — نور" },
      { property: "og:description", content: "منصة نور: قرآن، أذكار، أحاديث، ومساعد ذكي في مكان واحد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const FEATURES = [
  { icon: BookOpen, title: "القرآن الكريم", desc: "جميع السور الـ114 بخط عثماني، مع تفسير الجلالين والميسر، وتلاوات لكبار القراء، وحفظ آخر موضع، والتحكم بحجم الخط." },
  { icon: Sparkles, title: "المساعد الذكي", desc: "مساعد إسلامي يجيب على أسئلتك بالعربية ويستند إلى القرآن والسنة، مع تنسيق واضح للآيات والأحاديث." },
  { icon: BookMarked, title: "الأحاديث النبوية", desc: "مكتبة أحاديث مصنفة (الأخلاق، الذكر، الصلاة…) مع الراوي والمصدر وشرح مبسّط قابل للتوسع." },
  { icon: GraduationCap, title: "تعليم الصلاة والوضوء", desc: "دليل خطوة بخطوة للوضوء والصلاة مع الصيغ الشرعية لكل ركن." },
  { icon: Hand, title: "الأذكار", desc: "أذكار الصباح والمساء والنوم وبعد الصلاة مع عدّاد لكل ذكر." },
  { icon: CircleDot, title: "السبحة الإلكترونية", desc: "سبحة رقمية بعدّاد تلقائي وحفظ آخر عدد واختيار الذكر." },
  { icon: Clock, title: "مواقيت الصلاة", desc: "مواقيت دقيقة حسب موقعك مع عدّ تنازلي للصلاة القادمة." },
  { icon: Compass, title: "اتجاه القبلة", desc: "بوصلة تفاعلية تحدد اتجاه القبلة من مكانك." },
];

function About() {
  return (
    <div className="bg-gradient-hero min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-card/60 px-4 py-1.5 text-xs font-semibold text-emerald-deep backdrop-blur">
            <Heart className="h-3.5 w-3.5 text-gold" />
            من نحن
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
            منصة <span className="bg-gradient-emerald bg-clip-text text-transparent">نور</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            رفيقك اليومي مع كتاب الله وسنة نبيه ﷺ. صُممت نور لتجمع بين جمال التصميم وسهولة الاستخدام،
            لتوفّر تجربة قراءة وعبادة رقمية هادئة، خالية من التشتيت.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-gold/20 bg-card p-6 md:p-10 shadow-elegant">
          <h2 className="font-display text-2xl font-bold text-foreground">رسالتنا</h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
            نسعى لتقديم أفضل تجربة رقمية لخدمة القرآن الكريم والسنة النبوية، عبر واجهة عربية أنيقة،
            سريعة، ومتجاوبة مع كل الأجهزة، مع احترام قدسية النص وتقديم المصادر الموثوقة.
          </p>
        </div>

        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-12 mb-4">
          ما الذي يقدّمه الموقع؟
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elegant hover:border-gold/40 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-emerald text-primary-foreground shadow-soft">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-emerald p-8 md:p-10 text-center shadow-elegant">
          <p className="font-quran text-2xl md:text-3xl text-primary-foreground leading-[2.2]">
            ﴿ وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ ﴾
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/quran"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#F3E5AB] px-6 py-3 text-sm font-bold text-emerald-deep shadow-gold hover:opacity-95 transition"
            >
              <BookOpen className="h-4 w-4" />
              ابدأ القراءة
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-2xl border border-primary-foreground/30 bg-primary-foreground/10 backdrop-blur px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/20 transition"
            >
              <Phone className="h-4 w-4" />
              تواصل معنا
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
