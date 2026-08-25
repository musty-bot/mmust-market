-- Enable RLS on tables (if not already enabled)
ALTER TABLE IF EXISTS public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.app_settings ENABLE ROW LEVEL SECURITY;

-- Storage bucket policies for "listing-images"
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing-images');

-- Allow public to view listing images
CREATE POLICY "Public can view listing images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listing-images');

-- Allow authenticated users to delete their own images (optional, for re-upload)
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'listing-images');

-- Table policies for "listings"
-- Allow authenticated users to insert listings
CREATE POLICY "Allow authenticated insert"
ON public.listings FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow public to view approved listings
CREATE POLICY "Public can view approved listings"
ON public.listings FOR SELECT
TO public
USING (status = 'approved');

-- Allow authenticated users to view their own listings (pending + approved)
CREATE POLICY "Users can view own listings"
ON public.listings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow authenticated users to update their own pending listings
CREATE POLICY "Users can update own pending listings"
ON public.listings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id and status = 'pending')
WITH CHECK (auth.uid() = user_id and status = 'pending');

-- Allow authenticated users to delete their own listings
CREATE POLICY "Users can delete own listings"
ON public.listings FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Table policies for "app_settings"
-- Allow public to read app settings (needed for auto_approve check in app)
CREATE POLICY "Public can read app settings"
ON public.app_settings FOR SELECT
TO public
USING (true);

-- Only allow admin/service_role to update/insert/delete app_settings
CREATE POLICY "Service role manages app settings"
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
