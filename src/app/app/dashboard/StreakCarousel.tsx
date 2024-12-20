"use client"

import * as React from "react"
import { useRef } from "react"
import Autoplay from 'embla-carousel-autoplay'
import { StreakData } from "@/app/types/definitions"

import { Card, CardFooter, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Flame } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function CarouselStreack({data} : {data : StreakData[]} ) {
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xs"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {data.map((cardData, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="w-[300px] hover:cursor-pointer">
                <CardHeader>
                  <CardTitle>{cardData.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Flame></Flame>
                  <span className="font-semibold"><span className="text-xl">{cardData.value}</span> day streak</span>
                </CardContent>
                <CardFooter>
                  <CardDescription className="flex flex-col gap-4">
                    <span>{cardData.value} day(s) meeting your calorie goal !</span>
                    <span className="font-semibold tracking-tight text-foreground">{cardData.footer}</span>
                  </CardDescription>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

