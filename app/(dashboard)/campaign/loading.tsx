import { Skeleton } from "@/components/ui/skeleton"

export default function CampaignLoading() {
  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-3 py-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            {i < 4 && <Skeleton className="h-0.5 w-12 rounded-full" />}
          </div>
        ))}
      </div>

      {/* Content card */}
      <div className="rounded-[2rem] bg-card shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] p-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
        <div className="flex justify-between pt-4">
          <Skeleton className="h-12 w-28 rounded-full" />
          <Skeleton className="h-12 w-32 rounded-full" />
        </div>
      </div>
    </div>
  )
}
