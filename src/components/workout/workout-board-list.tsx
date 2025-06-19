"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, X, BarChart } from "lucide-react"
import { getContrastColor } from "@/lib/utils"
import type { WorkoutCard as WorkoutCardType } from "../board/board"

type WorkoutBoardProps = {
  workoutCards: WorkoutCardType[]
  onRemoveCard: (cardId: string) => void
  onClearWorkout: () => void
}

export default function WorkoutBoard({ workoutCards, onRemoveCard, onClearWorkout }: WorkoutBoardProps) {
  if (workoutCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No exercises added yet</h3>
        <p className="text-muted-foreground max-w-md">
          Add exercises to your workout by clicking the + button on exercise cards in the Exercises tab.
        </p>
      </div>
    )
  }

  // Sort workout cards by the time they were added
  const sortedWorkoutCards = workoutCards
    .slice()
    .sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime())

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Current Workout</h2>
        <Button variant="outline" size="sm" onClick={onClearWorkout} className="text-destructive">
          <X className="h-4 w-4 mr-1" />
          Clear Workout
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="max-h-[70vh] overflow-y-auto">
          <ul className="divide-y">
            {sortedWorkoutCards.map((card) => (
              <WorkoutListItem key={card.id} card={card} onRemove={() => onRemoveCard(card.id)} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

type WorkoutListItemProps = {
  card: WorkoutCardType
  onRemove: () => void
}

function WorkoutListItem({ card, onRemove }: WorkoutListItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <li
      className="p-3 hover:bg-muted/20 transition-colors flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1">
        <div className="flex items-center">
          <div className="font-medium">{card.title}</div>
          <div className="ml-3 px-2 py-0.5 bg-muted rounded-full text-xs font-medium">{card.sets} sets</div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {card.labels.map((label : any) => (
            <div
              key={`${label.id}-${label.intensity}`}
              className="rounded-full px-2 py-0.5 flex items-center"
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
      </div>
      {isHovered && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive ml-2"
          onClick={onRemove}
          title="Remove from workout"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove from workout</span>
        </Button>
      )}
    </li>
  )
}
