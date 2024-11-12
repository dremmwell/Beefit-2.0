"use client"

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area';
import Timeline from "./TimeLine";
import { Ingredient, Meal } from '@prisma/client';
import { AddMealDialog } from "./AddMealDialog";
import { RecipeAndIngredients, MealData, MealValues, TimeLineMeal } from '@/app/types/definitions';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { getMealValues } from '@/lib/recipe_utils';

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

    function getTimeLineItems(mealValues : Array<MealValues>){
            // Sets timeline items with meals values //
        const timeLineItems : Array<TimeLineMeal>= []
        mealValues.forEach((meal) => {
            const timeLineItem : TimeLineMeal = {
                title: "",
                calories: 0,
                description: "",
                mealId: ""
            };
            timeLineItem.title = meal.mealType;
            timeLineItem.calories = meal.calories;
            timeLineItem.mealId = meal.mealId;
            timeLineItem.description = meal.description;
            timeLineItems.push(timeLineItem);
        })

        // Sets timeline grouped items with meals values //
        const groupedItems :any = [];

        // Sorts the timelineitems by mealtype (title) and merges their properties
        timeLineItems.reduce((acc, item) =>{
            if(!groupedItems[item.title]) {
                groupedItems[item.title] = { title : item.title, calories : 0, mealId : "", description : ""}
            }
            groupedItems[item.title].calories += +item.calories;
            groupedItems[item.title].mealId += item.mealId + "/";
            groupedItems[item.title].description += item.description + "\n"
            return acc;
        }, {});
        // Create a timeline array from the sorted object //
        const timelineItemsGrouped = Object.values(groupedItems).map((item : any) => ({
            title: item.title,
            mealId: item.mealId,
            calories: item.calories,
            description: item.description
        }));
        return [timeLineItems, timelineItemsGrouped]
    }

 const timelineItems = getTimeLineItems(mealValues)[0];
 const timelineItemsGrouped = getTimeLineItems(mealValues)[1];

  return (
    <div className='flex flex-col h-4/6 lg:h-full'>
        <div className='flex items-center justify-between mb-4'>
          <div className='ml-4 pr-4 flex flex-col lg:flex-row gap-1 lg:gap-2'>
            <h3 className='font-semibold leading-none tracking-tight pt-2 px-2'>Meal Diary - <span className='text-sm text-muted-foreground font-normal'>02 October 2024</span></h3>
            <div className='text-sm text-muted-foreground flex items-center'>
                <Switch checked={isGrouped} onCheckedChange={setIsGrouped} className='mt-2'/>
                <Label htmlFor="converted"className="ml-2 mt-2">group meals</Label>
            </div>
          </div>
          <AddMealDialog recipes={recipes} ingredients={ingredients}/>
        </div>
        <ScrollArea className="rounded-xl border col-start-2 row-start-3 p-4">
            {isGrouped?
                <Timeline items={timelineItemsGrouped}/>
            :
                <Timeline items={timelineItems}/>
            }
        </ScrollArea>
    </div>
  )
}

export default Diary
