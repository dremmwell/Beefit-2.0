"use client"

import React, { useState, useRef } from "react";
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

function MacroGoalCard(
{savedProteinsGoal, savedCarbsGoal, savedFatsGoal} 
:
{savedProteinsGoal : number, savedCarbsGoal : number, savedFatsGoal : number}) 
{

    const [proteinsGoal, setProteinsGoal] = useState(savedProteinsGoal)
    const [carbsGoal, setCarbsGoal] = useState(savedCarbsGoal)
    const [fatsGoal, setFatsGoal] = useState(savedFatsGoal)

    function onClick(adjustment: number,macro : string) {
        if(macro === "proteins"){
            // @ts-ignore
            setProteinsGoal(Math.max(0, proteinsGoal + adjustment));
        }
        if(macro === "carbs"){
            // @ts-ignore
            setCarbsGoal(Math.max(0, carbsGoal + adjustment));
        }
        if(macro === "fats"){
            // @ts-ignore
            setFatsGoal(Math.max(0, fatsGoal + adjustment));
        }
        else{
            return
        }
      };

    //Handles mouse hold, using a "timer" as Ref with useRef hook to keep track of the count accross renders//
    const timer = useRef(0);

    function onMouseHold(adjustment: number,macro : string) {
        if(macro === "proteins"){
            // @ts-ignore
            timer.current = setInterval(() => setProteinsGoal(prev => prev + adjustment), 200);
        }
        if(macro === "carbs"){
            // @ts-ignore
            timer.current = setInterval(() => setCarbsGoal(prev => prev + adjustment), 200);
        }
        if(macro === "fats"){
            // @ts-ignore
            timer.current = setInterval(() => setFatsGoal(prev => prev + adjustment), 200);
        }
        else{
            return
        }
      };

    function timeoutClear() {
        clearInterval(timer.current);
    }

  return (
    <Card>
      <CardHeader className="md:pb-4 pb-2">
        <CardTitle className="text-base text-center md:text-left">Macronutriments Goal</CardTitle>
        <CardDescription className="hidden md:block">Set your daily macronutriments goal.</CardDescription>
      </CardHeader>
      <CardContent className="md:py-4 pb-4 flex flex-col md:flex-row md:justify-evenly gap-4 md:min-w-">
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center space-x-2">
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onMouseLeave={timeoutClear}
                onMouseUp={timeoutClear}
                onMouseDown={() => onMouseHold(-2,"proteins")}
                onClick={() => onClick(-2, "proteins")}
                disabled={proteinsGoal <= 0}
            >
                <Minus />
                <span className="sr-only">Decrease</span>
            </Button>
            <div className="flex-1 text-center px-4">
                <div className="text-3xl md:text-5xl font-bold tracking-tighter">{proteinsGoal}</div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                Proteins/day
                </div>
            </div>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onMouseLeave={timeoutClear}
                onMouseUp={timeoutClear}
                onMouseDown={() => onMouseHold(2,"proteins")}
                onClick={() => onClick(2, "proteins")}
            >
                <Plus />
                <span className="sr-only">Increase</span>
            </Button>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center space-x-2">
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onMouseLeave={timeoutClear}
                onMouseUp={timeoutClear}
                onMouseDown={() => onMouseHold(-5,"carbs")}
                onClick={() => onClick(-5, "carbs")}
                disabled={carbsGoal <= 0}
            >
                <Minus />
                <span className="sr-only">Decrease</span>
            </Button>
            <div className="flex-1 text-center px-4">
                <div className="text-3xl md:text-5xl font-bold tracking-tighter">{carbsGoal}</div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                Carbs/day
                </div>
            </div>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onMouseLeave={timeoutClear}
                onMouseUp={timeoutClear}
                onMouseDown={() => onMouseHold(5,"carbs")}
                onClick={() => onClick(5, "carbs")}
            >
                <Plus />
                <span className="sr-only">Increase</span>
            </Button>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center space-x-2">
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onMouseLeave={timeoutClear}
                onMouseUp={timeoutClear}
                onMouseDown={() => onMouseHold(-2,"fats")}
                onClick={() => onClick(-2, "fats")}
                disabled={fatsGoal <= 0}
            >
                <Minus />
                <span className="sr-only">Decrease</span>
            </Button>
            <div className="flex-1 text-center px-4">
                <div className="text-3xl md:text-5xl font-bold tracking-tighter">{fatsGoal}</div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                Fats/day
                </div>
            </div>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onMouseLeave={timeoutClear}
                onMouseUp={timeoutClear}
                onMouseDown={() => onMouseHold(2,"fats")}
                onClick={() => onClick(2,"fats")}
            >
                <Plus />
                <span className="sr-only">Increase</span>
            </Button>
            </div>
        </div>
      </CardContent>
      <CardFooter className="md:pt-4">
        <Button className="mx-auto w-full md:w-5/6">Set Macronutriments Goals</Button>  
      </CardFooter>
    </Card>
  )
}

export default MacroGoalCard
