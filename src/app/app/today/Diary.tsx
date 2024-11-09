"use client"

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area';
import Timeline from "./TimeLine";
import { Ingredient, Meal } from '@prisma/client';
import { AddMealDialog } from "./AddMealDialog";
import { RecipeAndIngredients } from '@/app/types/definitions';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';


function Diary({ 
    meals,
    recipes,
    ingredients
} : {
    meals : Array<Meal>,
    recipes : Array<RecipeAndIngredients>,
    ingredients : Array<Ingredient>
}) {

    const [isGrouped, setIsGrouped] = useState(false);


    const timelineItems = [
            {
                title: "Snack",
                calories: "300",
                description: "QuInteger eu lorem pretium, sollicitudin nisi et, luctus magna.",
            },

            {
                title: "Diner",
                calories: "1050",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam pretium neque nec facilisis faucibus. Cras non lobortis enim, sit amet sollicitudin purus. Suspendisse metus turpis, eleifend eget augue vitae, consectetur placerat enim. Maecenas ornare mi nec orci blandit, at sagittis nibh ultricies. In ultrices tellus leo, sit amet sodales sem dignissim sit amet.",
            },
            {
                title: "Snack",
                calories: "410",
                description: "Suspendisse interdum lectus maximus, ullamcorper felis feugiat, mollis tortor.",
            },
            {
                title: "Lunch",
                calories: "850",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam pretium neque nec facilisis faucibus. Cras non lobortis enim, sit amet sollicitudin purus. Suspendisse metus turpis, eleifend eget augue vitae,",
            },
            {
                title: "Snack",
                calories: "300",
                description: "QuInteger eu lorem pretium, sollicitudin nisi et, luctus magna.",
            },
            {
                title: "Breakfast",
                calories: "1205",
                description: "Nulla gravida maximus nunc mollis luctus. Donec eu enim purus. Quisque tempor, lacus sit amet feugiat maximus, ante ex scelerisque elit, et lacinia ipsum dolor vitae ligula.",
            },
            {
                title: "Snack",
                calories: "300",
                description: "QuInteger eu lorem pretium, sollicitudin nisi et, luctus magna.",
            },

            {
                title: "Diner",
                calories: "1050",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam pretium neque nec facilisis faucibus. Cras non lobortis enim, sit amet sollicitudin purus. Suspendisse metus turpis, eleifend eget augue vitae, consectetur placerat enim. Maecenas ornare mi nec orci blandit, at sagittis nibh ultricies. In ultrices tellus leo, sit amet sodales sem dignissim sit amet.",
            },
            {
                title: "Snack",
                calories: "410",
                description: "Suspendisse interdum lectus maximus, ullamcorper felis feugiat, mollis tortor.",
            },
            {
                title: "Lunch",
                calories: "850",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam pretium neque nec facilisis faucibus. Cras non lobortis enim, sit amet sollicitudin purus. Suspendisse metus turpis, eleifend eget augue vitae,",
            },
    ]

    const timelineItemsGrouped = [
        {
            title: "Diner",
            calories: "1050",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam pretium neque nec facilisis faucibus. Cras non lobortis enim, sit amet sollicitudin purus. Suspendisse metus turpis, eleifend eget augue vitae, consectetur placerat enim. Maecenas ornare mi nec orci blandit, at sagittis nibh ultricies. In ultrices tellus leo, sit amet sodales sem dignissim sit amet.",
        },
    ]
    
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
