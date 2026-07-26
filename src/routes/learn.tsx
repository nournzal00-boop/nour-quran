import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Droplets, Sparkles, ChevronLeft, ChevronRight, Check } from "lucide-react";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "تعليم الصلاة والوضوء — نور" },
      { name: "description", content: "دليل تفاعلي مصوّر خطوة بخطوة لتعليم الوضوء والصلاة بالأدعية والأذكار الصحيحة." },
      { property: "og:title", content: "تعليم الصلاة والوضوء — نور" },
      { property: "og:description", content: "دليل تفاعلي مصوّر لتعليم الوضوء والصلاة." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LearnPage,
});

const WUDU_STEPS = [
  { title: "النيّة والتسمية", desc: "استحضر نيّة الوضوء في قلبك ثم قل: بسم الله.", phrase: "بِسْمِ اللَّهِ" },
  { title: "غسل الكفّين", desc: "اغسل كفّيك ثلاث مرات بدءًا باليمنى.", phrase: "" },
  { title: "المضمضة والاستنشاق", desc: "تمضمض ثلاثًا، ثم استنشق الماء بأنفك واستنثره ثلاثًا.", phrase: "" },
  { title: "غسل الوجه", desc: "اغسل وجهك ثلاث مرات من منابت الشعر إلى أسفل الذقن، ومن الأذن إلى الأذن.", phrase: "" },
  { title: "غسل اليدين إلى المرفقين", desc: "اغسل يدك اليمنى إلى المرفق ثلاثًا، ثم اليسرى كذلك.", phrase: "" },
  { title: "مسح الرأس والأذنين", desc: "امسح رأسك بيديك مبتدئًا من مقدمة الرأس إلى مؤخرته ثم أعدهما، ثم امسح أذنيك.", phrase: "" },
  { title: "غسل الرِّجلين إلى الكعبين", desc: "اغسل قدمك اليمنى إلى الكعبين ثلاثًا، ثم اليسرى كذلك، مع تخليل الأصابع.", phrase: "" },
  { title: "دعاء بعد الوضوء", desc: "ارفع بصرك إلى السماء وقل الدعاء التالي.", phrase: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ" },
];

const SALAH_STEPS = [
  { title: "تكبيرة الإحرام", desc: "قف مستقبل القبلة، وارفع يديك حذو منكبيك، ثم كبّر.", phrase: "اللَّهُ أَكْبَرُ" },
  { title: "دعاء الاستفتاح", desc: "ضع يدك اليمنى على اليسرى على صدرك واقرأ:", phrase: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ" },
  { title: "الاستعاذة والبسملة", desc: "قل الاستعاذة سرًّا ثم البسملة.", phrase: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ • بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ" },
  { title: "قراءة الفاتحة", desc: "اقرأ سورة الفاتحة كاملة ثم ما تيسّر من القرآن.", phrase: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ …" },
  { title: "الركوع", desc: "كبّر واركع، وضع كفّيك على ركبتيك، واستوِ ظهرًا، وقل ثلاثًا:", phrase: "سُبْحَانَ رَبِّيَ الْعَظِيمِ" },
  { title: "الرفع من الركوع", desc: "ارفع رأسك قائلًا (سمع الله لمن حمده) ثم بعد الاعتدال:", phrase: "رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ" },
  { title: "السجود الأول", desc: "كبّر واسجد على سبعة أعضاء (الجبهة والأنف، الكفّان، الركبتان، أطراف القدمين) وقل ثلاثًا:", phrase: "سُبْحَانَ رَبِّيَ الْأَعْلَى" },
  { title: "الجلوس بين السجدتين", desc: "ارفع من السجود مكبّرًا واجلس مطمئنًا وقل:", phrase: "رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي" },
  { title: "السجود الثاني", desc: "كبّر واسجد كالسجود الأول، ثم قم للركعة الثانية.", phrase: "سُبْحَانَ رَبِّيَ الْأَعْلَى" },
  { title: "التشهّد", desc: "بعد الركعة الثانية اجلس للتشهد وقل:", phrase: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ" },
  { title: "الصلاة الإبراهيمية", desc: "في التشهد الأخير أضف:", phrase: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ" },
  { title: "التسليم", desc: "التفت يمينًا ثم يسارًا مسلّمًا:", phrase: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ" },
];

function LearnPage() {
  const [tab, setTab] = useState<"wudu" | "salah">("wudu");
  const [wuduStep, setWuduStep] = useState(0);
  const [salahStep, setSalahStep] = useState(0);

  const steps = tab === "wudu" ? WUDU_STEPS : SALAH_STEPS;
  const active = tab === "wudu" ? wuduStep : salahStep;
  const setActive = tab === "wudu" ? setWuduStep : setSalahStep;

  return (
    <div className="bg-gradient-hero min-h-screen">
      <section className="mx-auto max-w-4xl px-4 pt-10 pb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-card/60 px-4 py-1.5 text-xs font-medium text-emerald-deep backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-gold" /> دليل تفاعلي
        </div>
        <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold text-foreground">تعليم الصلاة والوضوء</h1>
        <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          خطوات مصوّرة ومختصرة تعلّمك الوضوء والصلاة بأذكارها الصحيحة كما وردت عن النبي ﷺ.
        </p>

        <div className="mt-8 inline-flex items-center gap-1 rounded-2xl border border-border bg-card p-1 shadow-soft">
          {([
            { id: "wudu", label: "الوضوء", icon: Droplets },
            { id: "salah", label: "الصلاة", icon: Sparkles },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                tab === t.id ? "bg-gradient-emerald text-primary-foreground shadow-elegant" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16">
        {/* Progress dots */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`الخطوة ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                i === active ? "w-8 bg-gradient-emerald" : i < active ? "w-2.5 bg-primary/60" : "w-2.5 bg-border"
              }`}
            />
          ))}
        </div>

        <article className="relative rounded-3xl border border-gold/20 bg-card shadow-elegant p-8 md:p-12 overflow-hidden">
          <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-gradient-gold opacity-10 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-gradient-emerald opacity-10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-emerald text-primary-foreground font-display text-xl font-bold shadow-soft">
                {active + 1}
              </div>
              <div className="text-xs font-semibold text-muted-foreground">
                الخطوة {active + 1} من {steps.length}
              </div>
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">{steps[active].title}</h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">{steps[active].desc}</p>

            {steps[active].phrase && (
              <div className="mt-6 rounded-2xl border border-gold/30 bg-accent/40 p-6">
                <div className="text-xs font-semibold text-gold-foreground/70 mb-2">الصيغة الشرعية</div>
                <p className="font-quran text-2xl md:text-3xl text-foreground text-center leading-[2.2]">
                  {steps[active].phrase}
                </p>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                onClick={() => setActive(Math.max(0, active - 1))}
                disabled={active === 0}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="h-4 w-4" />
                السابق
              </button>
              {active === steps.length - 1 ? (
                <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-4 py-2.5 text-sm font-bold text-gold-foreground shadow-soft">
                  <Check className="h-4 w-4" />
                  اكتملت الخطوات
                </span>
              ) : (
                <button
                  onClick={() => setActive(Math.min(steps.length - 1, active + 1))}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-emerald px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-elegant hover:-translate-y-0.5 transition"
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </article>

        {/* All steps list */}
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`text-right rounded-2xl border p-4 transition-all hover:-translate-y-0.5 ${
                i === active ? "border-primary bg-accent/60 shadow-soft" : "border-border bg-card hover:shadow-soft"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-emerald text-primary-foreground text-sm font-bold">
                  {i + 1}
                </div>
                <div>
                  <div className="font-display text-lg font-bold text-foreground">{s.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
