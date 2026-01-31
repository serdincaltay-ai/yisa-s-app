import './globals.css'

export const metadata = {
  title: 'YİSA-S App - Patron Paneli',
  description: 'YİSA-S Yönetim Paneli',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className="bg-[#030508] text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
