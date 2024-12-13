
"use client"

import React, { Dispatch, SetStateAction } from 'react';
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { Ingredient } from "@prisma/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Recipe } from "@prisma/client"
import { columnsIngredients, columnsRecipes  } from "../today/columns"
import CustomMealWeekdayForm from './CustomMealWeekdayForm';
import MealIngredientsWeekdayForm from './MealIngredientsWeekdayForm';
import MealRecipeWeekdayForm from './MealRecipesWeekdayForm';


export function AddMealDialogWeekday( {
  recipes,
  ingredients,
  date,
} : {
  recipes : Array<Recipe>,
  ingredients : Array<Ingredient>,
  date : Date,
}) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleClose = () => {
    setOpen(false);
  };

  if (true) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Meal</Button>
        </DialogTrigger>
        <DialogContent className="min-w-fit max-h-full flex-1">
        <DialogHeader >
            <DialogTitle>New Meal on {date.toLocaleString("en-GB", {month : 'long', day : 'numeric', year : 'numeric'})}</DialogTitle>
            <DialogDescription>
              Add a new meal on your {date.toLocaleString("en-GB", {month : 'long', day : 'numeric'})} diary!
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="overflow-y-scroll no-scrollbar">
            <Tabs defaultValue="ingredients">
              <TabsList className="grid w-full grid-cols-3 mb-5">
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="recipes">Recipes</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
              <TabsContent value="ingredients">
                <MealIngredientsWeekdayForm columns={columnsIngredients} data={ingredients} onSave={handleClose} date={date}/>
              </TabsContent>
              <TabsContent value="recipes">
                <MealRecipeWeekdayForm columns={columnsRecipes} data={recipes} ingredients={ingredients} onSave={handleClose} date={date}/>
              </TabsContent>
              <TabsContent value="custom">
                <CustomMealWeekdayForm onSave={handleClose} date={date}/>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  }
 
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button >Add Meal</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>New Meal</DrawerTitle>
          <DrawerDescription>
            Add a new meal to your diary !
          </DrawerDescription>
        </DrawerHeader>
          <ScrollArea className="overflow-y-scroll no-scrollbar">
            <Tabs defaultValue="ingredients">
              <TabsList className="grid w-full grid-cols-3 mb-5">
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="recipes">Recipes</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
              <TabsContent value="ingredients">
                <MealIngredientsWeekdayForm columns={columnsIngredients} data={ingredients} onSave={handleClose} date={date}/>
              </TabsContent>
              <TabsContent value="recipes">
                <MealRecipeWeekdayForm columns={columnsRecipes} data={recipes} ingredients={ingredients} onSave={handleClose} date={date}/>
              </TabsContent>
              <TabsContent value="custom">
                <CustomMealWeekdayForm onSave={handleClose} date={date}/>
              </TabsContent>
            </Tabs>
          </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
