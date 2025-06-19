"use client"
import type { WorkoutCard } from "../board/board"
import type { LabelGroup } from "../label-board/label-board-context"

type MuscleProgressProps = {
  labelGroups: LabelGroup[]
  workoutCards: WorkoutCard[]
}

type MuscleData = {
  id: string
  name: string
  color: string
  priorityValue: number
  setsDone: number
  remaining: number
  groupId: string
  groupName: string
  groupPriority: number
}

export default function MuscleProgress({ labelGroups, workoutCards }: MuscleProgressProps) {
  // Calculate sets done for each muscle group
  const calculateMuscleProgress = () => {
    const muscleProgress = new Map<string, MuscleData>()

    // Initialize with all muscle groups from labelGroups
    labelGroups.forEach((group) => {
      group.labels.forEach((label) => {
        if (!muscleProgress.has(label.id)) {
          muscleProgress.set(label.id, {
            id: label.id,
            name: label.name,
            color: label.color,
            priorityValue: group.value,
            setsDone: 0,
            remaining: group.value,
            groupId: group.id,
            groupName: group.title,
            groupPriority: group.value,
          })
        }
      })
    })

    // Calculate sets done from workout cards
    workoutCards.forEach((workoutCard) => {
      workoutCard.labels.forEach((label : any) => {
        const current = muscleProgress.get(label.id)
        if (current) {
          // Calculate sets contribution (half intensity = 0.5 sets)
          const setsContribution = workoutCard.sets * (label.intensity === "half" ? 0.5 : 1)

          muscleProgress.set(label.id, {
            ...current,
            setsDone: current.setsDone + setsContribution,
            remaining: Math.max(0, current.priorityValue - (current.setsDone + setsContribution)),
          })
        }
      })
    })

    return Array.from(muscleProgress.values())
  }

  const muscleData = calculateMuscleProgress()

  // Group muscles by their priority categories
  const groupedMuscles = muscleData.reduce(
    (acc, muscle) => {
      const group = labelGroups.find((g) => g.id === muscle.groupId)
      if (group) {
        acc[group.id] = acc[group.id] || {
          id: group.id,
          name: group.title,
          priority: group.value,
          muscles: [],
        }
        acc[group.id].muscles.push(muscle)
      }
      return acc
    },
    {} as Record<
      string,
      {
        id: string
        name: string
        priority: number
        muscles: MuscleData[]
      }
    >,
  )

  // Sort groups by priority value (highest first)
  const sortedGroups = Object.values(groupedMuscles).sort((a, b) => b.priority - a.priority)

  // Calculate totals
  const totalSetsDone = muscleData.reduce((sum, muscle) => sum + muscle.setsDone, 0)
  const totalPriorityValue = muscleData.reduce((sum, muscle) => sum + muscle.priorityValue, 0)
  const totalRemaining = muscleData.reduce((sum, muscle) => sum + muscle.remaining, 0)
  const overallProgress = totalPriorityValue > 0 ? Math.min(100, (totalSetsDone / totalPriorityValue) * 100) : 0

  if (muscleData.length === 0) {
    return (
      <div className="bg-card border rounded-md p-4">
        <h2 className="text-lg font-medium mb-3 text-foreground">Progress</h2>
        <p className="text-sm text-muted-foreground">No muscle groups defined yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-card border rounded-md p-3 sm:p-4">
      {/* Enhanced Weekly Summary - Now at the top */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-lg border-2 border-primary/30 dark:border-primary/40 p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-foreground">Progress</h2>
          <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">Summary</div>
        </div>

        {/* Key metrics in a grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-background/60 dark:bg-background/40 rounded-lg border border-primary/20">
            <div className="text-2xl font-bold text-primary">{totalSetsDone.toFixed(0)}</div>
            <div className="text-xs text-primary/80 font-medium">Sets Done</div>
          </div>

          <div className="text-center p-3 bg-background/60 dark:bg-background/40 rounded-lg border border-primary/20">
            <div className="text-2xl font-bold text-primary">{totalPriorityValue}</div>
            <div className="text-xs text-primary/80 font-medium">Target Sets</div>
          </div>

          <div className="text-center p-3 bg-background/60 dark:bg-background/40 rounded-lg border border-primary/20">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{totalRemaining.toFixed(0)}</div>
            <div className="text-xs text-orange-700 dark:text-orange-300 font-medium">Remaining</div>
          </div>

          <div className="text-center p-3 bg-background/60 dark:bg-background/40 rounded-lg border border-primary/20">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{overallProgress.toFixed(0)}%</div>
            <div className="text-xs text-green-700 dark:text-green-300 font-medium">Complete</div>
          </div>
        </div>

        {/* Progress visualization */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-primary">Goal Progress</span>
            <span className="text-primary/80">
              {totalSetsDone.toFixed(0)} / {totalPriorityValue} sets
            </span>
          </div>
          <div className="w-full bg-primary/10 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-primary transition-all duration-500 ease-out relative"
              style={{ width: `${overallProgress}%` }}
            >
              {overallProgress > 10 && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
            </div>
          </div>

          {/* Added progress percentage and remaining sets */}
          <div className="flex justify-between items-center text-xs mt-1">
            <span className="text-muted-foreground">{totalRemaining.toFixed(0)} sets remaining</span>
            <span className="text-muted-foreground font-medium">{overallProgress.toFixed(0)}% complete</span>
          </div>

          {/* Status message */}
          <div className="text-center pt-2">
            {overallProgress >= 100 ? (
              <div className="text-green-700 dark:text-green-300 font-semibold flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>🎉 Goal achieved!
              </div>
            ) : overallProgress >= 75 ? (
              <div className="text-primary font-medium">💪 Almost there! {totalRemaining.toFixed(0)} sets to go</div>
            ) : overallProgress >= 50 ? (
              <div className="text-primary font-medium">🔥 Halfway done! Keep pushing</div>
            ) : overallProgress >= 25 ? (
              <div className="text-primary font-medium">🚀 Good start! {totalRemaining.toFixed(0)} sets remaining</div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Muscle groups by priority - responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedGroups.map((group) => (
          <div key={group.id} className="space-y-3">
            <h3 className="font-medium text-sm border-b pb-1 text-foreground">{group.name}</h3>
            <div className="space-y-4">
              {group.muscles
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((muscle) => {
                  const progressPercentage =
                    muscle.priorityValue > 0 ? Math.min(100, (muscle.setsDone / muscle.priorityValue) * 100) : 0

                  const isComplete = muscle.remaining <= 0

                  return (
                    <div key={muscle.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: muscle.color }} />
                          <span className="text-sm font-medium text-foreground">{muscle.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {muscle.setsDone.toFixed(0)}/{muscle.priorityValue}
                        </div>
                      </div>

                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${progressPercentage}%`,
                            backgroundColor: isComplete ? "#22c55e" : muscle.color,
                          }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span
                          className={
                            isComplete ? "text-green-600 dark:text-green-400 font-medium" : "text-muted-foreground"
                          }
                        >
                          {isComplete ? "Complete!" : `${muscle.remaining.toFixed(0)} sets remaining`}
                        </span>
                        <span className="text-muted-foreground">{progressPercentage.toFixed(0)}%</span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
