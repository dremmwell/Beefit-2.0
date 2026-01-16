"use client"

import type React from "react"
import { Dumbbell, Tag, BarChart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PriorityBoard from "./PriorityBoard"
import { FocusLabels } from "@/app/types/definitions"


export default function WorkoutTabs({focus}: {focus: Array<FocusLabels>}) {

  console.log(focus)

  return (
        <Tabs defaultValue="progress" className="flex-1 flex flex-col min-h-0 px-4 mt-2">
          <TabsList className="mb-3 lg:mb-6 w-full sm:w-auto bg-muted">
            <TabsTrigger value="priority" className="flex items-center flex-1 sm:flex-auto">
              <Tag className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Focus</span>
              <span className="sm:hidden">Focus</span>
            </TabsTrigger>
            <TabsTrigger value="workouts" className="flex items-center flex-1 sm:flex-auto">
              <Dumbbell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Workouts</span>
              <span className="sm:hidden">Workouts</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center flex-1 sm:flex-auto">
              <BarChart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Progress</span>
              <span className="sm:hidden">Progress</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="priority" className="flex-1 min-h-0 lg:mt-4 mt-0 flex flex-col overflow-hidden">
            <PriorityBoard focus={focus}/>
          </TabsContent>

          <TabsContent value="workouts" className="mt-0 flex flex-col">
            Workout
          </TabsContent>

          <TabsContent value="progress" className="mt-0">
            PROGRESS
          </TabsContent>
        </Tabs>
  )
}
