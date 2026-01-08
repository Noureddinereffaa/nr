# Component Library Documentation

This project uses a custom set of reusable UI components found in `components/ui`.

## Core Components

### 1. Button

A flexible button component with multiple variants and states.

**Path**: `components/ui/Button.tsx`

**Props**:
- `variant`: `primary` (default), `secondary`, `outline`, `ghost`, `danger`
- `size`: `sm`, `md` (default), `lg`, `icon`
- `isLoading`: `boolean` - Shows a spinner and disables the button.
- `leftIcon`, `rightIcon`: `LucideIcon` - Icons to display.

**Usage**:
```tsx
import { Button } from '@/components/ui/Button';
import { Mail } from 'lucide-react';

<Button 
  variant="primary" 
  leftIcon={Mail} 
  onClick={() => console.log('Sent')}
>
  Send Email
</Button>
```

### 2. Input

A styled input field with support for labels and error messages.

**Path**: `components/ui/Input.tsx`

**Props**:
- `label`: `string` - Label text displayed above the input.
- `error`: `string` - Error message displayed below in red.
- `icon`: `LucideIcon` - Icon displayed inside the input on the left.
- All standard `HTMLInputElement` props.

**Usage**:
```tsx
import { Input } from '@/components/ui/Input';
import { User } from 'lucide-react';

<Input 
  label="Username" 
  placeholder="Enter username" 
  icon={User} 
  error={formErrors.username}
/>
```

### 3. Card

A glassmorphism-styled container for grouping content.

**Path**: `components/ui/Card.tsx`

**Props**:
- `gradient`: `boolean` - Adds a subtle accent gradient border and background effect.
- All standard `HTMLDivElement` props.

**Usage**:
```tsx
import { Card } from '@/components/ui/Card';

<Card gradient className="p-4">
  <h3 className="text-xl">Featured Content</h3>
  <p>This card has a nice gradient effect.</p>
</Card>
```

## Layout Components

### Dashboard Layout components
- `components/dashboard/Sidebar.tsx`: Main navigation.
- `components/dashboard/Header.tsx`: Top bar with search and profile.

## Best Practices

1.  **Reusability**: Always try to use `Button` and `Card` instead of raw HTML elements to ensure UI consistency.
2.  **Tailwind**: Use the `cn()` utility to merge custom classes with component defaults.
    ```tsx
    <Button className="w-full mt-4">Full Width</Button>
    ```
