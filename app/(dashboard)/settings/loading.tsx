import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Tabs row */}
      <div className="flex gap-2 p-1 bg-muted rounded-full w-fit">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>

      {/* Settings card */}
      <div className="rounded-[2rem] bg-card shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] p-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="space-y-4 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-12 w-36 rounded-full" />
      </div>
    </div>
  )
}
