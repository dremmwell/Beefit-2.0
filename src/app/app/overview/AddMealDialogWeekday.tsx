
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
import MealIngredientsForm from "../today/MealIngredientsForm"
import { columnsIngredients, columnsRecipes  } from "../today/columns"
import MealRecipeForm from "../today/MealRecipesForm"
import CustomMealForm from "../today/CustomMealForm"



export function AddMealDialogWeekday( {
  recipes,
  ingredients,
  date,
  isOpen,
  setIsOpen,
} : {
  recipes : Array<Recipe>,
  ingredients : Array<Ingredient>,
  date : Date,
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
}) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleClose = () => {
    setIsOpen(false);
  };

  if (true) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button >Add Meal</Button>
        </DialogTrigger>
        <DialogContent className="min-w-fit max-h-full flex-1">
        <DialogHeader >
            <DialogTitle>New Meal</DialogTitle>
            <DialogDescription>
              Add a new meal to your diary !
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
                <MealIngredientsForm columns={columnsIngredients} data={ingredients} onSave={handleClose}/>
              </TabsContent>
              <TabsContent value="recipes">
                <MealRecipeForm columns={columnsRecipes} data={recipes} ingredients={ingredients} onSave={handleClose}/>
              </TabsContent>
              <TabsContent value="custom">
                <CustomMealForm onSave={handleClose}/>
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
                <MealIngredientsForm columns={columnsIngredients} data={ingredients} onSave={handleClose}/>
              </TabsContent>
              <TabsContent value="recipes">
                <MealRecipeForm columns={columnsRecipes} data={recipes} ingredients={ingredients} onSave={handleClose}/>
              </TabsContent>
              <TabsContent value="custom">
                <CustomMealForm onSave={handleClose}/>
              </TabsContent>
            </Tabs>
          </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}