"use client"

import React from 'react'
import { MealValues, ObjectiveAndDate, ObjectiveAndDateandColor } from '@/app/types/definitions';
import DayCard from './DayCard';
import { useState } from 'react';
import { Objective } from '@prisma/client';
import { sumMealValues } from '@/lib/meal_utils';
import DayChartsCards from './DayChartCard';
import Timeline from '../today/TimeLine';
import { ScrollArea } from '@/components/ui/scroll-area';

function getMealsCreatedOnDate(mealValues: MealValues[], date: Date): MealValues[] {
    // Convert the date to midnight UTC
    const startOfDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    // Filter meals created on the given date
    return mealValues.filter(meal => {
        const mealCreatedAt = new Date(meal.createdAt);
        return (
            mealCreatedAt.getFullYear() === startOfDay.getFullYear() &&
            mealCreatedAt.getMonth() === startOfDay.getMonth() &&
            mealCreatedAt.getDate() === startOfDay.getDate()
        );
    });
}

function getDayColor(objective : Objective,values : MealValues){
    let dayColor: string = ""
    if(objective.calories < values.calories){
        dayColor = "primary"
    }
    else if(objective.calories * 0.5 < values.calories){
        dayColor = "success"
    }
    else{
        dayColor = "below"
    }
    return dayColor
}


function Weekly({ weeklyMeals, weeklyObjectives }: {weeklyMeals : Array<MealValues>, weeklyObjectives : Array<ObjectiveAndDate>}) {

    //-----------------------------Sets day color for all days---------------------------------------//
    const weeklyObjectiveDateColor : ObjectiveAndDateandColor[] = []
    weeklyObjectives.forEach(dayObjective => {
        const dayColor = getDayColor(dayObjective.objective,sumMealValues(getMealsCreatedOnDate(weeklyMeals, dayObjective.date)));
        const objectiveDateColor : ObjectiveAndDateandColor = {
            objective :dayObjective.objective,
            date : dayObjective.date,
            color : dayColor
        }
        weeklyObjectiveDateColor.push(objectiveDateColor)
    })

    //---------------------- Handles week day selection and format selected day values ----------------------//
    const [selectedDay, setSelectedDay] = useState<Date | null>(weeklyObjectives[weeklyObjectives.length - 1].date);
    const [selectedObjective, setSelectedObjective] = useState<Objective>(weeklyObjectives[weeklyObjectives.length - 1].objective)
    const [dayValues, setDayValues] = useState<MealValues[]>(getMealsCreatedOnDate(weeklyMeals, weeklyObjectives[weeklyObjectives.length - 1].date))

    function handleDaySelect (dayObjective : ObjectiveAndDate ) {
        setSelectedDay(dayObjective.date)
        setSelectedObjective(dayObjective.objective)

        const dayValues : MealValues[] = getMealsCreatedOnDate(weeklyMeals, dayObjective.date);
        setDayValues(dayValues)
    }

    return (
        <>
            <div className='flex flex-col gap-2 pb-2'>
                <div className='flex gap-1'>
                    {weeklyObjectiveDateColor.map((day, index) => (
                        <div key={index} onClick={() => handleDaySelect(day)} className='flex-1'>
                            <DayCard date={day.date} color={day.color} isSelected={selectedDay && selectedDay.getTime() === day.date.getTime()}/> 
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
                <div className='flex flex-col 2xl:flex-row gap-4'>
                    <DayChartsCards date={selectedDay} values={sumMealValues(dayValues)} objective={selectedObjective}/>
                    <ScrollArea className="rounded-xl border col-start-2 row-start-3 p-2 md:p-4">
                        <Timeline meals={dayValues} isGrouped={true}/>
                    </ScrollArea>
                </div>
            }
        </>
    )
}

export default Weekly