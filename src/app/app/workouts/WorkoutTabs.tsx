"use client"

import type React from "react"
import { Dumbbell, Tag, BarChart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PriorityBoard from "./PriorityBoard"


export default function WorkoutTabs() {

  return (
      <div className="max-h-fit mt-4">
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="mb-4 sm:mb-6 w-full sm:w-auto bg-muted">
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

          <TabsContent value="priority" className="mt-0">
            <PriorityBoard />
          </TabsContent>

          <TabsContent value="workouts" className="mt-0">
            WORKOUTS
          </TabsContent>

          <TabsContent value="progress" className="mt-0">
            PROGRESS
          </TabsContent>
        </Tabs>
      </div>
  )
}
