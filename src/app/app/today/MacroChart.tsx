"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

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

export const description = "A bar chart with a label"

const chartData = [
  { macro: "Prot.", desktop: 115},
  { macro: "Carb.", desktop: 358},
  { macro: "Fats", desktop: 126},
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function MacroChart() {
  return (
    <Card className="min-w-[250px] h-52">
      <CardHeader className="pb-4">
        <CardTitle>Macronutriments :</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="macro"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={6}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground font-bold pt-1"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

