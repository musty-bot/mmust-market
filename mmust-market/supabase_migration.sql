-- Add missing columns to listings table
ALTER TABLE public.listings 
  ADD COLUMN IF NOT EXISTS seller TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT;
