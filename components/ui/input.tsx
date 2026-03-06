import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn("file:text-foreground placeholder:text-muted-foreground/60 selection:bg-primary selection:text-white h-12 w-full min-w-0 rounded-full bg-slate-50/50 border-0 px-6 py-1 text-base shadow-inner transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50", "focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]", "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
