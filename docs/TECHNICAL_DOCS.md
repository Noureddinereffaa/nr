# Technical Documentation: Service Request System

This document provides a technical overview of the Service Request and Client Portal system.

## Architecture

The system is built on a service-oriented architecture, separating data fetching and business logic from the UI components.

### Core Services

1.  **[requestService.ts](../lib/services/requestService.ts)**
    -   Handles all CRUD operations for `service_requests`.
    -   Manages automated timeline events (creation, status changes).
    -   Handles attachment metadata synchronization.
    -   Supports real-time updates via Supabase.

2.  **[fileUploadService.ts](../lib/services/fileUploadService.ts)**
    -   Standardized interface for Supabase Storage.
    -   Includes file validation (size/type).
    -   Provides utility methods for file icons and size formatting.
    -   Supports simulation mode for environments without Supabase credentials.

---

## Data Schema (`service_requests` table)

The table combines structured columns for performance and a `data` JSONB column for flexibility.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `TEXT` | Primary Key (`req-timestamp`) |
| `project_id` | `TEXT` | FK to projects for filtering |
| `client_email`| `TEXT` | Used for portal access |
| `status` | `TEXT` | `new`, `review`, `proposal`, `accepted`, `rejected`, `completed` |
| `attachments` | `JSONB`| Array of `RequestAttachment` objects |
| `timeline_events`| `JSONB`| Array of `RequestTimelineEvent` objects |
| `data` | `JSONB` | Legacy data container for backward compatibility |

---

## Real-time Sync Logic

The system uses [Supabase Realtime](https://supabase.com/docs/guides/realtime) to keep the UI in sync without manual refreshes.

### Client View (`ClientPortalPage.tsx`)
Subscribes to changes filtered by `project_id`:
```typescript
filter: `project_id=eq.${project.id}`
```

### Admin View (`RequestDetail.tsx`)
Subscribes to specific request ID updates:
```typescript
filter: `id=eq.${request.id}`
```

When an `UPDATE` event is received, the components trigger a fresh `fetch` via `requestService.getAll()` to ensure all complex relations (attachments/timeline) are up to date.

---

## Component Props Documentation

### `FileUploader`
- `onFilesUploaded`: Callback `(results: UploadResult[]) => void`
- `maxFiles`: `number` (Default: 5)
- `maxSizeMB`: `number` (Default: 10)
- `allowedTypes`: `string[]`

### `Timeline`
- `events`: `RequestTimelineEvent[]`
- `className`: `string`
