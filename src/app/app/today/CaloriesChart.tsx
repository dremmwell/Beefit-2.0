"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CaloriesChart({  }) {

  const radius = 90;
  const percent = 100;
  const percentSegment = 100;

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
    <Card >
      <CardHeader>
        <CardTitle className="text-center">Calories</CardTitle>
      </CardHeader>
      <CardContent className="translate-y-2 pb-2" >
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
        stroke="#65a30d"
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
     <circle 
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        stroke="#991b1b"
        strokeDasharray={dashArraySegment}
        strokeDashoffset={offsetSegment}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        style={{
          transition: "stroke-dashoffset 1s",
        }}
        transform={transformSegment}
     />
    </svg>
    <div className="absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <p className="fill-foreground text-4xl font-bold">
          1800
      </p>
      <p className="fill-muted-foreground">
          calories
      </p>
    </div>
      </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            of 2200 cal
          </div>
          <div className="leading-none text-muted-foreground">
            (200 cal left)
          </div>
        </CardFooter>
    </Card>
  )
}


