"use client"

import React, { useState } from 'react'
import { Focus } from '@prisma/client'
import { SplitWorkoutData } from '@/app/types/definitions'
import ProgressDetail from './ProgressDetails'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function ProgressBlock({ focus, workouts }: { focus: Focus, workouts: SplitWorkoutData[] }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
        <Card className="bg-background">
          <CardHeader
            className="cursor-pointer flex flex-row items-center justify-between select-none py-3 lg:cursor-default"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            <CardTitle>{focus.name}</CardTitle>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform duration-200",
                isExpanded && "rotate-180",
              )}
            />
          </CardHeader>

          <div className={cn("grid transition-all duration-200 lg:grid-rows-[1fr]", isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
            <div className="overflow-hidden">
              <CardContent>
                <ProgressDetail />
              </CardContent>
            </div>
          </div>
        </Card>
    </>
  )
}

export default ProgressBlock
