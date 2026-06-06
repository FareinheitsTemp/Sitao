-- ============================================================
-- Надати права owner для fareinheits@gmail.com
-- Запускай у Supabase SQL Editor
-- ============================================================

UPDATE public.profiles
SET role = 'owner'
WHERE id = (
    SELECT id FROM auth.users
    WHERE email = 'fareinheits@gmail.com'
    LIMIT 1
);

-- Перевірка
SELECT p.id, p.nickname, p.role, u.email
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'fareinheits@gmail.com';
