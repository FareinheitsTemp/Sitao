-- ============================================================
-- SITAO.fun — Supabase Storage Buckets Setup
-- Запускай у SQL Editor після schema.sql
-- ============================================================

-- ── Bucket для аватарів ────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,          -- публічний (перегляд без авторизації)
    1048576,       -- 1MB макс
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ── Bucket для обкладинок постів ─────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'post-covers',
    'post-covers',
    true,
    5242880,       -- 5MB макс
    ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- ── Storage RLS Policies ──────────────────────────────────

-- Аватари: публічний перегляд
CREATE POLICY "avatars_public_read" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

-- Аватари: тільки власник завантажує (папка = user_id)
CREATE POLICY "avatars_owner_upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "avatars_owner_delete" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Обкладинки: публічний перегляд
CREATE POLICY "post_covers_public_read" ON storage.objects
    FOR SELECT USING (bucket_id = 'post-covers');

-- Обкладинки: тільки admin/owner завантажує
CREATE POLICY "post_covers_admin_upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'post-covers'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'owner')
        )
    );

CREATE POLICY "post_covers_admin_delete" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'post-covers'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('admin', 'owner')
        )
    );
