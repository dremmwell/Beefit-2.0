import { CalendarDayCell } from '@/components/ui/calendar-day-cell'
import { Split } from '@prisma/client'
import React from 'react'

function SplitDays({split} : {split : Split}) {
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
      <div className="mb-2 grid w-full grid-cols-7 auto-rows-max place-items-center gap-1">
        {splitDays.map((day) => (
          <CalendarDayCell
            key={day.toISOString()}
            date={day}
            isToday={day.getTime() === today.getTime()}
            aria-label={day.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          >
            {day.getDate()}
          </CalendarDayCell>
        ))}
      </div>
  )
}

export default SplitDays
