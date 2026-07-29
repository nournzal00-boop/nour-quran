import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Volume2, Palette, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/tajweed")({
  head: () => ({
    meta: [
      { title: "مِئْذَنَةُ التَّجْوِيدِ — نور" },
      { name: "description", content: "تعلّم أحكام التجويد ومخارج الحروف والنطق الصحيح مع أمثلة تفاعلية وتلوين تجويدي." },
      { property: "og:title", content: "مِئْذَنَةُ التَّجْوِيدِ — نور" },
      { property: "og:description", content: "دليل تفاعلي لأحكام التجويد ومخارج الحروف." },
    ],
  }),
  component: TajweedPage,
});

interface Rule {
  id: string;
  title: string;
  desc: string;
  example: string;
  example_highlighted?: { text: string; color: string }[];
  color: string;
  sample?: string;
}

const RULES: { group: string; rules: Rule[] }[] = [
  {
    group: "أحكام النون الساكنة والتنوين",
    rules: [
      {
        id: "izhar",
        title: "الإظهار الحلقي",
        desc: "إخراج النون الساكنة أو التنوين من مخرجها من غير غنة كاملة، عند حروف: ء هـ ع ح غ خ.",
        example: "﴿مِنْ خَيْرٍ﴾، ﴿يَنْأَوْنَ﴾، ﴿كُلٌّ آمَنَ﴾",
        color: "text-sky-500",
      },
      {
        id: "idgham",
        title: "الإدغام",
        desc: "إدخال حرف ساكن في حرف متحرك بعده، عند حروف (يرملون). بغنة مع (ينمو) وبلا غنة مع (ل، ر).",
        example: "﴿مَن يَعْمَلْ﴾، ﴿مِن رَّبِّهِمْ﴾",
        color: "text-emerald-500",
      },
      {
        id: "iqlab",
        title: "الإقلاب",
        desc: "قلب النون الساكنة أو التنوين ميمًا مخفاة بغنة عند حرف الباء.",
        example: "﴿مِنۢ بَعْدِ﴾، ﴿سَمِيعٌۢ بَصِيرٌ﴾",
        color: "text-amber-500",
      },
      {
        id: "ikhfa",
        title: "الإخفاء الحقيقي",
        desc: "النطق بحرف بين الإظهار والإدغام مع بقاء الغنة، عند بقية الحروف الخمسة عشر.",
        example: "﴿أَنْتُمْ﴾، ﴿مِنْ ثَمَرَةٍ﴾",
        color: "text-violet-500",
      },
    ],
  },
  {
    group: "أحكام المدود",
    rules: [
      {
        id: "madd-tabi3i",
        title: "المد الطبيعي",
        desc: "مد حرفين (حركتين) إذا جاء بعد الحرف حرف مد (ا و ي) ولا سبب بعده.",
        example: "﴿قَالَ﴾، ﴿يَقُولُ﴾، ﴿قِيلَ﴾",
        color: "text-rose-500",
      },
      {
        id: "madd-wajib",
        title: "المد الواجب المتصل",
        desc: "أن يأتي بعد حرف المد همزة في نفس الكلمة، ويمد ٤ أو ٥ حركات.",
        example: "﴿جَاءَ﴾، ﴿السَّمَاءِ﴾",
        color: "text-red-500",
      },
      {
        id: "madd-jaez",
        title: "المد الجائز المنفصل",
        desc: "أن يأتي بعد حرف المد همزة في أول الكلمة التالية، ويمد ٤ أو ٥ حركات.",
        example: "﴿يَا أَيُّهَا﴾، ﴿إِنَّا أَنزَلْنَاهُ﴾",
        color: "text-red-400",
      },
      {
        id: "madd-lazim",
        title: "المد اللازم",
        desc: "أن يأتي بعد حرف المد سكون أصلي، ويمد ٦ حركات وجوبًا.",
        example: "﴿الضَّالِّينَ﴾، ﴿الحَاقَّةُ﴾",
        color: "text-red-600",
      },
    ],
  },
  {
    group: "القلقلة",
    rules: [
      {
        id: "qalqala",
        title: "القلقلة",
        desc: "اضطراب الصوت عند النطق بالحرف الساكن حتى يُسمع له نبرة قوية، وحروفها (قطب جد).",
        example: "﴿يَجْعَلُونَ﴾، ﴿قَدْ أَفْلَحَ﴾، ﴿البُرُوجِ﴾",
        color: "text-blue-500",
      },
    ],
  },
  {
    group: "أحكام الميم الساكنة",
    rules: [
      {
        id: "ikhfa-shafawi",
        title: "الإخفاء الشفوي",
        desc: "إخفاء الميم الساكنة بغنة عند الباء.",
        example: "﴿تَرْمِيهِم بِحِجَارَةٍ﴾",
        color: "text-teal-500",
      },
      {
        id: "idgham-mithlain",
        title: "إدغام المتماثلين الصغير",
        desc: "إدغام الميم الساكنة في الميم المتحركة بغنة كاملة.",
        example: "﴿لَهُم مَّا يَشَاءُونَ﴾",
        color: "text-emerald-600",
      },
    ],
  },
];

const MAKHARIJ = [
  { letter: "ء هـ", region: "أقصى الحلق", tip: "من أعمق نقطة في الحلق قرب الصدر." },
  { letter: "ع ح", region: "وسط الحلق", tip: "من منتصف الحلق دون ضغط." },
  { letter: "غ خ", region: "أدنى الحلق", tip: "أقرب الحلق إلى الفم." },
  { letter: "ق", region: "أقصى اللسان مع الحنك", tip: "من أقصى اللسان مع ما يقابله من الحنك اللحمي." },
  { letter: "ك", region: "أقصى اللسان أسفل القاف", tip: "أسفل مخرج القاف بقليل." },
  { letter: "ج ش ي", region: "وسط اللسان مع الحنك", tip: "الشجرية — وسط اللسان يلتقي بالحنك." },
  { letter: "ض", region: "حافة اللسان مع الأضراس", tip: "من إحدى حافتي اللسان أو كليهما." },
  { letter: "ل", region: "حافة اللسان مع اللثة", tip: "أدنى حافة اللسان مع لثة الثنايا العليا." },
  { letter: "ن", region: "طرف اللسان مع اللثة", tip: "أسفل مخرج اللام قليلًا." },
  { letter: "ر", region: "طرف اللسان مع اللثة", tip: "مع انحراف قليل نحو ظهر اللسان." },
  { letter: "ط د ت", region: "طرف اللسان مع أصول الثنايا", tip: "النطعية." },
  { letter: "ص س ز", region: "طرف اللسان مع الثنايا السفلى", tip: "الأسلية — حروف الصفير." },
  { letter: "ظ ذ ث", region: "طرف اللسان مع أطراف الثنايا العليا", tip: "اللثوية." },
  { letter: "ف", region: "بطن الشفة السفلى مع الثنايا العليا", tip: "الشفوية." },
  { letter: "ب م و", region: "الشفتان", tip: "من انطباق الشفتين مع الغنة في الميم." },
];

function TajweedPage() {
  const [colorize, setColorize] = useState(true);
  const [openRule, setOpenRule] = useState<string | null>(null);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text.replace(/[﴿﴾]/g, ""));
    u.lang = "ar-SA";
    u.rate = 0.7;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="bg-gradient-hero min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="text-center mb-8">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-card/60 px-4 py-1.5 text-xs font-medium text-emerald-deep">
            <GraduationCap className="h-3.5 w-3.5 text-gold" /> تعلم أحكام التلاوة
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">مِئْذَنَةُ التَّجْوِيدِ</h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            دليل تفاعلي لأحكام النون والميم والمدود والقلقلة، ومخارج الحروف، والنطق الصحيح.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setColorize(v => !v)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${colorize ? "bg-gradient-emerald text-[#F3E5AB] border-transparent" : "border-border bg-card hover:bg-accent"}`}
          >
            <Palette className="h-3.5 w-3.5" />
            {colorize ? "التلوين التجويدي مفعّل" : "تفعيل التلوين التجويدي"}
          </button>
        </div>

        {/* Legend */}
        {colorize && (
          <div className="mb-8 rounded-2xl border border-border bg-card p-4">
            <div className="text-xs font-bold text-muted-foreground mb-3">دلالة الألوان</div>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-red-500" /> المدود</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-emerald-500" /> الإدغام والغنّة</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-blue-500" /> القلقلة</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-violet-500" /> الإخفاء</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-sky-500" /> الإظهار</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-amber-500" /> الإقلاب</span>
            </div>
          </div>
        )}

        {/* Rules */}
        <section className="space-y-6">
          {RULES.map(group => (
            <div key={group.group}>
              <h2 className="font-display text-2xl font-bold text-emerald-deep mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" /> {group.group}
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {group.rules.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setOpenRule(openRule === r.id ? null : r.id)}
                    className="text-right rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elegant hover:border-gold/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-bold text-foreground">{r.title}</h3>
                      <span className={`h-2.5 w-2.5 rounded-full mt-2 shrink-0 ${colorize ? r.color.replace("text-", "bg-") : "bg-muted-foreground/40"}`} />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                    <div className="mt-4 rounded-xl bg-background/60 border border-border/60 p-3">
                      <p className={`font-quran text-2xl leading-loose text-center ${colorize ? r.color : "text-foreground"}`}>
                        {r.example}
                      </p>
                    </div>
                    {openRule === r.id && (
                      <div
                        onClick={(e) => { e.stopPropagation(); speak(r.example); }}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-emerald text-[#F3E5AB] px-3 py-1.5 text-xs font-bold cursor-pointer"
                      >
                        <Volume2 className="h-3.5 w-3.5" /> استمع للنطق
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Makharij */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-emerald-deep mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" /> مخارج الحروف
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MAKHARIJ.map(m => (
              <div key={m.letter} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elegant transition">
                <div className="flex items-center justify-between">
                  <span className="font-quran text-3xl text-emerald-deep">{m.letter}</span>
                  <button
                    onClick={() => speak(m.letter)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-gradient-gold text-gold-foreground shadow-gold"
                    aria-label="استمع"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 text-sm font-bold text-foreground">{m.region}</div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{m.tip}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
