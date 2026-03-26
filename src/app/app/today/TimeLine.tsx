import React from 'react'
import { MealValues, TimeLineMeal } from '@/app/types/definitions';
import TimelineItem from './TimelineItem';



export default function Timeline({ meals, isGrouped }:{ meals : Array<MealValues>, isGrouped : boolean}) {


  function getTimeLineItems(mealValues : Array<MealValues>){
    // Sets timeline items with meals values //
    const timeLineItems : Array<TimeLineMeal>= []
    mealValues.forEach((meal) => {
    const timeLineItem : TimeLineMeal = {
        title: "",
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,
        saturatedFats: 0,
        fibers: 0,
        description: "",
        mealId: "",
        userId:"",
    };
    timeLineItem.title = meal.mealType;
    timeLineItem.calories = meal.calories;
    timeLineItem.proteins = meal.proteins;
    timeLineItem.carbs = meal.carbs;
    timeLineItem.fats = meal.fats;
    timeLineItem.saturatedFats = meal.saturatedFats;
    timeLineItem.fibers = meal.fibers;
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
            groupedItems[item.title] = { title : item.title, calories : 0, proteins: 0, carbs: 0, fats: 0, saturatedFats: 0, fibers: 0, mealId : "", description : ""};
        }
        groupedItems[item.title].calories += +item.calories;
        groupedItems[item.title].proteins += +item.proteins;
        groupedItems[item.title].carbs += +item.carbs;
        groupedItems[item.title].fats += +item.fats;
        groupedItems[item.title].saturatedFats += +item.saturatedFats;
        groupedItems[item.title].fibers += +item.fibers;
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
        proteins: item.proteins,
        carbs: item.carbs,
        fats: item.fats,
        saturatedFats: item.saturatedFats,
        fibers: item.fibers,
        description: item.description,
        userId: item.userId,
    }));
    return [timeLineItems, timelineItemsGrouped]
  }

  const items = getTimeLineItems(meals)[0];
  const itemsGrouped = getTimeLineItems(meals)[1];

  return (
    <>
      <ol className='mx-2 my-4 mt-2'>
        {!isGrouped && items.map((item) => (
            <TimelineItem key={item.mealId} meal={item}/> 
        ))}
        {isGrouped && itemsGrouped.map((itemGrouped) => (
            <TimelineItem key={itemGrouped.mealId} meal={itemGrouped}/> 
        ))}
      </ol>
    </>

  )
}