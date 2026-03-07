import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-semibold transition-all duration-200 hover:-translate-y-px hover:scale-[1.02] active:translate-y-0 active:scale-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.6)] hover:shadow-[0_8px_28px_-6px_hsl(var(--primary)/0.7)]",
        destructive: "bg-destructive text-primary-foreground hover:bg-destructive/90 shadow-[0_4px_20px_-4px_hsl(var(--destructive)/0.5)] hover:shadow-[0_8px_28px_-6px_hsl(var(--destructive)/0.6)]",
        outline: "bg-muted/60 text-foreground hover:bg-muted shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]",
        secondary: "bg-secondary/20 text-secondary hover:bg-secondary/30 shadow-[0_2px_10px_-2px_hsl(var(--secondary)/0.3)]",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground shadow-none",
        link: "text-primary shadow-none underline-offset-4 hover:underline hover:translate-y-0 hover:scale-100",
      },
      size: {
        default: "h-11 px-6 py-2 has-[>svg]:px-4",
        xs: "h-8 gap-1 px-3 text-xs has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-13 px-8 text-base has-[>svg]:px-6",
        icon: "size-11", "icon-xs": "size-8 [&_svg:not([class*='size-'])]:size-4", "icon-sm": "size-9", "icon-lg": "size-13",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
