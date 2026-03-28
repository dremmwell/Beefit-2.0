"use client"

import { useState, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil, X, ChevronDown, ChevronUp, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import Card from "./card"
import type { BoardColumn, Card as CardType, CardLabel, LabelIntensity } from "./board"
import { getContrastColor } from "@/lib/utils"

// Predefined column background colors
const COLUMN_COLORS = [
  { value: "#f3f4f6", name: "Light Gray" },
  { value: "#fee2e2", name: "Light Red" },
  { value: "#fef3c7", name: "Light Yellow" },
  { value: "#d1fae5", name: "Light Green" },
  { value: "#dbeafe", name: "Light Blue" },
  { value: "#e0e7ff", name: "Light Indigo" },
  { value: "#ede9fe", name: "Light Purple" },
  { value: "#fce7f3", name: "Light Pink" },
]

type ColumnProps = {
  column: BoardColumn
  labels: any
  onAddCard: (cardTitle: string, cardLabels: CardLabel[]) => void
  onDeleteColumn: () => void
  onDeleteCard: (cardId: string) => void
  onToggleCardLabel: (cardId: string, labelId: string, intensity: LabelIntensity) => void
  onUpdateCard: (cardId: string, updatedCard: Partial<CardType>) => void
  onUpdateColumn: (updates: Partial<BoardColumn>) => void
}

type LabelSelection = {
  id: string
  intensity: LabelIntensity
}

export default function Column({
  column,
  labels,
  onAddCard,
  onDeleteColumn,
  onDeleteCard,
  onToggleCardLabel,
  onUpdateCard,
  onUpdateColumn,
}: ColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState("")
  const [selectedLabels, setSelectedLabels] = useState<LabelSelection[]>([])
  const [showLabelSelector, setShowLabelSelector] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(column.title)
  const [selectedColor, setSelectedColor] = useState(column.backgroundColor || "#f3f4f6")

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
        backgroundColor: selectedColor,
      })
    }
    setIsEditingTitle(false)
  }

  const cancelEditing = () => {
    setEditedTitle(column.title)
    setSelectedColor(column.backgroundColor || "#f3f4f6")
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

  return (
    <div
      className="rounded-lg p-3 w-72 shrink-0 flex flex-col h-fit group"
      style={{ backgroundColor: column.backgroundColor || "#f3f4f6" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditingTitle ? (
        <div className="mb-3 bg-white dark:bg-gray-950 p-3 rounded-md shadow-sm">
          <div className="flex items-center justify-between mb-2">
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
              <Label className="text-xs">Background Color</Label>
              <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-1 mt-1">
                {COLUMN_COLORS.map((color) => (
                  <div key={color.value} className="flex items-center">
                    <RadioGroupItem value={color.value} id={`color-${color.value}`} className="sr-only" />
                    <Label
                      htmlFor={`color-${color.value}`}
                      className={`h-6 w-6 rounded-full cursor-pointer flex items-center justify-center border-2 ${
                        selectedColor === color.value ? "border-black dark:border-white" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      <span className="sr-only">{color.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button size="sm" onClick={handleSaveTitle} className="w-full mt-2">
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-3 px-1 flex justify-between items-center">
          <span className="font-medium">{column.title}</span>

          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              onClick={() => {
                setEditedTitle(column.title)
                setSelectedColor(column.backgroundColor || "#f3f4f6")
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
        </div>
      )}

      <div className="space-y-2 mb-3 overflow-y-auto max-h-[500px]">
        {column.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            labels={labels}
            onDeleteCard={() => onDeleteCard(card.id)}
          />
        ))}
      </div>

      {isAddingCard ? (
        <div className="mt-2 bg-white dark:bg-gray-950 p-3 rounded-md shadow-sm">
          <Input
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter card title..."
            className="mb-2"
            autoFocus
          />
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
                    {labels.map((label : any) => {
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
    </div>
  )
}
