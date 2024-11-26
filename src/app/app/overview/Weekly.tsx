"use client"

import React from 'react'
import { MealData } from '@/app/types/definitions';
import DayCard from './DayCard';
import DayInfo from './DayInfos';
import { useState } from 'react';

function groupByCreationDay(objects : any) {
    return Object.values(
      objects.reduce((acc : any, obj : any) => {
        const date = new Date(obj.createdAt).toDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(obj);
        return acc;
      }, {})
    );
}

function Weekly({ weeklyMeals }: {weeklyMeals : Array<MealData>}) {

/*  const mealsByDay = groupByCreationDay(weeklyMeals);
 */
    const today : Date = new Date();
    const yesterday : Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
    const dates: Date[] = [];
    for (let i = 0; i < 8; i++) {
        const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (8-i));
        dates.push(day);
    }

    const [selectedDay, setSelectedDay] = useState<Date | null>(yesterday);
    const handleDaySelect = (date: Date) => {
        setSelectedDay(date);
    };

    return (
        <>
            <div className='w-full flex flex-wrap justify-evenly md:px-4'>
            {dates.map((day, index) => (
                <div key={index} onClick={() => handleDaySelect(day)}>
                    <DayCard date={day} dotColor='success' isSelected={selectedDay && selectedDay.getTime() === day.getTime()}/> 
                </div>
            ))}
            </div>
            {selectedDay && <DayInfo date={selectedDay}/>}
        </>
    )
}

export default Weekly