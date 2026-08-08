-- Ensure auto_approve setting exists
INSERT INTO public.app_settings (key, value)
VALUES ('auto_approve', 'false')
ON CONFLICT (key) DO NOTHING;
