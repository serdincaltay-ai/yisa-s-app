# AŞAMA 8 RAPOR — Otomatik Tenant Kurulumu

**Tarih:** 2 Şubat 2026  
**Durum:** ✅ Tamamlandı

---

## Yapılan İşler

### Demo onaylandığında (app/api/demo-requests/route.ts)

1. **Tenant oluşturma** — Zaten vardı
2. **Kullanıcı eşleştirme (YENİ):**
   - Demo talebi e-posta ile auth.users listesinde kullanıcı aranır
   - Bulunursa: `tenants.owner_id` güncellenir
   - `user_tenants` tablosuna (user_id, tenant_id, role: 'owner') kayıt eklenir
   - Böylece mevcut kullanıcı demo onayıyla otomatik tenant'a bağlanır

### Akış

1. Franchise müşterisi demo formu doldurur (e-posta dahil)
2. Patron Onay Kuyruğu'ndan onaylar
3. Tenant oluşturulur
4. E-posta ile kullanıcı varsa → owner_id + user_tenants atanır
5. Kullanıcı franchise.yisa-s.com'a giriş yaptığında tesisini görür
