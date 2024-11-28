"use client"

import React, { useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area';
import Timeline from "./TimeLine";
import { Ingredient, Meal } from '@prisma/client';
import { AddMealDialog } from "./AddMealDialog";
import { RecipeAndIngredients, MealData, MealValues, TimeLineMeal } from '@/app/types/definitions';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { getMealValues } from '@/lib/meal_utils';

function Diary({ 
    meals,
    recipes,
    ingredients
} : {
    meals : Array<MealData>,
    recipes : Array<RecipeAndIngredients>,
    ingredients : Array<Ingredient>
}) {

    const [isGrouped, setIsGrouped] = useState(false);
    const mealValues : Array<MealValues> = getMealValues(meals);
    const today = new Date();

    return (
    <div className='flex flex-col min-h-0 w-full'>
        <div className='flex items-center justify-between mb-4'>
          <div className='ml-4 pr-4 flex flex-col lg:flex-row gap-1 lg:gap-2'>
            <h3 className='font-semibold leading-none tracking-tight pt-2 px-2'>Meal Diary - <span className='text-sm text-muted-foreground font-normal'>{today.toLocaleString("en-GB", {month : 'long', day : 'numeric', year : 'numeric'})}</span></h3>
            <div className='text-sm text-muted-foreground flex items-center'>
                <Switch checked={isGrouped} onCheckedChange={setIsGrouped} className='mt-2'/>
                <Label htmlFor="converted"className="ml-2 mt-2">group meals</Label>
            </div>
          </div>
          <AddMealDialog recipes={recipes} ingredients={ingredients}/>
        </div>
        <ScrollArea className="rounded-xl border col-start-2 row-start-3 p-2 md:p-4">
            <Timeline meals={mealValues} isGrouped={isGrouped}/>
        </ScrollArea>
    </div>
  )
}

export default Diary
