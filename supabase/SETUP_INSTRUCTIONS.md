# Supabase Setup Instructions

## Phase 7: Database & Storage Configuration

Follow these steps to configure Supabase for the enhanced service request system.

---

## Prerequisites

- ✅ Supabase project created
- ✅ Supabase URL and keys configured in `.env`
- ✅ `service_requests` table exists

---

## Step 1: Run Database Migration

### Via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the contents of `supabase/migrations/add_service_request_enhancements.sql`
5. Paste and execute (⌘/Ctrl + Enter)
6. Verify success message

### Via Supabase CLI

```bash
# If using Supabase CLI
supabase migration new add_service_request_enhancements
# Copy the SQL content to the generated migration file
supabase db push
```

### Verification

Run this query to verify columns were added:

```sql
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'service_requests'
AND column_name IN ('category', 'source', 'attachments', 'timeline_events', 'internal_notes', 'estimated_completion');
```

You should see 6 rows returned.

---

## Step 2: Create Storage Bucket

### Via Supabase Dashboard

1. Navigate to **Storage** in your Supabase dashboard
2. Click **New Bucket**
3. Enter bucket name: `service-attachments`
4. Select **Private** (not public)
5. Click **Create Bucket**

### Configuration Settings

After bucket creation, configure limits:

1. Click on the `service-attachments` bucket
2. Go to **Settings** tab
3. Set **File size limit**: 10 MB (10485760 bytes)
4. Set **Allowed MIME types**:
   ```
   image/jpeg
   image/png
   image/gif
   image/webp
   application/pdf
   application/msword
   application/vnd.openxmlformats-officedocument.wordprocessingml.document
   application/vnd.ms-excel
   application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
   application/zip
   application/x-zip-compressed
   ```

---

## Step 3: Apply Storage RLS Policies

1. Go to **SQL Editor**
2. Create a new query
3. Copy contents of `supabase/migrations/storage_rls_policies.sql`
4. Execute the query

### Verify Policies

Run this query to check policies:

```sql
SELECT policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%service-attachments%';
```

You should see policies for INSERT, SELECT, and DELETE operations.

---

## Step 4: Test Configuration

### Test Database Columns

```sql
-- Insert test request with new fields
INSERT INTO service_requests (
  id,
  client_name,
  service_title,
  client_email,
  client_phone,
  status,
  category,
  source,
  attachments,
  timeline_events,
  data
) VALUES (
  'test-' || gen_random_uuid()::text,
  'Test Client',
  'Test Service Request',
  'test@example.com',
  '0123456789',
  'new',
  'development',
  'portal',
  '[]'::jsonb,
  '[{"id":"evt-1","timestamp":"2026-01-29T00:00:00Z","type":"created","description":"Test event","actor":"client"}]'::jsonb,
  '{}'::jsonb
);

-- Verify insertion
SELECT category, source, attachments, timeline_events
FROM service_requests
WHERE client_name = 'Test Client';

-- Clean up test data
DELETE FROM service_requests WHERE client_name = 'Test Client';
```

### Test Storage Upload (via JavaScript)

```javascript
// In your browser console on the portal page
const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
const { data, error } = await supabase.storage
  .from('service-attachments')
  .upload(`test-${Date.now()}.txt`, testFile);

console.log('Upload result:', data, error);

// If successful, clean up
if (data) {
  await supabase.storage
    .from('service-attachments')
    .remove([data.path]);
}
```

---

## Step 5: Update Application Configuration

### Environment Variables

Ensure these are set in your `.env.local`:

``env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### fileUploadService Configuration

The service is already configured to use:
- Bucket: `service-attachments`
- Max size: 10MB
- Folder structure: `{clientEmail}/{timestamp}-{filename}`

No changes needed if using defaults.

---

## Troubleshooting

### Issue: "Bucket not found"
**Solution:** Verify bucket name is exactly `service-attachments` (no typos)

### Issue: "RLS policy violation"
**Solution:** 
- Check user is authenticated
- Verify policies were applied correctly
- Check policy conditions match your auth setup

### Issue: "File size too large"
**Solution:**
- Verify bucket file size limit is set to 10MB
- Check FileUploader maxSizeMB prop (default: 10)

### Issue: "Columns not found"
**Solution:**
- Re-run migration script
- Check for SQL errors in dashboard
- Verify table name is `service_requests`

---

## Rollback

If you need to undo changes:

```sql
-- Remove columns
ALTER TABLE service_requests
DROP COLUMN IF EXISTS category,
DROP COLUMN IF EXISTS source,
DROP COLUMN IF EXISTS attachments,
DROP COLUMN IF EXISTS timeline_events,
DROP COLUMN IF EXISTS internal_notes,
DROP COLUMN IF EXISTS estimated_completion;

-- Remove indexes
DROP INDEX IF EXISTS idx_service_requests_category;
DROP INDEX IF EXISTS idx_service_requests_source;
DROP INDEX IF EXISTS idx_service_requests_estimated_completion;
DROP INDEX IF EXISTS idx_service_requests_attachments;
DROP INDEX IF EXISTS idx_service_requests_timeline_events;
```

To remove storage bucket:
1. Go to Storage in dashboard
2. Click `service-attachments`
3. Click **Delete bucket**

---

## Next Steps

After successful configuration:

1. ✅ Test file upload from portal request form
2. ✅ Verify timeline events are saved
3. ✅ Test admin internal notes
4. ✅ Check attachment downloads work
5. ✅ Move to Phase 6 (Real-time features) or Phase 8 (Testing)

---

## Support

If you encounter issues:
- Check Supabase logs in dashboard
- Review storage logs for upload errors
- Verify RLS policies match your auth setup
- Check browser console for client-side errors
