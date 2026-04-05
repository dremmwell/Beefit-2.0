import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExerciceData } from "@/app/types/definitions"

type ExerciceDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (exercice: ExerciceData) => void
  exercice: ExerciceData
}

export default function ExerciceDialog({ open, onOpenChange, onSave, exercice}: ExerciceDialogProps) {

  const handleSave = () => {
      onSave(exercice)
      onOpenChange(false)
    }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Exercise to your workout</DialogTitle>
        </DialogHeader>
        <DialogContent>

        </DialogContent>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}