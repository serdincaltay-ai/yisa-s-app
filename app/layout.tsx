import './globals.css'
import ChatWidget from '@/components/ChatWidget'

export const metadata = {
  title: 'YİSA-S App - Patron Paneli',
  description: 'YİSA-S Yönetim Paneli',
  title: 'YİSA-S',
  description: 'YİSA-S Patron Paneli',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

@@ -11,9 +10,8 @@
    <html lang="tr">
      <body className="bg-slate-950 text-white min-h-screen">
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}
