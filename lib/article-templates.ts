export interface ArticleTemplate {
    id: string;
    title: string;
    description: string;
    icon: string;
    structure: string;
}

export const SOVEREIGN_TEMPLATES: ArticleTemplate[] = [
    {
        id: 'case-study',
        title: 'دراسة حالة (Case Study)',
        description: 'تحليل معمق لمشروع ناجح مع إبراز الأرقام والنتائج الاستراتيجية.',
        icon: 'Target',
        structure: `
<h2 className="text-indigo-400">ملخص التحدي (The Challenge)</h2>
<p>هنا نقوم بوصف المشكلة الأساسية التي كان يواجهها العميل قبل تدخلنا الاستراتيجي. ركز على نقاط الألم والتأثير الاقتصادي.</p>

<div className="alert bg-slate-900 border-indigo-500/30 p-8 rounded-3xl my-10 border">
<h4 className="font-black text-indigo-400 mb-4">أهداف العملية:</h4>
<ul>
<li>تقليل الفاقد الزمني بنسبة X%</li>
<li>أتمتة المسارات الحرجة في المنظومة</li>
<li>رفع كفاءة الأداء العام</li>
</ul>
</div>

<h2>الحل السيادي (The Sovereign Solution)</h2>
<p>وصف تفصيلي للأنظمة التي تم بناؤها. اذكر الهندسة الرقمية المستخدمة وكيفية ربط الأدوات ببعضها.</p>

<img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80" alt="Solution Architecture" className="w-full rounded-3xl my-10 border border-white/10" />

<h3>النتائج المحققة (Impact & ROI)</h3>
<p>هنا تضع الأرقام الحقيقية. كيف تغير واقع العمل بعد التنفيذ؟</p>

<blockquote>
"لقد تحولت منظومتنا من العمل اليدوي المشتت إلى محرك رقمي سيادي يعمل بدقة الساعة."
<cite>— اسم العميل، المنصب</cite>
</blockquote>
        `
    },
    {
        id: 'technical-breakdown',
        title: 'تحليل تقني (Technical Breakdown)',
        description: 'شرح معمق لهندسة معينة أو تقنية حديثة وطريقة تطبيقها.',
        icon: 'Code2',
        structure: `
<h2 className="text-purple-400">الهندسة العميقة (Deep Architecture)</h2>
<p>شرح للطبقات التقنية التي يتكون منها النظام. لماذا اخترنا هذه الأدوات بالتحديد؟</p>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
<div className="p-6 bg-slate-950 border border-white/5 rounded-2xl">
<h4 className="text-white font-black mb-2">المميزات الاستراتيجية:</h4>
<p className="text-sm text-slate-400">وصف للمزايا التي تقدمها هذه التقنية في سياق الأعمال.</p>
</div>
<div className="p-6 bg-slate-950 border border-white/5 rounded-2xl">
<h4 className="text-white font-black mb-2">تحديات التنفيذ:</h4>
<p className="text-sm text-slate-400">كيف تغلبنا على المعوقات التقنية أثناء البناء.</p>
</div>
</div>

<h2>مسار التنفيذ (Implementation Roadmap)</h2>
<p>خطوات عملية لنقل الفكرة من الورق إلى الكود البرمجي الفعال.</p>

<pre className="bg-slate-900 p-6 rounded-2xl border border-white/5 font-mono text-sm text-indigo-300">
// نموذج لهيكل البيانات السيادي
const systemConfig = {
  authority: "Active",
  intelligence: "Enabled",
  autoScale: true
};
</pre>

<h3>الخلاصة المعمارية</h3>
<p>التوصيات النهائية للمهندسين وصناع القرار التقنيين.</p>
        `
    },
    {
        id: 'strategic-insight',
        title: 'رؤية استراتيجية (Strategic Insight)',
        description: 'مقال فكري يحلل اتجاهات السوق والمستقبل الرقمي.',
        icon: 'Sparkles',
        structure: `
<h2 className="text-indigo-400">تموضع السوق (Market Positioning)</h2>
<p>تحليل للواقع الحالي للتحول الرقمي في المنطقة وما هي الفرص الضائعة.</p>

<blockquote>
التكنولوجيا بلا استراتيجية هي مجرد تكلفة، بينما التكنولوجيا كاستراتيجية هي سلطة سوقية مطلقة.
</blockquote>

<h2>قوانين اللعبة الجديدة (The New Rules)</h2>
<p>هنا تستعرض الرؤية الخاصة بك وكيف يجب على الشركات التكيف مع المتغيرات المتسارعة.</p>

<ul>
<li><strong>السيادة الرقمية:</strong> امتلاك الأدوات وليس فقط استخدامها.</li>
<li><strong>الذكاء المدمج:</strong> تحويل البيانات إلى قرارات تلقائية.</li>
<li><strong>المرونة الهيكلية:</strong> بناء أنظمة قابلة للتطور اللحظي.</li>
</ul>

<h3>الخاتمة القيادية</h3>
<p>دعوة للعمل (Call to Action) الموجهة للنخبة من صناع القرار.</p>
        `
    }
];
