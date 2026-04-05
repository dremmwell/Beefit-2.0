"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ExerciceData, ExercicePerfInput } from "@/app/types/definitions"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { createExercicePerformance } from "@/app/actions/db.actions/workout.actions"

type ExerciceDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercice: ExerciceData
}

export default function ExerciceDialog({ open, onOpenChange, exercice}: ExerciceDialogProps) {
  const [sets, setSets] = useState<number>(1)
  const [reps, setReps] = useState<number>(8)
  const [weight, setWeight] = useState<number>(0)
  const [notes, setNotes] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    if (!open) return
    setSets(4)
    setReps(8)
    setWeight(0)
    setNotes("")
  }, [open, exercice.id])

  async function handleSave () {
    try{
      setIsSaving(true)
      await createExercicePerformance({
        sets,
        reps,
        weight,
        notes,
      }, exercice.id);

      toast({
        title: `${exercice.name} added to your workout!`,
    });
      onOpenChange(false);
    }
    catch(error){
      console.log(error)
      toast({
        title: `Failed to add ${exercice.name} to your workout. Please try again.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add {exercice.name} sets to your workout</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-1">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="exercice-sets">Sets</Label>
              <Input
                id="exercice-sets"
                type="number"
                min={1}
                step={1}
                value={sets}
                onChange={(event) => setSets(Number.parseInt(event.target.value, 10) || 1)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="exercice-reps">Reps</Label>
              <Input
                id="exercice-reps"
                type="number"
                min={1}
                step={1}
                value={reps}
                onChange={(event) => setReps(Number.parseInt(event.target.value, 10) || 1)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="exercice-weight">Weight (kg)</Label>
            <Input
              id="exercice-weight"
              type="number"
              min={0}
              step={0.5}
              value={weight}
              onChange={(event) => setWeight(Number.parseFloat(event.target.value) || 0)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="exercice-notes">Notes</Label>
            <Textarea
              id="exercice-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="How did it feel? Tempo, rest time, or any details..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isSaving && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Add to workout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}