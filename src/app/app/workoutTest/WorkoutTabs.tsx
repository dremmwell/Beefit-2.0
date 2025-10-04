"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pencil, Check, Dumbbell, Tag, BarChart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LabelBoard from "@/components/label-board/label-board"
import Board, { type WorkoutCard, type BoardColumn } from "@/components/board/board"
import WorkoutBoard from "@/components/workout/workout-board"
import { ThemeProvider } from "@/components/theme-provider"
import type { Label } from "@/components/label-board/label-types"
import type { LabelGroup } from "@/components/label-board/label-board-context"

// Storage keys for localStorage
const STORAGE_KEYS = {
  ACTIVE_TAB: "gym-planner-active-tab",
  LABELS: "gym-planner-labels",
  LABEL_GROUPS: "gym-planner-label-groups",
  WORKOUT_CARDS: "gym-planner-workout-cards",
  BOARD_COLUMNS: "gym-planner-board-columns",
}

function HomeContent() {

  // Load active tab from localStorage or use default
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) || "muscles"
    }
    return "muscles"
  })

  // State to hold labels that will be shared between components
  const [labels, setLabels] = useState<Label[]>(() => {
    if (typeof window !== "undefined") {
      const savedLabels = localStorage.getItem(STORAGE_KEYS.LABELS)
      return savedLabels ? JSON.parse(savedLabels) : []
    }
    return []
  })

  // State to hold label groups for priority values
  const [labelGroups, setLabelGroups] = useState<LabelGroup[]>(() => {
    if (typeof window !== "undefined") {
      const savedGroups = localStorage.getItem(STORAGE_KEYS.LABEL_GROUPS)
      return savedGroups ? JSON.parse(savedGroups) : []
    }
    return []
  })

  // State to hold workout cards
  const [workoutCards, setWorkoutCards] = useState<WorkoutCard[]>(() => {
    if (typeof window !== "undefined") {
      const savedWorkoutCards = localStorage.getItem(STORAGE_KEYS.WORKOUT_CARDS)
      if (savedWorkoutCards) {
        try {
          const parsed = JSON.parse(savedWorkoutCards)
          // Convert string dates back to Date objects
          return parsed.map((card: any) => ({
            ...card,
            addedAt: new Date(card.addedAt),
            // Ensure sets property exists (for backward compatibility)
            sets: card.sets || 3,
          }))
        } catch (e) {
          console.error("Error parsing workout cards:", e)
          return []
        }
      }
      return []
    }
    return []
  })

  // State to hold board columns
  const [boardColumns, setBoardColumns] = useState<BoardColumn[]>(() => {
    if (typeof window !== "undefined") {
      const savedColumns = localStorage.getItem(STORAGE_KEYS.BOARD_COLUMNS)
      return savedColumns ? JSON.parse(savedColumns) : null
    }
    return null
  })

  // Save active tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab)
  }, [activeTab])

  // Save labels to localStorage when they change
  useEffect(() => {
    if (labels.length > 0) {
      localStorage.setItem(STORAGE_KEYS.LABELS, JSON.stringify(labels))
    }
  }, [labels])

  // Save label groups to localStorage when they change
  useEffect(() => {
    if (labelGroups.length > 0) {
      localStorage.setItem(STORAGE_KEYS.LABEL_GROUPS, JSON.stringify(labelGroups))
    }
  }, [labelGroups])

  // Save workout cards to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_CARDS, JSON.stringify(workoutCards))
  }, [workoutCards])

  // Save board columns to localStorage when they change
  useEffect(() => {
    if (boardColumns) {
      localStorage.setItem(STORAGE_KEYS.BOARD_COLUMNS, JSON.stringify(boardColumns))
    }
  }, [boardColumns])


  // This callback will be called when the labels in the LabelBoard change
  const handleLabelsChange = useCallback((allLabels: Label[]) => {
    // Update the labels state with the complete list from LabelBoard
    // But only if they've actually changed to prevent infinite loops
    setLabels((prevLabels) => {
      // Skip update if the arrays are identical
      if (prevLabels.length === allLabels.length && JSON.stringify(prevLabels) === JSON.stringify(allLabels)) {
        return prevLabels
      }
      return allLabels
    })
  }, [])

  // This callback will be called when the groups in the LabelBoard change
  const handleGroupsChange = useCallback((groups: LabelGroup[]) => {
    setLabelGroups(groups)

    // Update workout cards with new priority values
    setWorkoutCards((prevCards) =>
      prevCards.map((card) => ({
        ...card,
        labels: card.labels.map((label : any) => {
          const labelGroup = groups.find((g) => g.labels.some((l : any ) => l.id === label.id))

          return {
            ...label,
            priorityValue: labelGroup?.value || 0,
          }
        }),
      })),
    )
  }, [])

  // Handle adding a card to the workout
  const handleAddToWorkout = useCallback((workoutCard: WorkoutCard) => {
    // Always add a new card with a unique ID
    setWorkoutCards((prev) => [
      ...prev,
      {
        ...workoutCard,
        id: crypto.randomUUID(), // Ensure each card has a unique ID
      },
    ])

    // Switch to workout tab
    setActiveTab("workout")
  }, [])

  // Handle removing a card from the workout
  const handleRemoveFromWorkout = useCallback((cardId: string) => {
    setWorkoutCards((prev) => prev.filter((c) => c.id !== cardId))
  }, [])

  // Handle clearing the entire workout
  const handleClearWorkout = useCallback(() => {
    setWorkoutCards([])
  }, [])

  // Handle board columns updates
  const handleBoardColumnsChange = useCallback((columns: BoardColumn[]) => {
    setBoardColumns(columns)
  }, [])

  return (
      <div className="max-h-fit mt-4">
        <Tabs defaultValue="workout" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 sm:mb-6 w-full sm:w-auto bg-muted">
            <TabsTrigger value="muscles" className="flex items-center flex-1 sm:flex-auto">
              <Tag className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Muscles</span>
              <span className="sm:hidden">Muscles</span>
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex items-center flex-1 sm:flex-auto">
              <Dumbbell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Exercises</span>
              <span className="sm:hidden">Exercises</span>
            </TabsTrigger>
            <TabsTrigger value="workout" className="flex items-center flex-1 sm:flex-auto">
              <BarChart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Workout</span>
              <span className="sm:hidden">Workout</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exercises" className="mt-0">
            <Board
              labels={labels}
              labelGroups={labelGroups}
              onAddToWorkout={handleAddToWorkout}
              initialColumns={boardColumns}
              onColumnsChange={handleBoardColumnsChange}
            />
          </TabsContent>

          <TabsContent value="muscles" className="mt-0">
            <LabelBoard
              onLabelsChange={handleLabelsChange}
              onGroupsChange={handleGroupsChange}
              initialLabels={labels.length > 0 ? labels : undefined}
              initialGroups={labelGroups.length > 0 ? labelGroups : undefined}
            />
          </TabsContent>

          <TabsContent value="workout" className="mt-0">
            <WorkoutBoard
              workoutCards={workoutCards}
              labelGroups={labelGroups}
              onRemoveCard={handleRemoveFromWorkout}
              onClearWorkout={handleClearWorkout}
            />
          </TabsContent>
        </Tabs>
      </div>
  )
}

export default function Home() {
  return (
      <HomeContent />
  )
}
