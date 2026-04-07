"use client"

import * as React from "react"
import { useState } from "react"
import { addDays, differenceInCalendarDays, format, isAfter, isBefore, isSameDay } from "date-fns"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "./ui/use-toast"
import { createSplit } from "@/app/actions/db.actions/workout.actions"

export function DatePicker() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [spanDays, setSpanDays] = useState(7)
  const [isSaving, setIsSaving] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const spanEndDate = React.useMemo(() => {
    if (!date) return undefined
    return addDays(date, spanDays - 1)
  }, [date, spanDays])

  const increaseSpan = () => setSpanDays((prev) => Math.min(prev + 1, 60))
  const decreaseSpan = () => setSpanDays((prev) => Math.max(prev - 1, 1))

const { toast } = useToast()

  async function handleSave () {
    if (!date) {
      return
    }

    try{
      setIsSaving(true)
      const startDateTime = new Date(date)
      startDateTime.setHours(0, 0, 0, 0)

      await createSplit("userId", startDateTime, spanDays)
      setIsOpen(false)

      toast({
        title: `Split updated successfully!`,
    });
    }
    catch(error){
      console.log(error)
      toast({
        title: `Failed to update split. Please try again.`,
      });
    }
    finally {
      setIsSaving(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-[280px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date && spanEndDate ? (
            <span>{format(date, "PPP")} - {format(spanEndDate, "PPP")}</span>
          ) : (
            <span>Pick a date</span>
          )}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="border-b p-2 flex flex-col items-center justify-between gap-3">
            <div className="flex items-center w-full">
                <span className="text-sm font-medium ml-2">Split length</span>
                <div className="flex items-center gap-1 ml-auto">
                    <Button type="button" size="icon" variant="ghost" className="size-7" onClick={decreaseSpan}>
                        <ChevronLeftIcon className="size-4" />
                    </Button>
                    <div className="min-w-16 rounded-md border border-primary px-2 py-1 text-center text-sm font-medium">{spanDays} days</div>
                    <Button type="button" size="icon" variant="ghost" className="size-7" onClick={increaseSpan}>
                        <ChevronRightIcon className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
          modifiers={{
            spanStart: (day) => !!date && isSameDay(day, date),
            spanMiddle: (day) => !!date && !!spanEndDate && isAfter(day, date) && isBefore(day, spanEndDate),
            spanEnd: (day) => !!date && !!spanEndDate && spanDays > 1 && isSameDay(day, spanEndDate),
            spanRange: (day) => !!date && !!spanEndDate && (isSameDay(day, date) || isSameDay(day, spanEndDate) || (isAfter(day, date) && isBefore(day, spanEndDate))),
            repeatSpanStart: (day) => {
              if (!date) return false
              const diff = differenceInCalendarDays(day, date)
              return diff >= spanDays && diff % spanDays === 0
            },
            repeatSpanMiddle: (day) => {
              if (!date || spanDays <= 2) return false
              const diff = differenceInCalendarDays(day, date)
              if (diff < spanDays) return false
              const cyclePosition = diff % spanDays
              return cyclePosition > 0 && cyclePosition < spanDays - 1
            },
            repeatSpanEnd: (day) => {
              if (!date || spanDays <= 1) return false
              const diff = differenceInCalendarDays(day, date)
              return diff >= spanDays && diff % spanDays === spanDays - 1
            },
            repeatSpanRange: (day) => {
              if (!date) return false
              const diff = differenceInCalendarDays(day, date)
              return diff >= spanDays
            },
          }}
          
        />
        <Button className="w-full rounded-t-none" size="sm" onClick={handleSave} disabled={!date || isSaving}>
            {isSaving && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
        Save
      </Button>
      </PopoverContent>
    </Popover>
  )
}
