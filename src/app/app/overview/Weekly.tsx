"use client"

import React from 'react'
import { MealValues } from '@/app/types/definitions';
import DayCard from './DayCard';
import DayInfo from './DayInfos';
import { useState } from 'react';
import { Objective } from '@prisma/client';


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

function getObjectivesCreatedOnDate(objectives: Objective[], date: Date): Objective[] {
    // Convert the date to midnight UTC
    const startOfDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    // Filter obejctives created on the given date
    return objectives.filter(objective => {
        const objectiveCreatedAt = new Date(objective.createdAt);
        return (
            objectiveCreatedAt.getFullYear() === startOfDay.getFullYear() &&
            objectiveCreatedAt.getMonth() === startOfDay.getMonth() &&
            objectiveCreatedAt.getDate() === startOfDay.getDate()
        );
    });
}


function Weekly({ weeklyMeals, weeklyObjectives }: {weeklyMeals : Array<MealValues>, weeklyObjectives : Array<Objective>}) {

    /*  const mealsByDay = groupByCreationDay(weeklyMeals);*/

    const today : Date = new Date();
    const yesterday : Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (7 - i));
        dates.push(day);
    }

    const [selectedDay, setSelectedDay] = useState<Date | null>(yesterday);
    const [dayValues, setDayValues] = useState<MealValues[]>(getMealsCreatedOnDate(weeklyMeals, yesterday))
    const [dayObjective, setDayObjective] = useState<Objective>(getObjectivesCreatedOnDate(weeklyObjectives, yesterday)[0])

    function handleDaySelect (date: Date) {
        const dayValues : MealValues[] = getMealsCreatedOnDate(weeklyMeals, date);
        const dayObjective : Objective = getObjectivesCreatedOnDate(weeklyObjectives, date)[0];

        setSelectedDay(date);
        setDayValues(dayValues);
        setDayObjective(dayObjective)
    };

    const color = "success";

    return (
        <>
            <div className='w-full flex flex-wrap md:px-4 py-2 md:py-4 px-0 gap-1 md:gap-2'>

            {dates.map((day, index) => (
                <div key={index} onClick={() => handleDaySelect(day)} className='flex-1'>
                    <DayCard date={day} color={color} isSelected={selectedDay && selectedDay.getTime() === day.getTime()}/> 
                </div>
            ))}
            </div>
            {selectedDay && <DayInfo date={selectedDay} values={dayValues} objective={dayObjective}/>}
        </>
    )
}

export default Weekly