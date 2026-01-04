import './globals.css'
import ChatWidget from '@/components/ChatWidget'

export const metadata = {
  title: 'YİSA-S App - Patron Paneli',
  description: 'YİSA-S Yönetim Paneli',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-slate-950 text-white min-h-screen">
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}
```

4. **"Commit changes"** tıkla

---

### DOSYA 4: `package.json` GÜNCELLE

1. GitHub'da `package.json` dosyasını bul ve tıkla

2. **Kalem ikonu (Edit)** tıkla

3. `"@supabase/supabase-js"` satırının **üstüne** şunu ekle:
```
"@anthropic-ai/sdk": "^0.32.0",
