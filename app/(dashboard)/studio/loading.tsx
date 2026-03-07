import { Skeleton } from "@/components/ui/skeleton"

export default function StudioLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-3xl bg-card shadow-[0_8px_32px_-4px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col md:flex-row h-auto md:h-[320px]">
            {/* Image */}
            <Skeleton className="w-full md:w-2/5 h-48 md:h-full rounded-none" />
            {/* Content */}
            <div className="flex flex-1 flex-col md:flex-row">
              <div className="flex-1 p-8 space-y-4">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-7 w-40" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-3 flex-wrap">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-8 w-20 rounded-xl" />
                  ))}
                </div>
              </div>
              <div className="p-8 min-w-[240px] flex flex-col items-center justify-center gap-6">
                <div className="space-y-2 text-center">
                  <Skeleton className="h-10 w-32 mx-auto" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
                <Skeleton className="h-14 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
