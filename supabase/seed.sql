-- ============================================================
-- SITAO.fun — Seeds (початкові дані)
-- Запускай тільки в dev/staging, НЕ в production!
-- ============================================================

-- Тестовий адмін (потрібно спочатку зареєструватись через UI)
-- UPDATE public.profiles
-- SET role = 'owner'
-- WHERE nickname = 'твій_нікнейм';

-- Тестовий пост
INSERT INTO public.posts (
    author_id, title, slug, content, excerpt, category, status, pinned, published_at
)
SELECT
    p.id,
    '🎮 Ласкаво просимо на SITAO!',
    'welcome-to-sitao',
    '## Вітаємо на нашому сервері!

SITAO — це унікальний Minecraft сервер з дружньою спільнотою та цікавими івентами.

### Що нас чекає?
- Регулярні оновлення
- Турніри з призами
- Активна адміністрація

Приєднуйся та грай разом з нами!',
    'Ласкаво просимо на SITAO — найкращий Minecraft сервер!',
    'news',
    'published',
    true,
    now()
FROM public.profiles p
WHERE p.role IN ('owner', 'admin')
LIMIT 1
ON CONFLICT (slug) DO NOTHING;
