"use client"

import React, { useState, useRef } from "react";
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { seedDB, setObjective } from "@/app/actions/db.actions";
import { Loader2 } from "lucide-react";

export default function CaloriesGoalCard( {objective} : {objective : any}) {

  const [goal, setGoal] = useState(objective.calories)

  function onClick(adjustment: number) {
    setGoal((prev : any) => prev + adjustment);
  }

  // Handles mouse hold //
  const timer = useRef(0);
  function onMouseHold(adjustment: number) {
    // @ts-ignore
    timer.current = setInterval(() => setGoal(prev => prev + adjustment), 200);
  };

  function timeoutClear() {
    clearInterval(timer.current);
  }

  // --------------- Saving Objective to DB ----------------//

  const [loading, setLoading] = useState(false);
  const { toast } = useToast()

  async function onSave() {
    setLoading(true)
    objective.calories = goal;
    try {
      await setObjective(objective);
      toast({
        title: `New Caloric Objective set!`,
        description: `Your new objective is ${objective.calories} calories a day.`,
      });

    }
    catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
      }
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
            onMouseLeave={timeoutClear}
            onMouseUp={timeoutClear}
            onMouseDown={() => onMouseHold(-10)}
            onClick={() => onClick(-10)}
            disabled={goal <= 0}
          >
            <Minus />
            <span className="sr-only">Decrease</span>
          </Button>
          <div className="flex-1 text-center">
            <div className="text-3xl md:text-4xl font-bold tracking-tighter">{goal}</div>
            <div className="text-[0.70rem] uppercase text-muted-foreground">
              Calories/day
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onMouseLeave={timeoutClear}
            onMouseUp={timeoutClear}
            onMouseDown={() => onMouseHold(10)}
            onClick={() => onClick(10)}
          >
            <Plus />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="md:pt-2">
        <Button disabled={loading} onClick={onSave} className="mx-auto w-5/6 md:w-4/6">
        {loading && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
        )}
        Set Calories Goal
        </Button>
      </CardFooter>
    </Card>
  )
}