"use client"

import { MealData, MealValues} from "@/app/types/definitions";
import { Objective } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useWindowDimensions from "@/lib/hooks/useWindowDimensions";
import { useEffect, useState } from "react";

export default function CaloriesChart({ values, objective } : { values : MealValues, objective : Objective}) {

  const { height, width } = useWindowDimensions();
  const [isShorted , setIsShorted] = useState(false)

 // Get windows dimensions and set isShorted true/false
 const [size ,setSize] = useState(1);
 const shortWidth = 1023;

 useEffect(() => {
   if (typeof width !== 'undefined') {
     if (width <= shortWidth) {
       setSize(0.7);
       setIsShorted(true)
     }
     else {
      setIsShorted(false)
       setSize(1);
     }
   }
 }, [width]);

  const percent = values.calories / objective.calories *100;
  const percentSegment = (values.calories - objective.calories) / (objective.calories/3) *100;
  
  const radius =90*size;
  const strokeWidth = radius * 0.13;
  const innerRadius = radius - ( strokeWidth / 2 );

  const circumference = innerRadius * 2 * Math.PI;
  const arc = circumference * (205 / 360);
  const dashArray = `${arc} ${circumference}`;
  const transform = `rotate(150, ${radius}, ${radius})`;

  const percentNormalized = Math.min(Math.max(percent, 0), 100);
  const offset = arc - (percentNormalized / 100) * arc;

  const arcSegment = circumference * (23 / 360);
  const dashArraySegment = `${arcSegment} ${circumference}`;
  const transformSegment = `rotate(7, ${radius}, ${radius})`;

  const percentNormalizedSegment = Math.min(Math.max(percentSegment, 0), 100);
  const offsetSegment = arcSegment - (percentNormalizedSegment / 100) * arcSegment;

  return (
    <div >
      {!isShorted ?
      <>
        <div className="text-center text-muted-foreground">Calories</div>
      <div className="translate-y-2 pb-2 flex flex-col items-center" >
      <svg
        height={radius * 2}
        width={radius * 2}
      >
      <circle
          cx={radius}
          cy={radius}
          fill="transparent"
          r={innerRadius}
          stroke="hsl(var(--muted))"
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
          stroke="hsl(var(--success))"
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
          stroke="hsl(var(--muted))"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          strokeDasharray={dashArraySegment}
          transform={transformSegment}
      />
      {values.calories > objective.calories &&
        <circle 
          cx={radius}
          cy={radius}
          fill="transparent"
          r={innerRadius}
          stroke="hsl(var(--primary))"
          strokeDasharray={dashArraySegment}
          strokeDashoffset={offsetSegment}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          style={{
            transition: "stroke-dashoffset 1s",
          }}
          transform={transformSegment}
        />
      }

      </svg>
      <div className="absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      {values.calories <= objective.calories ?
      <>
        <p className="fill-foreground text-4xl font-bold text-success">
        {values.calories.toFixed(0)}
        </p>
        <p className="fill-muted-foreground font-semibold">
        calories
        </p>
      </>
        :
        <>
        <p className="fill-foreground text-4xl font-bold text-primary">
        {values.calories.toFixed(0)}
        </p>
        <p className="fill-muted-foreground">
        calories
        </p>
        </>
      }
      </div>
        </div>
          <div className="flex flex-col gap-2 text-sm lg:transform lg:-translate-y-4">
            <div className="font-medium leading-none text-center">
              of {objective.calories.toFixed(0)} cal
            </div>
            {values.calories <= objective.calories ?
            <div className="leading-none text-success text-center">
              ({(objective.calories - values.calories).toFixed(0)} cal. left)
            </div>
            :
            <div className="leading-none text-primary text-center">
              ({(values.calories - objective.calories).toFixed(0)} cal. over)
            </div>
            }
          </div>
      </>
      :
      <>
      <div className="translate-y-3 pb-0 flex justify-evenly gap-2 items-center" >
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
        >
        <circle
            cx={radius}
            cy={radius}
            fill="transparent"
            r={innerRadius}
            stroke="hsl(var(--muted))"
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
            stroke="hsl(var(--success))"
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
            stroke="hsl(var(--muted))"
            strokeLinecap="round"
            strokeWidth={strokeWidth}
            strokeDasharray={dashArraySegment}
            transform={transformSegment}
        />
        {values.calories > objective.calories &&
          <circle 
            cx={radius}
            cy={radius}
            fill="transparent"
            r={innerRadius}
            stroke="hsl(var(--primary))"
            strokeDasharray={dashArraySegment}
            strokeDashoffset={offsetSegment}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
            style={{
              transition: "stroke-dashoffset 1s",
            }}
            transform={transformSegment}
          />
        }
        </svg>
        <div className="absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          {values.calories <= objective.calories ?
          <>
            <p className="fill-foreground text-2xl font-bold text-success">
            {values.calories.toFixed(0)}
            </p>
            <p className="fill-muted-foreground">
            calories
            </p>
          </>
            :
            <>
            <p className="fill-foreground text-2xl font-bold text-primary">
            {values.calories.toFixed(0)}
            </p>
            <p className="fill-muted-foreground">
            calories
            </p>
            </>
          }
        </div>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          of {objective.calories.toFixed(0)} cal
        </div>
        {values.calories <= objective.calories ?
        <div className="leading-none text-success">
          ({(objective.calories - values.calories).toFixed(0)} cal. left)
        </div>
        :
        <div className="leading-none text-primary">
          ({(values.calories - objective.calories).toFixed(0)} cal. over)
        </div>
        }
      </div>
      </div>
      </>
      } 
    </div>
  )
}


