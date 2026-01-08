import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
    it('renders children correctly', () => {
        render(<Card>Test Content</Card>);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies gradient classes when gradient prop is true', () => {
        const { container } = render(<Card gradient>Content</Card>);
        // Check for the gradient class on the main div
        // Note: The implementation uses 'bg-gradient-to-br from-slate-900 to-slate-900/50'
        const card = container.firstChild;
        expect(card).toHaveClass('bg-gradient-to-br');
    });

    it('renders gradient accent line when gradient prop is true', () => {
        const { container } = render(<Card gradient>Content</Card>);
        // The accent line is an absolute div inside
        const accentLine = container.querySelector('.bg-gradient-to-r');
        expect(accentLine).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(<Card className="custom-test-class">Content</Card>);
        expect(container.firstChild).toHaveClass('custom-test-class');
    });
});
