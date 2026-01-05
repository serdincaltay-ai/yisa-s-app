import './globals.css'

export const metadata = {
  title: 'YİSA-S',
  description: 'YİSA-S Patron Paneli',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-slate-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
