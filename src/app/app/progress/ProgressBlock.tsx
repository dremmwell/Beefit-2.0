"use client"

import React, { useState } from 'react'
import { FocusLabels, SplitWorkoutData } from '@/app/types/definitions'
import ProgressDetail from './ProgressDetails'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function ProgressBlock({ focus, workouts }: { focus: FocusLabels, workouts: SplitWorkoutData[] }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const focusTargetSets = Number.isFinite(Number(focus.priority))
    ? Math.max(0, Number.parseInt(String(focus.priority), 10))
    : 0

  const labelProgressRows = focus.labels
    .map((label) => {
      const completedSets = workouts.reduce((total, workout) => {
        const hasLabel = workout.Exercice.execiceLabels.some((exerciseLabel) => exerciseLabel.Labels.id === label.id)
        return hasLabel ? total + workout.sets : total
      }, 0)

      const targetSets = (label.sets ?? focusTargetSets) || 0
      const safeTargetSets = targetSets > 0 ? targetSets : completedSets || 1
      const progressPercentage = Math.min(100, Math.round((completedSets / safeTargetSets) * 100))

      return {
        id: label.id,
        labelName: label.name,
        labelColor: label.color,
        completedSets,
        targetSets,
        progressPercentage,
      }
    })
    .sort((a, b) => b.completedSets - a.completedSets)

  const totalCompletedSets = labelProgressRows.reduce((total, row) => total + row.completedSets, 0)
  const totalTargetSets = labelProgressRows.reduce((total, row) => total + row.targetSets, 0)
  const safeTotalTargetSets = totalTargetSets > 0 ? totalTargetSets : totalCompletedSets || 1
  const totalProgressPercentage = Math.min(100, Math.round((totalCompletedSets / safeTotalTargetSets) * 100))
  const hasReachedFocusGoal = totalTargetSets > 0 && totalCompletedSets >= totalTargetSets

  return (
    <>
        <Card className="bg-background">
          <CardHeader
            className="cursor-pointer flex flex-row items-start justify-between gap-3 select-none py-3 lg:cursor-default"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  {focus.name}
                  {hasReachedFocusGoal && <Check className="h-4 w-4 text-success" />}
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {totalCompletedSets} / {totalTargetSets} sets
                </span>
              </div>
              <Progress value={totalProgressPercentage} className="h-2" />
            </div>
            <ChevronDown
              className={cn(
                "mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                isExpanded && "rotate-180",
              )}
            />
          </CardHeader>
          <div className={cn("grid transition-all duration-200", isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
            <div className="overflow-hidden">
              <CardContent>
                <Separator  className='mb-2'/>
                <ProgressDetail rows={labelProgressRows} />
              </CardContent>
            </div>
          </div>
        </Card>
    </>
  )
}

export default ProgressBlock
