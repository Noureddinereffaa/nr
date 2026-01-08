/**
 * Lightweight Validation & Sanitization Library
 * No external dependencies - pure JavaScript implementation
 */

/**
 * Validation Rules
 */
export const ValidationRules = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d\s\-\+\(\)]+$/,
    url: /^https?:\/\/.+/,
    alphanumeric: /^[a-zA-Z0-9\s]+$/,
    arabic: /^[\u0600-\u06FF\s]+$/,
    noScript: /<script|javascript:|onerror=|on\w+\s*=/i
};

/**
 * Basic HTML sanitization (removes dangerous tags and attributes)
 */
const sanitizeHTML = (html: string): string => {
    // Remove script tags and their content
    let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handlers
    cleaned = cleaned.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    cleaned = cleaned.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

    // Remove javascript: protocol
    cleaned = cleaned.replace(/javascript:/gi, '');

    // Remove data: protocol (can be used for XSS)
    cleaned = cleaned.replace(/data:text\/html/gi, '');

    return cleaned;
};

/**
 * Sanitization utilities
 */
export const sanitize = {
    text: (input: string): string => {
        // Remove all HTML tags
        return input.replace(/<[^>]*>/g, '').trim();
    },

    html: (input: string): string => {
        return sanitizeHTML(input);
    },

    email: (input: string): string => {
        return input.toLowerCase().trim();
    },

    phone: (input: string): string => {
        return input.replace(/[^\d\+]/g, '');
    },

    url: (input: string): string => {
        try {
            const url = new URL(input);
            // Only allow http and https protocols
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                return '';
            }
            return url.toString();
        } catch {
            return '';
        }
    }
};

/**
 * Validation utilities
 */
export const validate = {
    email: (email: string): boolean => {
        return ValidationRules.email.test(email);
    },

    phone: (phone: string): boolean => {
        return ValidationRules.phone.test(phone) && phone.length >= 10;
    },

    url: (url: string): boolean => {
        return ValidationRules.url.test(url);
    },

    required: (value: any): boolean => {
        return value !== null && value !== undefined && value !== '';
    },

    minLength: (value: string, min: number): boolean => {
        return value.length >= min;
    },

    maxLength: (value: string, max: number): boolean => {
        return value.length <= max;
    },

    noMalicious: (value: string): boolean => {
        return !ValidationRules.noScript.test(value);
    },

    isArabic: (value: string): boolean => {
        return ValidationRules.arabic.test(value);
    },

    isAlphanumeric: (value: string): boolean => {
        return ValidationRules.alphanumeric.test(value);
    }
};

/**
 * Form validation helper
 */
export interface ValidationError {
    field: string;
    message: string;
}

export const validateForm = (
    data: Record<string, any>,
    rules: Record<string, ((value: any) => boolean | string)[]>
): ValidationError[] => {
    const errors: ValidationError[] = [];

    for (const [field, validators] of Object.entries(rules)) {
        const value = data[field];

        for (const validator of validators) {
            const result = validator(value);
            if (typeof result === 'string') {
                errors.push({ field, message: result });
                break;
            } else if (result === false) {
                errors.push({ field, message: `${field} is invalid` });
                break;
            }
        }
    }

    return errors;
};
