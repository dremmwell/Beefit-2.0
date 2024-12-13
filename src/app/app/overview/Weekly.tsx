"use client"

import React from 'react'
import { DayData, MealValues } from '@/app/types/definitions';
import DayCard from './DayCard';
import { useState } from 'react';
import { Objective } from '@prisma/client';
import { sumMealValues } from '@/lib/meal_utils';
import DayChartsCards from './DayChartCard';
import TimelineWeekday from './TimeLineWeekday';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Recipe, Ingredient } from "@prisma/client"


function Weekly({ 
    weekData,
    recipes,
    ingredients,
}: {
    weekData : DayData[],
    recipes : Array<Recipe>,
    ingredients : Array<Ingredient>,
}) {

    //---------------------- Handles week day selection and format selected day values ----------------------//
    const [selectedDay, setSelectedDay] = useState<Date | null>(weekData[weekData.length - 1].date);
    const [selectedObjective, setSelectedObjective] = useState<Objective>(weekData[weekData.length - 1].objective)
    const [dayValues, setDayValues] = useState<MealValues[]>(weekData[weekData.length - 1].mealsValues)

    function handleDaySelect (dayData : DayData) {
        setSelectedDay(dayData.date)
        setSelectedObjective(dayData.objective)
        setDayValues(dayData.mealsValues)
    }

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex flex-col gap-2'>
                <div className='flex gap-1'>
                    {weekData.map((dayData, index) => (
                        <div key={index} onClick={() => handleDaySelect(dayData)} className='flex-1'>
                            <DayCard date={dayData.date} color={dayData.color} isSelected={selectedDay && selectedDay.getTime() === dayData.date.getTime()}/> 
                        </div>
                    ))}
                </div>
                <div className='flex gap-2 justify-end md:px-4'>
                    <div className='flex items-center sm:gap-2 gap-1 sm:text-sm text-xs text-muted-foreground'>
                        on target :
                        <div className={`rounded-full w-2 h-2 shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.2),_1px_1px_2px_rgba(255,255,255,0.3)] bg-success`}></div>
                        <div className='text-muted-foreground'>|</div>
                    </div>
                    <div className='flex items-center sm:gap-2 gap-1 sm:text-sm text-xs text-muted-foreground'>
                        over target :
                        <div className={`rounded-full w-2 h-2 shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.2),_1px_1px_2px_rgba(255,255,255,0.3)] bg-primary`}></div>
                        <div className='text-muted-foreground'>|</div>
                    </div>
                    <div className='flex items-center sm:gap-2 gap-1 sm:text-sm text-xs text-muted-foreground'>
                        below target :
                        <div className={`rounded-full w-2 h-2 shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.2),_1px_1px_2px_rgba(255,255,255,0.3)] bg-below`}></div>
                    </div>
                </div>
            </div>
            {selectedDay && 
                <div className='flex lg:flex-col flex-col-reverse gap-4'>
                    <ScrollArea className="rounded-xl border col-start-2 row-start-3 p-2 md:p-4">
                        <TimelineWeekday day={selectedDay} meals={dayValues} recipes={recipes} ingredients={ingredients}/>
                    </ScrollArea>
                    <DayChartsCards date={selectedDay} values={sumMealValues(dayValues)} objective={selectedObjective}/>
                </div>
            }
        </div>
    )
}

export default Weekly