# API & Utilities Overview

## Data Access Layer (Supabase)

We use custom hooks to interact with Supabase (Database & Auth).

### 1. useBusiness Hook
**Path**: `context/BusinessContext.tsx`
Manages core business entities:
- `projects`: CRO & Analytics projects.
- `clients`: Customer data.
- `invoices`: Financial records.
- `transactions`: Cash flow data.

**Methods**:
- `addProject(project)`, `updateProject(id, data)`
- `addClient(client)`, `updateClient(id, data)`
- `addInvoice(invoice)`, `updateInvoice(id, data)`

### 2. useSync Hook
**Path**: `context/SyncContext.tsx`
Handles offline-first synchronization with the cloud.
- `syncState`: 'idle' | 'syncing' | 'error' | 'conflict'
- `resolveConflict(method)`: 'local' (keep ours) or 'server' (take theirs).

## Utility Libraries

### Validation (`lib/validation.ts`)
Zero-dependency validation library.

- `validate.email(str)`
- `validate.phone(str)`
- `validate.noMalicious(str)`: Checks for XSS vectors.
- `sanitize.html(str)`: Strips scripts and dangerous attributes.

### General Utilities (`lib/utils.ts`)

- `cn(...)`: Class name merger (combines `clsx` and `tailwind-merge`).
- `formatDate(date, locale)`: Standardized date formatting.
- `formatCurrency(amount, currency)`: Money formatting with locale support.
- `generateSlug(text)`: Creates SEO-friendly URL slugs (supports Arabic).

## AI Integration (`lib/ai-service.ts`)

Interfaces with Gemini API for content generation.
**Note**: Some methods are currently stubbed awaiting full "Sovereign AI" integration.

- `generateSection(prompt)`
- `improveContent(text)`
