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

export default function MacroChart() {

  return (
    <Card >
      <CardHeader>
        <CardTitle>Macronutriments :</CardTitle>
      </CardHeader>
      <CardContent>
      </CardContent>
    </Card>
  )
}

/* export default function CaloriesChart() {

  const radius = 80;
  let percent = 80;
  let percentSegment= 100;

  const strokeWidth = radius * 0.2;
  const innerRadius = radius - ( strokeWidth / 2 );

  const circumference = innerRadius * 2 * Math.PI;
  const arc = circumference * (210 / 360);
  const rotation = 135;

  const dashArray = `${arc} ${circumference}`;
  const transform = `rotate(${rotation}, ${radius}, ${radius})`;

  const arcSegment = circumference * (40 / 360);
  const rotationSegment = 230+rotation;
  const dashArraySegment = `${arcSegment} ${circumference}`;
  const transformSegment = `rotate(${rotationSegment}, ${radius}, ${radius})`;


  const percentNormalized = Math.min(Math.max(percent, 0), 100);
  const offset = arc - (percentNormalized / 100) * arc;

  const percentNormalizedSegment = Math.min(Math.max(percentSegment, 0), 100);
  const offsetSegment = arcSegment - (percentNormalizedSegment / 100) * arc;

  return (
    <Card >
      <CardHeader >
        <CardTitle>Calories: </CardTitle>
      </CardHeader>
      <CardContent >
    <svg
      height={radius * 2}
      width={radius * 2}
    >
     <circle
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        stroke="gray"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        transform={transform}
     />
     <circle 
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        stroke="green"
        strokeDasharray={dashArray}
        strokeDashoffset={offset}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        style={{
          transition: "stroke-dashoffset 1s",
        }}
        transform={transform}
     />
     <circle
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        stroke="gray"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        strokeDasharray={dashArraySegment}
        strokeDashoffset={offsetSegment}
        transform={transformSegment}
     />
      <circle
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        stroke="red"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        strokeDasharray={dashArraySegment}
        style={{
          transition: "stroke-dashoffset 1s",
        }}
        transform={transformSegment}
     />
    </svg>
      </CardContent>
      <CardFooter >
      </CardFooter>
    </Card>
  )
} */