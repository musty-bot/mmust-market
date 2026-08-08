-- ============================================================
-- AUTO-APPROVE FIX & DIAGNOSTIC
-- Run this in Supabase Dashboard -> SQL Editor
-- ============================================================

-- 1. Ensure RLS is enabled on app_settings (if not already)
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing conflicting policies first (idempotent)
DROP POLICY IF EXISTS "Public can read app settings" ON public.app_settings;
DROP POLICY IF EXISTS "Service role manages app settings" ON public.app_settings;
DROP POLICY IF EXISTS "Service role updates app settings" ON public.app_settings;
DROP POLICY IF EXISTS "Service role deletes app settings" ON public.app_settings;

-- 3. Allow public to READ app_settings (this is what the app needs to check auto_approve)
CREATE POLICY "Public can read app settings"
ON public.app_settings FOR SELECT
TO public
USING (true);

-- 4. Allow service_role (admin) to write/update/delete app_settings
CREATE POLICY "Service role inserts app settings"
ON public.app_settings FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role updates app settings"
ON public.app_settings FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role deletes app settings"
ON public.app_settings FOR DELETE
TO service_role
USING (true);

-- 5. Ensure auto_approve seed exists (set to 'true' for testing)
INSERT INTO public.app_settings (key, value)
VALUES ('auto_approve', 'true')
ON CONFLICT (key) DO UPDATE SET value = 'true';

-- 6. Ensure maintenance_mode seed exists
INSERT INTO public.app_settings (key, value)
VALUES ('maintenance_mode', 'false')
ON CONFLICT (key) DO UPDATE SET value = 'false';

-- 7. Verify: check current auto_approve value
SELECT key, value FROM public.app_settings WHERE key = 'auto_approve';

-- 8. Verify: check current RLS policies on app_settings
SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'app_settings';

-- 9. Verify: check if listings table has seller column
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'listings' AND column_name IN ('seller', 'phone');

-- 10. TEST: manually insert a test listing with auto_approve = true
-- (Run this only if you want to test, then delete the test listing)
/*
INSERT INTO public.listings (user_id, type, title, price, category, location, phone, description, images, status, approved_at, created_at)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'product',
  'TEST AUTO-APPROVE ITEM',
  100,
  'Electronics',
  'Main Campus',
  '0700000000',
  'This is a test listing to verify auto-approve works.',
  '{}',
  'approved',
  NOW(),
  NOW()
);
*/
