"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, X, BarChart, FileText } from "lucide-react"
import { getContrastColor } from "@/lib/utils"
import MuscleProgress from "./muscle-progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { WorkoutCard as WorkoutCardType } from "../board/board"
import type { LabelGroup } from "../label-board/label-board-context"

type WorkoutBoardProps = {
  workoutCards: WorkoutCardType[]
  labelGroups: LabelGroup[]
  onRemoveCard: (cardId: string) => void
  onClearWorkout: () => void
}

export default function WorkoutBoard({ workoutCards, labelGroups, onRemoveCard, onClearWorkout }: WorkoutBoardProps) {
  // Sort workout cards by the time they were added
  const sortedWorkoutCards = workoutCards
    .slice()
    .sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime())

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
      {/* Weekly Progress - full width on mobile, 3/5 on desktop */}
      <div className="w-full md:w-3/5">
        <MuscleProgress labelGroups={labelGroups} workoutCards={workoutCards} />
      </div>

      {/* Workout cards - full width on mobile, 2/5 on desktop */}
      <div className="w-full md:w-2/5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-foreground">Current Workout</h2>
          <Button variant="outline" size="sm" onClick={onClearWorkout} className="text-destructive">
            <X className="h-4 w-4 mr-1" />
            Clear Workout
          </Button>
        </div>

        {workoutCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center bg-muted/20 rounded-md border border-dashed p-4">
            <BarChart className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Add exercises to your workout by clicking the + button on exercise cards.
            </p>
          </div>
        ) : (
          <div className="max-h-[50vh] md:max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              {sortedWorkoutCards.map((card) => (
                <WorkoutCard key={card.id} card={card} onRemove={() => onRemoveCard(card.id)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

type WorkoutCardProps = {
  card: WorkoutCardType
  onRemove: () => void
}

function WorkoutCard({ card, onRemove }: WorkoutCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const [isNotesOpen, setIsNotesOpen] = useState(false)

  const hasNotes = card.notes && card.notes.trim().length > 0

  return (
    <div
      className="bg-card border rounded-md p-2.5 shadow-sm relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => {
        // Add a small delay before hiding the button to allow for tap
        setTimeout(() => setIsTouched(false), 500)
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <h3 className="font-medium text-sm text-foreground">{card.title}</h3>

            {/* Notes indicator */}
            {hasNotes && (
              <Popover open={isNotesOpen} onOpenChange={setIsNotesOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 text-muted-foreground hover:text-primary">
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

          <div className="flex items-center gap-1">
            <div className="text-xs px-1.5 py-0.5 bg-muted rounded-full">{card.sets} sets</div>
            {card.weight && (
              <div className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                {card.weight}kg
              </div>
            )}
          </div>
        </div>
        {(isHovered || isTouched) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive -mr-1"
            onClick={onRemove}
            title="Remove from workout"
          >
            <Trash2 className="h-3 w-3" />
            <span className="sr-only">Remove from workout</span>
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mt-1.5">
        {card.labels.map((label :any) => (
          <div
            key={`${label.id}-${label.intensity}`}
            className="rounded-full px-1.5 py-0 flex items-center"
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
    </div>
  )
}
