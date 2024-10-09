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
import { useMediaQuery } from "@/lib/hooks/use-media-query"

export const description = "A bar chart with a label"

const chartData = [
  { label: "Prot.", macro: 115},
  { label: "Carb.", macro: 358},
  { label: "Fats", macro: 126},
]

const chartConfig = {
  macro: {
    label: "macro",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function MacroChart() {

  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <Card className="min-w-[250px] h-52">
      <CardHeader>
        <CardTitle>Macronutriments :</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: isDesktop ? 20 : 0,
              left: isDesktop ? 20 : 0,
              bottom: 0,
            }}
            width={isDesktop ? 350 : 280}
            height={isDesktop ? 250 : 200}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={isDesktop ? 10 : 5}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
              tick={{ fontSize: isDesktop ? 12 : 10}}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="macro" fill="var(--color-macro)" radius={6} width={isDesktop ? 60 : 30}>
              <LabelList
                position="top"
                offset={isDesktop? 12 : 8}
                className="fill-foreground font-bold pt-1"
                fontSize={isDesktop ? 12 : 10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

