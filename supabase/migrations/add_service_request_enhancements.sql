-- Migration: Add Enhanced Service Request Fields
-- Created: 2026-01-29
-- Description: Adds columns for categories, attachments, timeline, notes, and source tracking
-- Phase: 8 - Enhanced Client Portal

-- Add new columns to service_requests table
ALTER TABLE service_requests
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'web' CHECK (source IN ('web', 'portal', 'portal_support', 'api')),
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS timeline_events JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS estimated_completion TIMESTAMP WITH TIME ZONE;

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_service_requests_category ON service_requests(category);

-- Create index on source for analytics
CREATE INDEX IF NOT EXISTS idx_service_requests_source ON service_requests(source);

-- Create index on estimated_completion for deadline tracking
CREATE INDEX IF NOT EXISTS idx_service_requests_estimated_completion ON service_requests(estimated_completion);

-- Create GIN index on attachments JSONB for faster queries
CREATE INDEX IF NOT EXISTS idx_service_requests_attachments ON service_requests USING GIN (attachments);

-- Create GIN index on timeline_events JSONB for faster queries
CREATE INDEX IF NOT EXISTS idx_service_requests_timeline_events ON service_requests USING GIN (timeline_events);

-- Add comments to document new columns
COMMENT ON COLUMN service_requests.category IS 'Request category: development, design, consulting, support, other';
COMMENT ON COLUMN service_requests.source IS 'Request origin: web, portal, portal_support, api';
COMMENT ON COLUMN service_requests.attachments IS 'Array of file attachment objects with metadata';
COMMENT ON COLUMN service_requests.timeline_events IS 'Array of timeline event objects tracking request history';
COMMENT ON COLUMN service_requests.internal_notes IS 'Admin-only notes, not visible to clients';
COMMENT ON COLUMN service_requests.estimated_completion IS 'Expected completion date for the request';

-- Verification query
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'service_requests'
AND column_name IN (
  'category', 
  'source', 
  'attachments', 
  'timeline_events', 
  'internal_notes', 
  'estimated_completion'
);
