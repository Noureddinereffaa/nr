
import { Service, Project, Stat, Testimonial, FAQItem, ProcessStep, Article } from './types';

export const NOUREDDINE_DATA = {
  name: "نورالدين رفعة",
  nameEn: "Noureddine Reffaa",
  primaryTitle: "مهندس نمو المشاريع الرقمية",
  secondaryTitle: "استشاري استراتيجي في التجارة الإلكترونية | مقاول معتمد",
  cardId: "19664843",
  address: "باتنة، الجزائر - حي حملة 3",
  expiry: "25-03-2030",
  photoUrl: "https://www2.0zz0.com/2025/12/17/16/907136235.jpg",
  bio: "نحن لا نصمم واجهات فقط، نحن نهندس أنظمة مبيعات أوتوماتيكية وندير مشاريعك من الصفر لضمان الهيمنة على السوق الرقمي.",
  socials: {
    whatsapp: "https://wa.me/213555000000",
    email: "contact@reffaa.com",
    linkedin: "https://linkedin.com/in/noureddine-reffaa",
    facebook: "https://facebook.com/noureddine.reffaa"
  }
};

export const DEFAULT_STATS: Stat[] = [
  { icon: "ShieldCheck", label: "اعتماد قانوني", val: "100%" },
  { icon: "Users", label: "شريك نجاح", val: "85+" },
  { icon: "Briefcase", label: "مشروع منجز", val: "140+" },
  { icon: "Zap", label: "دعم استراتيجي", val: "24/7" }
];

export const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "منصة التوزيع الكبرى",
    category: "SaaS Enterprise",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    status: "completed",
    featured: true,
    tags: ["React", "PostgreSQL", "Google Cloud"],
    stats: "أتمتة 90% من العمليات",
    fullDescription: "نظام متكامل لإدارة سلسلة التوريد والمبيعات لشركة استيراد كبرى، يربط المخازن بنقاط البيع لحظياً.",
    client: "مجموعة الواحة للاستيراد",
    date: "ديسمبر 2024",
    technologies: ["React", "PostgreSQL", "Google Cloud", "AI Forecasting"],
    challenges: "تشتت البيانات بين الفروع وصعوبة تتبع حركة المخزون مما تسبب في خسائر تشغيلية.",
    solutions: "تطوير لوحة تحكم مركزية بنظام السحب والإفلات لمراقبة المخزون، مع دمج ذكاء اصطناعي للتنبؤ بالطلب المستقبلي.",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1504868584819-f8e905263543?auto=format&fit=crop&q=80&w=800"
    ],
    links: { demo: "#" }
  },
  {
    id: "p2",
    title: "متجر أزياء رقمي متكامل",
    category: "E-Commerce",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    status: "completed",
    featured: true,
    tags: ["Next.js", "Stripe", "Shopify"],
    stats: "نمو المبيعات 300%",
    fullDescription: "منصة تجارة إلكترونية متطورة لعلامة أزياء محلية، مع نظام دفع متعدد ومتابعة شحن لحظية.",
    client: "بوتيك الأناقة",
    date: "نوفمبر 2024",
    technologies: ["Next.js", "Stripe", "Shopify API", "Tailwind CSS"],
    challenges: "غياب وجود رقمي للعلامة التجارية وصعوبة التواصل مع العملاء.",
    solutions: "بناء هوية رقمية متكاملة مع متجر إلكتروني سريع وتكامل مع وسائل التواصل الاجتماعي.",
    gallery: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800"
    ],
    links: { demo: "#" }
  },
  {
    id: "p3",
    title: "تطبيق حجز المواعيد الذكي",
    category: "Mobile App",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    status: "completed",
    featured: false,
    tags: ["React Native", "Firebase", "Node.js"],
    stats: "10,000+ مستخدم",
    fullDescription: "تطبيق حجز مواعيد للعيادات الطبية مع إشعارات ذكية ونظام دفع إلكتروني.",
    client: "مجمع الشفاء الطبي",
    date: "أكتوبر 2024",
    technologies: ["React Native", "Firebase", "Node.js", "Push Notifications"],
    challenges: "ازدحام العيادة وصعوبة إدارة المواعيد يدوياً.",
    solutions: "تطبيق ذكي يسمح بالحجز والإلغاء بسهولة مع تذكيرات تلقائية.",
    gallery: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&q=80&w=800"
    ],
    links: { demo: "#" }
  },
  {
    id: "p4",
    title: "لوحة تحكم تحليلات الأعمال",
    category: "Business Intelligence",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    status: "completed",
    featured: true,
    tags: ["Power BI", "Python", "ML"],
    stats: "توفير 15 ساعة/أسبوع",
    fullDescription: "نظام ذكاء أعمال يجمع بيانات المبيعات والمخزون ويقدم تقارير تنبؤية.",
    client: "شركة الصناعات الغذائية",
    date: "سبتمبر 2024",
    technologies: ["Power BI", "Python", "SQL Server", "Machine Learning"],
    challenges: "قرارات مبنية على الحدس بدلاً من البيانات.",
    solutions: "لوحة تحكم تفاعلية تعرض KPIs في الوقت الفعلي مع تنبؤات AI.",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1543286386-713df548e9cc?auto=format&fit=crop&q=80&w=800"
    ],
    links: { demo: "#" }
  },
  {
    id: "p5",
    title: "موقع مؤسسي فاخر",
    category: "Corporate Website",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    status: "completed",
    featured: false,
    tags: ["React", "Framer Motion", "CMS"],
    stats: "زيادة الاستفسارات 200%",
    fullDescription: "موقع مؤسسي عصري لشركة عقارية كبرى مع نظام عرض العقارات والتواصل المباشر.",
    client: "العمران للتطوير العقاري",
    date: "أغسطس 2024",
    technologies: ["React", "Framer Motion", "Sanity CMS", "Google Maps API"],
    challenges: "موقع قديم لا يعكس مستوى الشركة الحقيقي.",
    solutions: "تصميم فاخر مع رسوم متحركة سلسة ونظام إدارة محتوى سهل.",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
    ],
    links: { demo: "#" }
  },
  {
    id: "p6",
    title: "نظام إدارة الموارد البشرية",
    category: "HR Tech",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    status: "in-progress",
    featured: false,
    tags: ["Vue.js", "Laravel", "MySQL"],
    stats: "تقليل الأخطاء 85%",
    fullDescription: "منصة شاملة لإدارة الموظفين والرواتب والإجازات مع تقارير تحليلية.",
    client: "مجموعة التميز للخدمات",
    date: "يوليو 2024",
    technologies: ["Vue.js", "Laravel", "MySQL", "Chart.js"],
    challenges: "إدارة يدوية مرهقة للموظفين وحسابات الرواتب.",
    solutions: "نظام أتمتة كامل مع بوابة ذاتية للموظفين ولوحة تحكم للإدارة.",
    gallery: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
    ],
    links: { demo: "#" }
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "سفيان بن علي",
    role: "مدير تنفيذي - ديزاد فود",
    text: "نورالدين ليس مجرد مطور، بل مهندس حلول يفهم السوق الجزائري بعمق. بفضله حققنا نمواً غير مسبوق في المبيعات.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
  }
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

export const ARTICLES: Article[] = [
  {
    id: "art-1",
    slug: "why-need-digital-system",
    title: "لماذا يحتاج نشاطك التجاري إلى 'نظام' وليس مجرد موقع إلكتروني؟",
    content: "المحتوى الكامل للمقال...",
    excerpt: "في عصر المنافسة الشرسة، الموقع الإلكتروني التقليدي لم يعد كافياً. اكتشف كيف تحول مشروعك إلى آلة بيع أوتوماتيكية.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    category: "Business Strategy",
    tags: ["Digital Transformation", "Sales"],
    keywords: ["نظام رقمي", "مبيعات"],
    author: "Noureddine Reffaa",
    date: new Date().toISOString(),
    status: "published",
    readTime: "5 دقيقة",
    seo: { title: "", description: "", focusKeyword: "" }
  },
  {
    id: "art-2",
    slug: "ai-in-algerian-market",
    title: "مستقبل الذكاء الاصطناعي في السوق الجزائري: فرص وتحديات 2025",
    content: "المحتوى الكامل للمقال...",
    excerpt: "كيف يمكن للشركات الجزائرية استغلال ثورة الذكاء الاصطناعي لتقليل التكاليف ومضاعفة الإنتاجية قبل فوات الأوان.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    category: "AI Trends",
    tags: ["AI", "Algeria"],
    keywords: ["ذكاء اصطناعي", "الجزائر"],
    author: "Noureddine Reffaa",
    date: new Date().toISOString(),
    status: "published",
    readTime: "7 دقيقة",
    seo: { title: "", description: "", focusKeyword: "" }
  },
  {
    id: "art-3",
    slug: "e-commerce-automation",
    title: "أتمتة التجارة الإلكترونية: كيف تدير متجرك وأنت نائم",
    content: "المحتوى الكامل للمقال...",
    excerpt: "دليل عملي لأصحاب المتاجر الإلكترونية لربط المخزون، الشحن، وخدمة العملاء في نظام واحد متكامل.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800",
    category: "E-Commerce",
    tags: ["Automation", "E-com"],
    keywords: ["تجارة إلكترونية", "أتمتة"],
    author: "Noureddine Reffaa",
    date: new Date().toISOString(),
    status: "published",
    readTime: "6 دقيقة",
    seo: { title: "", description: "", focusKeyword: "" }
  }
];
