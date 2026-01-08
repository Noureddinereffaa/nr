export type SchemaType = 'Article' | 'FAQPage' | 'Organization' | 'BreadcrumbList';

export const SchemaGenerator = {
    organization: (data: { name: string; url: string; logo?: string; sameAs?: string[] }) => ({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name,
        url: data.url,
        logo: data.logo,
        sameAs: data.sameAs || [],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            areaServed: 'DZ',
            availableLanguage: ['ar', 'en', 'fr']
        }
    }),

    article: (data: {
        headline: string;
        image: string[];
        datePublished: string;
        dateModified: string;
        authorName: string;
        description: string;
        url: string;
    }) => ({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.headline,
        image: data.image,
        datePublished: data.datePublished,
        dateModified: data.dateModified || data.datePublished,
        author: [{
            '@type': 'Person',
            name: data.authorName,
            url: 'https://nr-os.vercel.app/about' // Should be dynamic
        }],
        publisher: {
            '@type': 'Organization',
            name: 'NR-OS',
            logo: {
                '@type': 'ImageObject',
                url: 'https://nr-os.vercel.app/logo.png'
            }
        },
        description: data.description,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url
        }
    }),

    faq: (questions: { question: string; answer: string }[]) => ({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map(q => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: q.answer
            }
        }))
    }),

    breadcrumb: (items: { name: string; item: string; position: number }[]) => ({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map(item => ({
            '@type': 'ListItem',
            position: item.position,
            name: item.name,
            item: item.item
        }))
    })
};
