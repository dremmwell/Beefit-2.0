"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Info } from "lucide-react"
import Column from "./column"
import type { Label } from "../label-board/label-types"
import type { LabelGroup } from "../label-board/label-board-context"
import AddToWorkoutDialog from "./add-to-workout-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import AddColumnCard from "./add-column-card"
import BulkExportDialog from "./bulk-export-dialog"
import DeleteColumnDialog from "./delete-column-dialog"

export type LabelIntensity = "full" | "half"

export type CardLabel = {
  id: string
  intensity: LabelIntensity
}

export type Card = {
  id: string
  title: string
  labels: CardLabel[]
  sets: number
  weight?: number
  notes?: string // Added notes field
  columnId: string
}

export type BoardColumn = {
  id: string
  title: string
  cards: Card[]
  backgroundColor?: string
}

export type WorkoutCard = {
  id: string
  cardId: string
  title: string
  sets: number
  weight?: number
  notes?: string // Added notes to workout cards
  labels: Array<{
    id: string
    name: string
    color: string
    intensity: LabelIntensity
    priorityValue: number
  }>
  addedAt: Date
}

type BoardProps = {
  labels: Label[]
  labelGroups: LabelGroup[]
  onAddToWorkout: (workoutCard: WorkoutCard) => void
  initialColumns?: BoardColumn[] | null
  onColumnsChange?: (columns: BoardColumn[]) => void
}

// Default columns if no initial columns are provided
const DEFAULT_COLUMNS: BoardColumn[] = [
  {
    id: "1",
    title: "Pecs",
    cards: [
      {
        id: "card-1",
        title: "Cable Fly",
        labels: [{ id: "label-1", intensity: "full" }],
        sets: 3,
        weight: 15,
        columnId: "1",
      },
      {
        id: "card-2",
        title: "Dumbbell Fly",
        labels: [{ id: "label-1", intensity: "full" }],
        sets: 3,
        weight: 12,
        columnId: "1",
      },
      {
        id: "card-3",
        title: "Bench Press",
        labels: [
          { id: "label-1", intensity: "full" },
          { id: "label-4", intensity: "half" },
        ],
        sets: 4,
        weight: 80,
        columnId: "1",
      },
      {
        id: "card-4",
        title: "Dumbbell Press",
        labels: [
          { id: "label-1", intensity: "full" },
          { id: "label-4", intensity: "half" },
        ],
        sets: 4,
        weight: 25,
        columnId: "1",
      },
      {
        id: "card-5",
        title: "Machine Press",
        labels: [
          { id: "label-1", intensity: "full" },
          { id: "label-4", intensity: "half" },
        ],
        sets: 3,
        weight: 60,
        columnId: "1",
      },
      {
        id: "card-6",
        title: "Declined Press",
        labels: [
          { id: "label-1", intensity: "full" },
          { id: "label-4", intensity: "half" },
        ],
        sets: 3,
        weight: 70,
        columnId: "1",
      },
      {
        id: "card-7",
        title: "Inclined Press",
        labels: [
          { id: "label-1", intensity: "full" },
          { id: "label-4", intensity: "half" },
          { id: "label-5", intensity: "half" },
        ],
        sets: 4,
        weight: 65,
        columnId: "1",
      },
    ],
  },
  {
    id: "2",
    title: "Legs",
    cards: [
      {
        id: "card-8",
        title: "Squats",
        labels: [{ id: "label-8", intensity: "full" }],
        sets: 4,
        weight: 100,
        columnId: "2",
      },
      {
        id: "card-9",
        title: "Leg Press",
        labels: [{ id: "label-8", intensity: "full" }],
        sets: 3,
        weight: 150,
        columnId: "2",
      },
      {
        id: "card-10",
        title: "Deadlift",
        labels: [
          { id: "label-9", intensity: "full" },
          { id: "label-10", intensity: "full" },
          { id: "label-11", intensity: "full" },
        ],
        sets: 4,
        weight: 120,
        columnId: "2",
      },
      {
        id: "card-11",
        title: "Hip Thrust",
        labels: [
          { id: "label-10", intensity: "full" },
          { id: "label-11", intensity: "half" },
          { id: "label-9", intensity: "half" },
        ],
        sets: 3,
        weight: 90,
        columnId: "2",
      },
      {
        id: "card-12",
        title: "Sumo Dumbbell Deadlift",
        labels: [
          { id: "label-9", intensity: "full" },
          { id: "label-11", intensity: "half" },
        ],
        sets: 3,
        weight: 35,
        columnId: "2",
      },
      {
        id: "card-13",
        title: "Leg Curl",
        labels: [{ id: "label-9", intensity: "full" }],
        sets: 3,
        weight: 45,
        columnId: "2",
      },
      {
        id: "card-14",
        title: "Leg Extension",
        labels: [{ id: "label-8", intensity: "full" }],
        sets: 3,
        weight: 50,
        columnId: "2",
      },
    ],
  },
  {
    id: "3",
    title: "Back",
    cards: [
      {
        id: "card-15",
        title: "Machine Pulldown",
        labels: [
          { id: "label-12", intensity: "full" },
          { id: "label-2", intensity: "full" },
        ],
        sets: 3,
        weight: 55,
        columnId: "3",
      },
      {
        id: "card-16",
        title: "Cable Pulldown",
        labels: [
          { id: "label-12", intensity: "full" },
          { id: "label-2", intensity: "full" },
        ],
        sets: 3,
        weight: 50,
        columnId: "3",
      },
      {
        id: "card-17",
        title: "Barbell Row",
        labels: [
          { id: "label-12", intensity: "full" },
          { id: "label-2", intensity: "full" },
        ],
        sets: 4,
        weight: 60,
        columnId: "3",
      },
      {
        id: "card-18",
        title: "Cable Sideway Pulldown",
        labels: [{ id: "label-12", intensity: "full" }],
        sets: 3,
        weight: 40,
        columnId: "3",
      },
      {
        id: "card-19",
        title: "Cable Row",
        labels: [{ id: "label-2", intensity: "full" }],
        sets: 3,
        weight: 45,
        columnId: "3",
      },
    ],
  },
  {
    id: "4",
    title: "Shoulders",
    cards: [
      {
        id: "card-20",
        title: "Upright Row",
        labels: [{ id: "label-6", intensity: "full" }],
        sets: 3,
        weight: 30,
        columnId: "4",
      },
      {
        id: "card-21",
        title: "Lateral Raises",
        labels: [{ id: "label-6", intensity: "full" }],
        sets: 3,
        weight: 8,
        columnId: "4",
      },
      {
        id: "card-22",
        title: "Cable Lateral Raises",
        labels: [{ id: "label-6", intensity: "full" }],
        sets: 3,
        weight: 10,
        columnId: "4",
      },
      {
        id: "card-23",
        title: "Shoulder Press",
        labels: [{ id: "label-5", intensity: "full" }],
        sets: 4,
        weight: 20,
        columnId: "4",
      },
      {
        id: "card-24",
        title: "Military Press",
        labels: [{ id: "label-5", intensity: "full" }],
        sets: 4,
        weight: 50,
        columnId: "4",
      },
    ],
  },
  {
    id: "5",
    title: "Biceps",
    cards: [
      {
        id: "card-25",
        title: "Preacher Curls",
        labels: [{ id: "label-7", intensity: "full" }],
        sets: 3,
        weight: 15,
        columnId: "5",
      },
      {
        id: "card-26",
        title: "EZ 7x3 Superset",
        labels: [{ id: "label-7", intensity: "full" }],
        sets: 3,
        weight: 20,
        columnId: "5",
      },
      {
        id: "card-27",
        title: "Hammer Curls",
        labels: [{ id: "label-7", intensity: "full" }],
        sets: 3,
        weight: 12,
        columnId: "5",
      },
    ],
  },
  {
    id: "6",
    title: "Triceps",
    cards: [
      {
        id: "card-28",
        title: "Cable Pushdown",
        labels: [{ id: "label-4", intensity: "full" }],
        sets: 3,
        weight: 25,
        columnId: "6",
      },
      {
        id: "card-29",
        title: "Cable Overhead Extensions",
        labels: [{ id: "label-4", intensity: "full" }],
        sets: 3,
        weight: 20,
        columnId: "6",
      },
    ],
  },
]

export default function Board({
  labels,
  labelGroups,
  onAddToWorkout,
  initialColumns = null,
  onColumnsChange,
}: BoardProps) {
  const [columns, setColumns] = useState<BoardColumn[]>(() => {
    // Ensure all existing cards have columnId set
    const columnsWithColumnIds = (initialColumns || DEFAULT_COLUMNS).map((column) => ({
      ...column,
      cards: column.cards.map((card) => ({
        ...card,
        columnId: card.columnId || column.id, // Set columnId if not present
        weight: card.weight || undefined, // Ensure weight is preserved
      })),
    }))
    return columnsWithColumnIds
  })

  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [isAddToWorkoutDialogOpen, setIsAddToWorkoutDialogOpen] = useState(false)
  const [showTip, setShowTip] = useState(true)
  const [bulkExportColumn, setBulkExportColumn] = useState<BoardColumn | null>(null)
  const [isBulkExportDialogOpen, setIsBulkExportDialogOpen] = useState(false)
  const [columnToDelete, setColumnToDelete] = useState<BoardColumn | null>(null)
  const [isDeleteColumnDialogOpen, setIsDeleteColumnDialogOpen] = useState(false)

  // Notify parent component when columns change
  useEffect(() => {
    if (onColumnsChange) {
      onColumnsChange(columns)
    }
  }, [columns, onColumnsChange])

  // Hide tip after 10 seconds
  useEffect(() => {
    if (showTip) {
      const timer = setTimeout(() => {
        setShowTip(false)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [showTip])

  const handleAddColumn = (position?: number) => {
    if (newColumnTitle.trim()) {
      const newColumn: BoardColumn = {
        id: crypto.randomUUID(),
        title: newColumnTitle.trim(),
        cards: [],
      }

      if (position !== undefined && position >= 0 && position <= columns.length) {
        // Insert at specific position
        const newColumns = [...columns]
        newColumns.splice(position, 0, newColumn)
        setColumns(newColumns)
      } else {
        // Add at the end (default behavior)
        setColumns([...columns, newColumn])
      }

      setNewColumnTitle("")
      setIsAddingColumn(false)
    }
  }

  const handleUpdateColumnPosition = (columnId: string, newPosition: number) => {
    const currentIndex = columns.findIndex((col) => col.id === columnId)
    if (currentIndex === -1 || newPosition < 0 || newPosition >= columns.length) return

    const newColumns = [...columns]
    const [movedColumn] = newColumns.splice(currentIndex, 1)
    newColumns.splice(newPosition, 0, movedColumn)
    setColumns(newColumns)
  }

  // Card drag and drop handler with proper columnId tracking
  const handleCardDrop = (sourceColumnId: string, targetColumnId: string, cardId: string, targetIndex?: number) => {
    setColumns((prevColumns) => {
      let cardToMove: Card | null = null

      // First pass: find and remove the card from source column
      const columnsAfterRemoval = prevColumns.map((column) => {
        if (column.id === sourceColumnId) {
          cardToMove = column.cards.find((card) => card.id === cardId) || null
          return {
            ...column,
            cards: column.cards.filter((card) => card.id !== cardId),
          }
        }
        return column
      })

      if (!cardToMove) return prevColumns

      // Update the card's columnId
      const updatedCard = {
        ...cardToMove,
        columnId: targetColumnId,
      }

      // Second pass: add the card to target column
      return columnsAfterRemoval.map((column) => {
        if (column.id === targetColumnId) {
          const cards = [...column.cards]
          const insertIndex = targetIndex !== undefined ? Math.min(targetIndex, cards.length) : cards.length
          cards.splice(insertIndex, 0, updatedCard)
          return {
            ...column,
            cards,
          }
        }
        return column
      })
    })
  }

  const handleAddCard = (columnId: string, cardTitle: string, cardLabels: CardLabel[] = []) => {
    if (cardTitle.trim()) {
      const newCard: Card = {
        id: crypto.randomUUID(),
        title: cardTitle.trim(),
        labels: cardLabels,
        sets: 3, // Default to 3 sets for new cards
        weight: undefined, // No default weight
        columnId: columnId, // Set the columnId when creating the card
      }

      setColumns(
        columns.map((column) => {
          if (column.id === columnId) {
            return {
              ...column,
              cards: [...column.cards, newCard],
            }
          }
          return column
        }),
      )
    }
  }

  const handleDeleteColumnClick = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId)
    if (column) {
      // If column is empty, delete immediately without confirmation
      if (column.cards.length === 0) {
        setColumns(columns.filter((col) => col.id !== columnId))
      } else {
        // If column has cards, show confirmation dialog
        setColumnToDelete(column)
        setIsDeleteColumnDialogOpen(true)
      }
    }
  }

  const handleDeleteColumnConfirm = () => {
    if (columnToDelete) {
      setColumns(columns.filter((column) => column.id !== columnToDelete.id))
      setColumnToDelete(null)
    }
  }

  const handleDeleteCard = (columnId: string, cardId: string) => {
    setColumns(
      columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            cards: column.cards.filter((card) => card.id !== cardId),
          }
        }
        return column
      }),
    )
  }

  const handleToggleCardLabel = (columnId: string, cardId: string, labelId: string, intensity: LabelIntensity) => {
    setColumns(
      columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            cards: column.cards.map((card) => {
              if (card.id === cardId) {
                const existingLabelIndex = card.labels.findIndex((label) => label.id === labelId)

                if (existingLabelIndex >= 0) {
                  // If label exists with same intensity, remove it
                  if (card.labels[existingLabelIndex].intensity === intensity) {
                    return {
                      ...card,
                      labels: card.labels.filter((label) => label.id !== labelId),
                    }
                  }
                  // If label exists with different intensity, update it
                  else {
                    const updatedLabels = [...card.labels]
                    updatedLabels[existingLabelIndex] = { id: labelId, intensity }
                    return {
                      ...card,
                      labels: updatedLabels,
                    }
                  }
                }
                // If label doesn't exist, add it
                else {
                  return {
                    ...card,
                    labels: [...card.labels, { id: labelId, intensity }],
                  }
                }
              }
              return card
            }),
          }
        }
        return column
      }),
    )
  }

  const handleUpdateCard = (columnId: string, cardId: string, updatedCard: Partial<Card>) => {
    setColumns(
      columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            cards: column.cards.map((card) => {
              if (card.id === cardId) {
                return {
                  ...card,
                  ...updatedCard,
                  // Ensure columnId is preserved unless explicitly updated
                  columnId: updatedCard.columnId || card.columnId,
                }
              }
              return card
            }),
          }
        }
        return column
      }),
    )
  }

  const handleUpdateColumn = (columnId: string, updates: Partial<BoardColumn>) => {
    setColumns(
      columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            ...updates,
          }
        }
        return column
      }),
    )
  }

  const handleAddToWorkoutClick = (card: Card) => {
    setSelectedCard(card)
    setIsAddToWorkoutDialogOpen(true)
  }

  const handleAddToWorkout = (sets: number) => {
    if (!selectedCard) return

    // Create a workout card with all the necessary data
    const workoutCard: WorkoutCard = {
      id: crypto.randomUUID(), // This will be overridden in the parent component
      cardId: selectedCard.id,
      title: selectedCard.title,
      sets: sets,
      weight: selectedCard.weight, // Include weight in workout card
      notes: selectedCard.notes, // Include notes in workout card
      labels: selectedCard.labels.map((cardLabel) => {
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
    }

    onAddToWorkout(workoutCard)
    setSelectedCard(null)
    setIsAddToWorkoutDialogOpen(false)
  }

  const handleBulkExport = (column: BoardColumn) => {
    setBulkExportColumn(column)
    setIsBulkExportDialogOpen(true)
  }

  const handleBulkExportConfirm = (workoutCards: WorkoutCard[]) => {
    // Add all cards to workout
    workoutCards.forEach((workoutCard) => {
      onAddToWorkout({
        ...workoutCard,
        id: crypto.randomUUID(), // Generate unique ID for each workout card
      })
    })
    setIsBulkExportDialogOpen(false)
    setBulkExportColumn(null)
  }

  return (
    <div className="flex-1 overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
      <div className="flex flex-nowrap gap-4 pb-4">
        {columns.map((column, index) => (
          <Column
            key={column.id}
            column={column}
            labels={labels}
            columnIndex={index}
            totalColumns={columns.length}
            onAddCard={(cardTitle, cardLabels) => handleAddCard(column.id, cardTitle, cardLabels)}
            onDeleteColumn={() => handleDeleteColumnClick(column.id)}
            onDeleteCard={(cardId) => handleDeleteCard(column.id, cardId)}
            onToggleCardLabel={(cardId, labelId, intensity) =>
              handleToggleCardLabel(column.id, cardId, labelId, intensity)
            }
            onUpdateCard={(cardId, updatedCard) => handleUpdateCard(column.id, cardId, updatedCard)}
            onUpdateColumn={(updates) => handleUpdateColumn(column.id, updates)}
            onUpdateColumnPosition={(newPosition) => handleUpdateColumnPosition(column.id, newPosition)}
            onAddToWorkout={handleAddToWorkoutClick}
            onCardDrop={handleCardDrop}
            onBulkExport={() => handleBulkExport(column)}
          />
        ))}

        {isAddingColumn ? (
          <AddColumnCard
            newColumnTitle={newColumnTitle}
            setNewColumnTitle={setNewColumnTitle}
            totalColumns={columns.length}
            onAddColumn={handleAddColumn}
            onCancel={() => {
              setIsAddingColumn(false)
              setNewColumnTitle("")
            }}
          />
        ) : (
          <Button
            variant="outline"
            className="h-fit p-3 border-dashed w-72 justify-start text-muted-foreground shrink-0"
            onClick={() => setIsAddingColumn(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Column
          </Button>
        )}
      </div>

      {selectedCard && (
        <AddToWorkoutDialog
          open={isAddToWorkoutDialogOpen}
          onOpenChange={setIsAddToWorkoutDialogOpen}
          exerciseTitle={selectedCard.title}
          onConfirm={handleAddToWorkout}
        />
      )}

      {bulkExportColumn && (
        <BulkExportDialog
          open={isBulkExportDialogOpen}
          onOpenChange={setIsBulkExportDialogOpen}
          column={bulkExportColumn}
          labels={labels}
          labelGroups={labelGroups}
          onConfirm={handleBulkExportConfirm}
        />
      )}

      {columnToDelete && (
        <DeleteColumnDialog
          open={isDeleteColumnDialogOpen}
          onOpenChange={setIsDeleteColumnDialogOpen}
          onConfirm={handleDeleteColumnConfirm}
          column={columnToDelete}
          labels={labels}
        />
      )}

      {showTip && (
        <Alert className="mb-4 bg-muted/50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <span className="font-medium">Tip:</span> Drag exercise cards to reorder them within columns or move them
            between columns. Double-click to add to workout.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
