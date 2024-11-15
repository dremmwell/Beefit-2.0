"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { MealData, MealValues, Objective } from "@/app/types/definitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function MacroChart({ values, objective } : { values : MealValues, objective : Objective}) {

  const percentCarbs = values.carbs / objective.carbs * 100;
  const carbsNormalized = Math.min(Math.max(percentCarbs, 0), 100);

  const percentProt = values.proteins / objective.proteins * 100;
  const proteinsNormalized = Math.min(Math.max(percentProt, 0), 100);

  const percentFats = values.fats / objective.fats * 100;
  const fatsNormalized = Math.min(Math.max(percentFats, 0), 100);

  const ratio = 3;

  const height = 8;
  const width = 100 * ratio;
  const limit = width*0.8;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Macronutriments</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-6">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-foreground mb-1">Carbs</p>
          <div className="flex flex-col h-3">
            <svg>
              <rect 
                height={height} 
                width={width} 
                rx="5" 
                ry="5" 
                fill="hsl(var(--muted))"
              />
              <rect 
                height={height} 
                width={ratio*carbsNormalized} 
                rx="5" 
                ry="5" 
                fill="hsl(var(--primary))"
              />
              <rect 
                x={limit}
                height={height} 
                width={height/2} 
                fill="hsl(var(--card))"
              />
            </svg>
          </div>
          <div className="flex gap-1 text-sm">
            <p className="font-semibold">{(values.carbs).toFixed(0)}g</p>
            {values.carbs > objective.carbs ?
            <p className="text-primary">(over {(values.carbs - objective.carbs).toFixed(0)}g)</p>
            :
            <p className="text-muted-foreground">(left {(objective.carbs - values.carbs).toFixed(0)}g)</p>
            }
            <p className="ml-auto text-muted-foreground">{(objective.carbs).toFixed(0)}g</p>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-foreground mb-1">Proteins</p>
          <div className="flex flex-col h-3" >
            <svg>
              <rect 
                height={height} 
                width={width} 
                rx="5" 
                ry="5" 
                fill="hsl(var(--muted))"
              />
              <rect 
                height={height} 
                width={ratio*proteinsNormalized} 
                rx="5" 
                ry="5" 
                fill="hsl(var(--primary))"
              />
              <rect 
                x={limit}
                height={height} 
                width={height/2} 
                fill="hsl(var(--card))"
              />
            </svg>
          </div>
          <div className="flex gap-1 text-sm">
            <p className="font-semibold">{(values.proteins).toFixed(0)}g</p>
            {values.proteins > objective.proteins ?
            <p className="text-primary">(over {(values.proteins - objective.proteins).toFixed(0)}g)</p>
            :
            <p className="text-muted-foreground">(left {(objective.proteins - values.proteins).toFixed(0)}g)</p>
            }
            <p className="ml-auto text-muted-foreground">{(objective.proteins).toFixed(0)}g</p>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-foreground mb-1">Fats</p>
          <div className="flex flex-col h-3" >
            <svg>
              <rect 
                height={height} 
                width={width} 
                rx="5" 
                ry="5" 
                fill="hsl(var(--muted))"
              />
              <rect 
                height={height} 
                width={ratio*fatsNormalized} 
                rx="5" 
                ry="5" 
                fill="hsl(var(--primary))"
              />
              <rect 
                x={limit}
                height={height} 
                width={height/2} 
                fill="hsl(var(--card))"
              />
            </svg>
          </div>
          <div className="flex gap-1 text-sm">
            <p className="font-semibold">{(values.fats).toFixed(0)}g</p>
            {values.fats > objective.fats ?
            <p className="text-primary ">(over {(values.fats - objective.fats).toFixed(0)}g)</p>
            :
            <p className="text-muted-foreground">(left {(objective.fats - values.fats).toFixed(0)}g)</p>
            }
            <p className="ml-auto text-muted-foreground">{(objective.fats).toFixed(0)}g</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}