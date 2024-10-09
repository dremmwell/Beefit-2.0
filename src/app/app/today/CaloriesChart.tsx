"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { useMediaQuery } from "@/lib/hooks/use-media-query"

export const description = "A radial chart with text"

const chartData = [
  { data: "calories", calories: 2212, fill: "var(--color-calories)" },
]

const chartConfig = {
  totalCalories: {
    label: "Taday",
  },
  calories: {
    label: "calories",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function CaloriesChart() {

  const isDesktop = useMediaQuery('(min-width: 768px)');
  
  return (
    <Card className="flex flex-col max-w-64 min-w-[170px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Calories - Today</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square "
        >
          <RadialBarChart
            data={chartData}
            startAngle={270}
            endAngle={0}
            innerRadius={isDesktop ? 80 : 50}
            outerRadius={isDesktop ? 110 : 80}
            barSize={isDesktop? 20 : 15}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={isDesktop ? [86, 74] : [56, 44]}
            />
            <RadialBar dataKey="calories" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground md:text-4xl text-2xl font-bold"
                        >
                          {chartData[0].calories.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Calories
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {isDesktop ? 
        <div className="flex items-center gap-2 font-medium leading-none">
          188 cal remaining today.
        </div>
        :
        <div className="flex items-center gap-2 font-medium leading-none">
        188 cal left
        </div>
        }
      </CardFooter>
    </Card>
  )
}

