-- Seed default app settings (idempotent)
INSERT INTO public.app_settings (key, value)
VALUES 
  ('auto_approve', 'false'),
  ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;

-- Toggle auto-approve on/off
-- UPDATE public.app_settings SET value = 'true' WHERE key = 'auto_approve';
-- UPDATE public.app_settings SET value = 'false' WHERE key = 'auto_approve';

-- Toggle maintenance mode on/off
-- UPDATE public.app_settings SET value = 'true' WHERE key = 'maintenance_mode';
-- UPDATE public.app_settings SET value = 'false' WHERE key = 'maintenance_mode';
