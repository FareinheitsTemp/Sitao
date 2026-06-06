-- ============================================================
-- SITAO.FUN — Supabase Database Schema
-- Version: 1.0.0 | Date: 2026-06-06
-- Security: RLS enabled, pgcrypto, prepared statements
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- EXTENSIONS
-- ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- ENUMS
-- ────────────────────────────────────────────────────────────
CREATE TYPE user_role     AS ENUM ('player', 'vip', 'premium', 'admin', 'owner');
CREATE TYPE user_status   AS ENUM ('active', 'banned', 'muted', 'pending');
CREATE TYPE post_status   AS ENUM ('draft', 'published', 'archived');
CREATE TYPE post_category AS ENUM ('news', 'update', 'event', 'maintenance');
CREATE TYPE donate_tier   AS ENUM ('vip', 'premium');
CREATE TYPE donate_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE report_status AS ENUM ('open', 'reviewing', 'resolved', 'rejected');
CREATE TYPE ban_type      AS ENUM ('temporary', 'permanent');

-- ────────────────────────────────────────────────────────────
-- PROFILES (розширює auth.users Supabase)
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
    id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nickname        TEXT        NOT NULL UNIQUE,
    display_name    TEXT,
    avatar_url      TEXT,
    role            user_role   NOT NULL DEFAULT 'player',
    status          user_status NOT NULL DEFAULT 'active',

    -- Minecraft-специфічні дані
    minecraft_uuid  UUID        UNIQUE,
    minecraft_name  TEXT,

    -- Прогрес
    play_time_hours INTEGER     NOT NULL DEFAULT 0 CHECK (play_time_hours >= 0),
    total_deaths    INTEGER     NOT NULL DEFAULT 0 CHECK (total_deaths >= 0),
    total_kills     INTEGER     NOT NULL DEFAULT 0 CHECK (total_kills >= 0),
    balance         NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),

    -- Метадані
    last_seen_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Обмеження довжини нікнейму (Minecraft: 3-16 символів)
    CONSTRAINT nickname_length   CHECK (char_length(nickname)   BETWEEN 3 AND 16),
    CONSTRAINT nickname_format   CHECK (nickname ~ '^[a-zA-Z0-9_]+$'),
    CONSTRAINT display_name_len  CHECK (char_length(display_name) <= 32)
);

-- ────────────────────────────────────────────────────────────
-- SESSIONS (для аудиту логінів)
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.login_sessions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ip_hash         TEXT        NOT NULL, -- SHA256(ip + salt), не зберігаємо сирий IP
    user_agent_hash TEXT        NOT NULL, -- SHA256(user_agent)
    country_code    CHAR(2),
    is_suspicious   BOOLEAN     NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at      TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days')
);

-- ────────────────────────────────────────────────────────────
-- RATE LIMITING (на рівні БД)
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.rate_limit_log (
    id              BIGSERIAL   PRIMARY KEY,
    identifier      TEXT        NOT NULL, -- SHA256(ip) або user_id
    action          TEXT        NOT NULL, -- 'login', 'register', 'api_call'
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Автоматичне очищення старих записів (> 1 година)
CREATE INDEX idx_rate_limit_identifier_action ON public.rate_limit_log(identifier, action, created_at);

-- ────────────────────────────────────────────────────────────
-- POSTS / НОВИНИ
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.posts (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    title           TEXT        NOT NULL,
    slug            TEXT        NOT NULL UNIQUE,
    content         TEXT        NOT NULL,
    excerpt         TEXT,
    cover_url       TEXT,
    category        post_category NOT NULL DEFAULT 'news',
    status          post_status NOT NULL DEFAULT 'draft',
    views           INTEGER     NOT NULL DEFAULT 0 CHECK (views >= 0),
    pinned          BOOLEAN     NOT NULL DEFAULT false,
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Захист від занадто великого контенту
    CONSTRAINT title_length   CHECK (char_length(title)   BETWEEN 3 AND 200),
    CONSTRAINT slug_format    CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT excerpt_length CHECK (char_length(excerpt) <= 500),
    CONSTRAINT content_max    CHECK (octet_length(content) <= 524288) -- max 512KB
);

-- ────────────────────────────────────────────────────────────
-- КОМЕНТАРІ до постів
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.comments (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         UUID        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_id       UUID        REFERENCES public.comments(id) ON DELETE CASCADE,
    content         TEXT        NOT NULL,
    is_deleted      BOOLEAN     NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT content_length CHECK (char_length(content) BETWEEN 1 AND 2000),
    -- Максимум 1 рівень вкладеності
    CONSTRAINT no_deep_nesting CHECK (parent_id IS NULL OR (
        SELECT parent_id FROM public.comments c WHERE c.id = comments.parent_id
    ) IS NULL)
);

-- ────────────────────────────────────────────────────────────
-- ДОНАТИ
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.donations (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    tier            donate_tier NOT NULL,
    amount_uah      NUMERIC(8,2) NOT NULL CHECK (amount_uah > 0),
    status          donate_status NOT NULL DEFAULT 'pending',
    payment_id      TEXT        UNIQUE, -- зовнішній ID платіжної системи
    expires_at      TIMESTAMPTZ, -- коли закінчується доступ
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- БАНИ
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.bans (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    issued_by       UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason          TEXT        NOT NULL,
    type            ban_type    NOT NULL DEFAULT 'temporary',
    expires_at      TIMESTAMPTZ, -- NULL = permanent
    is_active       BOOLEAN     NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT reason_length CHECK (char_length(reason) BETWEEN 3 AND 500)
);

-- ────────────────────────────────────────────────────────────
-- РЕПОРТИ (скарги на гравців)
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.reports (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason          TEXT        NOT NULL,
    evidence_urls   TEXT[]      DEFAULT '{}',
    status          report_status NOT NULL DEFAULT 'open',
    resolved_by     UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolution_note TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT not_self_report  CHECK (reporter_id != target_id),
    CONSTRAINT reason_length    CHECK (char_length(reason) BETWEEN 10 AND 1000),
    CONSTRAINT evidence_max     CHECK (array_length(evidence_urls, 1) <= 5)
);

-- ────────────────────────────────────────────────────────────
-- НОТИФІКАЦІЇ
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.notifications (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type            TEXT        NOT NULL, -- 'ban', 'unban', 'donate_activated', 'comment_reply'
    title           TEXT        NOT NULL,
    body            TEXT,
    is_read         BOOLEAN     NOT NULL DEFAULT false,
    related_id      UUID,       -- ID пов'язаного запису
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT type_whitelist   CHECK (type IN ('ban','unban','donate_activated','donate_expired','comment_reply','system')),
    CONSTRAINT title_length     CHECK (char_length(title) <= 100),
    CONSTRAINT body_length      CHECK (char_length(body) <= 500)
);

-- ────────────────────────────────────────────────────────────
-- AUDIT LOG (незмінний журнал дій адмінів)
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.audit_log (
    id              BIGSERIAL   PRIMARY KEY,
    actor_id        UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
    action          TEXT        NOT NULL, -- 'ban_user', 'delete_post', etc.
    target_table    TEXT,
    target_id       TEXT,
    old_data        JSONB,
    new_data        JSONB,
    ip_hash         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- audit_log тільки для додавання — забороняємо UPDATE/DELETE
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_log_no_update" ON public.audit_log FOR UPDATE USING (false);
CREATE POLICY "audit_log_no_delete" ON public.audit_log FOR DELETE USING (false);
CREATE POLICY "audit_log_admin_read" ON public.audit_log FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'owner')
    ));

-- ============================================================
-- INDEXES (продуктивність)
-- ============================================================

-- profiles
CREATE INDEX idx_profiles_nickname       ON public.profiles(nickname);
CREATE INDEX idx_profiles_role           ON public.profiles(role);
CREATE INDEX idx_profiles_status         ON public.profiles(status);
CREATE INDEX idx_profiles_minecraft_uuid ON public.profiles(minecraft_uuid) WHERE minecraft_uuid IS NOT NULL;
CREATE INDEX idx_profiles_created_at     ON public.profiles(created_at DESC);

-- login_sessions
CREATE INDEX idx_sessions_user_id   ON public.login_sessions(user_id);
CREATE INDEX idx_sessions_expires   ON public.login_sessions(expires_at);

-- posts
CREATE INDEX idx_posts_status_published ON public.posts(status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_posts_author           ON public.posts(author_id);
CREATE INDEX idx_posts_slug             ON public.posts(slug);
CREATE INDEX idx_posts_category         ON public.posts(category);
CREATE INDEX idx_posts_pinned           ON public.posts(pinned) WHERE pinned = true;

-- comments
CREATE INDEX idx_comments_post_id   ON public.comments(post_id);
CREATE INDEX idx_comments_author    ON public.comments(author_id);
CREATE INDEX idx_comments_parent    ON public.comments(parent_id) WHERE parent_id IS NOT NULL;

-- donations
CREATE INDEX idx_donations_user_id  ON public.donations(user_id);
CREATE INDEX idx_donations_status   ON public.donations(status);
CREATE INDEX idx_donations_expires  ON public.donations(expires_at) WHERE status = 'paid';

-- bans
CREATE INDEX idx_bans_user_active   ON public.bans(user_id, is_active) WHERE is_active = true;

-- reports
CREATE INDEX idx_reports_status     ON public.reports(status) WHERE status = 'open';
CREATE INDEX idx_reports_target     ON public.reports(target_id);

-- notifications
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read, created_at DESC) WHERE is_read = false;

-- audit_log
CREATE INDEX idx_audit_actor        ON public.audit_log(actor_id);
CREATE INDEX idx_audit_created      ON public.audit_log(created_at DESC);
CREATE INDEX idx_audit_action       ON public.audit_log(action);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Автооновлення updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at  BEFORE UPDATE ON public.profiles  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER posts_updated_at     BEFORE UPDATE ON public.posts      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER comments_updated_at  BEFORE UPDATE ON public.comments   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER donations_updated_at BEFORE UPDATE ON public.donations  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER reports_updated_at   BEFORE UPDATE ON public.reports    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Авто-оновлення статусу юзера при бані
CREATE OR REPLACE FUNCTION public.sync_ban_status()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.is_active = true THEN
        UPDATE public.profiles SET status = 'banned' WHERE id = NEW.user_id;
    END IF;
    IF TG_OP = 'UPDATE' AND NEW.is_active = false AND OLD.is_active = true THEN
        UPDATE public.profiles SET status = 'active' WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER bans_sync_status
AFTER INSERT OR UPDATE ON public.bans
FOR EACH ROW EXECUTE FUNCTION public.sync_ban_status();

-- Авто-активація ролі після оплати донату
CREATE OR REPLACE FUNCTION public.activate_donation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
        UPDATE public.profiles
        SET role = NEW.tier::user_role
        WHERE id = NEW.user_id;

        INSERT INTO public.notifications(user_id, type, title, body, related_id)
        VALUES (
            NEW.user_id,
            'donate_activated',
            'Донат активовано!',
            'Твій статус ' || UPPER(NEW.tier::TEXT) || ' активовано. Дякуємо за підтримку!',
            NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER donations_activate
AFTER INSERT OR UPDATE ON public.donations
FOR EACH ROW EXECUTE FUNCTION public.activate_donation();

-- Авто-створення профілю після реєстрації
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    INSERT INTO public.profiles (id, nickname, display_name)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'nickname',
            split_part(NEW.email, '@', 1)
        ),
        NEW.raw_user_meta_data->>'nickname'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Автоочищення rate_limit_log (старше 2 годин)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limit()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM public.rate_limit_log WHERE created_at < now() - INTERVAL '2 hours';
    RETURN NULL;
END;
$$;

CREATE TRIGGER rate_limit_cleanup
AFTER INSERT ON public.rate_limit_log
FOR EACH STATEMENT EXECUTE FUNCTION public.cleanup_rate_limit();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bans           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications  ENABLE ROW LEVEL SECURITY;

-- ── profiles ──────────────────────────────────────────────
-- Публічний перегляд (без чутливих полів)
CREATE POLICY "profiles_public_read" ON public.profiles
    FOR SELECT USING (status != 'banned' OR auth.uid() = id);

-- Тільки власник може оновити свій профіль (не роль, не статус)
CREATE POLICY "profiles_self_update" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        -- Заборона самостійної зміни ролі та статусу
        AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
        AND status = (SELECT status FROM public.profiles WHERE id = auth.uid())
    );

-- Адмін може робити все з профілями
CREATE POLICY "profiles_admin_all" ON public.profiles
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','owner'))
    );

-- ── login_sessions ────────────────────────────────────────
CREATE POLICY "sessions_own_read" ON public.login_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "sessions_insert_self" ON public.login_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sessions_admin_read" ON public.login_sessions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','owner'))
    );

-- ── rate_limit_log ────────────────────────────────────────
-- Тільки service_role може писати та читати
CREATE POLICY "rate_limit_service_only" ON public.rate_limit_log
    USING (false); -- блокує всіх, service_role bypasses RLS

-- ── posts ─────────────────────────────────────────────────
CREATE POLICY "posts_public_read" ON public.posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "posts_author_draft" ON public.posts
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "posts_admin_all" ON public.posts
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','owner'))
    );

-- ── comments ──────────────────────────────────────────────
CREATE POLICY "comments_public_read" ON public.comments
    FOR SELECT USING (
        is_deleted = false
        AND EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND status = 'published')
    );

CREATE POLICY "comments_auth_insert" ON public.comments
    FOR INSERT WITH CHECK (
        auth.uid() = author_id
        AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND status = 'active')
    );

CREATE POLICY "comments_own_update" ON public.comments
    FOR UPDATE USING (auth.uid() = author_id)
    WITH CHECK (
        auth.uid() = author_id
        AND is_deleted = false
        -- Не можна змінити post_id або parent_id
        AND post_id   = (SELECT post_id   FROM public.comments WHERE id = comments.id)
        AND parent_id IS NOT DISTINCT FROM (SELECT parent_id FROM public.comments WHERE id = comments.id)
    );

CREATE POLICY "comments_admin_all" ON public.comments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','owner'))
    );

-- ── donations ─────────────────────────────────────────────
CREATE POLICY "donations_own_read" ON public.donations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "donations_admin_all" ON public.donations
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','owner'))
    );

-- ── bans ─────────────────────────────────────────────────
CREATE POLICY "bans_public_read" ON public.bans
    FOR SELECT USING (is_active = true);

CREATE POLICY "bans_admin_all" ON public.bans
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','owner'))
    );

-- ── reports ───────────────────────────────────────────────
CREATE POLICY "reports_own_read" ON public.reports
    FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "reports_auth_insert" ON public.reports
    FOR INSERT WITH CHECK (
        auth.uid() = reporter_id
        AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND status = 'active')
    );

CREATE POLICY "reports_admin_all" ON public.reports
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','owner'))
    );

-- ── notifications ─────────────────────────────────────────
CREATE POLICY "notifications_own" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- ФУНКЦІЇ БЕЗПЕКИ (допоміжні)
-- ============================================================

-- Перевірка ліміту запитів (rate limit) на рівні БД
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_identifier TEXT,
    p_action     TEXT,
    p_max_count  INTEGER DEFAULT 5,
    p_window_sec INTEGER DEFAULT 300 -- 5 хвилин
)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM public.rate_limit_log
    WHERE identifier = p_identifier
      AND action = p_action
      AND created_at > (now() - (p_window_sec || ' seconds')::INTERVAL);

    IF v_count >= p_max_count THEN
        RETURN false;
    END IF;

    INSERT INTO public.rate_limit_log(identifier, action)
    VALUES (p_identifier, p_action);

    RETURN true;
END;
$$;

-- Функція отримання публічного профілю (без чутливих даних)
CREATE OR REPLACE FUNCTION public.get_public_profile(p_nickname TEXT)
RETURNS TABLE (
    id             UUID,
    nickname       TEXT,
    display_name   TEXT,
    avatar_url     TEXT,
    role           user_role,
    play_time_hours INTEGER,
    total_kills    INTEGER,
    last_seen_at   TIMESTAMPTZ,
    created_at     TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER STABLE AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id, p.nickname, p.display_name, p.avatar_url, p.role,
        p.play_time_hours, p.total_kills, p.last_seen_at, p.created_at
    FROM public.profiles p
    WHERE p.nickname = p_nickname
      AND p.status = 'active';
END;
$$;

-- ============================================================
-- VIEWS (без чутливих даних для публічного API)
-- ============================================================

CREATE OR REPLACE VIEW public.v_public_profiles AS
SELECT
    id, nickname, display_name, avatar_url, role,
    play_time_hours, total_kills, last_seen_at, created_at
FROM public.profiles
WHERE status = 'active';

CREATE OR REPLACE VIEW public.v_published_posts AS
SELECT
    p.id, p.title, p.slug, p.excerpt, p.cover_url,
    p.category, p.views, p.pinned, p.published_at,
    pr.nickname AS author_nickname,
    pr.avatar_url AS author_avatar
FROM public.posts p
JOIN public.profiles pr ON pr.id = p.author_id
WHERE p.status = 'published'
ORDER BY p.pinned DESC, p.published_at DESC;

CREATE OR REPLACE VIEW public.v_staff AS
SELECT
    id, nickname, display_name, avatar_url, role, last_seen_at
FROM public.profiles
WHERE role IN ('admin', 'owner')
  AND status = 'active'
ORDER BY role, nickname;

-- ============================================================
-- КОМЕНТАР ДО ТАБЛИЦЬ (документація)
-- ============================================================
COMMENT ON TABLE public.profiles       IS 'Профілі гравців, розширює auth.users';
COMMENT ON TABLE public.login_sessions IS 'Аудит логінів (IP зберігається хешованим)';
COMMENT ON TABLE public.rate_limit_log IS 'Лог для rate-limiting на рівні БД';
COMMENT ON TABLE public.posts          IS 'Новини та оголошення сервера';
COMMENT ON TABLE public.comments       IS 'Коментарі до постів';
COMMENT ON TABLE public.donations      IS 'Донати та активні привілеї';
COMMENT ON TABLE public.bans           IS 'Журнал банів';
COMMENT ON TABLE public.reports        IS 'Скарги гравців';
COMMENT ON TABLE public.notifications  IS 'Системні нотифікації';
COMMENT ON TABLE public.audit_log      IS 'Незмінний аудит-лог дій адмінів';
