import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

// Base: shadcn/ui (radix-nova), adaptado aos tokens da Direção A.
// Alturas mínimas de 44px (padrão) e 36px (sm) para alvos de toque.
const buttonVariantsBase = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-control border border-transparent bg-clip-padding font-sans font-semibold whitespace-nowrap transition-[background-color,border-color,color] duration-200 ease-out-soft outline-none select-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-brand active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-88",
        outline:
          "border-line-strong bg-transparent text-foreground hover:border-muted-foreground",
        ghost: "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
        link: "h-auto! px-0! text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 gap-2 px-[1.125rem] text-small",
        sm: "h-9 gap-1.5 px-3.5 text-[0.875rem]",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Classes do botão já mescladas (tailwind-merge): sem isso, `border-transparent`
 * da base e a borda do `outline` disputam pela ordem do CSS e a borda some.
 */
function buttonVariants(options?: Parameters<typeof buttonVariantsBase>[0]): string {
  return cn(buttonVariantsBase(options))
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariantsBase> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariantsBase({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
