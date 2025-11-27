import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SorteioSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-muted rounded" />
          <div>
            <div className="w-48 h-5 bg-muted rounded mb-2" />
            <div className="w-32 h-4 bg-muted rounded" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="w-24 h-4 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="w-20 h-6 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
