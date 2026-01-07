
export const SYSTEM_ARTICLE_CONTENT = `
<div class="space-y-12 text-right" dir="rtl">
    <!-- Hero Section -->
    <div class="relative p-8 md:p-16 rounded-[3rem] bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-white/10 overflow-hidden shadow-2xl">
        <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>
        <h2 class="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">لماذا يحتاج نشاطك التجاري إلى "نظام" وليس مجرد موقع إلكتروني؟</h2>
        <p class="text-xl text-slate-300 leading-relaxed mb-10">في الاقتصاد الرقمي الحديث، الموقع الإلكتروني هو مجرد "واجهة عرض". أما النظام، فهو "المحرك" الذي يدير النمو بينما أنت نائم.</p>
        <div class="flex flex-wrap gap-4">
            <span class="px-6 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-indigo-400 font-bold">هندسة الأنظمة</span>
            <span class="px-6 py-2 bg-emerald-600/20 border border-emerald-500/30 rounded-full text-emerald-400 font-bold">التحول الرقمي</span>
        </div>
    </div>

    <!-- Section 1: The Trap -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
            <h3 class="text-3xl font-black text-white mb-6">فخ "الموقع الجميل"</h3>
            <p class="text-lg text-slate-400 leading-relaxed mb-6">يقع معظم أصحاب الأعمال في خطأ فادح: استثمار ميزانيات ضخمة في تصميم موقع إلكتروني مبهر بصرياً، ثم يكتشفون بعد الإطلاق أن الموقع لا يجلب أي مبيعات. لماذا؟</p>
            <ul class="space-y-4">
                <li class="flex items-start gap-4 text-slate-300">
                    <span class="text-red-500 font-bold">●</span>
                    <p>الموقع التقليدي ثابت وغير متفاعل مع سلوك العميل.</p>
                </li>
                <li class="flex items-start gap-4 text-slate-300">
                    <span class="text-red-500 font-bold">●</span>
                    <p>غياب قمع مبيعات (Sales Funnel) يوجه الزائر من الوعي إلى الشراء.</p>
                </li>
                <li class="flex items-start gap-4 text-slate-300">
                    <span class="text-red-500 font-bold">●</span>
                    <p>انعدام الربط مع أدوات إدارة العملاء (CRM) والأتمتة.</p>
                </li>
            </ul>
        </div>
        <div class="p-8 rounded-[2rem] bg-slate-900 border border-white/5 shadow-inner">
            <div class="space-y-6">
                <div class="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">إحصائية مرعبة</p>
                    <p class="text-4xl font-black text-white">95%</p>
                    <p class="text-slate-400">من المواقع الإلكترونية الجزائرية هي مجرد "بروشورات إلكترونية" لا تساهم في نمو الشركة.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Section 2: The Sovereign System -->
    <div class="py-12 border-y border-white/5">
        <h3 class="text-3xl font-black text-white mb-10 text-center">أركان النظام الرقمي السيادي</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-8 rounded-3xl bg-indigo-600/5 border border-indigo-500/20 hover:border-indigo-500 transition-all">
                <div class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-900/40">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h4 class="text-xl font-bold text-white mb-4">مولد العملاء اللحظي</h4>
                <p class="text-slate-400 leading-relaxed">نظام جذب يستهدف الجمهور المناسب ويعالج استفساراتهم الأولى فوراً لضمان عدم ضياع الفرصة.</p>
            </div>
            <div class="p-8 rounded-3xl bg-purple-600/5 border border-purple-500/20 hover:border-purple-500 transition-all">
                <div class="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-purple-900/40">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h4 class="text-xl font-bold text-white mb-4">ذاكرة المؤسسة (CRM)</h4>
                <p class="text-slate-400 leading-relaxed">كل عميل له ملف كامل، تتبع للمكالمات، البريد الإلكتروني، وتاريخ الطلبات. لا شيء يُفقد في الأوراق.</p>
            </div>
            <div class="p-8 rounded-3xl bg-emerald-600/5 border border-emerald-500/20 hover:border-emerald-500 transition-all">
                <div class="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-900/40">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </div>
                <h4 class="text-xl font-bold text-white mb-4">محرك الأتمتة الذكي</h4>
                <p class="text-slate-400 leading-relaxed">إرسال الفواتير، التذكير بالمواعيد، وجمع الآراء يتم تلقائياً. فريقك يركز فقط على إغلاق الصفقات.</p>
            </div>
        </div>
    </div>

    <!-- Section 3: Detailed Strategy (Deep Content) -->
    <div class="prose prose-invert max-w-none">
        <h3 class="text-3xl font-black text-white">خارطة الطريق لبناء نظامك السيادي</h3>
        <p>لبناء نظام رقمي ناجح، لا نبدأ بالكود، بل نبدأ بالاستراتيجية. إليك الخطوات الخمس التي نتبعها في NR-OS:</p>
        
        <h4>1. تحليل التشتت (Dispersion Analysis)</h4>
        <p>نبدأ بتحديد أين تضيع بيانات عملائك. هل هي في رسائل الواتساب الخاصة بالموظفين؟ هل في ملفات Excel مشتتة؟ الهدف هو توحيد كل "نقاط التماس" مع العميل في مكان واحد.</p>
        
        <blockquote>
            "النظام هو الفرق بين القلق الدائم والنمو المستدام."
        </blockquote>

        <h4>2. تصميم رحلة العميل الأوتوماتيكية</h4>
        <p>نرسم المسار الذي يجب أن يسلكه العميل من أول إعلان يراه إلى أن يصبح مروجاً لعلامتك التجارية. نقوم ببرمجة "المحفزات" (Triggers) التي تدفع العميل للمرحلة التالية دون تدخل بشري.</p>

        <h4>3. هندسة لوحة التحكم المركزية</h4>
        <p>تحتاج كمدير إلى رؤية "نبض" مشروعك في شاشة واحدة. مبيعات اليوم، حالة المخزون، أداء الفريق، ومعدل رضا العملاء. إذا لم تستطع قياسه، فلا يمكنك إدارته.</p>
    </div>

    <!-- Case Study Card -->
    <div class="p-10 md:p-16 rounded-[3rem] bg-white text-slate-900 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
        <h3 class="text-3xl font-black mb-8">دراسة حالة: من الفوضى إلى السيادة</h3>
        <p class="text-lg mb-8">شركة توزيع في الجزائر كانت تعاني من ضياع 40% من الطلبات بسبب الاعتماد على "الأجندة الورقية" والواتساب. بعد تطبيق نظامنا المتكامل:</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div class="p-6 border-l-2 border-indigo-600">
                <p class="text-4xl font-black text-indigo-600">+300%</p>
                <p class="font-bold">زيادة في المبيعات</p>
            </div>
            <div class="p-6 border-l-2 border-indigo-600">
                <p class="text-4xl font-black text-indigo-600">0%</p>
                <p class="font-bold">معدل ضياع الطلبات</p>
            </div>
            <div class="p-6">
                <p class="text-4xl font-black text-indigo-600">12 ساعة</p>
                <p class="font-bold">توفير أسبوعي للمدير</p>
            </div>
        </div>
    </div>

    <!-- Final Call to Action -->
    <div class="text-center py-16 bg-slate-900/50 rounded-[4rem] border border-white/5 shadow-2xl">
        <h2 class="text-4xl font-black text-white mb-6">هل أنت مستعد للتوقف عن إدارة الموقع والبدء في إدارة النظام؟</h2>
        <p class="text-slate-400 mb-12 max-w-2xl mx-auto">احجز جلسة استشارية مجانية اليوم لنقوم بتشخيص وضعك الرقمي ورسم مخطط سيادتك السوقية.</p>
        <button class="px-12 py-6 bg-indigo-600 text-white font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)]">ابدأ التحول الآن</button>
    </div>
</div>
`;

export const AI_ALGERIA_CONTENT = `
<div class="space-y-12 text-right" dir="rtl">
    <!-- Header -->
    <div class="relative py-20 px-8 md:px-20 rounded-[4rem] bg-indigo-950/30 border border-white/10 overflow-hidden">
        <div class="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>
        <div class="relative z-10 max-w-4xl">
            <h2 class="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">مستقبل الذكاء الاصطناعي في السوق الجزائري 2025</h2>
            <p class="text-2xl text-indigo-300 font-medium">دليل الشركات للريادة التقنية وتجاوز المنافسة التقليدية.</p>
        </div>
    </div>

    <!-- Introduction -->
    <div class="prose prose-invert max-w-none">
        <p class="text-xl leading-relaxed">الذكاء الاصطناعي ليس مجرد "تريند" عالمي، بل هو أدق وسيلة لتحسين كفاءة الشركات الجزائرية التي تواجه تحديات فريدة في اللوجستيات، خدمة العملاء، وتحليل البيانات. في 2025، الفرق بين الشركة الناجحة والمفلسة سيكون هو مدى امتلاكها لـ "دماغ رقمي" يدير عملياتها.</p>
        
        <div class="p-10 my-16 bg-gradient-to-l from-indigo-600/20 to-transparent border-r-8 border-indigo-500 rounded-2xl">
            <h3 class="text-white font-black">لماذا الآن؟</h3>
            <p>السوق الجزائري يمر بمرحلة انفتاح رقمي غير مسبوقة. البنية التحتية تتطور، وسلوك المستهلك يتجه نحو الرقمنة. من يبدأ اليوم في دمج الـ AI في نموذج عمله، سيحجز مكاناً في القمة للعشر سنوات القادمة.</p>
        </div>

        <h3 class="text-3xl font-black text-white">تطبيقات عملية في الواقع الجزائري</h3>
        
        <h4>1. أتمتة خدمة العملاء بلهجة محلية</h4>
        <p>لقد ولى زمن الردود الآلية المملة. الأن نقوم ببناء أنظمة ذكية تفهم "الدرجة الجزائرية" وتجيب على استفسارات العملاء في فيسبوك وإنستغرام بدقة تفوق البشر بنسبة 90%، مع القدرة على إغلاق المبيعات مباشرة.</p>

        <h4>2. التحليل التنبؤي للمخزون</h4>
        <p>تذبذب الأسعار وتوفر السلع تحدي كبير. أنظمة الذكاء الاصطناعي التي نطورها تقوم بتحليل بيانات السوق التاريخية للتنبؤ بالطلب المستقبلي، مما يساعد الشركات على شراء المخزون الصحيح في الوقت الصحيح، تقليص الخسائر بنسبة تصل لـ 30%.</p>

        <h4>3. هندسة المحتوى البيعي</h4>
        <p>لا تحتاج لجيش من كتاب المحتوى. الـ AI يمكنه توليد استراتيجيات محتوى كاملة، نصوص إعلانية مؤثرة، وتصاميم بصرية احترافية في ثوانٍ، بشرط وجود "مهندس أوامر" (Prompt Engineer) خبير يوجهه.</p>
    </div>

    <!-- Comparison Table -->
    <div class="overflow-x-auto my-16">
        <table class="w-full text-right border-collapse">
            <thead>
                <tr class="bg-white/5">
                    <th class="p-6 border border-white/10 text-white font-black">المجال</th>
                    <th class="p-6 border border-white/10 text-slate-400">الطريقة التقليدية</th>
                    <th class="p-6 border border-white/10 text-indigo-400">عصر الـ AI السيادي</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="p-6 border border-white/10 text-white font-bold text-lg">خدمة العملاء</td>
                    <td class="p-6 border border-white/10 text-slate-400">موظفين بدوام كامل، ضغط عالي، تأخر في الرد</td>
                    <td class="p-6 border border-white/10 text-indigo-300">رد فوري على مدار الساعة، معالجة آلاف المحادثات لحظياً</td>
                </tr>
                <tr class="bg-white/5">
                    <td class="p-6 border border-white/10 text-white font-bold text-lg">اتخاذ القرار</td>
                    <td class="p-6 border border-white/10 text-slate-400">بناءً على "الحدس" أو الخبرة الشخصية</td>
                    <td class="p-6 border border-white/10 text-indigo-300">قرارات مبنية على بيانات دقيقة وتنبؤات إحصائية</td>
                </tr>
                <tr>
                    <td class="p-6 border border-white/10 text-white font-bold text-lg">تكلفة التشغيل</td>
                    <td class="p-6 border border-white/10 text-slate-400">مرتفعة وتزيد مع نمو الشركة</td>
                    <td class="p-6 border border-white/10 text-indigo-300">منخفضة ومستقرة، مما يسمح بالتوسع اللا نهائي</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Strategy Section -->
    <div class="prose prose-invert max-w-none">
        <h3 class="text-3xl font-black text-white">كيف تبدأ رحلة الـ AI في شركتك؟</h3>
        <p>نحن في NR-OS لا نؤمن بالحلول الجاهزة. كل شركة تحتاج إلى "خارطة طريق" مخصصة:</p>
        <ol>
            <li><strong>التشخيص الرقمي:</strong> نبحث عن المهام المتكررة التي تستهلك وقت فريقك.</li>
            <li><strong>اختيار الأدوات السيادية:</strong> نحدد الأنظمة التي تتوافق مع القوانين واللغة المحلية.</li>
            <li><strong>التدريب والتكامل:</strong> نقوم بدمج الـ AI تدريجياً لضمان سلاسة الانتقال.</li>
        </ol>
    </div>

    <!-- CTA Box -->
    <div class="p-16 rounded-[3rem] bg-indigo-600 text-white relative overflow-hidden group">
        <div class="absolute -top-20 -right-20 w-80 h-80 bg-white/10 blur-[100px] rounded-full group-hover:bg-white/20 transition-all"></div>
        <h3 class="text-4xl font-black mb-6">هل تريد أن تكون الرائد أم التابع؟</h3>
        <p class="text-xl mb-10 text-indigo-100 italic">"المستقبل ينتمي لمن يمتلكون الشجاعة لاستخدام أدوات المستقبل اليوم."</p>
        <div class="flex flex-col md:flex-row gap-6">
            <button class="px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl shadow-2xl">احجز استشارة تقنية</button>
            <button class="px-10 py-5 bg-indigo-500 border border-indigo-400 font-black rounded-2xl">تحميل ملف الفرص 2025</button>
        </div>
    </div>
</div>
`;

export const ECOM_AUTO_CONTENT = `
<div class="space-y-12 text-right" dir="rtl">
    <!-- Header -->
    <div class="p-12 md:p-24 rounded-[3rem] bg-gradient-to-r from-emerald-900/40 to-slate-900/40 border-l-8 border-emerald-500 shadow-2xl">
        <h2 class="text-4xl md:text-6xl font-black text-white mb-6">أتمتة التجارة الإلكترونية: كيف تدير متجرك وأنت نائم</h2>
        <p class="text-xl text-emerald-300 font-medium leading-relaxed">دليلك العملي لتحويل متجرك الإلكتروني من مصدر للمتاعب إلى آلة مبيعات أوتوماتيكية تعمل 24/7.</p>
    </div>

    <!-- Problem & Solution Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="p-10 rounded-3xl bg-red-900/5 border border-red-500/20">
            <h3 class="text-2xl font-black text-red-400 mb-6">كابوس التاجر التقليدي</h3>
            <ul class="space-y-4 text-slate-400">
                <li class="flex gap-3">❌<span>تأكيد الطلبات يدوياً عبر الهاتف.</span></li>
                <li class="flex gap-3">❌<span>صعوبة تتبع حركة المخزون وتكرار النفاذ.</span></li>
                <li class="flex gap-3">❌<span>متابعة الشحن تستهلك ساعات طويلة.</span></li>
                <li class="flex gap-3">❌<span>العملاء يغادرون بسبب بطء الرد.</span></li>
            </ul>
        </div>
        <div class="p-10 rounded-3xl bg-emerald-900/5 border border-emerald-500/20">
            <h3 class="text-2xl font-black text-emerald-400 mb-6">جنة التاجر الأوتوماتيكي</h3>
            <ul class="space-y-4 text-slate-400">
                <li class="flex gap-3">✅<span>تأكيد الطلب آلياً عبر WhatsApp/SMS.</span></li>
                <li class="flex gap-3">✅<span>تحديث المخزون لحظياً مع الموردين.</span></li>
                <li class="flex gap-3">✅<span>إرسال بيانات الشحن للموزع بضغطة زر.</span></li>
                <li class="flex gap-3">✅<span>بوت ذكي يعالج 80% من أسئلة العملاء.</span></li>
            </ul>
        </div>
    </div>

    <!-- Deep Content Section -->
    <div class="prose prose-invert max-w-none">
        <h3 class="text-3xl font-black text-white">الركائز الثلاث للأتمتة الناجحة</h3>
        
        <h4>1. أتمتة مرحلة "قبل البيع" (Pre-Purchase)</h4>
        <p>السر يكمن في "قمع المبيعات" (Sales Funnel). الموقع لا يجب أن يسلم الطلب فقط، بل يجب أن يقنع الزائر. نستخدم اختبارات A/B، عروض الوقت المحدود، وأدوات إعادة الاستهداف لضمان أعلى نسبة تحويل.</p>
        
        <h4>2. أتمتة مرحلة "التنفيذ" (Fulfillment)</h4>
        <p>بمجرد خروج الطلب، يجب أن يتصل نظامك بنظام شركة الشحن. في الجزائر، قمنا بتطوير واجهات برمجية (APIs) تربط المتاجر مباشرة بشركات التوصيل المحلية لتوليد أرقام التتبع تلقائياً وإرسالها للعميل.</p>

        <div class="p-8 my-12 bg-white/5 border border-white/10 rounded-2xl relative">
            <div class="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h4 class="text-emerald-400 font-black">الوقت المسترد</h4>
            <p>أصحاب المتاجر الذين طبقوا نظام الأتمتة الكامل استردوا ما يعادل 15-20 ساعة عمل أسبوعياً، استغلوها في البحث عن منتجات جديدة أو توسيع النطاق التسويقي.</p>
        </div>

        <h4>3. أتمتة مرحلة "بعد البيع" (Retention)</h4>
        <p>العميل القديم أرخص 5 مرات من العميل الجديد. نبرمج تسلسلات بريد إلكتروني وواتساب تطلب تقييم المنتج بعد أسبوع، وتقدم خصومات مخصصة للطلب القادم، مما يحول المشتري العابر إلى عميل مخلص.</p>
    </div>

    <!-- Visual Aid: The Loop -->
    <div class="p-10 rounded-[3rem] bg-slate-900 border border-white/10 text-center">
        <h3 class="text-2xl font-black text-white mb-8">حلقة النمو الأوتوماتيكية</h3>
        <div class="flex flex-wrap justify-center gap-8 md:gap-16">
            <div class="flex flex-col items-center gap-4">
                <div class="w-20 h-20 rounded-full border-4 border-indigo-500 flex items-center justify-center text-xl font-black text-white">1</div>
                <p class="font-bold">جذب ذكي</p>
            </div>
            <div class="w-12 h-px bg-white/10 self-center hidden md:block"></div>
            <div class="flex flex-col items-center gap-4">
                <div class="w-20 h-20 rounded-full border-4 border-purple-500 flex items-center justify-center text-xl font-black text-white">2</div>
                <p class="font-bold">تحويل آلي</p>
            </div>
            <div class="w-12 h-px bg-white/10 self-center hidden md:block"></div>
            <div class="flex flex-col items-center gap-4">
                <div class="w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center text-xl font-black text-white">3</div>
                <p class="font-bold">تنفيذ سريع</p>
            </div>
            <div class="w-12 h-px bg-white/10 self-center hidden md:block"></div>
            <div class="flex flex-col items-center gap-4">
                <div class="w-20 h-20 rounded-full border-4 border-amber-500 flex items-center justify-center text-xl font-black text-white">4</div>
                <p class="font-bold">تكرار الشراء</p>
            </div>
        </div>
    </div>

    <!-- Checklist -->
    <div class="prose prose-invert max-w-none">
        <h3 class="text-3xl font-black text-white">قائمة مراجعة متجرك الأوتوماتيكي</h3>
        <ul class="space-y-4">
            <li><input type="checkbox" checked disabled> ربط المتجر بـ CRM مركزي.</li>
            <li><input type="checkbox" checked disabled> تفعيل نظام تأكيد الطلبات عبر SMS آلي.</li>
            <li><input type="checkbox" checked disabled> إعداد بوابات الدفع (Stripe/Paypal) أو تكامل الدفع عند الاستلام.</li>
            <li><input type="checkbox" checked disabled> برمجة تسلسلات المتابعة (Email Marketing).</li>
        </ul>
    </div>

    <!-- CTA Section -->
    <div class="p-12 md:p-20 rounded-[4rem] bg-gradient-to-br from-indigo-600 to-emerald-600 text-white text-center shadow-3xl">
        <h2 class="text-4xl md:text-5xl font-black mb-8">حان الوقت لتشغيل محرك الأتمتة الخاص بك</h2>
        <p class="text-xl mb-12 opacity-90">لا تدع المهام اليدوية تقتل طموحك. ابدأ اليوم ببناء متجر يعمل من أجلك، وليس العكس.</p>
        <div class="flex flex-wrap justify-center gap-4">
            <button class="px-12 py-6 bg-white text-indigo-600 font-black text-lg rounded-2xl shadow-xl hover:scale-105 transition-all">احصل على استشارة الأتمتة</button>
            <button class="px-12 py-6 bg-transparent border-2 border-white text-white font-black text-lg rounded-2xl hover:bg-white/10 transition-all">مشاهدة عرض تجريبي</button>
        </div>
    </div>
</div>
`;
