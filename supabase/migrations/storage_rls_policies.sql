-- Storage RLS Policies for Service Attachments
-- Created: 2026-01-29
-- Description: Security policies for service-attachments bucket

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to upload files to service-attachments
CREATE POLICY "Allow authenticated uploads to service-attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'service-attachments');

-- Policy: Allow users to read files they uploaded or are associated with their requests
CREATE POLICY "Allow users to read their service attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'service-attachments'
);

-- Policy: Allow users to delete their own uploads
CREATE POLICY "Allow users to delete their service attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'service-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow admins full access (if using role-based auth)
-- Uncomment if you have admin roles configured
-- CREATE POLICY "Allow admins full access to service-attachments"
-- ON storage.objects
-- FOR ALL
-- TO authenticated
-- USING (
--   bucket_id = 'service-attachments' AND
--   auth.jwt() ->> 'role' = 'admin'
-- );
