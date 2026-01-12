"use client"

import React, { useState } from 'react'
import { DndContext, DragEndEvent, useSensors, useSensor, PointerSensor, TouchSensor, useDroppable } from '@dnd-kit/core'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { SortableCard } from './components/SortableCard'

export interface Card {
  id: string
  title: string
  description?: string
}

export interface Column {
  id: string
  title: string
  priorityValue: number
  cards: Card[]
}

const initialColumns: Column[] = [
  {
    id: 'high-priority',
    title: 'High Priority',
    priorityValue: 10,
    cards: [
      { id: 'card-1', title: 'Bench Press', description: '3 sets of 10 reps' },
      { id: 'card-2', title: 'Squats', description: '4 sets of 8 reps' }
    ]
  },
  {
    id: 'medium-priority',
    title: 'Medium Priority',
    priorityValue: 7,
    cards: [
      { id: 'card-3', title: 'Deadlift', description: '3 sets of 5 reps' }
    ]
  },
  {
    id: 'low-priority',
    title: 'Low Priority',
    priorityValue: 4,
    cards: [
      { id: 'card-4', title: 'Pull-ups', description: '3 sets of max reps' }
    ]
  },
  {
    id: 'completed',
    title: 'Completed',
    priorityValue: 0,
    cards: []
  }
]

function PriorityBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  )

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find source column and card
    let sourceColumnIndex = -1
    let cardIndex = -1
    for (let i = 0; i < columns.length; i++) {
      cardIndex = columns[i].cards.findIndex(c => c.id === activeId)
      if (cardIndex !== -1) {
        sourceColumnIndex = i
        break
      }
    }
    if (sourceColumnIndex === -1) return

    // Check if dropping on another column
    const targetColumnIndex = columns.findIndex(c => c.id === overId)
    if (targetColumnIndex !== -1 && targetColumnIndex !== sourceColumnIndex) {
      const newColumns = [...columns]
      const [card] = newColumns[sourceColumnIndex].cards.splice(cardIndex, 1)
      newColumns[targetColumnIndex].cards.push(card)
      setColumns(newColumns)
    }
  }

  const addCard = (columnId: string, title: string) => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title,
      description: ''
    }
    setColumns(columns.map(col =>
      col.id === columnId
        ? { ...col, cards: [...col.cards, newCard] }
        : col
    ))
  }

  const removeCard = (columnId: string, cardId: string) => {
    setColumns(columns.map(col =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter(card => card.id !== cardId) }
        : col
    ))
  }

  const getPriorityColor = (value: number) => {
    if (value >= 8) return 'bg-red-500'
    if (value >= 5) return 'bg-yellow-500'
    if (value >= 1) return 'bg-blue-500'
    return 'bg-gray-500'
  }

  const getPriorityTextColor = (value: number) => {
    if (value >= 8) return 'text-red-700'
    if (value >= 5) return 'text-yellow-700'
    if (value >= 1) return 'text-blue-700'
    return 'text-gray-700'
  }

  const DroppableColumn = ({ column }: { column: Column }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: column.id,
    })

    return (
      <Card
        ref={setNodeRef}
        className={`w-72 sm:w-80 flex-shrink-0 ${isOver ? 'ring-2 ring-primary bg-muted/50' : ''}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{column.title}</CardTitle>
            <Badge
              className={`${getPriorityColor(column.priorityValue)} text-white font-bold px-2 py-1`}
            >
              {column.priorityValue}
            </Badge>
          </div>
          <p className={`text-sm ${getPriorityTextColor(column.priorityValue)}`}>
            Priority Value: {column.priorityValue}
          </p>
        </CardHeader>
        <CardContent className="space-y-3 min-h-[400px]">
          {column.cards.map(card => (
            <SortableCard
              key={card.id}
              card={card}
              onRemove={() => removeCard(column.id, card.id)}
            />
          ))}

          <Button
            onClick={() => addCard(column.id, `New ${column.title} Task`)}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground h-10 touch-manipulation border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add a card
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Priority Kanban Board</h2>
        <p className="text-muted-foreground">Organize your workout priorities by dragging cards between columns</p>
      </div>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 min-h-[600px] px-1">
          {columns.map(column => (
            <DroppableColumn key={column.id} column={column} />
          ))}
        </div>
      </DndContext>
    </div>
  )
}

export default PriorityBoard
