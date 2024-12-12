"use client"

import { CartesianGrid, Line, LineChart, XAxis, Area, AreaChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { DayData } from "@/app/types/definitions"
import { sumMealValues } from "@/lib/meal_utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"


export function WeekGraph( {weekData} : {weekData : DayData[]} ) {

    const chartData : any = []

    weekData.forEach((day : DayData)=> {
        const dayChartData = {
            day : day.date.toLocaleString("en-GB", {day : 'numeric', weekday : 'short', month : 'short'}),
            calories : sumMealValues(day.mealsValues).calories.toFixed(),
            proteins : sumMealValues(day.mealsValues).proteins.toFixed(),
            carbs : sumMealValues(day.mealsValues).carbs.toFixed(),
            fats : sumMealValues(day.mealsValues).fats.toFixed(),
            objectivecalories : day.objective.calories.toFixed(),
            objectiveproteins : day.objective.proteins.toFixed(),
            objectivecarbs : day.objective.carbs.toFixed(),
            objectivefats : day.objective.fats.toFixed(),
        }
        chartData.push(dayChartData)
    })

    const [selectedValue, setSelectedValue] = useState("calories")
    const [selectedObjective, setSelectedObjective] = useState("objectiveCalories")

    const handleSelectChange = (value: string) => {
      setSelectedValue(value)
      setSelectedObjective(`objective${value}`)
    }

    const chartConfig = {
      calories: {
          label: "Calories", 
          color: "hsl(var(--chart-1))",
      },
      proteins : {
        label: "Proteins", 
        color: "hsl(var(--chart-5))",
      },
      carbs : {
        label: "Carbs", 
        color: "hsl(var(--chart-3))",
      },
      fats : {
        label: "Fats", 
        color: "hsl(var(--chart-4))",
      },
      objectivecalories: {
        label: "Objective",
        color: "hsl(var(--chart-2))",
      },
      objectiveproteins : {
        label: "Objective",
        color: "hsl(var(--chart-2))",
      },
      objectivecarbs : {
        label: "Objective",
        color: "hsl(var(--chart-2))",
      },
      objectivefats : {
        label: "Objective",
        color: "hsl(var(--chart-2))",
      }
    } satisfies ChartConfig

  return (
    <Card >
      <CardHeader className="p-4 pb-0">
        <CardTitle className="flex justify-between">
          <p className="my-auto">Your week</p>
          <Select defaultValue={selectedValue} onValueChange={handleSelectChange}>
            <SelectTrigger className="max-w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calories">Calories</SelectItem>
              <SelectItem value="proteins">Proteins</SelectItem>
              <SelectItem value="carbs">Carbs</SelectItem>
              <SelectItem value="fats">Fats</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
      <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent  indicator="dot"/>} />
            <defs>
              <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-${selectedValue})`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${selectedValue})`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey={selectedObjective}
              type="natural"
              fill="url(#fillobjective)"
              fillOpacity={0.4}
              stroke={`var(--color-${selectedObjective})`}
              stackId="b"
            />
            <Area
              dataKey={selectedValue}
              type="natural"
              fill="url(#fill)"
              fillOpacity={0.4}
              stroke={`var(--color-${selectedValue})`}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


