"use client"

import { useState, useEffect } from "react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { getContrastColor } from "@/lib/utils"
import type { BoardColumn, Card, WorkoutCard } from "./board"
import type { Label as LabelType } from "../label-board/label-types"
import type { LabelGroup } from "../label-board/label-board-context"

type BulkExportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  column: BoardColumn
  labels: LabelType[]
  labelGroups: LabelGroup[]
  onConfirm: (workoutCards: WorkoutCard[]) => void
}

type ExportCard = {
  card: Card
  sets: number
}

export default function BulkExportDialog({
  open,
  onOpenChange,
  column,
  labels,
  labelGroups,
  onConfirm,
}: BulkExportDialogProps) {
  const [exportCards, setExportCards] = useState<ExportCard[]>([])

  // Initialize export cards when dialog opens
  useEffect(() => {
    if (open && column.cards.length > 0) {
      setExportCards(
        column.cards.map((card) => ({
          card,
          sets: card.sets,
        })),
      )
    }
  }, [open, column.cards])

  const handleSetsChange = (cardId: string, newSets: number) => {
    setExportCards((prev) =>
      prev.map((exportCard) =>
        exportCard.card.id === cardId ? { ...exportCard, sets: Math.max(1, Math.min(20, newSets)) } : exportCard,
      ),
    )
  }

  const handleConfirm = () => {
    const workoutCards: WorkoutCard[] = exportCards.map((exportCard) => ({
      id: crypto.randomUUID(),
      cardId: exportCard.card.id,
      title: exportCard.card.title,
      sets: exportCard.sets,
      weight: exportCard.card.weight,
      notes: exportCard.card.notes, // Include notes in workout cards
      labels: exportCard.card.labels.map((cardLabel) => {
        const labelInfo = labels.find((l) => l.id === cardLabel.id)
        const labelGroup = labelGroups.find((g) => g.labels.some((l) => l.id === cardLabel.id))

        return {
          id: cardLabel.id,
          name: labelInfo?.name || "",
          color: labelInfo?.color || "#cccccc",
          intensity: cardLabel.intensity,
          priorityValue: labelGroup?.value || 0,
        }
      }),
      addedAt: new Date(),
    }))

    onConfirm(workoutCards)
  }

  const totalSets = exportCards.reduce((sum, exportCard) => sum + exportCard.sets, 0)

  if (column.cards.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Export Column to Workout</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This column has no exercises to export.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-background">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Export {column.title} to Workout</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Review and adjust the number of sets for each exercise before adding them to your workout.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-foreground">Summary:</span>
              <span className="text-muted-foreground">
                {exportCards.length} exercises • {totalSets} total sets
              </span>
            </div>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {exportCards.map((exportCard) => {
                const cardLabels = exportCard.card.labels.map((cardLabel) => {
                  const labelInfo = labels.find((label) => label.id === cardLabel.id)
                  return {
                    ...cardLabel,
                    name: labelInfo?.name || "",
                    color: labelInfo?.color || "#cccccc",
                  }
                })

                const hasNotes = exportCard.card.notes && exportCard.card.notes.trim().length > 0

                return (
                  <div key={exportCard.card.id} className="border border-border rounded-lg p-4 space-y-3 bg-card">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium text-foreground">{exportCard.card.title}</h4>
                          {hasNotes && (
                            <div className="ml-2 text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
                              Has notes
                            </div>
                          )}
                        </div>
                        {cardLabels.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {cardLabels.map((label) => (
                              <div
                                key={`${label.id}-${label.intensity}`}
                                className="rounded-full px-2 py-0.5 flex items-center border border-border/50"
                                style={{
                                  backgroundColor: label.color,
                                  color: getContrastColor(label.color),
                                  opacity: label.intensity === "half" ? 0.6 : 1,
                                  border: label.intensity === "half" ? "1px dashed rgba(255,255,255,0.5)" : "none",
                                }}
                              >
                                <span className="text-xs font-medium truncate flex items-center">
                                  {label.name}
                                  {label.intensity === "half" && <span className="ml-1">½</span>}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Label
                          htmlFor={`sets-${exportCard.card.id}`}
                          className="text-sm whitespace-nowrap text-foreground"
                        >
                          Sets:
                        </Label>
                        <Input
                          id={`sets-${exportCard.card.id}`}
                          type="number"
                          min="1"
                          max="20"
                          value={exportCard.sets}
                          onChange={(e) => handleSetsChange(exportCard.card.id, Number.parseInt(e.target.value) || 1)}
                          className="w-16 h-8 bg-background border-input text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 bg-background">
          <div className="flex-1 text-sm text-muted-foreground">
            This will add {exportCards.length} exercises ({totalSets} sets) to your workout.
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-input text-foreground hover:bg-accent"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Add All to Workout
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
