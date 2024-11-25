import { MealValues, TimeLineMeal } from '@/app/types/definitions';
import React from 'react'
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Badge } from '../../../components/ui/badge'
import { useState } from 'react'
import { ArrowUpDown, MoreHorizontal, SquarePen, Trash2, ListCollapse } from "lucide-react"
import IconMenu from "@/components/icon-menu";
import DeleteMealDialog from './DeleteMealDialog';
import DetailsDialog from './DetailsMealDialog';

function TimelineItem( {meal} : {meal : TimeLineMeal} ) {

      // Handles Dioalog open/close state //
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
      <>
        <DeleteMealDialog 
            meal={meal}
            isOpen={isDeleteOpen}
            setIsOpen={setIsDeleteOpen}
        />
        <DetailsDialog 
            meal={meal}
            isOpen={isDetailsOpen}
            setIsOpen={setIsDetailsOpen}
        />
        
        <li key={meal.mealId} className="last:mb-0 mb-2">
            <div className="grid grid-cols-[minmax(60px,70px)_auto_1fr_auto] grid-rows-[20px_auto] md:gap-3 gap-1">
            <div className="ml-auto">
                <h3 className="text-sm font-semibold text-foreground">{meal.title}</h3>
            </div>
            <div className='flex justify-center max-h-5 w-20'>
            <Badge>{meal.calories.toFixed(0)} cal</Badge> 
            </div>
            <div className="col-start-3 row-start-2 mt-1">
                {meal.description?.split('\n').map((line, index) => (
                <div key={index} className="text-sm font-medium text-muted-foreground leading-relaxed -translate-y-[36px] md:-translate-y-[44px] pt-2">{line}</div>
                ))}
            </div>
            <div className="ml-auto col-start-4 row-start-1 row-span-2">
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
  )
}

export default TimelineItem
