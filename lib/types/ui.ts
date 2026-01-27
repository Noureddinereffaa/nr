export interface NavigationItem {
    id: string;
    label: string;
    path: string;
    icon?: string;
}

export interface SiteSection {
    id: string;
    type: 'hero' | 'services' | 'projects' | 'testimonials' | 'contact' | 'about';
    title: string;
    subtitle?: string;
    content?: Record<string, any>;
    visible: boolean;
}

export interface Stat {
    icon: string;
    label: string;
    val: string;
}

export interface Testimonial {
    name: string;
    role: string;
    text: string;
    avatar: string;
}

export interface FAQItem {
    q: string;
    a: string;
}

export interface ProcessStep {
    step: string;
    title: string;
    desc: string;
}
