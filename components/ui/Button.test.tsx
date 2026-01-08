import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
    it('renders correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('applies variant classes', () => {
        render(<Button variant="danger">Delete</Button>);
        const button = screen.getByText('Delete');
        expect(button.className).toContain('bg-red-500');
    });

    it('shows loading state', () => {
        const { container } = render(<Button isLoading>Submit</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });
});
