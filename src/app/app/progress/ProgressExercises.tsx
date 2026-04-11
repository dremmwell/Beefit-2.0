"use client"

import React, { useEffect, useState } from 'react'
import { SplitWorkoutData } from '@/app/types/definitions'
import { Split } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, MessageSquareText, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { deleteSplitWorkoutExercise, updateSplitWorkoutExercise } from '@/app/actions/db.actions/workout.actions'
import Link from "next/link"
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const getNormalizedHexColor = (value: string) => {
  const trimmedValue = value.trim().replace('#', '')

  if (/^[0-9a-fA-F]{3}$/.test(trimmedValue)) {
    return trimmedValue
      .split('')
      .map((character) => `${character}${character}`)
      .join('')
  }

  if (/^[0-9a-fA-F]{6}$/.test(trimmedValue)) {
    return trimmedValue
  }

  return null
}

const getReadableBadgeTextColor = (backgroundColor: string) => {
  const normalizedHexColor = getNormalizedHexColor(backgroundColor)

  if (!normalizedHexColor) {
    return '#ffffff'
  }

  const red = Number.parseInt(normalizedHexColor.slice(0, 2), 16)
  const green = Number.parseInt(normalizedHexColor.slice(2, 4), 16)
  const blue = Number.parseInt(normalizedHexColor.slice(4, 6), 16)
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255

  return luminance > 0.62 ? '#111827' : '#ffffff'
}

const getLocalDayKey = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

function ProgressExercises({ workouts, split, userId }: { workouts: SplitWorkoutData[]; split: Split; userId: string }) {
  const [workoutEntries, setWorkoutEntries] = useState<SplitWorkoutData[]>(workouts)
  const [activeEntry, setActiveEntry] = useState<SplitWorkoutData | null>(null)
  const [sets, setSets] = useState(4)
  const [reps, setReps] = useState(8)
  const [weight, setWeight] = useState(20)
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const normalizedStartDate = new Date(split.startDate)
  normalizedStartDate.setHours(0, 0, 0, 0)

  const splitDays = Array.from({ length: split.length }, (_, index) => {
    const dayDate = new Date(normalizedStartDate)
    dayDate.setDate(normalizedStartDate.getDate() + index)
    return dayDate
  })

  const workoutsByDay = workoutEntries.reduce<Map<string, SplitWorkoutData[]>>((accumulator, workout) => {
    const workoutDate = new Date(workout.createdAt)
    const dayKey = getLocalDayKey(workoutDate)
    const existingItems = accumulator.get(dayKey) ?? []

    existingItems.push(workout)
    accumulator.set(dayKey, existingItems)
    return accumulator
  }, new Map())

  useEffect(() => {
    if (!activeEntry) {
      return
    }

    setSets(activeEntry.sets ?? 1)
    setReps(activeEntry.reps ?? 1)
    setWeight(activeEntry.weights ?? 0)
    setNotes(activeEntry.notes ?? '')
  }, [activeEntry])

  const handleSaveWorkout = async () => {
    if (!activeEntry) {
      return
    }

    setIsSaving(true)
    try {
      const updatedEntry = await updateSplitWorkoutExercise(userId, activeEntry.id, {
        sets,
        reps,
        weight,
        notes,
      })

      if (updatedEntry) {
        setWorkoutEntries((previous) =>
          previous.map((workout) =>
            workout.id === activeEntry.id
              ? {
                  ...workout,
                  sets: updatedEntry.sets,
                  reps: updatedEntry.reps,
                  weights: updatedEntry.weights,
                  unit: updatedEntry.unit,
                  notes: updatedEntry.notes,
                }
              : workout,
          ),
        )
      }

      setActiveEntry(null)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteWorkout = async () => {
    if (!activeEntry) {
      return
    }

    setIsDeleting(true)
    try {
      const didDelete = await deleteSplitWorkoutExercise(userId, activeEntry.id)
      if (didDelete) {
        setWorkoutEntries((previous) => previous.filter((workout) => workout.id !== activeEntry.id))
      }
      setActiveEntry(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="bg-background flex min-h-96 flex-col overflow-hidden lg:h-full lg:max-h-full lg:w-1/2 no-scrollbar">
      <CardHeader className="pb-2 pt-2 flex flex-row items-center justify-between gap-2 px-2 lg:px-4 pl-4">
        <CardTitle className="text-lg">Exercise Diary</CardTitle>
        <Link className={buttonVariants({ variant: "default"})} href="/app/exercises">Add Exercise</Link>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 space-y-3 overflow-y-auto no-scrollbar px-2 lg:px-4">
        {splitDays.map((day) => {
          const dayKey = getLocalDayKey(day)
          const dayWorkouts = workoutsByDay.get(dayKey) ?? []

          return (
            <section key={dayKey} className="rounded-lg border bg-card/40 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">
                  {day.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {dayWorkouts.length} {dayWorkouts.length === 1 ? 'exercise' : 'exercises'}
                </span>
              </div>

              {dayWorkouts.length === 0 ? (
                <p className="rounded-md border border-dashed py-3 text-center text-xs text-muted-foreground">
                  No exercises logged on this day.
                </p>
              ) : (
                <ul className="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-y-2">
                  {dayWorkouts.map((workout) => {
                    const hasNotes = Boolean(workout.notes?.trim())

                    return (
                      <li
                        key={workout.id}
                        className="group/labelitem flex items-start gap-2 rounded-lg border bg-card p-2 transition-all duration-200 lg:p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-row items-center gap-2">
                            <span className="block truncate text-sm">{workout.Exercice.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-auto h-6 w-6 shrink-0"
                              onClick={() => setActiveEntry(workout)}
                              aria-label={`Edit ${workout.Exercice.name} workout entry`}
                            >
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                            </Button>
                          </div>

                          <div className="mt-1.5">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">
                                {workout.sets} x {workout.reps}
                              </span>
                              <span>@</span>
                              <span className="font-medium text-foreground">
                                {workout.weights} {workout.unit}
                              </span>
                              {hasNotes ? <MessageSquareText className="h-3 w-3 text-foreground/80" /> : null}
                            </div>
                          </div>

                          {workout.Exercice.execiceLabels.length > 0 ? (
                            <div className="mt-1 max-h-8 overflow-hidden opacity-100 transition-all duration-600 ease-out group-hover/labelitem:mt-2 group-hover/labelitem:max-h-32 group-focus-within/labelitem:mt-2 group-focus-within/labelitem:max-h-32">
                              <div className="flex w-full flex-row flex-wrap content-start items-center gap-1">
                                {workout.Exercice.execiceLabels.map((exerciceLabel) => (
                                  <Badge
                                    key={exerciceLabel.id}
                                    variant="outline"
                                    className="h-3 min-w-7 max-w-7 grow-0 shrink-0 basis-auto justify-center overflow-hidden rounded-full border-transparent px-1 shadow-sm transition-all duration-200 ease-out group-hover/labelitem:h-4 group-hover/labelitem:max-w-32 group-hover/labelitem:px-2 group-focus-within/labelitem:h-4 group-focus-within/labelitem:max-w-32 group-focus-within/labelitem:px-2"
                                    style={{
                                      backgroundColor: exerciceLabel.Labels.color,
                                      color: getReadableBadgeTextColor(exerciceLabel.Labels.color),
                                    }}
                                    title={exerciceLabel.Labels.name}
                                  >
                                    <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-600 ease-out group-hover/labelitem:max-w-24 group-hover/labelitem:opacity-100 group-focus-within/labelitem:max-w-24 group-focus-within/labelitem:opacity-100">
                                      {exerciceLabel.Labels.name}
                                    </span>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          )
        })}
      </CardContent>
      </Card>
      <Dialog open={!!activeEntry} onOpenChange={(open) => !open && setActiveEntry(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {activeEntry ? `${activeEntry.Exercice.name}` : 'Workout Details'}
            </DialogTitle>
          </DialogHeader>
          {activeEntry ? (
            <DialogDescription className="flex flex-col gap-2">
              {activeEntry.Exercice.description}
              <div className="flex flex-row flex-wrap gap-2">
                {activeEntry.Exercice.execiceLabels.map((exerciceLabel) => {
                  const label = exerciceLabel.Labels

                  if (!label) {
                    return null
                  }

                  return (
                    <Badge
                      key={exerciceLabel.id}
                      variant="outline"
                      className="h-6 min-w-10 max-w-32 grow-0 shrink-0 basis-auto justify-center overflow-hidden rounded-full border-transparent px-2.5 shadow-sm"
                      style={{
                        backgroundColor: label.color,
                        color: getReadableBadgeTextColor(label.color),
                      }}
                      title={label.name}
                    >
                      <span className="max-w-24 overflow-hidden whitespace-nowrap opacity-100">
                        {exerciceLabel.value === 'secondary' ? `1/2 ${label.name}` : label.name}
                      </span>
                    </Badge>
                  )
                })}
              </div>
            </DialogDescription>
          ) : null}

          <div className="mt-2 flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <div className="grid gap-2">
                <Label htmlFor="progress-exercice-sets">Sets</Label>
                <Input
                  id="progress-exercice-sets"
                  type="number"
                  min={1}
                  step={1}
                  value={sets}
                  onChange={(event) => setSets(Number.parseInt(event.target.value, 10) || 1)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="progress-exercice-reps">Reps per set</Label>
                <Input
                  id="progress-exercice-reps"
                  type="number"
                  min={1}
                  step={1}
                  value={reps}
                  onChange={(event) => setReps(Number.parseInt(event.target.value, 10) || 1)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="progress-exercice-weight">Weight (kg)</Label>
              <Input
                id="progress-exercice-weight"
                type="number"
                min={0}
                step={0.5}
                value={weight}
                onChange={(event) => setWeight(Number.parseFloat(event.target.value) || 0)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="progress-exercice-notes">Notes</Label>
              <Textarea
                id="progress-exercice-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="How did it feel? Tempo, rest time, or any details..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-between sm:justify-between gap-2">
            <Button variant="destructive" onClick={handleDeleteWorkout} disabled={isSaving || isDeleting}>
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Remove
            </Button>
            <div className='flex flex-row gap-2'>
                <Button variant="outline" onClick={() => setActiveEntry(null)} disabled={isSaving || isDeleting}>
                Cancel
                </Button>
                <Button onClick={handleSaveWorkout} disabled={isSaving || isDeleting}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save
                </Button>            
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProgressExercises
