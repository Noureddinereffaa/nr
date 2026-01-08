import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard utility for merging Tailwind CSS classes safely
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Enhanced date formatting with locale support
 */
export function formatDate(dateString: string | undefined, locale: 'en-US' | 'ar-EG' = 'ar-EG'): string {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString(locale, {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    } catch (e) {
        return 'Invalid Date';
    }
}

/**
 * Formats currency with support for DZD (Algerian Dinar)
 */
export function formatCurrency(amount: number, currency: 'USD' | 'EUR' | 'DZD' = 'DZD', locale: 'ar-DZ' | 'en-US' = 'ar-DZ'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

/**
 * Standardizes slug generation for SEO-friendly URLs
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-') // Support Arabic characters
        .replace(/^-+|-+$/g, '');
}

/**
 * Truncates text with ellipsis
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
}
