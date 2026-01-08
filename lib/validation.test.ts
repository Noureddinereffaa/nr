import { describe, it, expect } from 'vitest';
import { validate, sanitize } from './validation';

describe('Validation Library', () => {
    describe('validate', () => {
        it('validates emails correctly', () => {
            expect(validate.email('test@example.com')).toBe(true);
            expect(validate.email('invalid-email')).toBe(false);
        });

        it('validates phones correctly', () => {
            expect(validate.phone('1234567890')).toBe(true);
            expect(validate.phone('123')).toBe(false); // too short
        });

        it('detects malicious content', () => {
            expect(validate.noMalicious('Hello World')).toBe(true);
            expect(validate.noMalicious('<script>alert(1)</script>')).toBe(false);
        });

        it('detects Arabic text', () => {
            expect(validate.isArabic('مرحبا')).toBe(true);
            expect(validate.isArabic('Hello')).toBe(false);
        });
    });

    describe('sanitize', () => {
        it('sanitizes text (removes HTML)', () => {
            expect(sanitize.text('<b>Bold</b>')).toBe('Bold');
        });

        it('sanitizes HTML (removes scripts)', () => {
            const malicious = '<div onclick="alert(1)">content</div><script>console.log(1)</script>';
            const clean = sanitize.html(malicious);
            expect(clean).not.toContain('onclick');
            expect(clean).not.toContain('<script>');
            expect(clean).toContain('<div>content</div>');
        });

        it('sanitizes URLs', () => {
            expect(sanitize.url('https://google.com')).toBe('https://google.com/');
            expect(sanitize.url('javascript:alert(1)')).toBe('');
        });
    });
});
