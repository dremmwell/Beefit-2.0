"use client"

import React from 'react'
import { MealValues, ObjectiveAndDate, ObjectiveAndDateandColor } from '@/app/types/definitions';
import DayCard from './DayCard';
import DayInfo from './DayInfos';
import { useState } from 'react';
import { Objective } from '@prisma/client';
import { sumMealValues } from '@/lib/meal_utils';
import { object } from 'zod';


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
    const [selectedDay, setSelectedDay] = useState<Date | null>(weeklyObjectives[0].date);
    const [selectedObjective, setSelectedObjective] = useState<Objective>(weeklyObjectives[0].objective)
    const [dayValues, setDayValues] = useState<MealValues[]>(getMealsCreatedOnDate(weeklyMeals, weeklyObjectives[0].date))
    const [dayColor, setDayColor] = useState<string>(getDayColor(weeklyObjectives[0].objective,sumMealValues(dayValues)))

    function handleDaySelect (dayObjective : ObjectiveAndDate ) {
        setSelectedDay(dayObjective.date)
        setSelectedObjective(dayObjective.objective)

        const dayValues : MealValues[] = getMealsCreatedOnDate(weeklyMeals, dayObjective.date);
        setDayValues(dayValues)

        const dayColor : string = getDayColor(dayObjective.objective, sumMealValues(dayValues))
        setDayColor(dayColor)
    }

    return (
        <>
            <div className='w-full flex flex-wrap md:px-4 py-2 md:py-4 px-0 gap-1 md:gap-2'>
            {weeklyObjectiveDateColor.map((day, index) => (
                <div key={index} onClick={() => handleDaySelect(day)} className='flex-1'>
                    <DayCard date={day.date} color={day.color} isSelected={selectedDay && selectedDay.getTime() === day.date.getTime()}/> 
                </div>
            ))}
            </div>
            {selectedDay && <DayInfo date={selectedDay} values={dayValues} objective={selectedObjective}/>}
        </>
    )
}

export default Weekly