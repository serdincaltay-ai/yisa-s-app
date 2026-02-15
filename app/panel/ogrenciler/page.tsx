'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { OgrenciForm, type OgrenciFormData } from './OgrenciForm'
import { OgrenciTable, type StudentRow } from './OgrenciTable'

export default function OgrencilerPage() {
  const [items, setItems] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [perPage] = useState(20)
  const [totalPages, setTotalPages] = useState(0)
  const [q, setQ] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState('created_at')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [editStudent, setEditStudent] = useState<StudentRow | null>(null)
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<StudentRow | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const fetchList = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      params.set('sort', sort)
      params.set('order', order)
      params.set('page', String(page))
      params.set('perPage', String(perPage))
      if (statusFilter) params.set('status', statusFilter)
      const res = await fetch(`/api/students?${params}`)
      const data = await res.json()
      setItems(Array.isArray(data.items) ? data.items : [])
      setTotal(data.total ?? 0)
      setTotalPages(data.totalPages ?? 1)
    } catch {
      setItems([])
      setToast({ message: 'Liste yüklenemedi', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [searchQuery, sort, order, page, perPage, statusFilter])

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
      const url = editStudent ? `/api/students/${editStudent.id}` : '/api/students'
      const method = editStudent ? 'PATCH' : 'POST'
      const body = editStudent
        ? {
            ad_soyad: data.ad_soyad,
            dogum_tarihi: data.dogum_tarihi,
            cinsiyet: data.cinsiyet || null,
            veli_adi: data.veli_adi || null,
            veli_telefon: data.veli_telefon || null,
            veli_email: data.veli_email || null,
            brans: data.brans || null,
            grup_id: data.grup_id || null,
            saglik_notu: data.saglik_notu || null,
          }
        : data
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
      const res = await fetch(`/api/students/${deleteTarget.id}`, { method: 'DELETE' })
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

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Öğrenciler</h1>
          <p className="text-muted-foreground">Öğrenci kayıtlarını yönetin</p>
        </div>
        <Button onClick={() => { setEditStudent(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Öğrenci
        </Button>
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="İsim, TC veya telefon ile ara..."
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
          <option value="">Tümü</option>
          <option value="aktif">Aktif</option>
          <option value="pasif">Pasif</option>
        </select>
        <select
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="created_at">Kayıt Tarihi</option>
          <option value="ad_soyad">İsim</option>
          <option value="dogum_tarihi">Doğum Tarihi</option>
          <option value="brans">Branş</option>
        </select>
        <select
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={order}
          onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
        >
          <option value="desc">Azalan</option>
          <option value="asc">Artan</option>
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
            onEdit={(s) => { setEditStudent(s); setShowForm(true); }}
            onDelete={(s) => setDeleteTarget(s)}
            isMobile={isMobile}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Toplam {total} kayıt
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Önceki
                </Button>
                <span className="text-sm text-muted-foreground">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Sonraki
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="max-h-[90vh] overflow-y-auto w-full max-w-2xl">
            <OgrenciForm
              initial={editStudent ? {
                ad_soyad: editStudent.ad_soyad ?? undefined,
                tc_kimlik: editStudent.tc_kimlik ?? undefined,
                dogum_tarihi: editStudent.dogum_tarihi ?? undefined,
                cinsiyet: editStudent.cinsiyet ?? undefined,
                veli_adi: editStudent.veli_adi ?? undefined,
                veli_telefon: editStudent.veli_telefon ?? undefined,
                veli_email: editStudent.veli_email ?? undefined,
                brans: editStudent.brans ?? undefined,
                grup_id: editStudent.grup_id ?? undefined,
                saglik_notu: editStudent.saglik_notu ?? undefined,
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
              {deleteTarget.ad_soyad} adlı öğrenciyi pasife almak istediğinize emin misiniz?
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
