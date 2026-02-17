-- Add new columns for label, year, and shipping to listings table
-- These fields are optional and will be NULL if not provided

ALTER TABLE listings ADD COLUMN IF NOT EXISTS label TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS year VARCHAR(20);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS shipping VARCHAR(20);
