import { Project, Article } from './types';

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
    }
];

export const ARTICLES: Article[] = [
    {
        id: "art-1",
        slug: "why-need-digital-system",
        title: "لماذا يحتاج نشاطك التجاري إلى 'نظام' وليس مجرد موقع إلكتروني؟",
        content: "# لماذا تحتاج نظاماً رقمياً...",
        excerpt: "في عصر المنافسة الشرسة، الموقع الإلكتروني التقليدي لم يعد كافياً.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        category: "Business Strategy",
        tags: ["Digital Transformation", "Sales"],
        keywords: ["نظام رقمي", "مبيعات"],
        author: "Noureddine Reffaa",
        date: new Date().toISOString(),
        status: "published",
        readTime: "18 دقيقة",
        seo: { title: "لماذا تحتاج نظاماً رقمياً | NR Strategy", description: "الموقع الإلكتروني مجرد واجهة، النظام هو المحرك. تعلم كيف تبني نظام مبيعات أوتوماتيكي.", focusKeyword: "نظام رقمي" }
    }
];
