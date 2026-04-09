'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

export interface ProgressDetailItem {
  label: string
  value: number
  max?: number
  color?: string
}

export interface ProgressDetailProps {
  label?: string
  value: number
  max?: number
  items?: ProgressDetailItem[]
  className?: string
  defaultOpen?: boolean
}

function ProgressDetail({
  label,
  value,
  max = 100,
  items = [],
  className,
  defaultOpen = false,
}: ProgressDetailProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const hasItems = items.length > 0

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn('w-full', className)}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          {label && (
            <span className="text-sm font-medium text-foreground">{label}</span>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground tabular-nums">
              {Math.round(percentage)}%
            </span>
            {hasItems && (
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="rounded-md p-1 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={isOpen ? 'Collapse details' : 'Expand details'}
                >
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>
              </CollapsibleTrigger>
            )}
          </div>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>

      {hasItems && (
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-2 data-[state=open]:slide-down-2">
          <div className="mt-4 space-y-3 rounded-lg border border-border bg-muted/30 p-4">
            {items.map((item, index) => {
              const itemPercentage = Math.min(
                100,
                Math.max(0, (item.value / (item.max ?? 100)) * 100)
              )
              return (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {Math.round(itemPercentage)}%
                    </span>
                  </div>
                  <div
                    className={cn(
                      'relative h-1.5 w-full overflow-hidden rounded-full bg-primary/20'
                    )}
                  >
                    <div
                      className={cn(
                        'h-full transition-all duration-300',
                        item.color ?? 'bg-primary'
                      )}
                      style={{ width: `${itemPercentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}

export { ProgressDetail }
