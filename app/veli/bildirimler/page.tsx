'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Activity, Bell, BellOff, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type NotificationType = 'yoklama_sonucu' | 'odeme_hatirlatma' | 'duyuru'

interface Preferences {
  yoklama_sonucu: boolean
  odeme_hatirlatma: boolean
  duyuru: boolean
}

const NOTIFICATION_TYPES: Array<{
  key: NotificationType
  label: string
  description: string
  icon: string
}> = [
  {
    key: 'yoklama_sonucu',
    label: 'Yoklama Sonucu',
    description: 'Cocugunuzun derse katilim durumu hakkinda bildirim alin.',
    icon: '📋',
  },
  {
    key: 'odeme_hatirlatma',
    label: 'Odeme Hatirlatma',
    description: 'Aidat ve odeme tarihleri yaklastiginda hatirlatma alin.',
    icon: '💰',
  },
  {
    key: 'duyuru',
    label: 'Duyuru',
    description: 'Tesis duyurulari ve genel bilgilendirmeler.',
    icon: '📢',
  },
]

const DEFAULT_PREFS: Preferences = {
  yoklama_sonucu: true,
  odeme_hatirlatma: true,
  duyuru: true,
}

export default function BildirimlerPage() {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFS)
  const [pushSupported, setPushSupported] = useState(false)
  const [pushSubscribed, setPushSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check browser push support
  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    setPushSupported(supported)
  }, [])

  // Get user and load preferences
  const loadPreferences = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      setUserId(user.id)

      // Check existing push subscription
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.getSubscription()
        setPushSubscribed(!!sub)
      }

      // Load preferences from API
      const res = await fetch(`/api/notifications/preferences?user_id=${user.id}`)
      if (res.ok) {
        const data = await res.json()
        if (data.preferences) {
          setPreferences({
            yoklama_sonucu: data.preferences.yoklama_sonucu ?? true,
            odeme_hatirlatma: data.preferences.odeme_hatirlatma ?? true,
            duyuru: data.preferences.duyuru ?? true,
          })
        }
      }
    } catch (err) {
      console.error('[bildirimler] Tercih yuklenemedi:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPreferences()
  }, [loadPreferences])

  // Subscribe to push notifications
  const handleSubscribe = async () => {
    if (!pushSupported || !userId) return
    setSubscribing(true)
    setError(null)

    try {
      // Request notification permission
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setError('Bildirim izni verilmedi. Tarayici ayarlarindan izin verin.')
        setSubscribing(false)
        return
      }

      const reg = await navigator.serviceWorker.ready
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

      if (!vapidPublicKey) {
        setError('Push yapilandirmasi eksik. Yoneticiyle iletisime gecin.')
        setSubscribing(false)
        return
      }

      // Convert VAPID key to Uint8Array
      const padding = '='.repeat((4 - (vapidPublicKey.length % 4)) % 4)
      const base64 = (vapidPublicKey + padding).replace(/-/g, '+').replace(/_/g, '/')
      const rawData = atob(base64)
      const applicationServerKey = new Uint8Array(rawData.length)
      for (let i = 0; i < rawData.length; i++) {
        applicationServerKey[i] = rawData.charCodeAt(i)
      }

      // Subscribe
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })

      // Send subscription to server
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          user_id: userId,
        }),
      })

      if (res.ok) {
        setPushSubscribed(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Abonelik kaydedilemedi.')
      }
    } catch (err) {
      console.error('[bildirimler] Abonelik hatasi:', err)
      setError('Push aboneligi sirasinda hata olustu.')
    } finally {
      setSubscribing(false)
    }
  }

  // Unsubscribe from push
  const handleUnsubscribe = async () => {
    setSubscribing(true)
    setError(null)

    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()

      if (sub) {
        const endpoint = sub.endpoint
        await sub.unsubscribe()

        // Notify server
        await fetch('/api/notifications/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint }),
        })
      }

      setPushSubscribed(false)
    } catch (err) {
      console.error('[bildirimler] Abonelik iptal hatasi:', err)
      setError('Abonelik iptal edilemedi.')
    } finally {
      setSubscribing(false)
    }
  }

  // Toggle preference
  const togglePref = (key: NotificationType) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
    setSaveSuccess(false)
  }

  // Save preferences
  const handleSave = async () => {
    if (!userId) return
    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, ...preferences }),
      })

      if (res.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Tercihler kaydedilemedi.')
      }
    } catch (err) {
      console.error('[bildirimler] Tercih kayit hatasi:', err)
      setError('Tercihler kaydedilirken hata olustu.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/veli/dashboard" className="p-1 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563eb] text-white">
              <Bell className="h-5 w-5" />
            </div>
            <span className="font-bold text-gray-900">Bildirim Tercihleri</span>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#2563eb]" />
          </div>
        ) : (
          <>
            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Push subscription status */}
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {pushSubscribed ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <Bell className="h-5 w-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <BellOff className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {pushSubscribed ? 'Bildirimler Aktif' : 'Bildirimler Kapali'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {pushSubscribed
                          ? 'Bu cihazda push bildirimleri aliyorsunuz.'
                          : pushSupported
                            ? 'Push bildirimlerini etkinlestirmek icin asagiya tiklayin.'
                            : 'Tarayiciniz push bildirimlerini desteklemiyor.'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={pushSubscribed ? handleUnsubscribe : handleSubscribe}
                    disabled={!pushSupported || subscribing}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      pushSubscribed
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {subscribing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : pushSubscribed ? (
                      'Kapat'
                    ) : (
                      'Etkinlestir'
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Notification type preferences */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Bildirim Turleri</h2>
              <p className="text-sm text-gray-600">
                Hangi bildirim turlerini almak istediginizi secin.
              </p>
              {NOTIFICATION_TYPES.map((nt) => (
                <Card key={nt.key} className="border-gray-200 bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{nt.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{nt.label}</p>
                          <p className="text-xs text-gray-500">{nt.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => togglePref(nt.key)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          preferences[nt.key] ? 'bg-[#2563eb]' : 'bg-gray-200'
                        }`}
                        role="switch"
                        aria-checked={preferences[nt.key]}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            preferences[nt.key] ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-lg bg-[#2563eb] px-4 py-3 text-sm font-medium text-white hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saveSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Kaydedildi
                </>
              ) : (
                'Tercihleri Kaydet'
              )}
            </button>
          </>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-around py-2 min-h-[56px]">
          <Link href="/veli/dashboard" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-500 hover:text-gray-700">
            <Activity className="h-5 w-5" />
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link href="/veli/bildirimler" className="flex flex-col items-center gap-1 px-4 py-2 text-[#2563eb]">
            <Bell className="h-5 w-5" />
            <span className="text-xs font-medium">Bildirimler</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
