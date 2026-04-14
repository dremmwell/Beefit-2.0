"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ExerciceData, ExercicePerfInput } from "@/app/types/definitions"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Badge} from "@/components/ui/badge"
import { createExercicePerformance } from "@/app/actions/db.actions/workout.actions"
import { Labels } from "@prisma/client"

type ExerciceDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercice: ExerciceData,
  userId: string
}

export default function ExerciceDialog({ open, onOpenChange, exercice, userId }: ExerciceDialogProps) {
  const [sets, setSets] = useState<number | "">(exercice.exercicePerfs[0]?.sets ?? 4)
  const [reps, setReps] = useState<number | "">(exercice.exercicePerfs[0]?.reps ?? 8)
  const [weight, setWeight] = useState<number | "">(exercice.exercicePerfs[0]?.weights ?? 20)
  const [notes, setNotes] = useState<string>(exercice.exercicePerfs[0]?.notes || "")
  const [isSaving, setIsSaving] = useState(false)

  const handleNumberInputChange = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<number | "">>,
    parser: (nextValue: string) => number
  ) => {
    if (value === "") {
      setValue("")
      return
    }

    const parsedValue = parser(value)

    if (!Number.isNaN(parsedValue)) {
      setValue(parsedValue)
    }
  }

  const getNormalizedHexColor = (value: string) => {
  const trimmedValue = value.trim().replace("#", "")

  if (/^[0-9a-fA-F]{3}$/.test(trimmedValue)) {
    return trimmedValue
      .split("")
      .map((character) => `${character}${character}`)
      .join("")
  }

  if (/^[0-9a-fA-F]{6}$/.test(trimmedValue)) {
    return trimmedValue
  }

  return null
  }

  const getReadableBadgeTextColor = (backgroundColor: string) => {
  const normalizedHexColor = getNormalizedHexColor(backgroundColor)

  if (!normalizedHexColor) {
    return "#ffffff"
  }

  const red = Number.parseInt(normalizedHexColor.slice(0, 2), 16)
  const green = Number.parseInt(normalizedHexColor.slice(2, 4), 16)
  const blue = Number.parseInt(normalizedHexColor.slice(4, 6), 16)
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255

  return luminance > 0.62 ? "#111827" : "#ffffff"
}

  const { toast } = useToast()

  async function handleSave () {
    const normalizedSets = sets === "" ? 4 : sets
    const normalizedReps = reps === "" ? 8 : reps
    const normalizedWeight = weight === "" ? 20 : weight

    try{
      setIsSaving(true)
      await createExercicePerformance({
        sets: normalizedSets,
        reps: normalizedReps,
        weight: normalizedWeight,
        notes,
      },exercice.id, userId);

      toast({
        title: `${exercice.name} sets added to your workout!`,
    });
      onOpenChange(false);
    }
    catch(error){
      console.log(error)
      toast({
        title: `Failed to add ${exercice.name} sets to your workout. Please try again.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add {exercice.name} sets to your workout</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-2">
          {exercice.description}
          <div className="flex flex-row flex-wrap gap-2">
            {exercice.execiceLabels.map((exerciceLabel) => {
            const label = exerciceLabel.Labels ?? exerciceLabel.labels

            if (!label) {
              return null
            }

            if(exerciceLabel.value === "primary"){
              return(
              <Badge
                key={exerciceLabel.id}
                variant="outline"
                className="min-w-10 grow-0 shrink-0 basis-auto justify-center overflow-hidden rounded-full border-transparent shadow-sm h-6 max-w-32 px-2.5"
                style={{
                  backgroundColor: label.color,
                  color: getReadableBadgeTextColor(label.color),
                }}
                title={label.name}
              >
                <span className="overflow-hidden whitespace-nowrap max-w-24 opacity-100">
                  {label.name}
                </span>
              </Badge>
              )
            }
            if(exerciceLabel.value === "secondary"){
            return (
              <Badge
                key={exerciceLabel.id}
                variant="outline"
                className="min-w-10 grow-0 shrink-0 basis-auto justify-center overflow-hidden rounded-full border-transparent shadow-sm h-6 max-w-32 px-2.5"
                style={{
                  backgroundColor: label.color,
                  color: getReadableBadgeTextColor(label.color),
                }}
                title={label.name}
              >
                <span className="overflow-hidden whitespace-nowrap max-w-24 opacity-100">
                  1/2 {label.name}
                </span>
              </Badge>
            )
          }})}
          </div>
        </DialogDescription>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-row gap-4">
            <div className="grid gap-2">
              <Label htmlFor="exercice-sets">Sets</Label>
              <Input
                id="exercice-sets"
                type="number"
                step={1}
                value={sets}
                onChange={(event) => handleNumberInputChange(event.target.value, setSets, (value) => Number.parseInt(value, 10))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="exercice-reps">Reps per set</Label>
              <Input
                id="exercice-reps"
                type="number"
                required
                step={1}
                value={reps}
                onChange={(event) => handleNumberInputChange(event.target.value, setReps, (value) => Number.parseInt(value, 10))}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="exercice-weight">Weight</Label>
            <Input
              id="exercice-weight"
              type="number"
              required
              step={0.5}
              value={weight}
              onChange={(event) => handleNumberInputChange(event.target.value, setWeight, Number.parseFloat)}
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
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Add to workout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}