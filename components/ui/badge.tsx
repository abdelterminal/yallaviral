import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva("inline-flex items-center justify-center rounded-full border-0 px-3 py-1 text-xs font-bold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-ring/50 focus-visible:ring-[4px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive transition-[color,box-shadow,transform] overflow-hidden hover:scale-[1.02]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_4px_14px_-4px_hsl(var(--primary))] [a&]:hover:bg-primary/90",
        secondary: "bg-primary/10 text-primary [a&]:hover:bg-primary/20",
        destructive: "bg-destructive/10 text-destructive [a&]:hover:bg-destructive/20",
        outline: "bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        // Status variants
        pending: "bg-amber-500/15 text-amber-400 shadow-[0_0_10px_-2px_rgba(245,158,11,0.2)]",
        confirmed: "bg-emerald-500/15 text-emerald-400 shadow-[0_0_10px_-2px_rgba(52,211,153,0.2)]",
        rejected: "bg-red-500/15 text-red-400 shadow-[0_0_10px_-2px_rgba(239,68,68,0.2)]",
        completed: "bg-blue-500/15 text-blue-400 shadow-[0_0_10px_-2px_rgba(59,130,246,0.2)]",
        unpaid: "bg-orange-500/15 text-orange-400 shadow-[0_0_10px_-2px_rgba(249,115,22,0.2)]",
        paid: "bg-emerald-500/15 text-emerald-400 shadow-[0_0_10px_-2px_rgba(52,211,153,0.2)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
