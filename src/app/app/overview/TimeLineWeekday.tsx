import React from 'react'
import { useState } from 'react';
import { MealValues, TimeLineMeal } from '@/app/types/definitions';
import TimelineItemWeekday from './TimelineItemWeekday';
import { Recipe, Ingredient } from "@prisma/client"
import { AddMealDialogWeekday } from './AddMealDialogWeekday';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';


export default function TimelineWeekday({ 
  meals, 
  day,
  recipes,
  ingredients,
}:{ 
  meals : Array<MealValues>,
  day : Date,
  recipes : Array<Recipe>,
  ingredients : Array<Ingredient>,
}) {


  function getTimeLineItems(mealValues : Array<MealValues>){
    // Sets timeline items with meals values //
    const timeLineItems : Array<TimeLineMeal>= []
    mealValues.forEach((meal) => {
    const timeLineItem : TimeLineMeal = {
        title: "",
        calories: 0,
        description: "",
        mealId: "",
        userId:"",
    };
    timeLineItem.title = meal.mealType;
    timeLineItem.calories = meal.calories;
    timeLineItem.mealId = meal.mealId;
    timeLineItem.description = meal.description;
    timeLineItem.userId = meal.userId;
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
        groupedItems[item.title].description += item.description + "\n";
        groupedItems[item.title].userId = item.userId;
        return acc;
    }, {});
    // Create a timeline array from the sorted object //
    const timelineItemsGrouped : Array<TimeLineMeal> = Object.values(groupedItems).map((item : any) => ({
        title: item.title,
        mealId: item.mealId,
        calories: item.calories,
        description: item.description,
        userId: item.userId,
    }));
    return [timeLineItems, timelineItemsGrouped]
  }

  const items = getTimeLineItems(meals)[0];
  const itemsGrouped = getTimeLineItems(meals)[1];

  const [isGrouped, setIsGrouped] = useState(false);

  return (
    <>
      <div className='flex justify-between mx-2 gap-1'>
        <div className='flex items-center'>
          <p className='lg:px-2 pr-2'>
            {day.toLocaleString("en-GB", {month : 'short', day : 'numeric', year : 'numeric'})}
          </p>
          <Switch checked={isGrouped} onCheckedChange={setIsGrouped}/>
          <Label htmlFor="converted"className="ml-2 text-sm text-muted-foreground">group meals</Label>
        </div>
        <AddMealDialogWeekday 
              recipes = {recipes}
              ingredients={ingredients}
              date={day}
          />
      </div>
      <ol className='mx-2 my-4 mt-2'>
        {!isGrouped && items.map((item) => (
            <TimelineItemWeekday key={item.mealId} meal={item} ingredients={ingredients} recipes={recipes} day={day}/> 
        ))}
        {isGrouped && itemsGrouped.map((itemGrouped) => (
            <TimelineItemWeekday key={itemGrouped.mealId} meal={itemGrouped} ingredients={ingredients} recipes={recipes} day={day}/> 
        ))}
      </ol>
    </>
  )
}