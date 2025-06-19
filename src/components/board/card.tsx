"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Trash2, Edit, Plus, GripVertical, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Card as CardType } from "./board"
import type { Label } from "../label-board/label-types"
import CardEditDialog from "./card-edit-dialog"
import { getContrastColor } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type CardProps = {
  card: CardType
  labels: Label[]
  columnId: string
  onDeleteCard: () => void
  onToggleLabel: (labelId: string, intensity: "full" | "half") => void
  onUpdateCard: (updatedCard: Partial<CardType>) => void
  onAddToWorkout?: () => void
}

export default function Card({
  card,
  labels,
  columnId,
  onDeleteCard,
  onToggleLabel,
  onUpdateCard,
  onAddToWorkout,
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isEditingSets, setIsEditingSets] = useState(false)
  const [isEditingWeight, setIsEditingWeight] = useState(false)
  const [tempSets, setTempSets] = useState(card.sets.toString())
  const [tempWeight, setTempWeight] = useState(card.weight?.toString() || "")
  const [isDragging, setIsDragging] = useState(false)
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const notesButtonRef = useRef<HTMLButtonElement>(null)

  const cardLabels = card.labels.map((cardLabel) => {
    const labelInfo = labels.find((label) => label.id === cardLabel.id)
    return {
      ...cardLabel,
      name: labelInfo?.name || "",
      color: labelInfo?.color || "#cccccc",
    }
  })

  // Handle double click to add to workout
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      // Don't trigger if clicking on a button or input
      if (
        e.target instanceof HTMLButtonElement ||
        e.target instanceof HTMLInputElement ||
        notesButtonRef.current?.contains(e.target as Node)
      ) {
        return
      }

      if (onAddToWorkout && !isDragging) {
        onAddToWorkout()
      }
    },
    [onAddToWorkout, isDragging],
  )

  const handleSetsChange = (value: string) => {
    setTempSets(value)
  }

  const handleSetsSubmit = () => {
    const newSets = Number.parseInt(tempSets, 10)
    if (!isNaN(newSets) && newSets > 0 && newSets <= 20) {
      onUpdateCard({ sets: newSets })
    } else {
      setTempSets(card.sets.toString())
    }
    setIsEditingSets(false)
  }

  const handleSetsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSetsSubmit()
    } else if (e.key === "Escape") {
      setTempSets(card.sets.toString())
      setIsEditingSets(false)
    }
  }

  const handleWeightChange = (value: string) => {
    setTempWeight(value)
  }

  const handleWeightSubmit = () => {
    const newWeight = Number.parseFloat(tempWeight)
    if (!isNaN(newWeight) && newWeight > 0 && newWeight <= 1000) {
      onUpdateCard({ weight: newWeight })
    } else if (tempWeight === "") {
      onUpdateCard({ weight: undefined })
    } else {
      setTempWeight(card.weight?.toString() || "")
    }
    setIsEditingWeight(false)
  }

  const handleWeightKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleWeightSubmit()
    } else if (e.key === "Escape") {
      setTempWeight(card.weight?.toString() || "")
      setIsEditingWeight(false)
    }
  }

  // Drag handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", "card")
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        cardId: card.id,
        sourceColumnId: columnId,
      }),
    )
    e.dataTransfer.effectAllowed = "move"
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const hasNotes = card.notes && card.notes.trim().length > 0

  return (
    <>
      <div
        data-card-id={card.id}
        className={`bg-card border rounded-md p-3 shadow-sm relative group transition-all hover:shadow-md focus-within:ring-1 focus-within:ring-primary cursor-move ${
          isDragging ? "opacity-50 rotate-1" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleDoubleClick}
        draggable={!isEditingSets && !isEditingWeight && !isNotesOpen}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        tabIndex={0}
        role="button"
        aria-label={`Exercise: ${card.title}${onAddToWorkout ? ". Double-click to add to workout" : ""}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onAddToWorkout && !isDragging) {
            onAddToWorkout()
          }
        }}
      >
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1 pr-2">
            <div className="flex items-center">
              <GripVertical className="h-3 w-3 text-muted-foreground mr-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              <div className="text-sm font-medium text-foreground">{card.title}</div>

              {/* Notes indicator */}
              {hasNotes && (
                <Popover open={isNotesOpen} onOpenChange={setIsNotesOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      ref={notesButtonRef}
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1 text-muted-foreground hover:text-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span className="sr-only">View notes</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3" side="top">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">Notes</h4>
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap">{card.notes}</div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          {(isHovered || (typeof window !== "undefined" && "ontouchstart" in window)) && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditDialogOpen(true)
                }}
                title="Edit exercise"
              >
                <Edit className="h-3 w-3" />
                <span className="sr-only">Edit exercise</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteCard()
                }}
                title="Delete exercise"
              >
                <Trash2 className="h-3 w-3" />
                <span className="sr-only">Delete exercise</span>
              </Button>
            </div>
          )}
        </div>

        {cardLabels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {cardLabels.map((label) => (
              <div
                key={`${label.id}-${label.intensity}`}
                className="rounded-full transition-all duration-200 flex items-center overflow-hidden"
                style={{
                  backgroundColor: label.color,
                  width: isHovered ? "auto" : "16px",
                  height: isHovered ? "18px" : "8px",
                  maxWidth: isHovered ? "100%" : "16px",
                  opacity: label.intensity === "half" ? 0.6 : 1,
                  border: label.intensity === "half" ? "1px dashed rgba(255,255,255,0.5)" : "none",
                }}
              >
                {isHovered && (
                  <span
                    className="text-xs px-2 font-medium whitespace-nowrap flex items-center"
                    style={{
                      color: getContrastColor(label.color),
                    }}
                  >
                    {label.name}
                    {label.intensity === "half" && <span className="ml-1">½</span>}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isHovered && (
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground mr-2">Sets:</span>
                  {isEditingSets ? (
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={tempSets}
                      onChange={(e) => handleSetsChange(e.target.value)}
                      onBlur={handleSetsSubmit}
                      onKeyDown={handleSetsKeyDown}
                      className="h-5 w-12 text-xs px-1 py-0"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsEditingSets(true)
                        setTempSets(card.sets.toString())
                      }}
                      className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      {card.sets}
                    </button>
                  )}
                </div>

                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground mr-2">Weight:</span>
                  {isEditingWeight ? (
                    <Input
                      type="number"
                      min="0"
                      max="1000"
                      step="0.5"
                      value={tempWeight}
                      onChange={(e) => handleWeightChange(e.target.value)}
                      onBlur={handleWeightSubmit}
                      onKeyDown={handleWeightKeyDown}
                      className="h-5 w-16 text-xs px-1 py-0"
                      placeholder="kg"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsEditingWeight(true)
                        setTempWeight(card.weight?.toString() || "")
                      }}
                      className="text-xs font-medium text-primary hover:text-primary/80 transition-colors min-w-[20px] text-left"
                    >
                      {card.weight ? `${card.weight}kg` : "—"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {onAddToWorkout && (isHovered || (typeof window !== "undefined" && "ontouchstart" in window)) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-md text-primary hover:text-primary-foreground hover:bg-primary transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      onAddToWorkout()
                    }}
                    aria-label="Add to workout"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to workout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <CardEditDialog
        card={card}
        labels={labels}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onToggleLabel={onToggleLabel}
        onUpdateCard={onUpdateCard}
      />
    </>
  )
}
