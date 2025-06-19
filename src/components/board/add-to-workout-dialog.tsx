"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AddToWorkoutDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  exerciseTitle: string
  onConfirm: (sets: number) => void
}

export default function AddToWorkoutDialog({ open, onOpenChange, exerciseTitle, onConfirm }: AddToWorkoutDialogProps) {
  const [sets, setSets] = useState(4) // Default to 4 sets

  const handleConfirm = () => {
    onConfirm(sets)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add to Workout</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            How many sets of <span className="font-medium text-foreground">{exerciseTitle}</span> would you like to do?
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="sets" className="text-foreground">
              Number of Sets
            </Label>
            <Input
              id="sets"
              type="number"
              min="1"
              max="20"
              value={sets}
              onChange={(e) => setSets(Math.max(1, Number.parseInt(e.target.value) || 1))}
              className="w-full bg-background border-input text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <DialogFooter className="bg-background">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-input text-foreground hover:bg-accent"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Add to Workout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
