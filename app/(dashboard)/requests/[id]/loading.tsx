import { Skeleton } from "@/components/ui/skeleton"

export default function RequestDetailLoading() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-row md:flex-col items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-1.5 w-full">
                <Skeleton className="h-3.5 w-20 mx-auto" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="border-b border-border pb-1 flex gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-20" />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-20 rounded-xl" />
            <div className="space-y-3 pt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
