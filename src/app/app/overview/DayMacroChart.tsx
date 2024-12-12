"use client"

import { useEffect, useState, createRef } from "react";
import { MealData, MealValues } from "@/app/types/definitions";
import { Objective } from "@prisma/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useWindowDimensions from "@/lib/hooks/useWindowDimensions";

export default function DayMacroChart({ values, objective } : { values : MealValues, objective : Objective}) {

  const cardRef = createRef<HTMLDivElement>()

  // Get windows dimensions, card dimensions and set isShorted true/false
  const { height, width } = useWindowDimensions(); 
  const [cardWidth, setCardWidth ] = useState(100);
  const [isShorted , setIsShorted] = useState(false);
  const [size ,setSize] = useState(1);
  const shortwidth = 768;

  useEffect(() => {
    if (cardRef.current){
      const cardWidth = cardRef.current.offsetWidth;
      //@ts-ignore
      setCardWidth(cardWidth); 
      if (typeof width !== 'undefined') {
        if (width <= shortwidth) {
          setSize(1);
          setIsShorted(true)
        }
        else {
          setIsShorted(false)
          setSize(1);
        }
      }
    }
  }, [width, cardRef]);

  const chartHeight = 8;
  //@ts-ignore
  const chartWidth = size * cardWidth;

  const ratio =  chartWidth /100;

  const percentCarbs = values.carbs / objective.carbs * 100;
  const carbsNormalized = Math.min(Math.max(percentCarbs, 0), 100);
  const carbsWidth = carbsNormalized * ratio;

  const percentProt = values.proteins / objective.proteins * 100;
  const proteinsNormalized = Math.min(Math.max(percentProt, 0), 100);
  const protWidth = proteinsNormalized * ratio;

  const percentFats = values.fats / objective.fats * 100;
  const fatsNormalized = Math.min(Math.max(percentFats, 0), 100);
  const fatsWidth = fatsNormalized * ratio;

  const limit = chartWidth*0.8;

  return (
    <>
      {/* 
      // @ts-ignore */}
      <div ref={cardRef}> 
        {!isShorted ? 
        <>
          <div className="text-center pb-4 text-muted-foreground">Macronutriments</div>
          <div className="flex flex-col justify-between gap-6">
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-foreground mb-1">Carbs</p>
              <div className="flex flex-col h-3">
                <svg>
                  <rect 
                    height={chartHeight} 
                    width={chartWidth} 
                    rx="5" 
                    ry="5" 
                    fill="hsl(var(--muted))"
                  />
                  <rect 
                    height={chartHeight} 
                    width={carbsWidth} 
                    rx="5" 
                    ry="5" 
                    fill="hsl(var(--primary))"
                  />
                  <rect 
                    x={limit}
                    height={chartHeight} 
                    width={chartHeight/2} 
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
                    height={chartHeight} 
                    width={chartWidth} 
                    rx="5" 
                    ry="5" 
                    fill="hsl(var(--muted))"
                  />
                  <rect 
                    height={chartHeight} 
                    width={protWidth} 
                    rx="5" 
                    ry="5" 
                    fill="hsl(var(--primary))"
                  />
                  <rect 
                    x={limit}
                    height={chartHeight} 
                    width={chartHeight/2} 
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
                    height={chartHeight} 
                    width={chartWidth} 
                    rx="5" 
                    ry="5" 
                    fill="hsl(var(--muted))"
                  />
                  <rect 
                    height={chartHeight} 
                    width={fatsWidth} 
                    rx="5" 
                    ry="5" 
                    fill="hsl(var(--primary))"
                  />
                  <rect 
                    x={limit}
                    height={chartHeight} 
                    width={chartHeight/2} 
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
          </div>      
        </>
        :
        <>
          <div className="flex flex-col pt-4 pb-4 justify-between gap-3">
            <div className="flex flex-col">
              <div className="flex gap-1 text-sm">
              <p className="text-xs font-semibold text-foreground mb-1">Carbs : </p>
                <p className="font-semibold text-xs">{(values.carbs).toFixed(0)}g</p>
                {values.carbs > objective.carbs ?
                <p className="text-primary text-xs">(over {(values.carbs - objective.carbs).toFixed(0)}g)</p>
                :
                <p className="text-muted-foreground text-xs">(left {(objective.carbs - values.carbs).toFixed(0)}g)</p>
                }
                <p className="ml-auto text-muted-foreground text-xs">{(objective.carbs).toFixed(0)}g</p>
              </div>
              <div className="flex flex-col h-3">
                <svg>
                  <rect 
                    height={chartHeight} 
                    width={chartWidth} 
                    rx="5" 
                    ry="5" 
                    fill="hsl(var(--muted))"
                  />
                  <rect 
                    height={chartHeight} 
                    width={ratio*carbsNormalized} 
                    rx="5" 
                    ry="5" 
                    fill="hsl(var(--primary))"
                  />
                  <rect 
                    x={limit}
                    height={chartHeight} 
                    width={chartHeight/2} 
                    fill="hsl(var(--card))"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex gap-1 text-xs">
              <p className="text-xs font-semibold text-foreground mb-1">Proteins : </p>
                <p className="font-semibold">{(values.proteins).toFixed(0)}g</p>
                {values.proteins > objective.proteins ?
                <p className="text-primary text-xs">(over {(values.proteins - objective.proteins).toFixed(0)}g)</p>
                :
                <p className="text-muted-foreground text-xs">(left {(objective.proteins - values.proteins).toFixed(0)}g)</p>
                }
                <p className="ml-auto text-muted-foreground text-xs">{(objective.proteins).toFixed(0)}g</p>
              </div>
              <div className="flex flex-col h-3" >
                <svg>
                  <rect 
                    height={chartHeight} 
                    width={chartWidth} 
                    rx="5" 
                    ry="5" 
                    fill="hsl(var(--muted))"
                  />
                  <rect 
                    height={chartHeight} 
                    width={ratio*proteinsNormalized} 
                    rx="5" 
                    ry="5" 
                    fill="hsl(var(--primary))"
                  />
                  <rect 
                    x={limit}
                    height={chartHeight} 
                    width={chartHeight/2} 
                    fill="hsl(var(--card))"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex gap-1 text-xs">
              <p className="text-xs font-semibold text-foreground mb-1">Fats : </p>
                <p className="font-semibold text-xs">{(values.fats).toFixed(0)}g</p>
                {values.fats > objective.fats ?
                <p className="text-primary text-xs">(over {(values.fats - objective.fats).toFixed(0)}g)</p>
                :
                <p className="text-muted-foreground text-xs">(left {(objective.fats - values.fats).toFixed(0)}g)</p>
                }
                <p className="ml-auto text-muted-foreground text-xs">{(objective.fats).toFixed(0)}g</p>
              </div>
              <div className="flex flex-col h-3" >
                <svg>
                  <rect 
                    height={chartHeight} 
                    width={chartWidth} 
                    rx="5" 
                    ry="5" 
                    fill="hsl(var(--muted))"
                  />
                  <rect 
                    height={chartHeight} 
                    width={ratio*fatsNormalized} 
                    rx="5" 
                    ry="5" 
                    fill="hsl(var(--primary))"
                  />
                  <rect 
                    x={limit}
                    height={chartHeight} 
                    width={chartHeight/2} 
                    fill="hsl(var(--card))"
                  />
                </svg>
              </div>
            </div>
          </div>
        </>
        }
      </div>
    </>
  )
}