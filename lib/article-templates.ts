export interface ArticleTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  structure: string;
}

export const SOVEREIGN_TEMPLATES: ArticleTemplate[] = [
  {
    id: 'comprehensive-strategy',
    title: 'المنهجية الشاملة (The Sovereign Strategy)',
    description: 'قالب احترافي متكامل من 6 أجزاء يشمل الجداول، التحليل، والمخططات. مثالي للكتب الرقمية أو الأدلة المرجعية.',
    icon: 'Layout',
    structure: `
<header class="mb-10 text-right" dir="rtl">
    <h1 class="text-4xl font-bold leading-tight text-white mb-6">
      المنهجية الشاملة لإدارة المشاريع الرقمية وإنشاء متجر إلكتروني ناجح من الصفر
    </h1>

    <p class="mt-4 text-lg text-slate-400">
      مقال احترافي يوضح كيف تُدار المشاريع الرقمية الحديثة وفق منهجية متكاملة
      تضمن النجاح، الاستدامة، وقابلية التوسع في عالم التجارة الإلكترونية.
    </p>
</header>

<!-- مقدمة -->
<section class="mb-14 text-right" dir="rtl">
    <h2 class="text-2xl font-black mb-4 text-indigo-400">
      مقدمة: لماذا لم يعد إنشاء متجر إلكتروني وحده كافيًا؟
    </h2>

    <p class="mb-4 text-slate-300">
      في السنوات الأخيرة، أصبح إنشاء متجر إلكتروني أمرًا سهلًا تقنيًا،
      لكن <strong class="text-white">النجاح الحقيقي أصبح نادرًا</strong>.
      السبب لا يعود إلى الأدوات أو التقنيات، بل إلى غياب
      <strong class="text-indigo-300">منهجية واضحة لإدارة المشروع الرقمي</strong>.
    </p>

    <div class="bg-slate-900 border-r-4 border-indigo-500 p-6 my-8 rounded-l-xl">
      <p class="text-slate-300">
      هذا المقال لا يشرح فقط <em>كيف تنشئ متجرًا إلكترونيًا</em>،
      بل يوضح كيف تبني
      <strong class="text-white">نظامًا رقميًا متكاملًا</strong>
      قادرًا على النمو، التوسع، وتحقيق أرباح مستدامة.
      </p>
    </div>
</section>

<!-- جدول مقارنة -->
<section class="mb-14 text-right" dir="rtl">
    <h2 class="text-2xl font-black mb-6 text-white">
      مقارنة: العشوائية vs المنهجية الاحترافية
    </h2>

    <div class="overflow-x-auto rounded-xl border border-white/10">
      <table class="w-full text-sm text-right">
        <thead class="bg-slate-900 text-indigo-400">
          <tr>
            <th class="px-6 py-4">العنصر</th>
            <th class="px-6 py-4">مشروع عشوائي</th>
            <th class="px-6 py-4">مشروع بمنهجية شاملة</th>
          </tr>
        </thead>
        <tbody class="text-slate-300 divide-y divide-white/5">
          <tr class="bg-slate-950/50">
            <td class="px-6 py-4 font-bold text-white">التخطيط</td>
            <td class="px-6 py-4 text-red-400">غير واضح</td>
            <td class="px-6 py-4 text-green-400">خارطة طريق دقيقة</td>
          </tr>
          <tr>
            <td class="px-6 py-4 font-bold text-white">اتخاذ القرار</td>
            <td class="px-6 py-4">عشوائي</td>
            <td class="px-6 py-4">مبني على بيانات</td>
          </tr>
          <tr class="bg-slate-950/50">
            <td class="px-6 py-4 font-bold text-white">النمو</td>
            <td class="px-6 py-4">محدود</td>
            <td class="px-6 py-4">قابل للتوسع (Scalable)</td>
          </tr>
        </tbody>
      </table>
    </div>
</section>

<!-- الجزء الثاني: تحليل السوق -->
<section class="mb-20 text-right" dir="rtl">
    <h2 class="text-3xl font-black mb-6 text-indigo-400">
      تحليل السوق ودراسة الجدوى الرقمية
    </h2>

    <p class="mb-8 text-slate-300">
    قبل كتابة سطر واحد من الكود، يجب الإجابة على سؤال جوهري:
    <strong class="text-white">هل هذا المشروع الرقمي قابل للنجاح فعليًا؟</strong>
    </p>

    <h3 class="text-xl font-bold mb-4 text-white">نموذج عملي لتحليل السوق</h3>
    
    <div class="overflow-x-auto rounded-xl border border-white/10 mb-10">
      <table class="w-full text-sm text-right">
        <thead class="bg-slate-900 text-indigo-400">
          <tr>
            <th class="px-6 py-4">العنصر</th>
            <th class="px-6 py-4">التحليل</th>
            <th class="px-6 py-4">القرار الاستراتيجي</th>
          </tr>
        </thead>
        <tbody class="text-slate-300 divide-y divide-white/5">
          <tr>
            <td class="px-6 py-4 font-bold text-white">حجم السوق</td>
            <td class="px-6 py-4">طلب متوسط إلى مرتفع</td>
            <td class="px-6 py-4 text-indigo-300">قابل للاستهداف</td>
          </tr>
          <tr>
            <td class="px-6 py-4 font-bold text-white">المنافسة</td>
            <td class="px-6 py-4">منافسة متوسطة</td>
            <td class="px-6 py-4 text-indigo-300">فرصة للتميز عبر الجودة</td>
          </tr>
          <tr>
            <td class="px-6 py-4 font-bold text-white">الفجوات</td>
            <td class="px-6 py-4">ضعف خدمة ما بعد البيع</td>
            <td class="px-6 py-4 text-indigo-300">ميزة تنافسية رئيسية</td>
          </tr>
        </tbody>
      </table>
    </div>
</section>

<!-- الجزء الثالث: التخطيط الاستراتيجي -->
<section class="mb-20 text-right" dir="rtl">
    <h2 class="text-3xl font-black mb-6 text-indigo-400">
      التخطيط الاستراتيجي: خارطة الطريق (Roadmap)
    </h2>

    <p class="mb-6 text-slate-300">
    خارطة الطريق هي وثيقة استراتيجية توضح <strong>ماذا سنبني، متى، ولماذا</strong>.
    </p>

    <div class="overflow-x-auto rounded-xl border border-white/10">
      <table class="w-full text-sm text-right">
        <thead class="bg-indigo-900/20 text-indigo-300">
          <tr>
            <th class="px-6 py-4">المرحلة</th>
            <th class="px-6 py-4">الهدف</th>
            <th class="px-6 py-4">المدة</th>
            <th class="px-6 py-4">النتيجة</th>
          </tr>
        </thead>
        <tbody class="text-slate-300 divide-y divide-white/5">
          <tr>
            <td class="px-6 py-4 font-bold text-white"><span class="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-xs">MVP</span></td>
            <td class="px-6 py-4">اختبار السوق</td>
            <td class="px-6 py-4">4–6 أسابيع</td>
            <td class="px-6 py-4">بيانات حقيقية</td>
          </tr>
          <tr>
            <td class="px-6 py-4 font-bold text-white">التطوير</td>
            <td class="px-6 py-4">تحسين التجربة</td>
            <td class="px-6 py-4">2–3 أشهر</td>
            <td class="px-6 py-4">زيادة التحويل</td>
          </tr>
          <tr>
            <td class="px-6 py-4 font-bold text-white">التوسع</td>
            <td class="px-6 py-4">النمو</td>
            <td class="px-6 py-4">مستمر</td>
            <td class="px-6 py-4">استدامة</td>
          </tr>
        </tbody>
      </table>
    </div>
</section>

<!-- الجزء الرابع: المكدس التقني -->
<section class="mb-20 text-right" dir="rtl">
    <h2 class="text-3xl font-black mb-6 text-indigo-400">
      Tech Stack: البنية التقنية القابلة للتوسع
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
      <div class="bg-slate-900 p-6 rounded-2xl border border-white/5">
        <h4 class="text-indigo-400 font-bold mb-2">Frontend</h4>
        <p class="text-white text-xl font-black mb-2">Next.js</p>
        <p class="text-sm text-slate-500">لأداء فائق وتحسين محركات البحث (SEO).</p>
      </div>
      <div class="bg-slate-900 p-6 rounded-2xl border border-white/5">
        <h4 class="text-indigo-400 font-bold mb-2">Backend</h4>
        <p class="text-white text-xl font-black mb-2">Node.js</p>
        <p class="text-sm text-slate-500">لمرونة عالية ومعالجة سريعة للطلبات.</p>
      </div>
      <div class="bg-slate-900 p-6 rounded-2xl border border-white/5">
        <h4 class="text-indigo-400 font-bold mb-2">Database</h4>
        <p class="text-white text-xl font-black mb-2">PostgreSQL</p>
        <p class="text-sm text-slate-500">لموثوقية البيانات وسلامة العمليات.</p>
      </div>
    </div>
</section>

<!-- الجزء الخامس: تجربة المستخدم والنمو -->
<section class="mb-20 text-right" dir="rtl">
    <h2 class="text-3xl font-black mb-6 text-indigo-400">
      تجربة المستخدم (UX) ومعدل التحويل (CRO)
    </h2>

    <p class="mb-6 text-slate-300">
    تجربة المستخدم الجيدة لا تجعل الموقع جميلًا فقط، بل تجعله
    <strong class="text-white">آلة تحويل (Conversion Machine)</strong>.
    </p>

    <ul class="space-y-4 mb-10">
      <li class="flex items-start gap-3">
        <span class="bg-green-500/10 text-green-500 p-1 rounded mt-1">✓</span>
        <div>
            <strong class="text-white block">تقليل الارتداد (Bounce Rate)</strong>
            <span class="text-slate-400 text-sm">عبر تحسين سرعة التحميل وتوضيح القيمة المقترحة فورًا.</span>
        </div>
      </li>
      <li class="flex items-start gap-3">
        <span class="bg-green-500/10 text-green-500 p-1 rounded mt-1">✓</span>
        <div>
            <strong class="text-white block">Checkout مبسط</strong>
            <span class="text-slate-400 text-sm">إزالة أي خطوات غير ضرورية قد تعيق عملية الدفع.</span>
        </div>
      </li>
      <li class="flex items-start gap-3">
        <span class="bg-green-500/10 text-green-500 p-1 rounded mt-1">✓</span>
        <div>
            <strong class="text-white block">Call to Action (CTA)</strong>
            <span class="text-slate-400 text-sm">استخدام ألوان ونصوص واضحة توجه المستخدم نحو الهدف.</span>
        </div>
      </li>
    </ul>
</section>

<!-- CTA -->
<section class="bg-indigo-900/20 border border-indigo-500/30 p-10 rounded-3xl mt-20 text-center relative overflow-hidden">
  <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
  <div class="relative z-10">
      <h3 class="text-2xl font-black text-white mb-4">
        هل تريد تطبيق هذه المنهجية على مشروعك؟
      </h3>

      <p class="mb-8 text-indigo-200 mobile-relaxed max-w-2xl mx-auto">
        إذا كنت تبحث عن <strong class="text-white">إدارة احترافية لمشروعك الرقمي</strong>
        أو إنشاء متجر إلكتروني مبني على منهجية واضحة وقابل للنمو.
      </p>

      <a href="/contact" class="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-xl shadow-indigo-900/20">
        احجز استشارة استراتيجية الآن
      </a>
  </div>
</section>

<footer class="mt-16 pt-8 border-t border-white/5 text-sm text-slate-500 text-center">
  <p>
    إعداد: <strong class="text-indigo-400">نورالدين رفعة</strong> —
    خبير إدارة المشاريع الرقمية وتطوير المتاجر الإلكترونية
  </p>
</footer>
        `
  },
  {
    id: 'case-study',
    title: 'دراسة حالة (Case Study)',
    description: 'تحليل معمق لمشروع ناجح مع إبراز الأرقام والنتائج الاستراتيجية.',
    icon: 'Target',
    structure: `
<div class="text-right" dir="rtl">
    <h2 class="text-indigo-400 text-2xl font-bold mb-4">ملخص التحدي (The Challenge)</h2>
    <p class="text-slate-300 mb-6">هنا نقوم بوصف المشكلة الأساسية التي كان يواجهها العميل قبل تدخلنا الاستراتيجي. ركز على نقاط الألم والتأثير الاقتصادي.</p>

    <div class="bg-slate-900 border border-indigo-500/30 p-8 rounded-3xl my-10">
        <h4 class="font-black text-indigo-400 mb-4 text-lg">أهداف العملية:</h4>
        <ul class="text-slate-300 space-y-2 list-disc list-inside">
            <li>تقليل الفاقد الزمني بنسبة X%</li>
            <li>أتمتة المسارات الحرجة في المنظومة</li>
            <li>رفع كفاءة الأداء العام</li>
        </ul>
    </div>

    <h2 class="text-white text-2xl font-bold mb-4">الحل السيادي (The Sovereign Solution)</h2>
    <p class="text-slate-300 mb-6">وصف تفصيلي للأنظمة التي تم بناؤها. اذكر الهندسة الرقمية المستخدمة وكيفية ربط الأدوات ببعضها.</p>

    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80" alt="Solution Architecture" class="w-full rounded-3xl my-10 border border-white/10" />

    <h3 class="text-white text-xl font-bold mb-4">النتائج المحققة (Impact & ROI)</h3>
    <p class="text-slate-300 mb-8">هنا تضع الأرقام الحقيقية. كيف تغير واقع العمل بعد التنفيذ؟</p>

    <blockquote class="border-r-4 border-indigo-500 pr-6 py-2 my-8 bg-slate-900/50 rounded-r-xl">
        <p class="text-lg italic text-slate-200 mb-2">"لقد تحولت منظومتنا من العمل اليدوي المشتت إلى محرك رقمي سيادي يعمل بدقة الساعة."</p>
        <cite class="text-sm text-indigo-400 font-bold">— اسم العميل، المنصب</cite>
    </blockquote>
</div>
        `
  },
  {
    id: 'technical-breakdown',
    title: 'تحليل تقني (Technical Breakdown)',
    description: 'شرح معمق لهندسة معينة أو تقنية حديثة وطريقة تطبيقها.',
    icon: 'Code2',
    structure: `
<div class="text-right" dir="rtl">
    <h2 class="text-purple-400 text-2xl font-bold mb-4">الهندسة العميقة (Deep Architecture)</h2>
    <p class="text-slate-300 mb-8">شرح للطبقات التقنية التي يتكون منها النظام. لماذا اخترنا هذه الأدوات بالتحديد؟</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
        <div class="p-6 bg-slate-950 border border-white/5 rounded-2xl">
            <h4 class="text-white font-black mb-2">المميزات الاستراتيجية:</h4>
            <p class="text-sm text-slate-400">وصف للمزايا التي تقدمها هذه التقنية في سياق الأعمال.</p>
        </div>
        <div class="p-6 bg-slate-950 border border-white/5 rounded-2xl">
            <h4 class="text-white font-black mb-2">تحديات التنفيذ:</h4>
            <p class="text-sm text-slate-400">كيف تغلبنا على المعوقات التقنية أثناء البناء.</p>
        </div>
    </div>

    <h2 class="text-white text-2xl font-bold mb-4">مسار التنفيذ (Implementation Roadmap)</h2>
    <p class="text-slate-300 mb-6">خطوات عملية لنقل الفكرة من الورق إلى الكود البرمجي الفعال.</p>

    <pre class="bg-slate-900 p-6 rounded-2xl border border-white/5 font-mono text-sm text-indigo-300 dir-ltr text-left overflow-x-auto mb-8">
// نموذج لهيكل البيانات السيادي
const systemConfig = {
  authority: "Active",
  intelligence: "Enabled",
  autoScale: true
};
    </pre>

    <h3 class="text-white text-xl font-bold mb-4">الخلاصة المعمارية</h3>
    <p class="text-slate-300">التوصيات النهائية للمهندسين وصناع القرار التقنيين.</p>
</div>
        `
  },
  {
    id: 'strategic-insight',
    title: 'رؤية استراتيجية (Strategic Insight)',
    description: 'مقال فكري يحلل اتجاهات السوق والمستقبل الرقمي.',
    icon: 'Sparkles',
    structure: `
<div class="text-right" dir="rtl">
    <h2 class="text-indigo-400 text-2xl font-bold mb-4">تموضع السوق (Market Positioning)</h2>
    <p class="text-slate-300 mb-8">تحليل للواقع الحالي للتحول الرقمي في المنطقة وما هي الفرص الضائعة.</p>

    <blockquote class="border-r-4 border-indigo-500 pr-6 py-4 my-10 bg-indigo-900/10 rounded-r-xl">
        <p class="text-xl font-bold text-white leading-relaxed">التكنولوجيا بلا استراتيجية هي مجرد تكلفة، بينما التكنولوجيا كاستراتيجية هي سلطة سوقية مطلقة.</p>
    </blockquote>

    <h2 class="text-white text-2xl font-bold mb-4">قوانين اللعبة الجديدة (The New Rules)</h2>
    <p class="text-slate-300 mb-6">هنا تستعرض الرؤية الخاصة بك وكيف يجب على الشركات التكيف مع المتغيرات المتسارعة.</p>

    <ul class="space-y-4 mb-10">
        <li class="flex items-start gap-3">
            <span class="text-indigo-500 text-xl font-bold">•</span>
            <div>
                <strong class="text-white block">السيادة الرقمية:</strong>
                <span class="text-slate-400">امتلاك الأدوات وليس فقط استخدامها.</span>
            </div>
        </li>
        <li class="flex items-start gap-3">
            <span class="text-indigo-500 text-xl font-bold">•</span>
            <div>
                <strong class="text-white block">الذكاء المدمج:</strong>
                <span class="text-slate-400">تحويل البيانات إلى قرارات تلقائية.</span>
            </div>
        </li>
    </ul>

    <h3 class="text-white text-xl font-bold mb-4">الخاتمة القيادية</h3>
    <p class="text-slate-300">دعوة للعمل (Call to Action) الموجهة للنخبة من صناع القرار.</p>
</div>
        `
  },
  {
    id: 'product-launch',
    title: 'إطلاق منتج (Product Launch)',
    description: 'قالب تسويقي عالي التأثير لإعلان عن منتج أو ميزة جديدة.',
    icon: 'Rocket',
    structure: `
<div class="text-right" dir="rtl">
    <header class="mb-10 text-center">
        <span class="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">إعلان جديد</span>
        <h1 class="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">اسم المنتج: ثورة جديدة في عالم [الصناعة]</h1>
        <p class="text-xl text-slate-300 max-w-2xl mx-auto">نقدم لكم الحل الذي طال انتظاره. أداء أسرع، ذكاء أعمق، وسيطرة كاملة.</p>
    </header>

    <section class="mb-16">
        <h2 class="text-2xl font-bold text-white mb-6">لماذا الآن؟ (The Why)</h2>
        <p class="text-slate-300 mb-6">لطالما عانى السوق من [المشكلة]. الأدوات الحالية كانت [نقاط الضعف]. لذلك قمنا ببناء [اسم المنتج] من الصفر.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
            <div class="bg-slate-900/50 p-6 rounded-2xl border border-white/5 text-center">
                <h3 class="text-indigo-400 font-black text-3xl mb-2">10x</h3>
                <p class="text-slate-400 text-sm">أسرع من المنافسين</p>
            </div>
            <div class="bg-slate-900/50 p-6 rounded-2xl border border-white/5 text-center">
                <h3 class="text-indigo-400 font-black text-3xl mb-2">0%</h3>
                <p class="text-slate-400 text-sm">تعقيد في الإعداد</p>
            </div>
            <div class="bg-slate-900/50 p-6 rounded-2xl border border-white/5 text-center">
                <h3 class="text-indigo-400 font-black text-3xl mb-2">24/7</h3>
                <p class="text-slate-400 text-sm">دعم فني مخصص</p>
            </div>
        </div>
    </section>

    <section class="mb-16">
        <h2 class="text-2xl font-bold text-white mb-6">الميزات الرئيسية (Core Features)</h2>
        
        <div class="space-y-6">
            <div class="flex items-start gap-4 p-4 bg-slate-900 rounded-xl border border-white/5 hover:border-indigo-500/50 transition-colors">
                <div class="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <strong>01</strong>
                </div>
                <div>
                    <h4 class="text-white font-bold text-lg mb-1">الميزة الأولى: السيادة الكاملة</h4>
                    <p class="text-slate-400 text-sm">شرح تفصيلي للميزة وكيف ستغير حياة المستخدم للأفضل.</p>
                </div>
            </div>
            <div class="flex items-start gap-4 p-4 bg-slate-900 rounded-xl border border-white/5 hover:border-indigo-500/50 transition-colors">
                <div class="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <strong>02</strong>
                </div>
                <div>
                    <h4 class="text-white font-bold text-lg mb-1">الميزة الثانية: الذكاء التوليدي</h4>
                    <p class="text-slate-400 text-sm">كيف نستخدم الذكاء الاصطناعي لتسريع العمليات الروتينية.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-10 rounded-3xl text-center border border-white/10">
        <h3 class="text-2xl font-black text-white mb-4">جاهز للبدء؟</h3>
        <p class="text-indigo-200 mb-8 max-w-xl mx-auto">انضم إلى قائمة الانتظار اليوم واحصل على خصم حصري للأعضاء المؤسسين.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" class="px-8 py-3 bg-white text-indigo-900 font-black rounded-xl hover:bg-indigo-50 transition-colors">احصل على الوصول المبكر</a>
            <a href="#" class="px-8 py-3 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors">مشاهدة العرض التوضيحي</a>
        </div>
    </section>
</div>
        `
  },
  {
    id: 'nextjs-saas-launch',
    title: 'إطلاق SaaS (Next.js 14)',
    description: 'قالب برمجى كامل لإطلاق تطبيق ساس باستخدام بنية Next.js App Router.',
    icon: 'Cpu',
    structure: `
{
  "nextjs": true,
  "files": {
    "page.tsx": "<div class='space-y-16' dir='rtl'>\\n  <header class='text-center py-20 bg-gradient-to-b from-indigo-900/20 to-transparent rounded-3xl border border-white/5'>\\n    <h1 class='text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter'>Sovereign SaaS Engine</h1>\\n    <p class='text-xl text-slate-400 max-w-2xl mx-auto'>أول نظام سحابي لإدارة السيادة الرقمية بأتمتة كاملة.</p>\\n  </header>\\n\\n  <section class='grid grid-cols-1 md:grid-cols-3 gap-8'>\\n    <div class='p-8 bg-slate-900 rounded-3xl border border-white/5 hover:border-indigo-500 transition-all'>\\n      <h3 class='text-white font-bold text-xl mb-4'>سريع كالبرق</h3>\\n      <p class='text-slate-400 text-sm'>تم تحسين أداء الفرونت إند ليصل إلى 100/100 في Lighthouse.</p>\\n    </div>\\n    <div class='p-8 bg-slate-900 rounded-3xl border border-white/5 hover:border-indigo-500 transition-all'>\\n      <h3 class='text-white font-bold text-xl mb-4'>أمان سيادي</h3>\\n      <p class='text-slate-400 text-sm'>تشفير البيانات بمستويات عسكرية لضمان خصوصيتك الكاملة.</p>\\n    </div>\\n    <div class='p-8 bg-slate-900 rounded-3xl border border-white/5 hover:border-indigo-500 transition-all'>\\n      <h3 class='text-white font-bold text-xl mb-4'>ذكاء مدمج</h3>\\n      <p class='text-slate-400 text-sm'>استخدم محركات الذكاء الاصطناعي لتحليل البيانات فورياً.</p>\\n    </div>\\n  </section>\\n\\n  <footer class='bg-indigo-600 p-12 rounded-[3rem] text-center'>\\n    <h2 class='text-3xl font-black text-white mb-6'>ابدأ تجربتك المجانية اليوم</h2>\\n    <button class='px-10 py-4 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 transition-all'>ابدأ الآن</button>\\n  </footer>\\n</div>",
    "layout.tsx": "export default function Layout({ children }) { return <div className='p-4'>{children}</div> }",
    "metadata.ts": "export const metadata = { title: 'SaaS Launch' }"
  }
}
        `
  },
  {
    id: 'nextjs-tech-doc',
    title: 'توثيق تقني (App Router)',
    description: 'قالب لإنشاء صفحات توثيق برمجية أو دروس تعليمية متقدمة.',
    icon: 'BookOpen',
    structure: `
{
  "nextjs": true,
  "files": {
    "page.tsx": "<div class='prose prose-invert max-w-none text-right' dir='rtl'>\\n  <h1 class='text-indigo-400'>دليل هندسة النظم الموزعة</h1>\\n  <p>في هذا الدرس سنتعلم كيف تبني نظاماً يتحمل الضغط العالي باستخدام Next.js و Go.</p>\\n\\n  <div class='my-10 p-6 bg-slate-950 border-r-4 border-emerald-500 rounded-l-xl'>\\n    <h4 class='text-white mb-2'>مفهوم السيادة البرمجية:</h4>\\n    <p class='text-slate-400'>هو أن تمتلك البنية التحتية بالكامل دون الاعتماد على طرف ثالث.</p>\\n  </div>\\n\\n  <h2>كود الإعداد الأولي</h2>\\n  <pre class='bg-black p-6 rounded-xl font-mono text-sm text-indigo-300'>\\n    // main.go\\n    func main() {\\n      fmt.Println(\"Starting Sovereign Engine...\")\\n    }\\n  </pre>\\n\\n  <h2>الخلاصة الاستراتيجية</h2>\\n  <p>البناء للمستقبل يتطلب الدقة في اختيار التكنولوجيا منذ اليوم الأول.</p>\\n</div>",
    "layout.tsx": "export default function Layout({ children }) { return <main>{children}</main> }",
    "metadata.ts": "export const metadata = { title: 'Tech Doc' }"
  }
}
        `
  }
];

