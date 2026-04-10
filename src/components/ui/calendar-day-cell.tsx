import * as React from "react"
import { getDefaultClassNames } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const calendarDayClassName =
  "group/day relative aspect-square h-full w-full select-none rounded-md border border-border p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md"

const calendarTodayClassName =
  "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none"

const calendarDayButtonClassName =
  "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[span-range=true]:border data-[span-range=true]:border-primary/50 data-[span-range=true]:bg-primary/10 data-[span-middle=true]:rounded-none data-[span-start=true]:rounded-l-md data-[span-start=true]:rounded-r-none data-[span-end=true]:rounded-l-none data-[span-end=true]:rounded-r-md data-[span-start=true]:bg-primary data-[span-start=true]:text-primary-foreground data-[span-start=true]:border-primary data-[span-end=true]:border-primary data-[span-end=true]:bg-primary/20 data-[span-end=true]:border-r-[3px] data-[span-end=true]:border-r-primary/80 data-[span-end=true]:[border-right-style:solid] data-[repeat-span-range=true]:border data-[repeat-span-range=true]:border-dashed data-[repeat-span-range=true]:border-primary/35 data-[repeat-span-range=true]:bg-primary/5 data-[repeat-span-middle=true]:rounded-none data-[repeat-span-start=true]:rounded-l-md data-[repeat-span-start=true]:rounded-r-none data-[repeat-span-end=true]:rounded-l-none data-[repeat-span-end=true]:rounded-r-md data-[repeat-span-end=true]:border-r-[3px] data-[repeat-span-end=true]:border-r-primary/80 data-[repeat-span-end=true]:[border-right-style:solid] group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70"

type CalendarDayCellProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isToday?: boolean
  containerClassName?: string
  date?: Date
}

function CalendarDayCell({
  className,
  containerClassName,
  isToday = false,
  date,
  children,
  ...props
}: CalendarDayCellProps) {
  const defaultClassNames = getDefaultClassNames()
  const weekday = date
    ? date.toLocaleDateString('en-US', { weekday: 'short' })
    : null

  return (
    <div
      data-slot="calendar-day-cell"
      className={cn(
        calendarDayClassName,
        defaultClassNames.day,
        isToday && calendarTodayClassName,
        containerClassName
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "cursor-default hover:cursor-default px-1 py-1",
          !isToday && "hover:bg-transparent hover:text-inherit active:bg-transparent active:text-inherit",
          calendarDayButtonClassName,
          defaultClassNames.day,
          className
        )}
        {...props}
      >
        {weekday && <span className="text-xs font-medium">{weekday}</span>}
        {children}
      </Button>
    </div>
  )
}

export {
  CalendarDayCell,
  calendarDayButtonClassName,
  calendarDayClassName,
  calendarTodayClassName,
}