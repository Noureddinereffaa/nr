import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords = 'software development, digital transformation, algeria, tech agency, web development',
    image = 'https://nr-os.com/images/og-default.jpg',
    url = 'https://nr-os.com'
}) => {
    const siteTitle = `${title} | NR-OS`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={siteTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Favicon & Theme */}
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <meta name="theme-color" content="#0f172a" />
        </Helmet>
    );
};

export default SEO;
