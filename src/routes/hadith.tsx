import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookOpen, ChevronDown, Search } from "lucide-react";

export const Route = createFileRoute("/hadith")({
  head: () => ({
    meta: [
      { title: "الأحاديث النبوية مع الشرح — نور" },
      { name: "description", content: "مجموعة مختارة من الأحاديث النبوية الشريفة مع الراوي والمصدر وشرح مبسّط، مصنّفة حسب الموضوع." },
      { property: "og:title", content: "الأحاديث النبوية مع الشرح — نور" },
      { property: "og:description", content: "أحاديث نبوية مع الشرح مصنّفة حسب الموضوع." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HadithPage,
});

type Hadith = {
  text: string;
  narrator: string;
  source: string;
  explanation: string;
  category: string;
};

const CATEGORIES = ["الكل", "الأخلاق", "الذكر", "الصلاة", "العلم", "النية"] as const;

const HADITHS: Hadith[] = [
  {
    text: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى.",
    narrator: "عمر بن الخطاب رضي الله عنه",
    source: "صحيح البخاري",
    explanation: "يبيّن الحديث أن الأعمال تُقبل ويُثاب عليها بحسب النية، وأن ثواب العبد على قدر ما نواه في قلبه. وهو أصل عظيم في الدين تُبنى عليه كثير من الأحكام.",
    category: "النية",
  },
  {
    text: "مَنْ حُسْنِ إِسْلَامِ المَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ.",
    narrator: "أبو هريرة رضي الله عنه",
    source: "سنن الترمذي",
    explanation: "من علامات كمال إسلام المسلم أن يشتغل بما ينفعه في دينه ودنياه ويترك ما لا يعنيه من فضول القول والفعل.",
    category: "الأخلاق",
  },
  {
    text: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.",
    narrator: "أنس بن مالك رضي الله عنه",
    source: "صحيح البخاري ومسلم",
    explanation: "كمال الإيمان يستلزم أن يحب المؤمن لإخوانه من الخير مثل ما يحب لنفسه، فذلك يورث المحبة ويقطع أسباب الحسد.",
    category: "الأخلاق",
  },
  {
    text: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي المِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ العَظِيمِ.",
    narrator: "أبو هريرة رضي الله عنه",
    source: "صحيح البخاري",
    explanation: "يحثّ النبي ﷺ على المداومة على هاتين الكلمتين لسهولتهما وعظم أجرهما وثقلهما في ميزان الحسنات يوم القيامة.",
    category: "الذكر",
  },
  {
    text: "بُنِيَ الإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ البَيْتِ، وَصَوْمِ رَمَضَانَ.",
    narrator: "ابن عمر رضي الله عنهما",
    source: "صحيح البخاري ومسلم",
    explanation: "يبيّن أركان الإسلام الخمسة التي عليها مدار الدين، وهي الشهادتان والصلاة والزكاة والحج والصوم.",
    category: "الصلاة",
  },
  {
    text: "أَفْضَلُ الصَّلَاةِ بَعْدَ الفَرِيضَةِ صَلَاةُ اللَّيْلِ.",
    narrator: "أبو هريرة رضي الله عنه",
    source: "صحيح مسلم",
    explanation: "بيان فضل قيام الليل وأنه أفضل التطوع بعد الصلوات المفروضة لما فيه من الخلوة بالله وإخلاص العبادة.",
    category: "الصلاة",
  },
  {
    text: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الجَنَّةِ.",
    narrator: "أبو هريرة رضي الله عنه",
    source: "صحيح مسلم",
    explanation: "فضل طلب العلم الشرعي وأن الله يجازي طالبه بتيسير طريق الجنة له، ترغيبًا في العلم وأهله.",
    category: "العلم",
  },
  {
    text: "المُسْلِمُ مَنْ سَلِمَ المُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ.",
    narrator: "عبد الله بن عمرو رضي الله عنهما",
    source: "صحيح البخاري",
    explanation: "المسلم الكامل هو الذي يكفّ أذاه عن الناس قولًا وفعلًا، فلا يؤذي بلسانه بغيبة أو سبّ، ولا بيده بضرب أو ظلم.",
    category: "الأخلاق",
  },
  {
    text: "مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لَا يَذْكُرُ رَبَّهُ مَثَلُ الحَيِّ وَالمَيِّتِ.",
    narrator: "أبو موسى الأشعري رضي الله عنه",
    source: "صحيح البخاري",
    explanation: "تشبيه بليغ يوضّح أن الذاكر لله كالحيّ الذي فيه روح، والغافل عن ذكر الله كالميّت الذي فقد الحياة الحقيقية.",
    category: "الذكر",
  },
  {
    text: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ.",
    narrator: "أبو ذر ومعاذ رضي الله عنهما",
    source: "سنن الترمذي",
    explanation: "وصية جامعة تشمل حقّ الله بالتقوى في السر والعلن، وتدارك التقصير بالحسنات، وحقّ الخلق بحسن المعاملة.",
    category: "الأخلاق",
  },
];

function HadithPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("الكل");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const list = useMemo(() => {
    return HADITHS.filter((h) => (cat === "الكل" || h.category === cat) && (q.trim() === "" || h.text.includes(q) || h.explanation.includes(q)));
  }, [cat, q]);

  return (
    <div className="bg-gradient-hero min-h-screen">
      <section className="mx-auto max-w-5xl px-4 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-card/60 px-4 py-1.5 text-xs font-medium text-emerald-deep backdrop-blur">
          <BookOpen className="h-3.5 w-3.5 text-gold" /> صحاح ومختارات
        </div>
        <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold text-foreground">الأحاديث النبوية</h1>
        <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          مجموعة من الأحاديث الشريفة مع الراوي والمصدر وشرح موجز ميسّر.
        </p>

        <div className="mt-8 mx-auto max-w-xl relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث في متن الأحاديث أو الشرح…"
            className="w-full rounded-2xl border border-border bg-card/80 backdrop-blur px-12 py-3.5 text-sm text-foreground shadow-soft placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                cat === c
                  ? "bg-gradient-emerald text-primary-foreground shadow-soft"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 grid gap-4 md:grid-cols-2">
        {list.map((h, i) => {
          const isOpen = open === i;
          return (
            <article key={i} className="relative rounded-2xl border border-border bg-card shadow-soft hover:shadow-elegant transition-all p-6 flex flex-col">
              <div className="absolute top-4 left-4 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold text-emerald-deep">
                {h.category}
              </div>
              <p className="font-quran text-xl md:text-2xl font-bold text-foreground leading-[2.1] mt-6">
                «{h.text}»
              </p>
              <div className="mt-4 text-xs text-muted-foreground border-t border-border/60 pt-3">
                <div><span className="font-semibold text-foreground">الراوي:</span> {h.narrator}</div>
                <div className="mt-1"><span className="font-semibold text-foreground">المصدر:</span> {h.source}</div>
              </div>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="mt-4 inline-flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-accent transition"
              >
                <span>الشرح</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="mt-3 rounded-xl bg-accent/40 border border-gold/20 p-4 text-sm leading-relaxed text-foreground/90">
                  {h.explanation}
                </div>
              )}
            </article>
          );
        })}
        {list.length === 0 && (
          <div className="md:col-span-2 text-center text-muted-foreground py-12">لا توجد نتائج مطابقة.</div>
        )}
      </section>
    </div>
  );
}
