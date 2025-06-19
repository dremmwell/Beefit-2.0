"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { getContrastColor } from "@/lib/utils"
import type { BoardColumn } from "./board"
import type { Label } from "../label-board/label-types"

type DeleteColumnDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  column: BoardColumn
  labels: Label[]
}

export default function DeleteColumnDialog({ open, onOpenChange, onConfirm, column, labels }: DeleteColumnDialogProps) {
  const cardCount = column.cards.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Delete Column</DialogTitle>
              <DialogDescription className="mt-1 text-muted-foreground">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="mb-3">
              <h4 className="font-medium text-destructive">{column.title} will be permanently deleted</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {cardCount === 0
                  ? "This column is empty."
                  : `This column contains ${cardCount} exercise${cardCount === 1 ? "" : "s"} that will also be deleted.`}
              </p>
            </div>

            {cardCount > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Exercises to be deleted:
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {column.cards.map((card) => {
                    const cardLabels = card.labels.map((cardLabel) => {
                      const labelInfo = labels.find((label) => label.id === cardLabel.id)
                      return {
                        ...cardLabel,
                        name: labelInfo?.name || "",
                        color: labelInfo?.color || "#cccccc",
                      }
                    })

                    return (
                      <div
                        key={card.id}
                        className="flex items-center justify-between p-2 bg-background rounded border border-border"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">{card.title}</div>
                          {cardLabels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {cardLabels.map((label) => (
                                <div
                                  key={`${label.id}-${label.intensity}`}
                                  className="rounded-full px-1.5 py-0 flex items-center border border-border/50"
                                  style={{
                                    backgroundColor: label.color,
                                    color: getContrastColor(label.color),
                                    opacity: label.intensity === "half" ? 0.6 : 1,
                                    border: label.intensity === "half" ? "1px dashed rgba(255,255,255,0.5)" : "none",
                                  }}
                                >
                                  <span className="text-[10px] font-medium truncate flex items-center">
                                    {label.name}
                                    {label.intensity === "half" && <span className="ml-0.5">½</span>}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground ml-2">{card.sets} sets</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
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
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Column
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
