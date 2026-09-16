"use client"

import { useState } from "react"
import { CalendarDays, Loader2 } from "lucide-react"
import { saveStepCount, StepCountEntry } from "@/app/actions/db.actions/workout.actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendarVanilla"
import { useToast } from "@/components/ui/use-toast"

type AddStepsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onStepSaved?: (entry: StepCountEntry) => void
}

export default function AddStepsDialog({ open, onOpenChange, userId, onStepSaved }: AddStepsDialogProps) {
  const [count, setCount] = useState<number | "">("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (count === "") {
      return
    }

    setIsSaving(true)
    try {
      const savedEntry = await saveStepCount(userId, count, selectedDate)
      if (savedEntry === null) {
        throw new Error("Unable to save step count")
      }

      onStepSaved?.(savedEntry)
      onOpenChange(false)
      setCount("")
      setSelectedDate(new Date())
      toast({
        title: "Daily steps saved",
        description: `${savedEntry.count.toLocaleString("en-US")} steps added to your activity log.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Failed to save daily steps",
        description: "Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Steps</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Label htmlFor="session-step-count">Session steps</Label>
          <Input
            id="session-step-count"
            type="number"
            min={0}
            step={100}
            autoFocus
            value={count}
            onChange={(event) => {
              const value = event.target.value
              setCount(value === "" ? "" : Math.max(0, Number.parseInt(value, 10) || 0))
            }}
            placeholder="e.g. 8500"
          />
        </div>

        <div className="grid gap-2 pb-2">
          <Label htmlFor="session-step-date">Date</Label>
          <Popover modal open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                id="session-step-date"
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[70] w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(selectedDay) => {
                  if (selectedDay) {
                    setSelectedDate(selectedDay)
                    setIsDatePopoverOpen(false)
                  }
                }}
                defaultMonth={selectedDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || count === ""}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Steps
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}