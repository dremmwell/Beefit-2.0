import { Split } from '@prisma/client'
import React from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'

function SplitDays({ split }: { split: Split }) {

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startDate = new Date(split.startDate)
  startDate.setHours(0, 0, 0, 0)

  const splitDays = Array.from({ length: split.length }, (_, index) => {
    const day = new Date(startDate)
    day.setDate(startDate.getDate() + index)
    return day
  })

  return (
    <div className="mb-2 grid w-full grid-cols-7 gap-1 lg:w-1/2">
      {splitDays.map((day) => (
        <Card
          key={day.toISOString()}
          className={cn(
            'min-w-0 px-2 py-2 shadow-sm bg-background',
            'flex flex-col items-center justify-center gap-0.5',
            day.getTime() === today.getTime() && 'bg-card border-primary',
          )}
          aria-label={day.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        >
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {day.toLocaleDateString('en-US', { weekday: 'short' })}
          </span>
          <span className="text-base font-semibold leading-none">{day.getDate()}</span>
        </Card>
      ))}
    </div>
  )
}

export default SplitDays
