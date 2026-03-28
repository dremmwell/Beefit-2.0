"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Label } from "./label-management"
import  Column  from "./column"

export type LabelIntensity = "full" | "half"

export type CardLabel = {
  id: string
  intensity: LabelIntensity
}

export type Card = {
  id: string
  title: string
  labels: CardLabel[]
}

export type BoardColumn = {
  id: string
  title: string
  cards: Card[]
  backgroundColor?: string
}

type BoardProps = {
  labels: Label[]
}

export default function Board({ labels }: BoardProps) {
  const [columns, setColumns] = useState<BoardColumn[]>([
    {
      id: "1",
      title: "Pecs",
      cards: [
        {
          id: "card-1",
          title: "Cable Fly",
          labels: [{ id: "label-1", intensity: "full" }],
        },
        {
          id: "card-2",
          title: "Dumbbell Fly",
          labels: [{ id: "label-1", intensity: "full" }],
        },
        {
          id: "card-3",
          title: "Bench Press",
          labels: [
            { id: "label-1", intensity: "full" },
            { id: "label-4", intensity: "half" },
          ],
        },
        {
          id: "card-4",
          title: "Dumbbell Press",
          labels: [
            { id: "label-1", intensity: "full" },
            { id: "label-4", intensity: "half" },
          ],
        },
        {
          id: "card-5",
          title: "Machine Press",
          labels: [
            { id: "label-1", intensity: "full" },
            { id: "label-4", intensity: "half" },
          ],
        },
        {
          id: "card-6",
          title: "Declined Press",
          labels: [
            { id: "label-1", intensity: "full" },
            { id: "label-4", intensity: "half" },
          ],
        },
        {
          id: "card-7",
          title: "Inclined Press",
          labels: [
            { id: "label-1", intensity: "full" },
            { id: "label-4", intensity: "half" },
            { id: "label-5", intensity: "half" },
          ],
        },
      ],
      backgroundColor: "#fee2e2", // Light red
    },
    {
      id: "2",
      title: "Legs",
      cards: [
        {
          id: "card-8",
          title: "Squats",
          labels: [{ id: "label-8", intensity: "full" }],
        },
        {
          id: "card-9",
          title: "Leg Press",
          labels: [{ id: "label-8", intensity: "full" }],
        },
        {
          id: "card-10",
          title: "Deadlift",
          labels: [
            { id: "label-9", intensity: "full" },
            { id: "label-10", intensity: "full" },
            { id: "label-11", intensity: "full" },
          ],
        },
        {
          id: "card-11",
          title: "Hip Thrust",
          labels: [
            { id: "label-10", intensity: "full" },
            { id: "label-11", intensity: "half" },
            { id: "label-9", intensity: "half" },
          ],
        },
        {
          id: "card-12",
          title: "Sumo Dumbbell Deadlift",
          labels: [
            { id: "label-9", intensity: "full" },
            { id: "label-11", intensity: "half" },
          ],
        },
        {
          id: "card-13",
          title: "Leg Curl",
          labels: [{ id: "label-9", intensity: "full" }],
        },
        {
          id: "card-14",
          title: "Leg Extension",
          labels: [{ id: "label-8", intensity: "full" }],
        },
      ],
      backgroundColor: "#d1fae5", // Light green
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
        },
        {
          id: "card-16",
          title: "Cable Pulldown",
          labels: [
            { id: "label-12", intensity: "full" },
            { id: "label-2", intensity: "full" },
          ],
        },
        {
          id: "card-17",
          title: "Barbell Row",
          labels: [
            { id: "label-12", intensity: "full" },
            { id: "label-2", intensity: "full" },
          ],
        },
        {
          id: "card-18",
          title: "Cable Sideway Pulldown",
          labels: [{ id: "label-12", intensity: "full" }],
        },
        {
          id: "card-19",
          title: "Cable Row",
          labels: [{ id: "label-2", intensity: "full" }],
        },
      ],
      backgroundColor: "#fef3c7", // Light yellow
    },
    {
      id: "4",
      title: "Shoulders",
      cards: [
        {
          id: "card-20",
          title: "Upright Row",
          labels: [{ id: "label-6", intensity: "full" }],
        },
        {
          id: "card-21",
          title: "Lateral Raises",
          labels: [{ id: "label-6", intensity: "full" }],
        },
        {
          id: "card-22",
          title: "Cable Lateral Raises",
          labels: [{ id: "label-6", intensity: "full" }],
        },
        {
          id: "card-23",
          title: "Shoulder Press",
          labels: [{ id: "label-5", intensity: "full" }],
        },
        {
          id: "card-24",
          title: "Military Press",
          labels: [{ id: "label-5", intensity: "full" }],
        },
      ],
      backgroundColor: "#dbeafe", // Light blue
    },
    {
      id: "5",
      title: "Biceps",
      cards: [
        {
          id: "card-25",
          title: "Preacher Curls",
          labels: [{ id: "label-7", intensity: "full" }],
        },
        {
          id: "card-26",
          title: "EZ 7x3 Superset",
          labels: [{ id: "label-7", intensity: "full" }],
        },
        {
          id: "card-27",
          title: "Hammer Curls",
          labels: [{ id: "label-7", intensity: "full" }],
        },
      ],
      backgroundColor: "#e0e7ff", // Light indigo
    },
    {
      id: "6",
      title: "Triceps",
      cards: [
        {
          id: "card-28",
          title: "Cable Pushdown",
          labels: [{ id: "label-4", intensity: "full" }],
        },
        {
          id: "card-29",
          title: "Cable Overhead Extensions",
          labels: [{ id: "label-4", intensity: "full" }],
        },
      ],
      backgroundColor: "#ede9fe", // Light purple
    },
  ])

  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [isAddingColumn, setIsAddingColumn] = useState(false)

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: BoardColumn = {
        id: crypto.randomUUID(),
        title: newColumnTitle.trim(),
        cards: [],
        backgroundColor: "#f3f4f6", // Default light gray
      }
      setColumns([...columns, newColumn])
      setNewColumnTitle("")
      setIsAddingColumn(false)
    }
  }

  const handleAddCard = (columnId: string, cardTitle: string, cardLabels: CardLabel[] = []) => {
    if (cardTitle.trim()) {
      const newCard: Card = {
        id: crypto.randomUUID(),
        title: cardTitle.trim(),
        labels: cardLabels,
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

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter((column) => column.id !== columnId))
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

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="flex gap-4 p-4">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            labels={labels}
            onAddCard={(cardTitle, cardLabels) => handleAddCard(column.id, cardTitle, cardLabels)}
            onDeleteColumn={() => handleDeleteColumn(column.id)}
            onDeleteCard={(cardId) => handleDeleteCard(column.id, cardId)}
            onToggleCardLabel={(cardId, labelId, intensity) =>
              handleToggleCardLabel(column.id, cardId, labelId, intensity)
            }
            onUpdateCard={(cardId, updatedCard) => handleUpdateCard(column.id, cardId, updatedCard)}
            onUpdateColumn={(updates) => handleUpdateColumn(column.id, updates)}
          />
        ))}

        {isAddingColumn ? (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 w-72 h-fit shrink-0">
            <Input
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              placeholder="Enter column title..."
              className="mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddColumn}>
                Add Column
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingColumn(false)
                  setNewColumnTitle("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="h-fit p-3 border-dashed w-72 justify-start text-muted-foreground"
            onClick={() => setIsAddingColumn(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Column
          </Button>
        )}
      </div>
    </div>
  )
}
