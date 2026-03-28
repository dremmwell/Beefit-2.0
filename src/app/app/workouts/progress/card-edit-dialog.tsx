"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { Card, LabelIntensity, CardLabel } from "./board"
import type { Label as LabelType } from "./label-management"


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
  const [selectedLabels, setSelectedLabels] = useState<CardLabel[]>([])

  // Reset title and labels when card changes or dialog opens
  useEffect(() => {
    if (open) {
      setTitle(card.title)
      setSelectedLabels([...card.labels])
    }
  }, [card.title, card.labels, open])

  const handleSave = () => {
    if (title.trim()) {
      onUpdateCard({
        title: title.trim(),
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="card-title">Title</Label>
            <Input
              id="card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter card title"
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label>Labels</Label>
            {labels.length === 0 ? (
              <div className="text-sm text-muted-foreground">No labels available</div>
            ) : (
              <div className="space-y-2">
                {labels.map((label) => {
                  const isSelected = isLabelSelected(label.id)
                  const intensity = getLabelIntensity(label.id)

                  return (
                    <div key={label.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-label-${label.id}`}
                          checked={isSelected}
                          onCheckedChange={() => toggleLabelSelection(label.id)}
                        />
                        <label htmlFor={`edit-label-${label.id}`} className="flex items-center text-sm cursor-pointer">
                          <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: label.color }} />
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
