/**
 * YİSA-S Rol bazlı erişim (13 seviye)
 * Talimat Bölüm 1.3: 0 Ziyaretçi … 12 Misafir Sporcu
 */

/** Talimat uyumlu 13 rol (referans) */
export const ROLE_SYSTEM_13 = [
  'Ziyaretçi',
  'Alt Admin',
  'Tesis Müdürü',
  'İPTAL',
  'Sportif Direktör',
  'Uzman Antrenör',
  'Antrenör',
  'Yardımcı/Stajyer',
  'Kayıt Personeli',
  'Temizlik Personeli',
  'Veli',
  'Sporcu',
  'Misafir Sporcu',
] as const

export const ROLE_LEVELS = [
  'Ziyaretçi',
  'Ücretsiz Üye',
  'Ücretli Üye',
  'Deneme Üyesi',
  'Eğitmen',
  'Tesis Yöneticisi',
  'Tesis Sahibi',
  'Bölge Müdürü',
  'Franchise Sahibi',
  'Franchise Yöneticisi',
  'Sistem Admini',
  'Süper Admin',
  'Patron',
] as const

export type RoleName = (typeof ROLE_LEVELS)[number]

/** Dashboard'a giriş izni olan roller */
export const DASHBOARD_ALLOWED_ROLES: RoleName[] = [
  'Patron',
  'Süper Admin',
  'Sistem Admini',
]

export const PATRON_EMAIL = 'serdincaltay@gmail.com'

/**
 * Kullanıcının dashboard'a erişimi var mı?
 * Patron email veya izinli rol gerekir.
 */
export function canAccessDashboard(user: {
  email?: string | null
  user_metadata?: { role?: string }
} | null): boolean {
  if (!user) return false
  if (user.email === PATRON_EMAIL) return true
  const role = user.user_metadata?.role as RoleName | undefined
  if (!role) return false
  return DASHBOARD_ALLOWED_ROLES.includes(role)
}

/** Rol açıklaması (Users sayfası için) */
export const ROLE_DESCRIPTIONS: Record<RoleName, string> = {
  'Ziyaretçi': 'Giriş yapmamış, sınırlı görüntüleme',
  'Ücretsiz Üye': 'Temel üyelik, sınırlı özellikler',
  'Ücretli Üye': 'Tam üyelik, tüm üye özellikleri',
  'Deneme Üyesi': 'Deneme süresi, ücretli özellikler geçici',
  'Eğitmen': 'Antrenman verme, kendi sporcuları',
  'Tesis Yöneticisi': 'Tek tesis yönetimi',
  'Tesis Sahibi': 'Kendi tesis(ler) yönetimi',
  'Bölge Müdürü': 'Bölge genelinde tesisler',
  'Franchise Sahibi': 'Franchise sahipliği',
  'Franchise Yöneticisi': 'Franchise operasyon yönetimi',
  'Sistem Admini': 'Sistem ayarları, kullanıcı/rol yönetimi',
  'Süper Admin': 'Tam yetki, tüm panel erişimi',
  'Patron': 'En üst yetki, tüm kararlar',
}
