"use client"

import { CartesianGrid, Line, LineChart, XAxis, Area, AreaChart, LabelList } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Beef, CookingPot } from "lucide-react";
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

    const chartData : any = [];
    const totalData = {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats:0
    }

    const totalObjective = {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats:0
    }

   const calArray : number[] = []
   const protArray : number[] = []
   const carbArray : number[] = []
   const fatArray : number[] = []

   const calObjArray : number[] = []
   const protObjArray : number[] = []
   const carbObjArray : number[] = []
   const fatObjArray : number[] = []

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

        calArray.push(sumMealValues(day.mealsValues).calories)
        protArray.push(sumMealValues(day.mealsValues).proteins)
        carbArray.push(sumMealValues(day.mealsValues).carbs)
        fatArray.push(sumMealValues(day.mealsValues).fats)

        calObjArray.push(day.objective.calories)
        protObjArray.push(day.objective.proteins)
        carbObjArray.push(day.objective.carbs)
        fatObjArray.push(day.objective.fats)

        totalData.calories += sumMealValues(day.mealsValues).calories;
        totalData.proteins += sumMealValues(day.mealsValues).proteins;
        totalData.carbs += sumMealValues(day.mealsValues).carbs;
        totalData.fats += sumMealValues(day.mealsValues).fats;

        totalObjective.calories += day.objective.calories;
        totalObjective.proteins += day.objective.proteins;
        totalObjective.carbs += day.objective.carbs;
        totalObjective.fats += day.objective.fats 

    })

    const meanData = {
      calories : calArray.reduce((a, b) => a+ b) / calArray.length,
      proteins : protArray.reduce((a, b) => a+ b) / protArray.length,
      carbs : carbArray.reduce((a, b) => a+ b) / carbArray.length,
      fats : fatArray.reduce((a, b) => a + b) / fatArray.length
    }

    const meanObjective = {
      calories : calObjArray.reduce((a, b) => a+ b) / calObjArray.length,
      proteins : protObjArray.reduce((a, b) => a+ b) / calObjArray.length,
      carbs : carbObjArray.reduce((a, b) => a+ b) / calObjArray.length,
      fats : fatObjArray.reduce((a, b) => a + b) / calObjArray.length
    }

    const [selectedValue, setSelectedValue] = useState("calories")
    const [selectedObjective, setSelectedObjective] = useState("objectivecalories")
    const [selectedTotal, setSelectedTotal] = useState(totalData.calories.toFixed(0))
    const [unit, setUnit] = useState("cal")
    const [selectedMean, setSelectedMean] = useState(meanData.calories.toFixed(0))
    const [selectedMeanObjective, setSelectedMeanObjective] = useState(meanObjective.calories.toFixed(0))
    const [selectedTotalObjective, setSelectedTotalObjective] = useState(totalObjective.calories.toFixed(0))

    const handleSelectChange = (value: string) => {
      setSelectedValue(value)
      setSelectedObjective(`objective${value}`)
      switch(value){
        case "calories":
          setSelectedTotal(totalData.calories.toFixed(0))
          setSelectedMean(meanData.calories.toFixed(0))
          setSelectedMeanObjective( meanObjective.calories.toFixed(0))
          setSelectedTotalObjective(totalObjective.calories.toFixed(0))
          setUnit("cal")
          break
        case "proteins":
          setSelectedTotal(totalData.proteins.toFixed(0))
          setSelectedMean(meanData.proteins.toFixed(0))
          setSelectedMeanObjective( meanObjective.proteins.toFixed(0))
          setSelectedTotalObjective(totalObjective.proteins.toFixed(0))
          setUnit("g")
          break
        case "carbs":
          setSelectedTotal(totalData.carbs.toFixed(0))
          setSelectedMean(meanData.carbs.toFixed(0))
          setSelectedMeanObjective( meanObjective.carbs.toFixed(0))
          setSelectedTotalObjective(totalObjective.carbs.toFixed(0))
          setUnit("g")
          break
        case "fats":
          setSelectedTotal(totalData.fats.toFixed(0))
          setSelectedMean(meanData.fats.toFixed(0))
          setSelectedMeanObjective( meanObjective.fats.toFixed(0))
          setSelectedTotalObjective(totalObjective.fats.toFixed(0))
          setUnit("g")
          break
        default :
          setSelectedTotal(totalData.calories.toFixed(0))
          setSelectedMean(meanData.calories.toFixed(0))
          setSelectedMeanObjective( meanObjective.calories.toFixed(0))
          setSelectedTotalObjective(totalObjective.calories.toFixed(0))
          setUnit("cal")
      }
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
    <div className="flex flex-col gap-4">
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
                left: 14,
                right: 14,
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
                dataKey={selectedValue}
                type="natural"
                fill="url(#fill)"
                fillOpacity={0.4}
                stroke={`var(--color-${selectedValue})`}
                stackId="a"
                dot={{fill : `var(--color-${selectedValue})`}}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Area>
              <Area
                dataKey={selectedObjective}
                type="natural"
                fill="url(#fillobjective)"
                fillOpacity={0.4}
                stroke={`var(--color-${selectedObjective})`}
                stackId="b"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 xl:p-6 xl:pb-2">
            <CardTitle className="text-sm font-medium">
              Mean Weekly {selectedValue[0].toUpperCase() + selectedValue.slice(1)}
            </CardTitle>
          <Beef></Beef>
          </CardHeader>
          <CardContent className="p-4 pt-1 xl:p-6 xl:pt-2">
            <div className="text-xl font-bold">{selectedMean + " " + unit}</div>
            <p className="text-xs text-muted-foreground">
              out of {selectedMeanObjective} {unit} objective
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 xl:p-6 xl:pb-2">
            <CardTitle className="text-sm font-medium">
              Total Weekly {selectedValue[0].toUpperCase() + selectedValue.slice(1)} 
            </CardTitle>
            <CookingPot></CookingPot>
          </CardHeader>
          <CardContent className="p-4 pt-1 xl:p-6 xl:pt-2">
            <div className="text-xl font-bold">{selectedTotal + " " + unit}</div>
            <p className="text-xs text-muted-foreground">
              out of {selectedTotalObjective} {unit} objective
            </p>
          </CardContent>
        </Card>
    </div>
  </div>
  )
}


