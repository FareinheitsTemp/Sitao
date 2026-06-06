export const ROLE_HIERARCHY = {
  supervisor: 5,
  admin:      4,
  tech_admin: 3,
  tech_mod:   2,
  mod:        1,
  user:       0,
} as const;

export type UserRole = keyof typeof ROLE_HIERARCHY;

export function canManage(actor: UserRole, target: UserRole): boolean {
  if (actor === 'supervisor' && target === 'supervisor') return false;
  return ROLE_HIERARCHY[actor] > ROLE_HIERARCHY[target];
}

export function canResetPassword(actor: UserRole, target: UserRole): boolean {
  if (actor === 'supervisor' && target === 'supervisor') return false;
  return ROLE_HIERARCHY[actor] > ROLE_HIERARCHY[target];
}

export const ALL_PERMISSIONS = [
  'can_publish_posts',
  'can_edit_posts',
  'can_delete_posts',
  'can_manage_staff',
  'can_view_staff_panel',
  'can_manage_roles',
  'can_reset_passwords',
  'can_ban_users',
  'can_edit_donate',
  'can_moderate_chat',
  'can_view_logs',
  'can_manage_economy',
  'can_set_badges',
  'can_edit_site_content',
  'can_manage_wars',
  'can_access_cabinet',
] as const;

export type PermissionKey = typeof ALL_PERMISSIONS[number];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  can_publish_posts:     'Публікувати пости',
  can_edit_posts:        'Редагувати пости',
  can_delete_posts:      'Видаляти пости',
  can_manage_staff:      'Управляти персоналом',
  can_view_staff_panel:  'Переглядати панель персоналу',
  can_manage_roles:      'Змінювати ролі',
  can_reset_passwords:   'Скидати паролі',
  can_ban_users:         'Банити користувачів',
  can_edit_donate:       'Редагувати донати',
  can_moderate_chat:     'Модерувати чат',
  can_view_logs:         'Переглядати логи',
  can_manage_economy:    'Управляти економікою',
  can_set_badges:        'Встановлювати бейджики',
  can_edit_site_content: 'Редагувати контент сайту',
  can_manage_wars:       'Управляти війнами',
  can_access_cabinet:    'Доступ до кабінету',
};
