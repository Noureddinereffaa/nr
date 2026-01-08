import { useState } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    width,
    height,
    priority = false
}) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    // Generate srcset for responsive images
    const srcSet = `
    ${src}?w=400 400w,
    ${src}?w=800 800w,
    ${src}?w=1200 1200w
  `;

    return (
        <div className={`relative ${className}`}>
            {!loaded && !error && (
                <div className="absolute inset-0 bg-slate-800 animate-pulse rounded-lg" />
            )}
            <img
                src={src}
                srcSet={srcSet}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={alt}
                width={width}
                height={height}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
                className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
            />
            {error && (
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center rounded-lg">
                    <span className="text-slate-500 text-sm">فشل تحميل الصورة</span>
                </div>
            )}
        </div>
    );
};
