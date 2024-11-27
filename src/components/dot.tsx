import * as React from "react"
import { cn } from "@/lib/utils"

/* interface DotProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

const Dot = React.forwardRef<HTMLDivElement, DotProps>(
  ({ color = "bg-primary", size = 'md', className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4'
    }

    return (
      <div
        className={cn(
          "rounded-full",
          sizeClasses[size],
          color,
          "shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.2),_1px_1px_2px_rgba(255,255,255,0.3)]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Dot.displayName = "Dot"

export { Dot } */

function Dot({ color, size } : { color : string, size : 'sm' | 'md' | 'lg'}) {
  return (
    <div
    className="mt-1 rounded-full w-3 h-3 shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.2),_1px_1px_2px_rgba(255,255,255,0.3)] bg-success"
    >
    </div>
  )
}

export default Dot

