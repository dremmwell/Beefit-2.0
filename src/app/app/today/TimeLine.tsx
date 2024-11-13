"use client"

import React from 'react'
import { Badge } from '../../../components/ui/badge'
import { useState } from 'react'
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, SquarePen, Trash2, ListCollapse } from "lucide-react"
import IconMenu from "@/components/icon-menu";
import DeleteDialog from './DeleteMealDialog';
import { MealValues, TimeLineMeal } from '@/app/types/definitions';



export default function Timeline({ meals, isGrouped }:{ meals : Array<MealValues>, isGrouped : boolean}) {

  // Handles Dioalog open/close state //
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);


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
    const timelineItemsGrouped : Array<TimeLineMeal> = Object.values(groupedItems).map((item : any) => ({
        title: item.title,
        mealId: item.mealId,
        calories: item.calories,
        description: item.description
    }));
    return [timeLineItems, timelineItemsGrouped]
  }

  const items = getTimeLineItems(meals)[0];
  const itemsGrouped = getTimeLineItems(meals)[1];

  return (
    <>
      <ol className='mx-2 my-4 mt-2'>
        {!isGrouped && items.map((item) => (
          <>
            <li key={item.mealId} className="last:mb-0 mb-2">
              <div className="grid grid-cols-[minmax(60px,70px)_auto_1fr] grid-rows-[20px_auto] gap-3">
              <div className="ml-auto">
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
              </div>
              <div className='flex justify-center max-h-5 w-20'>
                <Badge>{item.calories} cal</Badge> 
              </div>
                <div className="col-start-3 row-start-2 mt-1">
                  {item.description?.split('\n').map((line, index) => (
                    <div key={index} className="text-sm font-medium text-muted-foreground leading-relaxed -translate-y-[36px]">{line}</div>
                  ))}
                </div>
                <div className="ml-auto col-start-1 row-start-2">
                  <DropdownMenu modal={false}> {/* modal={false} prevents instantly closing dialog modals */}
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                        <button
                          onClick={() => {
                            setIsDetailsOpen(true);
                          }}
                          className="w-full justify-start flex rounded-md p-2"
                        >
                          <IconMenu
                            text="Details"
                            icon={<ListCollapse className="h-4 w-4" />}
                          />
                        </button>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                        <button
                          onClick={() => {
                            setIsEditOpen(true);
                          }}
                          className="w-full justify-start flex rounded-md p-2"
                        >
                          <IconMenu
                            text="Edit"
                            icon={<SquarePen className="h-4 w-4" />}
                          />
                        </button>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 focus:bg-destructive">
                        <button
                          onClick={() => {
                            setIsDeleteOpen(true);
                          }}
                          className="w-full justify-start flex rounded-md p-2"
                        >
                          <IconMenu
                            text="Delete"
                            icon={<Trash2 className="h-4 w-4" />}
                          />
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="col-start-2 row-start-2 w-0.5 bg-muted rounded-3xl mx-auto" />
              </div>
            </li>
          </>
        ))}
        {isGrouped && itemsGrouped.map((itemGrouped) => (
          <>
            <li key={itemGrouped.mealId} className="last:mb-0 mb-2">
              <div className="grid grid-cols-[minmax(60px,70px)_auto_1fr] grid-rows-[20px_auto] gap-3">
              <div className="ml-auto">
                  <h3 className="text-sm font-semibold text-foreground">{itemGrouped.title}</h3>
              </div>
              <div className='flex justify-center max-h-5 w-20'>
                <Badge>{itemGrouped.calories} cal</Badge> 
              </div>
                <div className="col-start-3 row-start-2 mt-1">
                  {itemGrouped.description?.split('\n').map((line, index) => (
                    <div key={index} className="text-sm font-medium text-muted-foreground leading-relaxed -translate-y-[36px]">{line}</div>
                  ))}
                </div>
                <div className="ml-auto col-start-1 row-start-2">
                  <DropdownMenu modal={false}> {/* modal={false} prevents instantly closing dialog modals */}
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                        <button
                          onClick={() => {
                            setIsDetailsOpen(true);
                          }}
                          className="w-full justify-start flex rounded-md p-2"
                        >
                          <IconMenu
                            text="Details"
                            icon={<ListCollapse className="h-4 w-4" />}
                          />
                        </button>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                        <button
                          onClick={() => {
                            setIsEditOpen(true);
                          }}
                          className="w-full justify-start flex rounded-md p-2"
                        >
                          <IconMenu
                            text="Edit"
                            icon={<SquarePen className="h-4 w-4" />}
                          />
                        </button>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 focus:bg-destructive">
                        <button
                          onClick={() => {
                            setIsDeleteOpen(true);
                          }}
                          className="w-full justify-start flex rounded-md p-2"
                        >
                          <IconMenu
                            text="Delete"
                            icon={<Trash2 className="h-4 w-4" />}
                          />
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="col-start-2 row-start-2 w-0.5 bg-muted rounded-3xl mx-auto" />
              </div>
            </li>
          </>
        ))}
      </ol>
    </>

  )
}