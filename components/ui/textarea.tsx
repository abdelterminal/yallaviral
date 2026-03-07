import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn( "placeholder:text-muted-foreground/80 aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex field-sizing-content min-h-24 w-full rounded-2xl border-0 bg-muted/50 px-5 py-4 text-base shadow-none transition-[color,box-shadow] outline-none focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
