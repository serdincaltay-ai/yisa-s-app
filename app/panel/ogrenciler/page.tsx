'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Loader2 } from 'lucide-react'
import { OgrenciForm, type OgrenciFormData } from './OgrenciForm'
import { OgrenciTable, type AthleteRow } from './OgrenciTable'
import { usePanelRole } from '../PanelRoleContext'

export default function OgrencilerPage() {
  const role = usePanelRole()
  const isReadOnly = role === 'coach'
  const [items, setItems] = useState<AthleteRow[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [branchFilter, setBranchFilter] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [editStudent, setEditStudent] = useState<AthleteRow | null>(null)
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AthleteRow | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const fetchList = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      if (statusFilter) params.set('status', statusFilter)
      if (branchFilter) params.set('branch', branchFilter)
      const res = await fetch(`/api/franchise/athletes?${params}`)
      const data = await res.json()
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch {
      setItems([])
      setToast({ message: 'Liste yüklenemedi', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [searchQuery, statusFilter, branchFilter])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    setIsMobile(mq.matches)
    const h = () => setIsMobile(window.matchMedia('(max-width: 640px)').matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  const handleSubmit = async (data: OgrenciFormData) => {
    setSending(true)
    try {
      const url = editStudent ? `/api/franchise/athletes/${editStudent.id}` : '/api/franchise/athletes'
      const method = editStudent ? 'PATCH' : 'POST'
      const body = editStudent
        ? {
            name: data.ad,
            surname: data.soyad || null,
            birth_date: data.dogum_tarihi || null,
            gender: data.cinsiyet || null,
            branch: data.brans || null,
            level: data.seviye || null,
            group: data.grup || null,
            parent_name: data.veli_ad || null,
            parent_phone: data.veli_telefon || null,
            parent_email: data.veli_email || null,
            notes: data.saglik_notu || null,
          }
        : {
            name: data.ad,
            surname: data.soyad || null,
            birth_date: data.dogum_tarihi || null,
            gender: data.cinsiyet || null,
            branch: data.brans || null,
            level: data.seviye || null,
            group: data.grup || null,
            parent_name: data.veli_ad || null,
            parent_phone: data.veli_telefon || null,
            parent_email: data.veli_email || null,
            notes: data.saglik_notu || null,
          }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (res.ok && json.ok) {
        setToast({ message: editStudent ? 'Öğrenci güncellendi' : 'Öğrenci eklendi', type: 'success' })
        setShowForm(false)
        setEditStudent(null)
        fetchList()
      } else {
        setToast({ message: json.error ?? 'İşlem başarısız', type: 'error' })
      }
    } catch {
      setToast({ message: 'Bağlantı hatası', type: 'error' })
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/franchise/athletes/${deleteTarget.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (res.ok && json.ok) {
        setToast({ message: 'Öğrenci pasife alındı', type: 'success' })
        setDeleteTarget(null)
        fetchList()
      } else {
        setToast({ message: json.error ?? 'Silme başarısız', type: 'error' })
      }
    } catch {
      setToast({ message: 'Bağlantı hatası', type: 'error' })
    }
  }

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const adSoyad = (a: AthleteRow) => [a.name, a.surname].filter(Boolean).join(' ').trim() || '—'

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Öğrenciler</h1>
          <p className="text-muted-foreground">Öğrenci kayıtlarını yönetin</p>
        </div>
        {!isReadOnly && (
          <Button onClick={() => { setEditStudent(null); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Öğrenci Ekle
          </Button>
        )}
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ad veya soyad ile ara..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') setSearchQuery(q); }}
            className="pl-9"
          />
        </div>
        <select
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tüm Durumlar</option>
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
          <option value="trial">Deneme</option>
        </select>
        <select
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          <option value="">Tüm Branşlar</option>
          <option value="Artistik Cimnastik">Artistik Cimnastik</option>
          <option value="Ritmik Cimnastik">Ritmik Cimnastik</option>
          <option value="Trampolin">Trampolin</option>
          <option value="Genel Jimnastik">Genel Jimnastik</option>
          <option value="Temel Hareket Eğitimi">Temel Hareket Eğitimi</option>
          <option value="Diğer">Diğer</option>
        </select>
        <Button variant="outline" onClick={() => setSearchQuery(q)}>Ara</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <OgrenciTable
            students={items}
            onEdit={isReadOnly ? undefined : (s) => { setEditStudent(s); setShowForm(true); }}
            onDelete={isReadOnly ? undefined : (s) => setDeleteTarget(s)}
            isMobile={isMobile}
          />
          {items.length > 0 && (
            <p className="text-sm text-muted-foreground">Toplam {items.length} kayıt</p>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="max-h-[90vh] overflow-y-auto w-full max-w-2xl">
            <OgrenciForm
              initial={editStudent ? {
                ad: editStudent.name ?? undefined,
                soyad: editStudent.surname ?? undefined,
                dogum_tarihi: editStudent.birth_date ?? undefined,
                cinsiyet: editStudent.gender ?? undefined,
                brans: editStudent.branch ?? undefined,
                seviye: editStudent.level ?? undefined,
                grup: editStudent.group ?? undefined,
                veli_ad: editStudent.parent_name ?? undefined,
                veli_telefon: editStudent.parent_phone ?? undefined,
                veli_email: editStudent.parent_email ?? undefined,
                saglik_notu: editStudent.notes ?? undefined,
              } : null}
              onSubmit={handleSubmit}
              onCancel={() => { setShowForm(false); setEditStudent(null); }}
              isSubmitting={sending}
            />
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="rounded-lg border bg-card p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold">Silme Onayı</h3>
            <p className="text-muted-foreground mt-2">
              {adSoyad(deleteTarget)} adlı öğrenciyi pasife almak istediğinize emin misiniz?
            </p>
            <div className="flex gap-2 mt-4 justify-end">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                İptal
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Pasife Al
              </Button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-600/90' : 'bg-destructive/90'
          } text-white`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
