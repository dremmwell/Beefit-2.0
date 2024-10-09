
"use client"

import * as React from "react"
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
import MealIngredientsForm from "./MealIngredientsForm"
import { columnsIngredients, columnsRecipes  } from "./columns"
import MealRecipeForm from "./MealRecipesForm"



export function AddMealDialog( {
  recipes,
  ingredients,
} : {
  recipes : Array<Recipe>,
  ingredients : Array<Ingredient>
}) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleCloseDialog = () => {
    setOpen(false)
  }
 
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button >Add Meal</Button>
        </DialogTrigger>
        <DialogContent className="min-w-fit min-h-[620px] flex-1">
        <DialogHeader >
            <DialogTitle>New Meal</DialogTitle>
            <DialogDescription>
              Add a new meal to your diary !
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="ingredients">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="recipes">Recipes</TabsTrigger>
            </TabsList>
            <TabsContent value="ingredients">
              <MealIngredientsForm columns={columnsIngredients} data={ingredients} onSave={setOpen}/>
            </TabsContent>
            <TabsContent value="recipes">
              <MealRecipeForm columns={columnsRecipes} data={recipes} onSave={setOpen}/>
            </TabsContent>
          </Tabs>
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
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="recipes">Recipes</TabsTrigger>
              </TabsList>
              <TabsContent value="ingredients">
                  <MealIngredientsForm columns={columnsIngredients} data={ingredients} onSave={setOpen}/>
              </TabsContent>
              <TabsContent value="recipes">
                <MealRecipeForm columns={columnsRecipes} data={recipes} onSave={setOpen}/>
              </TabsContent>
            </Tabs>
          </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
