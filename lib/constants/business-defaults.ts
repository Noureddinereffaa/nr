import { Service, Project, Stat, Testimonial, FAQItem, ProcessStep, SocialIntegration } from '../types';

export const DEFAULT_STATS: Stat[] = [
    { icon: "ShieldCheck", label: "اعتماد قانوني", val: "100%" },
    { icon: "Users", label: "شريك نجاح", val: "85+" },
    { icon: "Briefcase", label: "مشروع منجز", val: "140+" },
    { icon: "Zap", label: "دعم استراتيجي", val: "24/7" }
];

export const SERVICES: Service[] = [
    {
        id: "s1",
        code: "NR-PRO-01",
        title: "إدارة المشاريع من الصفر",
        description: "نأخذ فكرتك من مرحلة التخطيط الورقي إلى كيان رقمي متكامل، مع إدارة شاملة لضمان النجاح والوصول للأهداف المرجوة.",
        icon: "Rocket",
        price: 0,
        priceLabel: "حسب المشروع",
        features: ["تخطيط استراتيجي شامل", "إدارة فرق العمل", "متابعة الميزانية والجدول الزمني", "تقييم المخاطر الرقمية"]
    },
    {
        id: "s2",
        code: "NR-WEB-02",
        title: "إنشاء المواقع والمنصات",
        description: "بناء منصات تجارة إلكترونية ومواقع مؤسساتية متطورة تركز على تجربة المستخدم (UX) وتحقيق أعلى معدلات التحويل.",
        icon: "Layout",
        price: 50000,
        priceLabel: "من 50,000 دج",
        features: ["تصميم واجهات UI/UX", "سرعة أداء فائقة", "توافق مع محركات البحث SEO", "أنظمة دفع وحجز متكاملة"]
    },
    {
        id: "s3",
        code: "NR-MKT-03",
        title: "إدارة التسويق الرقمي",
        description: "استراتيجيات نمو مبنية على البيانات لضمان الهيمنة على السوق واستهداف الجمهور الصحيح بأقل تكلفة وأعلى عائد.",
        icon: "BarChart4",
        price: 30000,
        priceLabel: "من 30,000 دج/شهر",
        features: ["إدارة حملات Ads الاحترافية", "تحليل سلوك المستهلك", "كتابة محتوى بيعي إقناعي", "بناء قمع المبيعات Funnels"]
    },
    {
        id: "s4",
        code: "NR-AUTO-04",
        title: "هندسة الأنظمة الأوتوماتيكية",
        description: "تحويل عمليات مشروعك اليدوية إلى أنظمة ذكية تعمل تلقائياً، مما يوفر وقتك ويقلل الأخطاء البشرية بنسبة تصل لـ 80%.",
        icon: "Zap",
        price: 0,
        priceLabel: "حسب الاحتياج",
        features: ["أتمتة خدمة العملاء", "ربط الأنظمة عبر API", "نظام تنبيهات ذكي", "تقارير أداء آلية"]
    }
];

export const WORK_PROCESS: ProcessStep[] = [
    { step: "01", title: "التشخيص الرقمي", desc: "تحليل دقيق لوضعك الحالي واكتشاف نقاط الضعف التي تمنعك من النمو." },
    { step: "02", title: "الهندسة المعمارية", desc: "رسم المخطط التقني والاستراتيجي للحل المقترح." },
    { step: "03", title: "الإطلاق والضبط", desc: "تنفيذ الحل ومراقبته في بيئة حقيقية لضمان الأداء الأقصى." },
    { step: "04", title: "الهيمنة السوقية", desc: "توسيع النطاق ومتابعة النمو المستدام لضمان الريادة." }
];

export const FAQS: FAQItem[] = [
    { q: "لماذا أختار نورالدين رفعة بدلاً من شركة برمجية؟", a: "لأنني أقدم شريك نجاح تقني وقانوني (مقاول معتمد) يهتم بالعائد المادي لمشروعك، وليس مجرد تسليم أكواد برمجية." }
];

export const INTEGRATIONS: SocialIntegration[] = [
    { id: 'li', provider: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', status: 'disconnected' },
    { id: 'tw', provider: 'twitter', name: 'Twitter (X)', icon: 'Twitter', status: 'disconnected' },
    { id: 'fb', provider: 'facebook', name: 'Facebook', icon: 'Facebook', status: 'disconnected' },
    { id: 'ig', provider: 'instagram', name: 'Instagram', icon: 'Instagram', status: 'disconnected' },
    { id: 'gb', provider: 'google_business', name: 'Google Business', icon: 'Globe', status: 'disconnected' }
];
