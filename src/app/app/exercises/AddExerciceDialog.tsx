"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Trash2 } from "lucide-react"
import { Labels } from "@prisma/client"

type LabelRole = "primary" | "secondary"
type LabelSelection = LabelRole | "none"

type AddExerciceDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (payload: {
    name: string
    description: string
    sets: number
    reps: number
    weight: number
    labels: { labelId: string; value: LabelRole }[]
  }) => Promise<void>
  labels: Labels[]
  groupName?: string
}

export default function AddExerciceDialog({ open, onOpenChange, onSave, labels, groupName }: AddExerciceDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [sets, setSets] = useState<number | "">(4)
  const [reps, setReps] = useState<number | "">(8)
  const [weight, setWeight] = useState<number | "">(20)
  const [isSaving, setIsSaving] = useState(false)
  const [labelSelections, setLabelSelections] = useState<Record<string, LabelSelection>>({})

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

  const sortedLabels = useMemo(() => {
    return [...labels].sort((leftLabel, rightLabel) => leftLabel.name.localeCompare(rightLabel.name))
  }, [labels])

  useEffect(() => {
    if (!open) {
      return
    }

    setName("")
    setDescription("")
    setSets(4)
    setReps(8)
    setWeight(20)
    const initialSelections: Record<string, LabelSelection> = {}
    sortedLabels.forEach((label) => {
      initialSelections[label.id] = "none"
    })
    setLabelSelections(initialSelections)
  }, [open, sortedLabels])

  const selectedLabels = useMemo(() => {
    return sortedLabels.flatMap((label) => {
      const selection = labelSelections[label.id]
      if (selection === "primary" || selection === "secondary") {
        return [{ labelId: label.id, value: selection }]
      }
      return []
    })
  }, [labelSelections, sortedLabels])

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

  const handleSave = async () => {
    if (!name.trim()) {
      return
    }

    const normalizedSets = sets === "" ? 4 : sets
    const normalizedReps = reps === "" ? 8 : reps
    const normalizedWeight = weight === "" ? 20 : weight

    setIsSaving(true)
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        sets: normalizedSets,
        reps: normalizedReps,
        weight: normalizedWeight,
        labels: selectedLabels,
      })
      onOpenChange(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Exercise{groupName ? ` to ${groupName}` : ""}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="add-exercise-name">Exercise Name</Label>
            <Input
              id="add-exercise-name"
              placeholder="e.g. Inclined Bench Press"
              value={name}
              required
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-4 mt-1">
            <div className="flex flex-row gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-exercise-sets">Sets</Label>
                <Input
                  id="add-exercise-sets"
                  type="number"
                  required
                  step={1}
                  value={sets}
                  onChange={(event) => handleNumberInputChange(event.target.value, setSets, (value) => Number.parseInt(value, 10))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="add-exercise-reps">Reps per set</Label>
                <Input
                  id="add-exercise-reps"
                  type="number"
                  min={0}
                  step={1}
                  value={reps}
                  onChange={(event) => handleNumberInputChange(event.target.value, setReps, (value) => Number.parseInt(value, 10))}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="add-exercise-weight">Weight</Label>
              <Input
                id="add-exercise-weight"
                type="number"
                min={0}
                step={0.5}
                value={weight}
                onChange={(event) => handleNumberInputChange(event.target.value, setWeight, Number.parseFloat)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="add-exercice-description">Description</Label>
            <Textarea
              id="add-exercice-description"
              placeholder="Optional cues, setup or tempo"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Label>Labels</Label>
              {selectedLabels.map((selectedLabel) => {
                const label = sortedLabels.find((item) => item.id === selectedLabel.labelId)
                if (!label) {
                  return null
                }

                return (
                  <div key={selectedLabel.labelId} className="flex items-center gap-1">
                    <Badge
                      className="h-6 rounded-full border-transparent px-2"
                      style={{
                        backgroundColor: label.color,
                        color: getReadableBadgeTextColor(label.color),
                      }}
                    >
                      {selectedLabel.value === "primary" ? `1 ${label.name}` : `1/2 ${label.name}`}
                    </Badge>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => {
                        setLabelSelections((previous) => ({
                          ...previous,
                          [label.id]: "none",
                        }))
                      }}
                      aria-label={`Remove ${label.name} selection`}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                )
              })}
            </div>
            {sortedLabels.length === 0 ? (
              <p className="text-sm text-muted-foreground">No labels available. Create labels in the focus board first.</p>
            ) : (
              <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border p-2 no-scrollbar">
                {sortedLabels.map((label) => {
                  return (
                  <div key={label.id} className="grid grid-cols-[1fr_auto] items-center gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-5 w-5 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: label.color }} />
                      <span className="text-sm truncate">{label.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroup
                        className="flex items-center gap-3"
                      value={labelSelections[label.id] ?? "none"}
                      onValueChange={(value: LabelRole) => {
                        setLabelSelections((previous) => ({
                          ...previous,
                          [label.id]: value,
                        }))
                      }}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem id={`label-primary-${label.id}`} value="primary" />
                          <Label htmlFor={`label-primary-${label.id}`} className="text-xs cursor-pointer">
                            Primary
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem id={`label-secondary-${label.id}`} value="secondary" />
                          <Label htmlFor={`label-secondary-${label.id}`} className="text-xs cursor-pointer">
                            Secondary
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )})}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()|| !sets || isSaving}>
            {isSaving && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Add Exercice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
