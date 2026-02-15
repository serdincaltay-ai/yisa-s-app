import { Loader2 } from 'lucide-react'

export default function OgrencilerLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
    </div>
  )
}
