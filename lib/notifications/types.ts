/**
 * Push notification type definitions for YiSA-S.
 *
 * Bildirim turleri:
 *  - yoklama_sonucu : Cocugun devamsizlik / yoklama sonucu
 *  - odeme_hatirlatma: Aidat / odeme hatirlatmasi
 *  - duyuru          : Genel tesis duyurusu
 */

export type NotificationType = 'yoklama_sonucu' | 'odeme_hatirlatma' | 'duyuru'

export interface PushSubscriptionRecord {
  id?: string
  user_id: string
  tenant_id?: string | null
  endpoint: string
  keys_p256dh: string
  keys_auth: string
  created_at?: string
  is_active?: boolean
}

export interface NotificationPreferences {
  user_id: string
  yoklama_sonucu: boolean
  odeme_hatirlatma: boolean
  duyuru: boolean
}

export interface SendNotificationPayload {
  type: NotificationType
  title: string
  body: string
  url?: string
  /** Target user IDs. If empty, sends to all subscribers matching tenant. */
  user_ids?: string[]
  tenant_id?: string
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  yoklama_sonucu: 'Yoklama Sonucu',
  odeme_hatirlatma: 'Odeme Hatirlatma',
  duyuru: 'Duyuru',
}

export const NOTIFICATION_TYPE_ICONS: Record<NotificationType, string> = {
  yoklama_sonucu: '📋',
  odeme_hatirlatma: '💰',
  duyuru: '📢',
}
