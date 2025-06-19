"use client"

import type React from "react"

import { useState, useRef, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil, X, ChevronDown, ChevronUp, Tag, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Card from "./card"
import type { BoardColumn, Card as CardType, CardLabel, LabelIntensity } from "./board"
import type { Label as LabelType } from "../label-board/label-types"
import { getContrastColor } from "@/lib/utils"
import { Card as UICard, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ColumnProps = {
  column: BoardColumn
  labels: LabelType[]
  columnIndex: number
  totalColumns: number
  onAddCard: (cardTitle: string, cardLabels: CardLabel[]) => void
  onDeleteColumn: () => void
  onDeleteCard: (cardId: string) => void
  onToggleCardLabel: (cardId: string, labelId: string, intensity: LabelIntensity) => void
  onUpdateCard: (cardId: string, updatedCard: Partial<CardType>) => void
  onUpdateColumn: (updates: Partial<BoardColumn>) => void
  onUpdateColumnPosition: (newPosition: number) => void
  onAddToWorkout?: (card: CardType) => void
  onCardDrop: (sourceColumnId: string, targetColumnId: string, cardId: string, targetIndex?: number) => void
  onBulkExport: () => void
}

export default function Column({
  column,
  labels,
  columnIndex,
  totalColumns,
  onAddCard,
  onDeleteColumn,
  onDeleteCard,
  onToggleCardLabel,
  onUpdateCard,
  onUpdateColumn,
  onUpdateColumnPosition,
  onAddToWorkout,
  onCardDrop,
  onBulkExport,
}: ColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState("")
  const [selectedLabels, setSelectedLabels] = useState<CardLabel[]>([])
  const [showLabelSelector, setShowLabelSelector] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(column.title)
  const [selectedPosition, setSelectedPosition] = useState<string>(columnIndex.toString())
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const columnRef = useRef<HTMLDivElement>(null)

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(newCardTitle, selectedLabels)
      setNewCardTitle("")
      setSelectedLabels([])
      setShowLabelSelector(false)
      setIsAddingCard(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddCard()
    }
  }

  const handleTitleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSaveTitle()
    } else if (e.key === "Escape") {
      cancelEditing()
    }
  }

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onUpdateColumn({
        title: editedTitle.trim(),
      })

      // Handle position change if different
      const newPosition = Number.parseInt(selectedPosition, 10)
      if (newPosition !== columnIndex) {
        onUpdateColumnPosition(newPosition)
      }
    }
    setIsEditingTitle(false)
  }

  const cancelEditing = () => {
    setEditedTitle(column.title)
    setSelectedPosition(columnIndex.toString())
    setIsEditingTitle(false)
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

  const activeLabels = selectedLabels.map((selectedLabel) => {
    const labelInfo = labels.find((l) => l.id === selectedLabel.id)
    return {
      id: selectedLabel.id,
      name: labelInfo?.name || "",
      color: labelInfo?.color || "#cccccc",
      intensity: selectedLabel.intensity,
    }
  })

  // Card drag handlers
  const handleCardDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const cardElements = Array.from(columnRef.current?.querySelectorAll("[data-card-id]") || [])
    const afterElement = getDragAfterElement(e.clientY, cardElements)

    if (afterElement) {
      const afterIndex = cardElements.indexOf(afterElement)
      setDragOverIndex(afterIndex)
    } else {
      setDragOverIndex(cardElements.length)
    }
  }

  const handleCardDragLeave = (e: React.DragEvent) => {
    if (!columnRef.current?.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null)
    }
  }

  const handleCardDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverIndex(null)

    const dataType = e.dataTransfer.getData("text/plain")
    if (dataType !== "card") return

    try {
      const dragData = JSON.parse(e.dataTransfer.getData("application/json"))
      const { cardId, sourceColumnId } = dragData

      const cardElements = Array.from(columnRef.current?.querySelectorAll("[data-card-id]") || [])
      const afterElement = getDragAfterElement(e.clientY, cardElements)

      let targetIndex: number
      if (afterElement) {
        targetIndex = cardElements.indexOf(afterElement)
      } else {
        targetIndex = cardElements.length
      }

      onCardDrop(sourceColumnId, column.id, cardId, targetIndex)
    } catch (error) {
      console.error("Error handling card drop:", error)
    }
  }

  const getDragAfterElement = (y: number, cardElements: Element[]) => {
    return cardElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child }
        } else {
          return closest
        }
      },
      { offset: Number.NEGATIVE_INFINITY, element: null as Element | null },
    ).element
  }

  return (
    <UICard
      ref={columnRef}
      className={`w-72 shrink-0 group ${dragOverIndex !== null ? "ring-2 ring-primary" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleCardDragOver}
      onDragLeave={handleCardDragLeave}
      onDrop={handleCardDrop}
    >
      <CardHeader className="px-4 py-3 space-y-0 flex flex-row items-center justify-between">
        {isEditingTitle ? (
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Edit Column</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={cancelEditing}
                title="Cancel"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cancel</span>
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="column-title" className="text-xs">
                  Title
                </Label>
                <Input
                  id="column-title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  className="h-7 py-1 text-sm mt-1"
                  autoFocus
                />
              </div>

              <div>
                <Label htmlFor="column-position" className="text-xs">
                  Position
                </Label>
                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger className="h-7 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: totalColumns }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        Position {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button size="sm" onClick={handleSaveTitle} className="w-full mt-2">
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <>
            <CardTitle className="text-sm font-medium">{column.title}</CardTitle>

            <div className="flex">
              {column.cards.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  onClick={onBulkExport}
                  title="Export all exercises to workout"
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Export all exercises to workout</span>
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                onClick={() => {
                  setEditedTitle(column.title)
                  setSelectedPosition(columnIndex.toString())
                  setIsEditingTitle(true)
                }}
                title="Edit column"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit column</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                onClick={onDeleteColumn}
                title="Delete column"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete column</span>
              </Button>
            </div>
          </>
        )}
      </CardHeader>

      <CardContent className="px-3 pt-0 pb-3">
        <div className="space-y-2 mb-3 overflow-y-auto max-h-[500px]">
          {column.cards.map((card, index) => (
            <div key={card.id}>
              {dragOverIndex === index && (
                <div className="h-1 bg-primary rounded-full mb-2 transition-all duration-200" />
              )}
              <Card
                card={card}
                labels={labels}
                columnId={column.id}
                onDeleteCard={() => onDeleteCard(card.id)}
                onToggleLabel={(labelId, intensity) => onToggleCardLabel(card.id, labelId, intensity)}
                onUpdateCard={(updatedCard) => onUpdateCard(card.id, updatedCard)}
                onAddToWorkout={onAddToWorkout ? () => onAddToWorkout(card) : undefined}
              />
            </div>
          ))}
          {dragOverIndex === column.cards.length && (
            <div className="h-1 bg-primary rounded-full transition-all duration-200" />
          )}
        </div>

        {column.cards.length === 0 && dragOverIndex !== null && (
          <div className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed border-primary rounded-md bg-primary/5">
            Drop card here
          </div>
        )}

        {isAddingCard ? (
          <div className="mt-2 bg-card p-3 rounded-md border shadow-sm">
            <Input
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter card title..."
              className="mb-2"
              autoFocus
            />

            {activeLabels.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {activeLabels.map((label) => (
                  <div
                    key={`${label.id}-${label.intensity}`}
                    className="h-5 rounded-full px-2 flex items-center"
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

            <div className="mb-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs w-full flex justify-between items-center"
                onClick={() => setShowLabelSelector(!showLabelSelector)}
              >
                <div className="flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {selectedLabels.length > 0 ? `${selectedLabels.length} labels selected` : "Add labels"}
                </div>
                {showLabelSelector ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>

              {showLabelSelector && (
                <div className="mt-2 p-2 border rounded-md bg-background">
                  {labels.length === 0 ? (
                    <div className="text-xs text-muted-foreground">No labels available</div>
                  ) : (
                    <div className="space-y-2">
                      {labels.map((label) => {
                        const isSelected = isLabelSelected(label.id)
                        const intensity = getLabelIntensity(label.id)

                        return (
                          <div key={label.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`new-card-label-${label.id}`}
                                checked={isSelected}
                                onCheckedChange={() => toggleLabelSelection(label.id)}
                              />
                              <label
                                htmlFor={`new-card-label-${label.id}`}
                                className="flex items-center text-xs cursor-pointer"
                              >
                                <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: label.color }} />
                                {label.name}
                              </label>
                            </div>

                            {isSelected && (
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant={intensity === "full" ? "secondary" : "outline"}
                                  size="sm"
                                  className="h-5 px-1 text-[10px]"
                                  onClick={() => updateLabelIntensity(label.id, "full")}
                                >
                                  Full
                                </Button>
                                <Button
                                  variant={intensity === "half" ? "secondary" : "outline"}
                                  size="sm"
                                  className="h-5 px-1 text-[10px]"
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
              )}
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddCard}>
                Add Card
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingCard(false)
                  setNewCardTitle("")
                  setSelectedLabels([])
                  setShowLabelSelector(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={() => setIsAddingCard(true)}
          >
            Add Card
          </Button>
        )}
      </CardContent>
    </UICard>
  )
}
