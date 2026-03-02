-- ADD EXPO MODE & RAFFLE SUPPORT
-- Run this in your Supabase SQL Editor

-- 1. Ensure the 'is_verified' column exists in 'leads' table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- 2. (Optional) Add unique constraint to prevent duplicate raffle entries per email per card
-- This ensures people don't scan the same person 100 times to game the raffle.
-- ALTER TABLE leads ADD CONSTRAINT unique_verified_lead UNIQUE (email, card_id, is_verified);

-- 3. (Optional) Create an index for faster raffle counting
CREATE INDEX IF NOT EXISTS idx_leads_verified ON leads(owner_id, is_verified);
