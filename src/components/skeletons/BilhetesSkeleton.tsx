export function BilhetesGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg bg-muted/20">
          <div className="h-4 bg-muted rounded w-16 mb-2" />
          <div className="h-3 bg-muted rounded w-24" />
        </div>
      ))}
    </div>
  )
}

export function BilhetesListSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="flex justify-between p-3 border rounded bg-muted/20"
        >
          <div className="w-20 h-4 bg-muted rounded" />
          <div className="w-24 h-4 bg-muted rounded" />
          <div className="w-32 h-4 bg-muted rounded" />
        </div>
      ))}
    </div>
  )
}
