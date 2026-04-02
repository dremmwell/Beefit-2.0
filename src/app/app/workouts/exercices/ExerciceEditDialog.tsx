import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Exercice } from "@prisma/client"

const COLORS = [
  { value: "#ef4444", name: "Red" },
  { value: "#f97316", name: "Orange" },
  { value: "#f59e0b", name: "Amber" },
  { value: "#eab308", name: "Yellow" },
  { value: "#84cc16", name: "Lime" },
  { value: "#22c55e", name: "Green" },
  { value: "#10b981", name: "Emerald" },
  { value: "#14b8a6", name: "Teal" },
  { value: "#06b6d4", name: "Cyan" },
  { value: "#0ea5e9", name: "Light Blue" },
  { value: "#3b82f6", name: "Blue" },
  { value: "#6366f1", name: "Indigo" },
  { value: "#8b5cf6", name: "Purple" },
  { value: "#a855f7", name: "Violet" },
  { value: "#d946ef", name: "Fuchsia" },
  { value: "#ec4899", name: "Pink" },
  { value: "#f43f5e", name: "Rose" },
  { value: "#6b7280", name: "Gray" },
]

type ExerciceEditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (exercice: Exercice) => void
  exercice: Exercice
}

export default function ExerciceEditDialog({ open, onOpenChange, onSave, exercice }: ExerciceEditDialogProps) {
  const [name, setName] = useState(exercice.name)
  const [description, setDescription] = useState(exercice.description)

  useEffect(() => {
    setName(exercice.name)
    setDescription(exercice.description)
  }, [exercice])

  const handleSave = () => {
    if (name.trim()) {

      const updatedExercice: Exercice = {
        ...exercice,  
        name: name.trim(),
        description
    }
      onSave(updatedExercice)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Label</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="label-name">Label Name</Label>
            <Input
              id="label-name"
              placeholder="Enter label name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}