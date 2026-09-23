"use client"

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Check, ChevronDown, Footprints } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Split } from '@prisma/client'
import { SplitStepData } from '@/app/actions/db.actions/workout.actions'

const getLocalDayKey = (date: Date) => {
  const year = date.getUTCFullYear()
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0')
  const day = `${date.getUTCDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

function StepProgress({ split, stepData, stepGoal }: { split: Split; stepData: SplitStepData; stepGoal: number }) {

  const [isExpanded, setIsExpanded] = useState(false)
  const dailyGoal = Math.max(0, Math.floor(stepGoal))
  const totalSteps = Object.values(stepData.counts).reduce((total, count) => total + count, 0)
  const splitTarget = dailyGoal * split.length
  const progressPercentage = splitTarget > 0
    ? Math.min(100, Math.round((totalSteps / splitTarget) * 100))
    : 0
  const hasReachedSplitGoal = splitTarget > 0 && totalSteps >= splitTarget

  const splitStartDate = new Date(split.startDate)
  splitStartDate.setUTCHours(0, 0, 0, 0)
  const splitDays = Array.from({ length: split.length }, (_, index) => {
    const day = new Date(splitStartDate)
    day.setUTCDate(splitStartDate.getUTCDate() + index)
    return day
  })
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const remainingDays = splitDays.filter((day) => day > today).length
  const remainingSteps = Math.max(0, splitTarget - totalSteps)
  const stepsPerRemainingDay = remainingDays > 0
    ? Math.ceil(remainingSteps / remainingDays)
    : 0

  return (
    <Card className="bg-background">
      <CardHeader
        className="flex cursor-pointer flex-row items-start justify-between gap-3 select-none py-3 lg:cursor-default"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Footprints className="h-4 w-4" />
              <span>Split steps</span>
              {hasReachedSplitGoal && <Check className="h-4 w-4 text-success" />}
            </CardTitle>
            <span className={cn("text-sm text-muted-foreground", hasReachedSplitGoal && "text-success")}>
              {totalSteps.toLocaleString('en-US')} / {splitTarget.toLocaleString('en-US')}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
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
            <Separator className="mb-3" />
            <div className="mt-3 flex gap-1 overflow-x-auto pb-1 no-scrollbar">
              {splitDays.map((day) => {
                const dayKey = getLocalDayKey(day)
                const daySteps = stepData.counts[dayKey] ?? 0
                const isCurrentDay = day.getTime() === today.getTime()
                const isPastDay = day < today
                const isCompletedDay = isPastDay || isCurrentDay
                const dayStepsRemaining = Math.max(0, dailyGoal - daySteps)
                const currentDayStepsRemaining = Math.max(0, stepsPerRemainingDay - daySteps)
                const displayedStepsRemaining = isCurrentDay ? currentDayStepsRemaining : dayStepsRemaining
                const displayedSteps = isCompletedDay ? daySteps : stepsPerRemainingDay

                return (
                  <div
                    key={dayKey}
                    className={cn(
                      'flex w-[82px] shrink-0 flex-col items-center gap-1 rounded-md border bg-background px-2 py-2 text-center',
                      isCurrentDay && 'border-primary bg-card',
                      isPastDay && 'opacity-60',
                    )}
                    aria-label={`${day.toLocaleDateString('en-US', {
                      timeZone: 'UTC',
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}: ${isCompletedDay
                      ? `${daySteps.toLocaleString('en-US')} done, ${displayedStepsRemaining.toLocaleString('en-US')} remaining`
                      : `${stepsPerRemainingDay.toLocaleString('en-US')} steps needed`}`}
                  >
                    <span className={cn(
                      'text-[9px] font-medium uppercase tracking-wide text-muted-foreground',
                      isCurrentDay && 'text-primary',
                    )}>
                      {isCurrentDay ? 'Today' : day.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })}
                    </span>
                    <span className="text-sm font-semibold leading-none">
                      {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
                    </span>
                    {isCompletedDay ? (
                      <>
                        <span className={cn(
                          'text-[10px] font-semibold',
                          displayedStepsRemaining === 0 ? 'text-success' : 'text-foreground',
                        )}>
                          {displayedSteps.toLocaleString('en-US')} done
                        </span>
                        <span className='text-[10px] text-muted-foreground'>
                          {displayedStepsRemaining.toLocaleString('en-US')} left
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] font-semibold text-foreground">
                        {displayedSteps.toLocaleString('en-US')} needed
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

export default StepProgress
