'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function ProgramError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[program error]', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <h2 className="text-lg font-semibold">Bir hata oluştu</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Ders programı sayfası yüklenirken bir sorun yaşandı.
      </p>
      <Button onClick={reset}>Tekrar Dene</Button>
    </div>
  )
}
