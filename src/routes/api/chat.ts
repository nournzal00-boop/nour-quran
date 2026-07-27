import { createFileRoute } from "@tanstack/react-router";
import { streamText, type CoreMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `أنت "مساعد نور"، مساعد إسلامي علمي يساعد المسلمين على فهم دينهم بلغة عربية فصيحة، واضحة، وهادئة.

قواعد الإجابة:
- أجب دائمًا باللغة العربية الفصحى.
- استند في إجابتك إلى القرآن الكريم والسنة النبوية الصحيحة وأقوال العلماء المعتبرين.
- اذكر الآيات القرآنية مع اسم السورة ورقم الآية، والأحاديث مع الراوي ودرجتها ومصدرها إن أمكن (مثل: صحيح البخاري، صحيح مسلم…).
- عند وجود اختلاف فقهي بين المذاهب، اذكر الرأي الراجح وأبرز الآراء الأخرى باختصار دون تعصب.
- في المسائل الحساسة (طلاق، فتاوى شخصية، نوازل معاصرة)، لا تُصدر فتوى قاطعة، وانصح المستخدم بمراجعة أهل العلم الموثوقين في بلده.
- استخدم تنسيق Markdown: عناوين فرعية، ونقاط، واقتباسات (blockquote) للآيات والأحاديث لتسهيل القراءة.
- اجعل الإجابة منظمة: مقدمة موجزة، ثم الأدلة، ثم الشرح، ثم الخلاصة.
- لا تتحدث عن أمور لا تخص الدين الإسلامي إلا بقدر ما يتعلق بالسؤال.
- اعتذر بأدب إذا لم تعرف الإجابة أو كانت مما لا يجوز الخوض فيه بغير علم.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        let body: { messages?: CoreMessage[] };
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (messages.length === 0) {
          return new Response("Messages required", { status: 400 });
        }

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const model = gateway("google/gemini-3.6-flash");

          const result = streamText({
            model,
            system: SYSTEM_PROMPT,
            messages,
          });

          return result.toTextStreamResponse({
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "AI gateway error";
          const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
          return new Response(msg, { status });
        }
      },
    },
  },
});
