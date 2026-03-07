import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn("file:text-foreground placeholder:text-muted-foreground/50 selection:bg-primary selection:text-white h-10 w-full min-w-0 rounded-[10px] bg-muted/40 border-0 px-4 py-1 text-sm text-foreground transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 hover:bg-muted/60 shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]", "focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-0 focus-visible:shadow-[inset_0_1px_3px_rgba(0,0,0,0.2),0_0_0_3px_hsl(var(--primary)/0.12)]", "aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
