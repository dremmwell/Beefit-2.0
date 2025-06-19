"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Card, LabelIntensity, CardLabel } from "./board"
import type { Label as LabelType } from "../label-board/label-types"

type CardEditDialogProps = {
  card: Card
  labels: LabelType[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggleLabel: (labelId: string, intensity: LabelIntensity) => void
  onUpdateCard: (updatedCard: Partial<Card>) => void
}

export default function CardEditDialog({
  card,
  labels,
  open,
  onOpenChange,
  onToggleLabel,
  onUpdateCard,
}: CardEditDialogProps) {
  const [title, setTitle] = useState(card.title)
  const [sets, setSets] = useState(card.sets)
  const [weight, setWeight] = useState(card.weight?.toString() || "")
  const [notes, setNotes] = useState(card.notes || "") // Added notes state
  const [selectedLabels, setSelectedLabels] = useState<CardLabel[]>([])
  const [activeTab, setActiveTab] = useState<string>("details")

  // Reset title, sets, weight, notes, and labels when card changes or dialog opens
  useEffect(() => {
    if (open) {
      setTitle(card.title)
      setSets(card.sets)
      setWeight(card.weight?.toString() || "")
      setNotes(card.notes || "") // Reset notes
      setSelectedLabels([...card.labels])
      setActiveTab("details")
    }
  }, [card.title, card.sets, card.weight, card.notes, card.labels, open])

  const handleSave = () => {
    if (title.trim() && sets > 0) {
      const weightValue = weight.trim() === "" ? undefined : Number.parseFloat(weight)
      const validWeight = weightValue && !isNaN(weightValue) && weightValue > 0 ? weightValue : undefined

      onUpdateCard({
        title: title.trim(),
        sets: sets,
        weight: validWeight,
        notes: notes.trim() || undefined, // Save notes, or undefined if empty
        labels: selectedLabels,
      })
    }
    onOpenChange(false)
  }

  const toggleLabelSelection = (labelId: string) => {
    setSelectedLabels((prev) => {
      const existingIndex = prev.findIndex((label) => label.id === labelId)

      if (existingIndex >= 0) {
        // Remove the label if it exists
        return prev.filter((_, index) => index !== existingIndex)
      } else {
        // Add the label with "full" as default intensity
        return [...prev, { id: labelId, intensity: "full" }]
      }
    })
  }

  const updateLabelIntensity = (labelId: string, intensity: LabelIntensity) => {
    setSelectedLabels((prev) => prev.map((label) => (label.id === labelId ? { ...label, intensity } : label)))
  }

  const isLabelSelected = (labelId: string) => {
    return selectedLabels.some((label) => label.id === labelId)
  }

  const getLabelIntensity = (labelId: string): LabelIntensity => {
    return selectedLabels.find((label) => label.id === labelId)?.intensity || "full"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Exercise</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="labels">Labels</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="card-title" className="text-foreground">
                Title
              </Label>
              <Input
                id="card-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter exercise title"
                autoFocus
                className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="card-sets" className="text-foreground">
                  Sets
                </Label>
                <Input
                  id="card-sets"
                  type="number"
                  min="1"
                  max="20"
                  value={sets}
                  onChange={(e) => setSets(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  placeholder="Number of sets"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="card-weight" className="text-foreground">
                  Weight (kg)
                </Label>
                <Input
                  id="card-weight"
                  type="number"
                  min="0"
                  max="1000"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Optional"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="card-notes" className="text-foreground">
                Notes
              </Label>
              <Textarea
                id="card-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add form tips, reminders, or other notes about this exercise..."
                className="min-h-[100px] bg-background border-input text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>
          </TabsContent>

          <TabsContent value="labels" className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-foreground">Muscle Groups</Label>
              {labels.length === 0 ? (
                <div className="text-sm text-muted-foreground">No labels available</div>
              ) : (
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                  {labels.map((label) => {
                    const isSelected = isLabelSelected(label.id)
                    const intensity = getLabelIntensity(label.id)

                    return (
                      <div
                        key={label.id}
                        className="flex items-center justify-between p-2 rounded-md border border-border bg-card"
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-label-${label.id}`}
                            checked={isSelected}
                            onCheckedChange={() => toggleLabelSelection(label.id)}
                            className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <label
                            htmlFor={`edit-label-${label.id}`}
                            className="flex items-center text-sm cursor-pointer text-foreground"
                          >
                            <div
                              className="h-3 w-3 rounded-full mr-2 border border-border/50"
                              style={{ backgroundColor: label.color }}
                            />
                            {label.name}
                          </label>
                        </div>

                        {isSelected && (
                          <div className="flex items-center space-x-1">
                            <Button
                              variant={intensity === "full" ? "secondary" : "outline"}
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => updateLabelIntensity(label.id, "full")}
                            >
                              Full
                            </Button>
                            <Button
                              variant={intensity === "half" ? "secondary" : "outline"}
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => updateLabelIntensity(label.id, "half")}
                            >
                              Half
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="bg-background">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-input text-foreground hover:bg-accent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || sets <= 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
