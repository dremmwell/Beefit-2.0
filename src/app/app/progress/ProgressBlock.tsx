import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, GripVertical, Pencil, Trash2, X } from "lucide-react"
import { ExercicePerfs, Focus } from '@prisma/client'
import ProgressCard from './ProgressCard'

function ProgressBlock({ workouts, focus }: { workouts: ExercicePerfs[], focus: Focus[] }) {
  return (
    <ProgressCard />
  )
}

export default ProgressBlock
