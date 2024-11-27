"use client"

import * as React from "react"
import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CaloriesGoalCard( {savedGoal} : {savedGoal : number}) {

  const [goal, setGoal] = useState(savedGoal)

  function onClick(adjustment: number) {
    setGoal(Math.max(0, goal + adjustment));
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base text-center md:text-left">Calories Goal</CardTitle>
        <CardDescription className="hidden md:block">Set your daily calories goal.</CardDescription>
      </CardHeader>
      <CardContent className="pb-4 flex flex-col md:flex-row md:justify-evenly gap-4">
        <div className="flex items-center justify-center space-x-2 md:w-4/6">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => onClick(-10)}
            disabled={goal <= 0}
          >
            <Minus />
            <span className="sr-only">Decrease</span>
          </Button>
          <div className="flex-1 text-center">
            <div className="text-3xl md:text-5xl font-bold tracking-tighter">{goal}</div>
            <div className="text-[0.70rem] uppercase text-muted-foreground">
              Calories/day
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={() => onClick(10)}
          >
            <Plus />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="md:pt-2">
        <Button className="mx-auto w-5/6 md:w-4/6">Set Calories Goal</Button>
      </CardFooter>
    </Card>
  )
}