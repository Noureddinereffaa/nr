import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatCurrency, generateSlug, truncate } from './utils';

describe('Utils Library', () => {
    describe('cn()', () => {
        it('merges class names correctly', () => {
            expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
        });

        it('handles conditional classes', () => {
            expect(cn('px-2', true && 'py-1', false && 'bg-red-500')).toBe('px-2 py-1');
        });

        it('merges tailwind conflicts (tailwind-merge)', () => {
            // tailwind-merge should override p-2 with p-4
            expect(cn('p-2', 'p-4')).toBe('p-4');
        });
    });

    describe('formatDate()', () => {
        it('formats date correctly for EN locale', () => {
            const date = '2023-01-15T12:00:00';
            expect(formatDate(date, 'en-US')).toBe('January 15, 2023');
        });

        it('handles invalid dates', () => {
            expect(formatDate('invalid-date')).toBe('Invalid Date');
        });

        it('handles undefined input', () => {
            expect(formatDate(undefined)).toBe('N/A');
        });
    });

    describe('formatCurrency()', () => {
        it('formats USD correctly', () => {
            // Note: internal implementation uses toLocaleString which depends on node/browser locale
            // We check for the presence of the currency symbol or code
            const result = formatCurrency(1000, 'USD', 'en-US');
            expect(result).toContain('$');
            expect(result).toContain('1,000.00');
        });

        it('formats DZD correctly', () => {
            const result = formatCurrency(1000, 'DZD', 'ar-DZ');
            // DZD formatting might vary, usually includes 'د.ج'
            expect(result).toMatch(/د.ج/);
        });
    });

    describe('generateSlug()', () => {
        it('converts to lowercase', () => {
            expect(generateSlug('Hello World')).toBe('hello-world');
        });

        it('handles special characters', () => {
            expect(generateSlug('Hello @ World!')).toBe('hello-world');
        });

        it('supports Arabic characters', () => {
            expect(generateSlug('مرحبا بالعالم')).toBe('مرحبا-بالعالم');
        });
    });

    describe('truncate()', () => {
        it('truncates long text', () => {
            expect(truncate('Hello World', 5)).toBe('Hello...');
        });

        it('returns original text if short enough', () => {
            expect(truncate('Hello', 10)).toBe('Hello');
        });
    });
});
